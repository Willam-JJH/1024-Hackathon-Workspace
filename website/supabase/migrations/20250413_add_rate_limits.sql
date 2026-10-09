
--partially broken but fixed with other snippets i think

-- Create rate limits table
create table public.rate_limits (
  ip text primary key,
  attempts integer not null default 1,
  last_attempt timestamptz not null default now(),
  created_at timestamptz not null default now()
);

-- Enable RLS
alter table public.rate_limits enable row level security;

-- Create maintenance function to clean up old rate limit records
create or replace function cleanup_old_rate_limits()
returns void
language plpgsql
security definer
as $$
begin
  -- Remove records older than 24 hours
  delete from public.rate_limits
  where last_attempt < now() - interval '1 day';
end;
$$;

-- Policy to allow reads/writes to rate_limits table (backend only)
create policy "Backend can read rate_limits"
  on public.rate_limits
  for select
  to service_role
  using (true);

create policy "Backend can insert rate_limits"
  on public.rate_limits
  for insert
  to service_role
  with check (true);

create policy "Backend can update rate_limits"
  on public.rate_limits
  for update
  to service_role
  using (true);

-- Create function to check and update rate limits
create or replace function check_rate_limit(client_ip text)
returns boolean
language plpgsql
security definer
as $$
declare
  rate_limit_record record;
begin
  -- Clean up old records first
  perform cleanup_old_rate_limits();

  -- Get or create rate limit record
  insert into public.rate_limits (ip)
  values (client_ip)
  on conflict (ip) do update
  set attempts = rate_limits.attempts + 1,
      last_attempt = now()
  returning *
  into rate_limit_record;

  -- Check if limit exceeded (5 attempts per hour)
  if rate_limit_record.attempts > 5 and
     rate_limit_record.last_attempt > now() - interval '1 hour'
  then
    return false;
  end if;

  return true;
end;
$$;

-- Modify existing policies for student_registrations
drop policy if exists "Allow public registration inserts" on public.student_registrations;
create policy "Allow public registration inserts with rate limit" on public.student_registrations
  as restrictive
  for insert
  to public
  with check (
    check_rate_limit(current_setting('request.headers')::json->>'cf-connecting-ip')
  );

-- Modify existing policies for school_registrations
drop policy if exists "Allow public registration inserts" on public.school_registrations;
create policy "Allow public registration inserts with rate limit" on public.school_registrations
  as restrictive
  for insert
  to public
  with check (
    check_rate_limit(current_setting('request.headers')::json->>'cf-connecting-ip') and
    student_count > 0 and
    student_count <= 10 and
    length(school_name) > 0 and
    length(teacher_name) > 0
  );

-- Grant necessary permissions
grant usage on schema public to anon;
grant select, insert, update on public.rate_limits to service_role;
