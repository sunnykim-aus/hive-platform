-- ─────────────────────────────────────────────────────────────────────────────
-- HIVE access tiers — Supabase schema (ORGANISATION-based).
-- Run once: Dashboard → SQL Editor → paste → Run.
--
-- Model: you manage ORGANISATIONS (one per customer). Each org has a tier and a
-- seat limit and a list of email domains. Staff sign in with their work email
-- and are auto-joined to the matching org (up to the seat limit) — so you set up
-- ~10 orgs, not ~100 users. A user's effective tier = their org's tier.
-- ─────────────────────────────────────────────────────────────────────────────

-- 1. organisations — one row per customer.
create table if not exists public.organisations (
  id            uuid primary key default gen_random_uuid(),
  name          text not null,
  tier          text not null default 'free'
                check (tier in ('free', 'pro', 'enterprise', 'government')),
  seat_limit    int,                       -- NULL = unlimited (use for government)
  email_domains text[] not null default '{}', -- e.g. {'bigchp.org.au','bigchp.com.au'}
  created_at    timestamptz not null default now()
);

-- 2. profiles — one row per auth user, belonging to an org.
create table if not exists public.profiles (
  id         uuid primary key references auth.users (id) on delete cascade,
  email      text,
  org_id     uuid references public.organisations (id) on delete set null,
  role       text not null default 'member' check (role in ('member', 'admin')),
  created_at timestamptz not null default now()
);

create index if not exists profiles_org_id_idx on public.profiles (org_id);

-- 3. Row Level Security.
alter table public.organisations enable row level security;
alter table public.profiles      enable row level security;

-- Users may read their own profile (and nothing else). No self-update → a user
-- can never change their org/role. You provision from the dashboard.
drop policy if exists "read own profile" on public.profiles;
create policy "read own profile"
  on public.profiles for select
  using (auth.uid() = id);

-- Users may read their own organisation (needed to resolve their tier).
drop policy if exists "read own org" on public.organisations;
create policy "read own org"
  on public.organisations for select
  using (id in (select org_id from public.profiles where id = auth.uid()));

-- 4. Auto-join: on signup, attach the user to the org whose email_domains match,
--    if a seat is free. Otherwise create an org-less (free) profile.
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  v_domain text;
  v_org    public.organisations%rowtype;
  v_count  int;
begin
  v_domain := lower(split_part(coalesce(new.email, ''), '@', 2));

  if v_domain <> '' then
    select * into v_org
      from public.organisations
      where v_domain = any (email_domains)
      limit 1;

    if found then
      select count(*) into v_count from public.profiles where org_id = v_org.id;
      if v_org.seat_limit is null or v_count < v_org.seat_limit then
        insert into public.profiles (id, email, org_id)
        values (new.id, new.email, v_org.id)
        on conflict (id) do nothing;
        return new;
      end if;
      -- seats full → fall through to an org-less (free) profile.
    end if;
  end if;

  insert into public.profiles (id, email)
  values (new.id, new.email)
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- ─────────────────────────────────────────────────────────────────────────────
-- PROVISIONING A CUSTOMER (you do this once per org, from the SQL editor):
--
--   -- CHP Pro, 3 seats, auto-join their domain:
--   insert into public.organisations (name, tier, seat_limit, email_domains)
--   values ('Acme Community Housing', 'pro', 3, '{acmehousing.org.au}');
--
--   -- Enterprise, 10 seats:
--   insert into public.organisations (name, tier, seat_limit, email_domains)
--   values ('Big CHP', 'enterprise', 10, '{bigchp.org.au,bigchp.com.au}');
--
--   -- Government, unlimited seats (seat_limit NULL):
--   insert into public.organisations (name, tier, seat_limit, email_domains)
--   values ('NSW Housing', 'government', null, '{nsw.gov.au}');
--
-- Their staff then just sign in with their work email and auto-join.
--
-- Attach someone whose email domain does NOT match (e.g. a consultant):
--   update public.profiles set org_id =
--     (select id from public.organisations where name = 'Big CHP')
--   where email = 'consultant@gmail.com';
--
-- Change a customer's plan / seats:
--   update public.organisations set tier='enterprise', seat_limit=10
--   where name='Acme Community Housing';
--
-- Revoke: remove the user from the org (frees a seat):
--   update public.profiles set org_id = null where email='leaver@bigchp.org.au';
-- ─────────────────────────────────────────────────────────────────────────────
