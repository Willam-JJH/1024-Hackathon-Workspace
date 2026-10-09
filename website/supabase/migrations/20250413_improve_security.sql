-- Drop and recreate the check_rate_limit function with multi-header support
create or replace function check_rate_limit(client_ip text)
returns boolean
language plpgsql
security definer
as $$
declare
  ip_to_check text;
  rate_limit_record record;
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

  -- Simple check: 5 attempts per hour
  return not (rate_limit_record.attempts > 5 and
             rate_limit_record.last_attempt > now() - interval '1 hour');
end;
$$;

-- Revoke broad permissions and grant only necessary ones
revoke all privileges on public.student_registrations from anon;
revoke all privileges on public.school_registrations from anon;
revoke all privileges on public.school_students from anon;

grant insert on public.student_registrations to anon;
grant insert on public.school_registrations to anon;
grant insert on public.school_students to anon;

-- Recreate rate limit policies to use the improved function
drop policy if exists "Allow public registration inserts with rate limit" on public.student_registrations;
create policy "Allow public registration inserts with rate limit" on public.student_registrations
  as restrictive
  for insert
  to public
  with check (
    check_rate_limit(current_setting('request.headers')::json->>'x-real-ip')
  );

drop policy if exists "Allow public registration inserts with rate limit" on public.school_registrations;
create policy "Allow public registration inserts with rate limit" on public.school_registrations
  as restrictive
  for insert
  to public
  with check (
    check_rate_limit(current_setting('request.headers')::json->>'x-real-ip') and
    student_count > 0 and
    student_count <= 10 and
    length(school_name) > 0 and
    length(teacher_name) > 0
  );
