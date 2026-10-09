-- in supabase dashboard thing

-- Create registrations table
create table public.registrations (
  id uuid default gen_random_uuid() primary key,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  school_name text not null,
  teacher_name text not null,
  contact_email text not null,
  contact_phone text not null,
  contact_wechat text,
  student_count integer not null,
  students jsonb not null
);

-- Enable Row Level Security (RLS)
alter table public.registrations enable row level security;

-- Create a policy to allow inserts by anyone (since this is a public registration form)
create policy "Allow public registration inserts" on public.registrations
  for insert
  with check (true);

-- Create an index on created_at for better query performance
create index registrations_created_at_idx on public.registrations (created_at);
