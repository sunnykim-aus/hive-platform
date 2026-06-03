-- ─────────────────────────────────────────────────────────────────────────────
-- HIVE access tiers — Supabase schema.
-- Run this once in your Supabase project: Dashboard → SQL Editor → paste → Run.
-- ─────────────────────────────────────────────────────────────────────────────

-- 1. profiles: one row per auth user, carrying their access tier.
create table if not exists public.profiles (
  id         uuid primary key references auth.users (id) on delete cascade,
  email      text,
  org        text,
  tier       text not null default 'free'
             check (tier in ('free', 'pro', 'enterprise', 'government')),
  created_at timestamptz not null default now()
);

-- 2. Row Level Security: users may READ their own profile, and nothing else.
--    There is deliberately NO insert/update policy for users, so a customer
--    can never change their own tier. You set tier from the dashboard (which
--    uses the service role and bypasses RLS).
alter table public.profiles enable row level security;

drop policy if exists "read own profile" on public.profiles;
create policy "read own profile"
  on public.profiles for select
  using (auth.uid() = id);

-- 3. Auto-create a free profile whenever a new auth user signs up.
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, email, tier)
  values (new.id, new.email, 'free')
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- ─────────────────────────────────────────────────────────────────────────────
-- Provisioning a customer (after they have signed in once):
--   update public.profiles set tier = 'pro'        where email = 'them@chp.org.au';
--   update public.profiles set tier = 'enterprise' where email = 'them@bigchp.org.au';
--   update public.profiles set tier = 'government'  where email = 'them@nsw.gov.au';
-- Downgrade / revoke:
--   update public.profiles set tier = 'free'        where email = 'them@chp.org.au';
-- ─────────────────────────────────────────────────────────────────────────────
