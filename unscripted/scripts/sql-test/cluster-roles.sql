-- 集群级：Supabase 预置的角色。每个测试集群只需建一次。
do $$
begin
  if not exists (select 1 from pg_roles where rolname = 'anon') then
    create role anon noinherit nologin;
  end if;
  if not exists (select 1 from pg_roles where rolname = 'authenticated') then
    create role authenticated noinherit nologin;
  end if;
  if not exists (select 1 from pg_roles where rolname = 'service_role') then
    create role service_role noinherit nologin bypassrls;
  end if;
end $$;

-- 本地测试用：让 postgres 能 set role 成这几个角色，从而验证权限边界
grant anon to postgres;
grant authenticated to postgres;
grant service_role to postgres;
