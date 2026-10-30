-- TopKaun database schema (Supabase / Postgres)
-- Paste this into the Supabase SQL editor once, when you create the project.
-- It creates the tables and the atomic functions the app calls.

-- ── Listings ──────────────────────────────────────────────────────────
create table if not exists listings (
  slug         text primary key,
  name         text not null,
  mono         text not null,
  tagline      text not null default '',
  url          text,
  city         text not null,
  category     text not null,
  total_inr    integer not null default 0,
  today_inr    integer not null default 0,
  today_date   date not null default (now() at time zone 'Asia/Kolkata')::date,
  hype         integer not null default 0,
  verified     boolean not null default false,
  founding     integer,
  visits_sent  integer not null default 0,
  created_at   timestamptz not null default now()
);

create index if not exists listings_total_idx on listings (total_inr desc);
create index if not exists listings_city_idx on listings (city);
create index if not exists listings_category_idx on listings (category);

-- ── Activity feed ("Recent moves") ────────────────────────────────────
create table if not exists moves (
  id    bigserial primary key,
  text  text not null,
  at    timestamptz not null default now()
);

-- ── Watch-alert signups ───────────────────────────────────────────────
create table if not exists watchers (
  id     bigserial primary key,
  email  text not null,
  board  text not null,
  at     timestamptz not null default now()
);

-- ── Atomic promotion top-up ───────────────────────────────────────────
-- Adds to total_inr, and to today_inr with a midnight-IST reset, in one step.
create or replace function increment_promotion(p_slug text, p_amount integer)
returns setof listings
language plpgsql
as $$
declare
  ist_today date := (now() at time zone 'Asia/Kolkata')::date;
begin
  return query
  update listings
     set total_inr  = total_inr + p_amount,
         today_inr  = case when today_date = ist_today then today_inr + p_amount else p_amount end,
         today_date = ist_today,
         -- a light, deterministic bump to the visits metric
         visits_sent = visits_sent + greatest(1, p_amount / 100)
   where slug = p_slug
   returning *;
end;
$$;

-- ── Atomic hype ───────────────────────────────────────────────────────
create or replace function increment_hype(p_slug text)
returns setof listings
language plpgsql
as $$
begin
  return query
  update listings set hype = hype + 1 where slug = p_slug returning *;
end;
$$;

-- ── Row Level Security ────────────────────────────────────────────────
-- Public may READ the board; all WRITES go through the server (service role),
-- which bypasses RLS. So we enable RLS and add read-only policies.
alter table listings enable row level security;
alter table moves    enable row level security;

create policy "public read listings" on listings for select using (true);
create policy "public read moves"    on moves    for select using (true);

-- watchers holds emails: no public read. Writes happen via the service role.
alter table watchers enable row level security;

-- ── Optional: a nightly job to reset the Today board for everyone ──────
-- The increment function already resets a listing's today total lazily on its
-- next top-up. If you want the whole board to show 0 for Today right at
-- midnight IST (even for listings with no new promotion), schedule this with
-- Supabase's pg_cron at 00:00 IST (18:30 UTC):
--   update listings set today_inr = 0,
--     today_date = (now() at time zone 'Asia/Kolkata')::date
--   where today_date < (now() at time zone 'Asia/Kolkata')::date;
