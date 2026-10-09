-- CyberAware SA — initial schema
--
-- Run this once in the Supabase project's SQL editor (Project -> SQL Editor -> New query),
-- or via `supabase db push` once the CLI is linked to the project. Not applied automatically —
-- this repo/session has no service_role key or DB password, only the anon key.
--
-- Prerequisite: enable Authentication -> Sign In / Providers -> Anonymous Sign-Ins in the
-- dashboard. The app signs users in anonymously (no login screen) purely so these RLS
-- policies have a real auth.uid() to scope rows to; it upgrades cleanly to email/magic-link
-- auth later via supabase.auth.updateUser()/linkIdentity() without a data migration, since
-- rows are already keyed by the (stable) auth.uid().
--
-- POPIA note: Supabase has no South Africa hosting region. Before any of this holds real,
-- identifiable student data, the project needs a documented lawful basis under POPIA —
-- see CLAUDE.md's "POPIA & data residency" rule. This migration only creates the structure;
-- it does not itself constitute that sign-off.

-- ---------------------------------------------------------------------------
-- profiles: one row per auth user, auto-created on sign-up (including anonymous sign-in).
-- ---------------------------------------------------------------------------
create table if not exists public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  streak integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.profiles enable row level security;

create policy "profiles: owner can select" on public.profiles
  for select using (auth.uid() = id);
create policy "profiles: owner can update" on public.profiles
  for update using (auth.uid() = id) with check (auth.uid() = id);

-- Auto-provision a profile row whenever a new auth user is created (anonymous or not),
-- so app code never has to remember to create one.
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id) values (new.id)
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- ---------------------------------------------------------------------------
-- module_progress: one row per (user, module), upserted as the student progresses.
-- ---------------------------------------------------------------------------
create table if not exists public.module_progress (
  user_id uuid not null references auth.users (id) on delete cascade,
  module_id text not null,
  progress smallint not null check (progress between 0 and 100),
  updated_at timestamptz not null default now(),
  primary key (user_id, module_id)
);

alter table public.module_progress enable row level security;

create policy "module_progress: owner can select" on public.module_progress
  for select using (auth.uid() = user_id);
create policy "module_progress: owner can insert" on public.module_progress
  for insert with check (auth.uid() = user_id);
create policy "module_progress: owner can update" on public.module_progress
  for update using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- ---------------------------------------------------------------------------
-- badges_earned: append-only per (user, badge) — a badge is never revoked.
-- ---------------------------------------------------------------------------
create table if not exists public.badges_earned (
  user_id uuid not null references auth.users (id) on delete cascade,
  badge_id text not null,
  earned_at timestamptz not null default now(),
  primary key (user_id, badge_id)
);

alter table public.badges_earned enable row level security;

create policy "badges_earned: owner can select" on public.badges_earned
  for select using (auth.uid() = user_id);
create policy "badges_earned: owner can insert" on public.badges_earned
  for insert with check (auth.uid() = user_id);

-- ---------------------------------------------------------------------------
-- quiz_attempts: immutable log, one row per assessment attempt (pass or fail).
-- ---------------------------------------------------------------------------
create table if not exists public.quiz_attempts (
  id bigint generated always as identity primary key,
  user_id uuid not null references auth.users (id) on delete cascade,
  module_id text not null,
  score smallint not null check (score between 0 and 100),
  passed boolean not null,
  attempted_at timestamptz not null default now()
);

alter table public.quiz_attempts enable row level security;

create policy "quiz_attempts: owner can select" on public.quiz_attempts
  for select using (auth.uid() = user_id);
create policy "quiz_attempts: owner can insert" on public.quiz_attempts
  for insert with check (auth.uid() = user_id);
