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

create table if not exists public.registration_groups (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  active boolean not null default true,
  created_at timestamptz not null default now()
);

create unique index if not exists idx_registration_groups_name_normalized
  on public.registration_groups (lower(regexp_replace(trim(name), '\s+', ' ', 'g')));

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
create index if not exists idx_profiles_group_name on public.profiles(group_name);
create index if not exists idx_question_bank_category on public.question_bank(category_id);
create index if not exists idx_question_bank_category_level on public.question_bank(category_id, level);

alter table public.profiles enable row level security;
alter table public.scores enable row level security;
alter table public.question_bank enable row level security;
grant select, insert, delete on public.scores to authenticated;

create or replace function public.has_active_group_access()
returns boolean
language sql stable security definer set search_path = public
as $$
  select exists (
    select 1
    from public.profiles p
    left join public.registration_groups g
      on lower(regexp_replace(trim(g.name), '\s+', ' ', 'g')) = lower(regexp_replace(trim(p.group_name), '\s+', ' ', 'g'))
    where p.id = auth.uid()
      and (p.is_admin or (p.approval_status = 'approved' and g.active = true))
  );
$$;
revoke execute on function public.has_active_group_access() from public;
grant execute on function public.has_active_group_access() to authenticated;

grant select on public.question_bank to authenticated;
grant insert, update, delete on public.question_bank to authenticated;

drop policy if exists "question_bank_select_authenticated" on public.question_bank;
create policy "question_bank_select_authenticated"
  on public.question_bank
  for select
  to authenticated
  using (public.has_active_group_access());

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
-- Status akses dikendalikan oleh registration_groups, bukan update user satu per satu.
revoke update (approval_status, approved_at) on public.profiles from public, anon, authenticated;

-- Fitur kode undangan sudah tidak dipakai. Tabel invite_groups lama dibiarkan
-- agar migrasi tidak menghapus data historis, tetapi tidak lagi menjadi syarat signup.
alter table public.invite_groups enable row level security;
drop policy if exists "invite_groups_select_authenticated" on public.invite_groups;
drop policy if exists "invite_groups_select_admin" on public.invite_groups;
revoke all on public.invite_groups from public, anon, authenticated;
drop function if exists public.create_invite_group(text, text, integer);
drop function if exists public.set_invite_group_active(uuid, boolean);
drop function if exists public.register_with_invite(text, text);

-- Semua user dapat mendaftar jika nama grupnya sedang aktif.
drop function if exists public.register_profile(text);
create or replace function public.register_profile(p_name text, p_group_name text)
returns public.profiles
language plpgsql
security definer
set search_path = public
as $$
declare
  allowed_group public.registration_groups;
  user_email text;
  generated_username text;
  new_profile public.profiles;
begin
  if auth.uid() is null then
    raise exception 'Anda harus login untuk mendaftar';
  end if;
  if length(trim(coalesce(p_name, ''))) < 2 then
    raise exception 'Nama asli wajib diisi';
  end if;
  if length(trim(coalesce(p_group_name, ''))) < 2 then
    raise exception 'Nama grup wajib diisi';
  end if;

  select * into allowed_group
  from public.registration_groups
  where lower(regexp_replace(trim(name), '\s+', ' ', 'g')) = lower(regexp_replace(trim(p_group_name), '\s+', ' ', 'g'))
    and active = true;
  if not found then
    raise exception 'Grup tidak terdaftar atau sedang dinonaktifkan';
  end if;

  select email into user_email from auth.users where id = auth.uid();
  generated_username := split_part(coalesce(user_email, 'user'), '@', 1);
  if exists (select 1 from public.profiles where username = generated_username) then
    generated_username := generated_username || '-' || substr(replace(auth.uid()::text, '-', ''), 1, 8);
  end if;

  insert into public.profiles (id, email, username, name, group_name, approval_status)
  values (auth.uid(), coalesce(user_email, ''), generated_username, trim(p_name), allowed_group.name, 'approved')
  on conflict (id) do update set name = excluded.name, group_name = excluded.group_name,
    approval_status = 'approved', approved_at = now();

  select * into new_profile from public.profiles where id = auth.uid();
  return new_profile;
end;
$$;

revoke execute on function public.register_profile(text, text) from public;

-- Admin mengatur grup yang boleh mendaftar dan akses seluruh anggotanya.
alter table public.registration_groups enable row level security;
drop policy if exists "registration_groups_select_admin" on public.registration_groups;
create policy "registration_groups_select_admin"
  on public.registration_groups for select to authenticated
  using (public.is_admin_user());
