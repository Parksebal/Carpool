create type verification_status as enum (
  'not_submitted',
  'pending',
  'approved',
  'rejected'
);

create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text not null unique,
  full_name text,
  profile_photo_url text,
  university text,
  class_year text,
  major text,
  student_status verification_status not null default 'not_submitted',
  driver_status verification_status not null default 'not_submitted',
  rating numeric(2,1) default 0,
  completed_rides integer not null default 0,
  created_at timestamptz not null default now(),

  constraint email_must_be_edu check (email ~* '^[^@]+@[^@]+\.edu$')
);

create table public.student_verifications (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null unique references public.profiles(id) on delete cascade,
  student_id_path text not null,
  status verification_status not null default 'pending',
  rejection_reason text,
  submitted_at timestamptz not null default now(),
  reviewed_at timestamptz
);

alter table public.profiles enable row level security;
alter table public.student_verifications enable row level security;

create policy "Users can read their own profile"
on public.profiles
for select
to authenticated
using (auth.uid() = id);

create policy "Users can create their own profile"
on public.profiles
for insert
to authenticated
with check (auth.uid() = id);

create policy "Users can update their own profile"
on public.profiles
for update
to authenticated
using (auth.uid() = id)
with check (auth.uid() = id);

create policy "Users can read their own student verification"
on public.student_verifications
for select
to authenticated
using (auth.uid() = user_id);

create policy "Users can submit their own student verification"
on public.student_verifications
for insert
to authenticated
with check (auth.uid() = user_id);

create policy "Users can update their own student verification"
on public.student_verifications
for update
to authenticated
using (auth.uid() = user_id)
with check (auth.uid() = user_id);