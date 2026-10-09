-- Drop conflicting policies first
drop policy if exists "Allow public registration inserts" on public.school_registrations;
drop policy if exists "Allow public registration inserts with rate limit" on public.school_registrations;
drop policy if exists "Allow own registration select" on public.school_registrations;

-- Recreate the policies with proper permissions
create policy "Allow public registration inserts with rate limit" on public.school_registrations
  as permissive
  for insert
  to public
  with check (
    check_rate_limit(coalesce(
      current_setting('request.headers')::json->>'x-real-ip',
      current_setting('request.headers')::json->>'x-forwarded-for',
      current_setting('request.headers')::json->>'cf-connecting-ip'
    )) and
    student_count > 0 and
    student_count <= 10 and
    length(school_name) > 0 and
    length(teacher_name) > 0
  );

create policy "Allow own registration select" on public.school_registrations
  as permissive
  for select
  to public
  using (created_at > now() - interval '1 day');

-- Re-grant necessary permissions explicitly
grant usage on schema public to anon;
grant insert, select on public.school_registrations to anon;
grant insert on public.school_students to anon;
grant execute on function gen_random_uuid() to anon;
grant execute on function check_rate_limit(text) to anon;