grant select on public.registration_groups to authenticated;

create or replace function public.create_registration_group(p_name text)
returns public.registration_groups
language plpgsql security definer set search_path = public
as $$
declare new_group public.registration_groups;
begin
  if not public.is_admin_user() then
    raise exception 'Hanya admin yang dapat mengatur grup';
  end if;
  if length(trim(coalesce(p_name, ''))) < 2 then
    raise exception 'Nama grup wajib diisi';
  end if;
  insert into public.registration_groups (name)
  values (regexp_replace(trim(p_name), '\s+', ' ', 'g'))
  returning * into new_group;
  return new_group;
end;
$$;

create or replace function public.set_registration_group_active(p_id uuid, p_active boolean)
returns public.registration_groups
language plpgsql security definer set search_path = public
as $$
declare updated_group public.registration_groups;
begin
  if not public.is_admin_user() then
    raise exception 'Hanya admin yang dapat mengatur grup';
  end if;
  update public.registration_groups
  set active = coalesce(p_active, false)
  where id = p_id
  returning * into updated_group;
  if not found then raise exception 'Grup tidak ditemukan'; end if;
  return updated_group;
end;
$$;

revoke execute on function public.create_registration_group(text) from public;
grant execute on function public.create_registration_group(text) to authenticated;
revoke execute on function public.set_registration_group_active(uuid, boolean) from public;
grant execute on function public.set_registration_group_active(uuid, boolean) to authenticated;

create or replace function public.move_profiles_to_group(p_user_ids uuid[], p_group_id uuid)
returns integer
language plpgsql security definer set search_path = public
as $$
declare
  target_group public.registration_groups;
  changed_count integer;
begin
  if not public.is_admin_user() then
    raise exception 'Hanya admin yang dapat mengatur grup user';
  end if;
  select * into target_group from public.registration_groups where id = p_group_id;
  if not found then raise exception 'Grup tujuan tidak ditemukan'; end if;
  if coalesce(array_length(p_user_ids, 1), 0) = 0 then
    raise exception 'Tidak ada user yang dipilih';
  end if;

  update public.profiles
  set group_name = target_group.name,
      approval_status = 'approved',
      approved_at = coalesce(approved_at, now())
  where id = any(p_user_ids) and is_admin = false;
  get diagnostics changed_count = row_count;
  return changed_count;
end;
$$;

revoke execute on function public.move_profiles_to_group(uuid[], uuid) from public;
grant execute on function public.move_profiles_to_group(uuid[], uuid) to authenticated;

-- Profil hanya dapat membaca status aksesnya sendiri; admin dapat membaca semua.
create or replace function public.get_profile_access(p_user_id uuid default auth.uid())
returns table (
  id uuid, email text, username text, name text, is_admin boolean,
  approval_status text, group_name text, group_active boolean,
  created_at timestamptz, approved_at timestamptz
)
language plpgsql stable security definer set search_path = public
as $$
begin
  if p_user_id <> auth.uid() and not public.is_admin_user() then
    raise exception 'Tidak diizinkan membaca profil ini';
  end if;
  return query
  select p.id, p.email, p.username, p.name, p.is_admin, p.approval_status,
         p.group_name,
         (p.is_admin or coalesce(g.active, false)) as group_active,
         p.created_at, p.approved_at
  from public.profiles p
  left join public.registration_groups g
    on lower(regexp_replace(trim(g.name), '\s+', ' ', 'g')) = lower(regexp_replace(trim(p.group_name), '\s+', ' ', 'g'))
  where p.id = p_user_id;
end;
$$;

revoke execute on function public.get_profile_access(uuid) from public;
grant execute on function public.get_profile_access(uuid) to authenticated;

grant execute on function public.register_profile(text, text) to authenticated;

drop policy if exists "scores_select_own_or_admin" on public.scores;
create policy "scores_select_own_or_admin"
  on public.scores
  for select
  to authenticated
  using (
    (auth.uid() = user_id and public.has_active_group_access())
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
  with check (auth.uid() = user_id and public.has_active_group_access());

drop policy if exists "scores_delete_admin" on public.scores;
create policy "scores_delete_admin"
  on public.scores for delete to authenticated
  using (exists (
    select 1 from public.profiles p
    where p.id = auth.uid() and p.is_admin = true
  ));
