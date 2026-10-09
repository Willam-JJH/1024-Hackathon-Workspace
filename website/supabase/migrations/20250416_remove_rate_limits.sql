-- Remove rate limit policies
drop policy if exists "Allow public registration inserts with rate limit" on public.student_registrations;
drop policy if exists "Allow public registration inserts with rate limit" on public.school_registrations;

-- Create new policies without rate limiting
create policy "Allow public registration inserts" on public.student_registrations
  for insert
  to public
  with check (true);

create policy "Allow public registration inserts" on public.school_registrations
  for insert
  to public
  with check (
    student_count > 0 and
    student_count <= 10 and
    length(school_name) > 0 and
    length(teacher_name) > 0
  );

-- Drop rate limit related objects
drop function if exists check_rate_limit;
drop function if exists cleanup_old_rate_limits;
drop table if exists public.rate_limits;
drop table if exists public.ip_whitelist;
