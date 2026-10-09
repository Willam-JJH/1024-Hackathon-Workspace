-- Create whitelist table
create table public.ip_whitelist (
  ip text primary key,
  description text,
  created_at timestamptz not null default now()
);

-- Enable RLS
alter table public.ip_whitelist enable row level security;

-- Policy to allow reads to ip_whitelist table (backend only)
create policy "Backend can read ip_whitelist"
  on public.ip_whitelist
  for select
  to service_role
  using (true);

create policy "Backend can insert ip_whitelist"
  on public.ip_whitelist
  for insert
  to service_role
  with check (true);

-- Modify rate limit check function to skip whitelisted IPs
create or replace function check_rate_limit(client_ip text)
returns boolean
language plpgsql
security definer
as $$
declare
  rate_limit_record record;
  is_whitelisted boolean;
begin
  -- Check if IP is whitelisted
  select exists(
    select 1 from public.ip_whitelist where ip = client_ip
  ) into is_whitelisted;

  -- Skip rate limiting for whitelisted IPs
  if is_whitelisted then
    return true;
  end if;

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

-- Grant necessary permissions
grant select, insert on public.ip_whitelist to service_role;

-- Insert some example whitelisted IPs (modify as needed)
insert into public.ip_whitelist (ip, description) values
  ('127.0.0.1', 'Local development'),
  ('::1', 'Local development IPv6');
