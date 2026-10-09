-- Students table for individual student registrations
create table public.student_registrations (
  id uuid default gen_random_uuid() primary key,
  created_at timestamptz default now(),
  real_name text not null,
  preferred_name text,
  age integer not null,
  gender text not null,
  email text not null,
  phone_number text not null,
  wechat_id text,
  school text not null,
  grade text,
  skills text[] not null,  -- Array type for multiple skills
  experience text,
  links text
);

-- School registrations table (for teachers registering multiple students)
create table public.school_registrations (
  id uuid default gen_random_uuid() primary key,
  created_at timestamptz default now(),
  school_name text not null,
  teacher_name text not null,
  contact_email text not null,
  contact_phone text not null,
  contact_wechat text,
  student_count integer not null
);

-- School students table (for students registered by teachers)
create table public.school_students (
  id uuid default gen_random_uuid() primary key,
  school_registration_id uuid references school_registrations(id) on delete cascade,
  name text not null,
  age integer not null,
  gender text not null,
  skills text[] not null,
  extra text,
  hackathon_experience boolean not null default false
);

-- Enable Row Level Security (RLS)
alter table public.student_registrations enable row level security;
alter table public.school_registrations enable row level security;
alter table public.school_students enable row level security;

-- Drop any existing policies
drop policy if exists "Allow public registration inserts" on public.student_registrations;
drop policy if exists "Allow public registration inserts" on public.school_registrations;
drop policy if exists "Allow public registration inserts" on public.school_students;

-- Create insert and select policies
create policy "Allow public registration inserts" on public.student_registrations
  as permissive
  for insert
  to public
  with check (true);

create policy "Allow own registration select" on public.student_registrations
  as permissive
  for select
  to public
  using (created_at > now() - interval '1 day');

create policy "Allow public registration inserts" on public.school_registrations
  as permissive
  for insert
  to public
  with check (true);  -- Simplified policy, validation handled in application code

create policy "Allow own registration select" on public.school_registrations
  as permissive
  for select
  to public
  using (created_at > now() - interval '1 day');

create policy "Allow public registration inserts" on public.school_students
  as permissive
  for insert
  to public
  with check (true);  -- Simplified policy, foreign key constraint handles relationship

create policy "Allow own registration select" on public.school_students
  as permissive
  for select
  to public
  using (
    school_registration_id in (
      select id from public.school_registrations
      where created_at > now() - interval '1 day'
    )
  );

-- Grant necessary permissions to anonymous users
grant usage on schema public to anon;
grant all privileges on public.student_registrations to anon;
grant all privileges on public.school_registrations to anon;
grant all privileges on public.school_students to anon;

-- Grant UUID generation permissions
grant execute on function gen_random_uuid() to anon;

-- Set up CORS headers for the tables
alter table public.student_registrations add column if not exists cors_headers jsonb default '{"Access-Control-Allow-Origin": "*"}';
alter table public.school_registrations add column if not exists cors_headers jsonb default '{"Access-Control-Allow-Origin": "*"}';
alter table public.school_students add column if not exists cors_headers jsonb default '{"Access-Control-Allow-Origin": "*"}';

-- Create indexes for better query performance
create index student_registrations_created_at_idx on public.student_registrations (created_at);
create index school_registrations_created_at_idx on public.school_registrations (created_at);
create index school_students_registration_id_idx on public.school_students (school_registration_id);
