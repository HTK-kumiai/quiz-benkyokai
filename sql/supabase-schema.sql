-- Souzai Kako Quiz
-- Schema + RLS untuk GitHub Pages + Supabase

create extension if not exists pgcrypto;

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text not null unique,
  username text not null unique,
  name text not null,
  is_admin boolean not null default false,
  approval_status text not null default 'pending' check (approval_status in ('pending', 'approved', 'rejected')),
  group_name text not null default '',
  approved_at timestamptz,
  created_at timestamptz not null default now()
);

-- CREATE TABLE IF NOT EXISTS tidak menambah kolom pada tabel yang sudah ada.
-- Lengkapi tabel profiles lama sebelum membuat index dan aturan hak admin.
alter table public.profiles
  add column if not exists email text,
  add column if not exists is_admin boolean not null default false,
  add column if not exists approval_status text not null default 'pending',
  add column if not exists group_name text not null default '',
  add column if not exists approved_at timestamptz;

alter table public.profiles drop constraint if exists profiles_approval_status_check;
alter table public.profiles add constraint profiles_approval_status_check
  check (approval_status in ('pending', 'approved', 'rejected'));

-- Admin yang sudah ada tetap dapat masuk setelah migrasi.
update public.profiles
set approval_status = 'approved'
where is_admin = true and approval_status <> 'approved';
update public.profiles
set approval_status = 'approved'
where group_name = '' and approval_status = 'pending';

create table if not exists public.invite_groups (
  id uuid primary key default gen_random_uuid(),
  code text not null unique,
  group_name text not null,
  max_users integer not null default 12 check (max_users > 0),
  active boolean not null default true,
  created_at timestamptz not null default now()
);

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
grant select on public.invite_groups to authenticated;
grant select on public.profiles to authenticated;
grant update (approval_status, approved_at) on public.profiles to authenticated;

create or replace function public.is_admin_user()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (select 1 from public.profiles where id = auth.uid() and is_admin = true);
$$;
revoke execute on function public.is_admin_user() from public;
grant execute on function public.is_admin_user() to authenticated;

create or replace function public.protect_profile_approval()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if (new.approval_status is distinct from old.approval_status
      or new.approved_at is distinct from old.approved_at)
     and not public.is_admin_user() then
    raise exception 'Status persetujuan hanya dapat diubah admin';
  end if;
  return new;
end;
$$;
drop trigger if exists protect_profile_approval on public.profiles;
create trigger protect_profile_approval
before update on public.profiles
for each row execute function public.protect_profile_approval();


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

drop policy if exists "profiles_select_admin" on public.profiles;
create policy "profiles_select_admin"
  on public.profiles for select to authenticated
  using (public.is_admin_user());

drop policy if exists "profiles_approve_admin" on public.profiles;
create policy "profiles_approve_admin"
  on public.profiles for update to authenticated
  using (public.is_admin_user())
  with check (approval_status in ('pending', 'approved', 'rejected'));

alter table public.invite_groups enable row level security;
drop policy if exists "invite_groups_select_authenticated" on public.invite_groups;
create policy "invite_groups_select_authenticated"
  on public.invite_groups for select to authenticated using (active = true);

drop policy if exists "invite_groups_select_admin" on public.invite_groups;
create policy "invite_groups_select_admin"
  on public.invite_groups for select to authenticated
  using (public.is_admin_user());

-- Pengelolaan undangan dilakukan lewat RPC agar anon key tidak mendapat
-- izin insert/update langsung pada tabel undangan.
create or replace function public.create_invite_group(
  p_code text,
  p_group_name text,
  p_max_users integer
)
returns public.invite_groups
language plpgsql
security definer
set search_path = public
as $$
declare
  new_invite public.invite_groups;
begin
  if not public.is_admin_user() then
    raise exception 'Hanya admin yang dapat membuat undangan';
  end if;
  if length(trim(coalesce(p_code, ''))) < 4 then
    raise exception 'Kode undangan minimal 4 karakter';
  end if;
  if length(trim(coalesce(p_group_name, ''))) < 2 then
    raise exception 'Nama grup wajib diisi';
  end if;
  if coalesce(p_max_users, 0) < 1 then
    raise exception 'Kuota undangan harus lebih dari 0';
  end if;

  insert into public.invite_groups (code, group_name, max_users)
  values (upper(trim(p_code)), trim(p_group_name), p_max_users)
  returning * into new_invite;
  return new_invite;
end;
$$;

create or replace function public.set_invite_group_active(
  p_id uuid,
  p_active boolean
)
returns public.invite_groups
language plpgsql
security definer
set search_path = public
as $$
declare
  updated_invite public.invite_groups;
begin
  if not public.is_admin_user() then
    raise exception 'Hanya admin yang dapat mengubah undangan';
  end if;

  update public.invite_groups
  set active = coalesce(p_active, false)
  where id = p_id
  returning * into updated_invite;
  if not found then
    raise exception 'Undangan tidak ditemukan';
  end if;
  return updated_invite;
end;
$$;

revoke execute on function public.create_invite_group(text, text, integer) from public;
grant execute on function public.create_invite_group(text, text, integer) to authenticated;
revoke execute on function public.set_invite_group_active(uuid, boolean) from public;
grant execute on function public.set_invite_group_active(uuid, boolean) to authenticated;

-- Pendaftaran atomik: status pending juga dihitung agar batas grup tidak terlewati.
create or replace function public.register_with_invite(p_code text, p_name text)
returns public.profiles
language plpgsql
security definer
set search_path = public
as $$
declare
  invite public.invite_groups;
  user_email text;
  generated_username text;
  new_profile public.profiles;
  current_count integer;
begin
  if auth.uid() is null then
    raise exception 'Anda harus login untuk mendaftar';
  end if;
  if length(trim(coalesce(p_name, ''))) < 2 then
    raise exception 'Nama asli wajib diisi';
  end if;

  select * into invite from public.invite_groups
  where upper(code) = upper(trim(p_code)) and active = true
  for update;
  if not found then raise exception 'Kode undangan tidak valid atau sudah ditutup'; end if;

  select count(*) into current_count from public.profiles
  where group_name = invite.group_name and approval_status in ('pending', 'approved');
  if current_count >= invite.max_users then
    raise exception 'Kuota grup sudah penuh';
  end if;

  select email into user_email from auth.users where id = auth.uid();
  generated_username := split_part(coalesce(user_email, 'user'), '@', 1);
  if exists (select 1 from public.profiles where username = generated_username) then
    generated_username := generated_username || '-' || substr(replace(auth.uid()::text, '-', ''), 1, 8);
  end if;

  insert into public.profiles (id, email, username, name, group_name, approval_status)
  values (auth.uid(), coalesce(user_email, ''), generated_username, trim(p_name), invite.group_name, 'pending')
  on conflict (id) do update set name = excluded.name, group_name = excluded.group_name;

  select * into new_profile from public.profiles where id = auth.uid();
  return new_profile;
end;
$$;

grant execute on function public.register_with_invite(text, text) to authenticated;

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
