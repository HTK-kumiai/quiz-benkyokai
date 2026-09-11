-- Souzai Kako Quiz
-- Schema + RLS untuk GitHub Pages + Supabase

create extension if not exists pgcrypto;

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text not null unique,
  username text not null unique,
  name text not null,
  is_admin boolean not null default false,
  created_at timestamptz not null default now()
);

-- CREATE TABLE IF NOT EXISTS tidak menambah kolom pada tabel yang sudah ada.
-- Lengkapi tabel profiles lama sebelum membuat index dan aturan hak admin.
alter table public.profiles
  add column if not exists email text,
  add column if not exists is_admin boolean not null default false;

-- Isi email profil lama dari akun Auth jika tersedia. Tetap izinkan NULL
-- pada tabel lama agar profil tanpa email Auth tidak menghambat migrasi.
update public.profiles as p
set email = u.email
from auth.users as u
where p.id = u.id and p.email is null and u.email is not null;

create table if not exists public.scores (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  username text not null,
  name text not null,
  category text not null,
  category_name text,
  level text not null check (level in ('shokyu', 'senmonkyu')),
  year text,
  correct integer not null default 0,
  wrong integer not null default 0,
  total integer not null default 0,
  percentage integer not null default 0,
  timestamp timestamptz not null default now()
);

create index if not exists idx_scores_user_id on public.scores(user_id);
create index if not exists idx_scores_timestamp on public.scores(timestamp desc);
create index if not exists idx_profiles_username on public.profiles(username);
create index if not exists idx_profiles_is_admin on public.profiles(is_admin);

alter table public.profiles enable row level security;
alter table public.scores enable row level security;

-- RLS membatasi baris; izin kolom mencegah user menaikkan hak admin sendiri.
revoke insert, update on public.profiles from public, anon, authenticated;
revoke insert (is_admin), update (is_admin) on public.profiles from public, anon, authenticated;
grant select on public.profiles to authenticated;
grant insert (id, email, username, name) on public.profiles to authenticated;
grant update (id, email, username, name) on public.profiles to authenticated;


drop policy if exists "profiles_select_own" on public.profiles;
create policy "profiles_select_own"
  on public.profiles
  for select
  to authenticated
  using (auth.uid() = id);

drop policy if exists "profiles_insert_own" on public.profiles;
create policy "profiles_insert_own"
  on public.profiles
  for insert
  to authenticated
  with check (auth.uid() = id);

drop policy if exists "profiles_update_own" on public.profiles;
create policy "profiles_update_own"
  on public.profiles
  for update
  to authenticated
  using (auth.uid() = id)
  with check (auth.uid() = id);

drop policy if exists "scores_select_own_or_admin" on public.scores;
create policy "scores_select_own_or_admin"
  on public.scores
  for select
  to authenticated
  using (
    auth.uid() = user_id
    or exists (
      select 1
      from public.profiles p
      where p.id = auth.uid()
        and p.is_admin = true
    )
  );

drop policy if exists "scores_insert_own" on public.scores;
create policy "scores_insert_own"
  on public.scores
  for insert
  to authenticated
  with check (auth.uid() = user_id);
