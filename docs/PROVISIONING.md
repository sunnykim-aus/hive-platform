# HIVE Access Provisioning — Playbook

How to grant, change, and revoke customer access. Two ways to do everything:
the **Admin panel** (`/admin`, click-based) or **Supabase SQL** (copy-paste).

---

## The tier model

| Tier | Who | Seats | Unlocks |
|------|-----|-------|---------|
| **free** | anyone (no login needed) | 1 | Housing Data, Housing Need (national), Supply Pipeline (state), Evidence sample |
| **pro** | CHP Pro ($6,500/yr) | 3 | + Development Viability, HAFF, Funding & Programs, Sustainability suite, Asset Intelligence, My Portfolio, full RAG search, PDF/Excel export |
| **enterprise** | CHP Enterprise ($18,000/yr) | 10 | + branded exports, HAFF submission pack, priority data, policy modelling |
| **government** | Government/HA ($45,000/yr) | unlimited | + custom data feeds, waitlist/supply-gap exports, ministerial briefing pack |

A user's tier = **their organisation's tier**. You manage organisations, not individual users.

---

## When a new customer signs up

### Option A — Admin panel (recommended)
1. Go to **https://hive.impactanalyticsaustralia.com.au/admin** (you must be signed in as an admin).
2. Under **Create organisation**:
   - **Name**: the customer's organisation name
   - **Tier**: the plan they bought
   - **Seats**: leave the default (3/10) or blank for unlimited (government)
   - **Email domains**: their work email domain(s), comma-separated (e.g. `bigchp.org.au`)
3. Click **Create**.
4. Tell the customer to sign in at the HIVE site with their **work email**. They auto-join and get their tier. Done.

### Option B — Supabase SQL
Supabase → SQL Editor → run one of:
```sql
-- CHP Pro, 3 seats
insert into public.organisations (name, tier, seat_limit, email_domains)
values ('Acme Community Housing', 'pro', 3, '{acmehousing.org.au}');

-- Enterprise, 10 seats
insert into public.organisations (name, tier, seat_limit, email_domains)
values ('Big CHP', 'enterprise', 10, '{bigchp.org.au,bigchp.com.au}');

-- Government, unlimited
insert into public.organisations (name, tier, seat_limit, email_domains)
values ('NSW Housing', 'government', null, '{nsw.gov.au}');
```

---

## Common tasks

**Add a person whose email domain doesn't match** (e.g. a consultant on gmail):
- Panel: *Attach a user to an org* → enter their email + pick the org. (They must have signed in once first.)
- SQL: `update public.profiles set org_id = (select id from public.organisations where name='Big CHP') where email='consultant@gmail.com';`

**Upgrade / downgrade a customer:**
- Panel: change the org's **Tier** dropdown → **Save**.
- SQL: `update public.organisations set tier='enterprise', seat_limit=10 where name='Acme Community Housing';`

**Change seat count:**
- Panel: edit **Seats** → Save. (Blank = unlimited.)
- SQL: `update public.organisations set seat_limit=10 where name='Big CHP';`

**Revoke a person (frees a seat):**
- Panel: *Attach a user* → their email → org = "none (free)".
- SQL: `update public.profiles set org_id=null where email='leaver@bigchp.org.au';`

**Revoke a whole customer:** set their org tier to `free` (keeps the record) or remove the domain so new staff can't join.

---

## How access actually works (for reference)

- **Login** = email + 6-digit code (no passwords; code is scanner-proof).
- On first sign-in, a user is **auto-joined** to the organisation whose `email_domains` match their address, if a seat is free.
- Route gating lives in `proxy.ts` + `lib/entitlements.ts`. Free pages are open to everyone; paid pages redirect non-members to `/login`, and insufficient tier to `/locked`.
- Seats full or no matching domain → the user gets a **free** (org-less) profile and can still use the free pages.

---

## Troubleshooting

- **Customer can't log in / no code email** → check Resend → Emails for delivery; check the email template contains `{{ .Token }}`; check the per-user 60s cooldown.
- **Signed in but still locked** → their org wasn't set before first login, or domain didn't match. Attach them manually (above), then have them reload.
- **Admin panel says "Admin not configured"** → `SUPABASE_SERVICE_ROLE_KEY` env var is missing on the server.
- **Can't open /admin** → your email isn't in `ADMIN_EMAILS`.
