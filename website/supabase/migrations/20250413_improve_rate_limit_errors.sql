-- Drop and recreate the check_rate_limit function with better error messages
create or replace function check_rate_limit(client_ip text)
returns boolean
language plpgsql
security definer
as $$
declare
  ip_to_check text;
  rate_limit_record record;
  remaining_time interval;
begin
  -- Try to get IP from various headers
  ip_to_check := coalesce(
    current_setting('request.headers')::json->>'x-real-ip',
    current_setting('request.headers')::json->>'x-forwarded-for',
    current_setting('request.headers')::json->>'cf-connecting-ip',
    client_ip
  );

  -- Clean up old records
  perform cleanup_old_rate_limits();

  -- Get or create rate limit record
  insert into public.rate_limits (ip)
  values (ip_to_check)
  on conflict (ip) do update
  set attempts = rate_limits.attempts + 1,
      last_attempt = now()
  returning *
  into rate_limit_record;

  -- Check if rate limited
  if rate_limit_record.attempts > 5 and
     rate_limit_record.last_attempt > now() - interval '1 hour' then
    
    -- Calculate remaining time
    remaining_time := (rate_limit_record.last_attempt + interval '1 hour') - now();
    
    raise exception 'RATE_LIMIT_EXCEEDED: Too many registration attempts. Please try again in % minutes.',
          ceiling(extract(epoch from remaining_time) / 60);
  end if;

  return true;
end;
$$;
