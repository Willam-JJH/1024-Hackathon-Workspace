-- 数据库级：Supabase 提供、但原生 PostgreSQL 没有的东西。
-- 每个测试库都要建一次。
--
-- 目的只是让迁移脚本能跑起来并验证权限边界，不是完整复刻 Supabase。
-- 如果迁移脚本将来用到了这里没 stub 的东西，测试会报错 —— 那正是我们想知道的。

create schema if not exists storage;

-- storage.buckets：迁移脚本会往这里 insert
create table if not exists storage.buckets (
  id                 text primary key,
  name               text not null,
  public             boolean default false,
  file_size_limit    bigint,
  allowed_mime_types text[],
  created_at         timestamptz default now()
);

-- storage.objects：迁移脚本会在这里建策略
create table if not exists storage.objects (
  id         uuid primary key default gen_random_uuid(),
  bucket_id  text references storage.buckets (id),
  name       text,
  owner      uuid,
  created_at timestamptz default now()
);

alter table storage.objects enable row level security;

-- Supabase 自带的函数，返回路径里除文件名外的各级目录
create or replace function storage.foldername(name text)
returns text[]
language plpgsql
immutable
as $$
declare
  _parts text[];
begin
  _parts := string_to_array(name, '/');
  return _parts[1:array_length(_parts, 1) - 1];
end;
$$;

-- auth schema：迁移脚本会读 auth.users（初始化筹备组名单）、
-- 并在策略里调用 auth.uid()
create schema if not exists auth;

create table if not exists auth.users (
  id    uuid primary key default gen_random_uuid(),
  email text unique
);

-- Supabase 的实现是读 JWT 里的 sub 声明。
-- 测试里用 set request.jwt.claim.sub = '<uuid>' 来模拟"当前登录的是谁"。
create or replace function auth.uid()
returns uuid
language sql
stable
as $$
  select nullif(current_setting('request.jwt.claim.sub', true), '')::uuid;
$$;

grant usage on schema auth to anon, authenticated;
grant select on auth.users to postgres;

-- Realtime 的发布通道，迁移脚本会往里加表
do $$
begin
  if not exists (select 1 from pg_publication where pubname = 'supabase_realtime') then
    create publication supabase_realtime;
  end if;
end $$;
