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

create table if not exists public.question_bank (
  id integer not null,
  category_id text not null,
  level text not null check (level in ('shokyu', 'senmonkyu')),
  year integer not null check (year between 2000 and 2100),
  question text not null,
  reading text not null default '',
  image text not null default '',
  answer text not null check (answer in ('○', '×')),
  explanation text not null default '',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  primary key (category_id, id)
);

create index if not exists idx_scores_user_id on public.scores(user_id);
create index if not exists idx_scores_timestamp on public.scores(timestamp desc);
create index if not exists idx_profiles_username on public.profiles(username);
create index if not exists idx_profiles_is_admin on public.profiles(is_admin);
create index if not exists idx_question_bank_category on public.question_bank(category_id);
create index if not exists idx_question_bank_category_level on public.question_bank(category_id, level);

alter table public.profiles enable row level security;
alter table public.scores enable row level security;
alter table public.question_bank enable row level security;

grant select on public.question_bank to authenticated;
grant insert, update, delete on public.question_bank to authenticated;

drop policy if exists "question_bank_select_authenticated" on public.question_bank;
create policy "question_bank_select_authenticated"
  on public.question_bank
  for select
  to authenticated
  using (true);

drop policy if exists "question_bank_insert_admin" on public.question_bank;
create policy "question_bank_insert_admin"
  on public.question_bank
  for insert
  to authenticated
  with check (
    exists (
      select 1 from public.profiles p
      where p.id = auth.uid() and p.is_admin = true
    )
  );

drop policy if exists "question_bank_update_admin" on public.question_bank;
create policy "question_bank_update_admin"
  on public.question_bank
  for update
  to authenticated
  using (
    exists (
      select 1 from public.profiles p
      where p.id = auth.uid() and p.is_admin = true
    )
  )
  with check (
    exists (
      select 1 from public.profiles p
      where p.id = auth.uid() and p.is_admin = true
    )
  );

drop policy if exists "question_bank_delete_admin" on public.question_bank;
create policy "question_bank_delete_admin"
  on public.question_bank
  for delete
  to authenticated
  using (
    exists (
      select 1 from public.profiles p
      where p.id = auth.uid() and p.is_admin = true
    )
  );

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
