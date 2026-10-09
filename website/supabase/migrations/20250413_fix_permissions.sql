-- Grant necessary insert permissions for registration tables
grant insert on table public.school_registrations to anon;
grant insert on table public.school_students to anon;
grant insert on table public.student_registrations to anon;

-- Grant access to uuid generation function (needed for id generation)
grant execute on function gen_random_uuid() to anon;
