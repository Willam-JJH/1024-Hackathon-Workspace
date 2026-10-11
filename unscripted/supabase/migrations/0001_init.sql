-- ============================================================================
-- Unscripted · 报名与作品提交 —— 初始化
--
-- 用法：Supabase Dashboard → SQL Editor → New query → 整段粘贴 → Run
-- 可以重复执行（建表 if not exists，策略先 drop 再建，函数 create or replace）
--
-- 权限设计（重点）：
--   匿名访客（anon）  → 能提交报名；能提交作品（但必须核对上报名记录）；
--                       一个字都读不到报名数据
--   筹备组（authenticated）→ 可以读全部，可以看作品文件
--   学生个人信息永远不公开可读
--
-- 作品归属怎么确认：
--   匿名读不到 participants 表，所以核对放在 submit_project() 这个
--   security definer 函数里做 —— 参赛者填「姓名 + 报名时的联系方式」，
--   函数内部去匹配，匹配不上就报错。前端拿不到任何报名数据。
-- ============================================================================


-- ========================== 1. 参加者报名 ==================================
create table if not exists public.participants (
  id                 uuid primary key default gen_random_uuid(),
  created_at         timestamptz not null default now(),

  name               text not null,                       -- 姓名
  contact            text not null,                       -- 联系方式（微信／手机）
  email              text,

  participation_type text not null default 'individual'   -- 个人 / 团队 / 社团
                     check (participation_type in ('individual','team','club')),
  group_name         text,                                -- 团队或社团名称
  member_count       int check (member_count is null or member_count between 1 and 50),

  direction          text not null default '',            -- 创作方向或已有内容
  has_existing       boolean not null default false,      -- 是否带着已有项目来
  existing_detail    text,

  day1_available     boolean not null default true,       -- 周六可来
  day2_available     boolean not null default true,       -- 周日可来
  time_note          text,                                -- 时段补充说明

  equipment_needs    text,                                -- 设备与工具需求
  notes              text
);

create index if not exists participants_created_at_idx on public.participants (created_at desc);


-- ========================== 2. 志愿者报名 ==================================
create table if not exists public.volunteers (
  id              uuid primary key default gen_random_uuid(),
  created_at      timestamptz not null default now(),

  name            text not null,
  contact         text not null,
  email           text,

  roles           text[] not null default '{}',           -- 岗位意愿，可多选
  day1_available  boolean not null default true,
  day2_available  boolean not null default true,
  time_note       text,

  experience      text,                                   -- 熟悉的工具或相关经验
  notes           text
);

create index if not exists volunteers_created_at_idx on public.volunteers (created_at desc);


-- ========================== 3. 参赛作品 ====================================
create table if not exists public.projects (
  id              uuid primary key default gen_random_uuid(),
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now(),

  title           text not null,                          -- 项目名
  summary         text not null,                          -- 一句话简介
  problem         text,                                   -- 关注的问题

  group_name      text,                                   -- 团队 / 社团
  members         text,                                   -- 参与成员
  direction       text,                                   -- 创作方向

  link            text,                                   -- 作品链接或入口
  instructions    text,                                   -- 必要操作说明（周日交接用）
  equipment_needs text,                                   -- 需要的设备与材料
  demo_format     text,                                   -- 演示形式
  contact         text,                                   -- 提交者联系方式

  files           jsonb not null default '[]'::jsonb,     -- [{path,name,size,type}]

  -- 作品在公开作品墙上的可见性，由作者提交时自己选：
  --   'named'     公开，署名
  --   'anonymous' 公开，不署名
  --   'hidden'    不上墙
  -- 故意不给默认值：提交时必须明确选一次，null 一律按最保守的 hidden 处理。
  wall_visibility text
                  check (wall_visibility in ('named','anonymous','hidden')),

  participant_id  uuid references public.participants(id) on delete set null
);

-- 已经建过表的库，用这句补上（整段脚本可以重复执行）
alter table public.projects
  add column if not exists wall_visibility text;

alter table public.projects
  drop constraint if exists projects_wall_visibility_check;

alter table public.projects
  add constraint projects_wall_visibility_check
  check (wall_visibility in ('named','anonymous','hidden'));

-- 早期版本用的是布尔字段 show_credit（只区分署不署名）。
-- 有就迁移过来再删掉：true→named，false→anonymous，
-- null→hidden（当时没问过"要不要公开"，按最保守处理）。
do $$
begin
  if exists (
    select 1 from information_schema.columns
    where table_schema = 'public'
      and table_name = 'projects'
      and column_name = 'show_credit'
  ) then
    update public.projects
    set wall_visibility = case
      when show_credit is true  then 'named'
      when show_credit is false then 'anonymous'
      else 'hidden'
    end
    where wall_visibility is null;

    alter table public.projects drop column show_credit;
  end if;
end $$;

create index if not exists projects_created_at_idx on public.projects (created_at desc);
create index if not exists projects_participant_idx on public.projects (participant_id);


-- ========================== 4. 开启行级安全 ================================
alter table public.participants enable row level security;
alter table public.volunteers   enable row level security;
alter table public.projects     enable row level security;


-- ========================== 5. 策略 ========================================

-- ---- 参加者：匿名可提交，只有筹备组可读 ----
drop policy if exists "participants: public can submit" on public.participants;
create policy "participants: public can submit"
  on public.participants for insert
  to anon, authenticated
  with check (
    length(btrim(name))    between 1 and 100
    and length(btrim(contact)) between 1 and 200
    and length(direction)  <= 5000
    and length(coalesce(notes, '')) <= 5000
  );

drop policy if exists "participants: staff can read" on public.participants;
create policy "participants: staff can read"
  on public.participants for select
  to authenticated
  using (true);

-- ---- 志愿者 ----
drop policy if exists "volunteers: public can submit" on public.volunteers;
create policy "volunteers: public can submit"
  on public.volunteers for insert
  to anon, authenticated
  with check (
    length(btrim(name))    between 1 and 100
    and length(btrim(contact)) between 1 and 200
    and length(coalesce(notes, '')) <= 5000
  );

drop policy if exists "volunteers: staff can read" on public.volunteers;
create policy "volunteers: staff can read"
  on public.volunteers for select
  to authenticated
  using (true);

-- ---- 作品：只允许筹备组读。写入一律走 submit_project() 函数 ----
-- （不开放匿名 insert，保证每一件作品都关联到一条核对过的报名记录）
drop policy if exists "projects: public can submit" on public.projects;
drop policy if exists "projects: staff can read" on public.projects;
create policy "projects: staff can read"
  on public.projects for select
  to authenticated
  using (true);


-- ========================== 6. 表级授权 ====================================
revoke all on public.participants from anon;
revoke all on public.volunteers   from anon;
revoke all on public.projects     from anon;

grant insert on public.participants to anon, authenticated;
grant insert on public.volunteers   to anon, authenticated;

grant select on public.participants to authenticated;
grant select on public.volunteers   to authenticated;
grant select on public.projects     to authenticated;


-- ========================== 7. 作品归属核对 + 提交 =========================

-- 用于存储策略的辅助函数：判断某个作品 id 是否真实存在。
-- 必须是 security definer，否则匿名调用时会被 projects 的 RLS 挡住。
create or replace function public.project_exists(p_id text)
returns boolean
language sql
security definer
stable
set search_path = public
as $$
  select exists (select 1 from public.projects where id::text = p_id);
$$;

grant execute on function public.project_exists(text) to anon, authenticated;


-- 提交（或更新）一件作品。
-- 参赛者必须提供报名时的姓名 + 联系方式，匹配上才允许写入。
-- 同一人对同一项目名重复提交视为修改，不会产生重复记录。
--
-- 加了 p_show_credit 之后签名变了，create or replace 会变成重载而不是替换，
-- 所以先把旧的 12 参数版本显式删掉。
drop function if exists public.submit_project(
  text, text, text, text, text, text, text, text, text, text, text, text
);

-- 中途用过一版 show_credit boolean，一并清掉
drop function if exists public.submit_project(
  text, text, text, text, boolean, text, text, text, text, text, text, text, text
);

create or replace function public.submit_project(
  p_name            text,
  p_contact         text,
  p_title           text,
  p_summary         text,
  p_wall_visibility text,
  p_problem         text default null,
  p_group_name      text default null,
  p_members         text default null,
  p_direction       text default null,
  p_link            text default null,
  p_instructions    text default null,
  p_equipment_needs text default null,
  p_demo_format     text default null
)
returns uuid
language plpgsql
security definer
set search_path = public
as $$
declare
  v_participant uuid;
  v_project     uuid;
  v_name        text := lower(btrim(coalesce(p_name, '')));
  v_contact     text := lower(regexp_replace(btrim(coalesce(p_contact, '')), '\s', '', 'g'));
begin
  if v_name = '' or v_contact = '' then
    raise exception 'NAME_OR_CONTACT_REQUIRED';
  end if;

  if btrim(coalesce(p_title, '')) = '' or btrim(coalesce(p_summary, '')) = '' then
    raise exception 'TITLE_OR_SUMMARY_REQUIRED';
  end if;

  -- 可见性必须明确选一次，不能靠默认值蒙混过去
  if p_wall_visibility is null
     or p_wall_visibility not in ('named','anonymous','hidden') then
    raise exception 'VISIBILITY_REQUIRED';
  end if;

  -- 核对归属：姓名 + 报名时填的联系方式，两者都要对上
  select p.id into v_participant
  from public.participants p
  where lower(btrim(p.name)) = v_name
    and lower(regexp_replace(btrim(p.contact), '\s', '', 'g')) = v_contact
  order by p.created_at desc
  limit 1;

  if v_participant is null then
    raise exception 'NOT_REGISTERED';
  end if;

  -- 同一个人、同一个项目名 = 修改已有提交
  select pr.id into v_project
  from public.projects pr
  where pr.participant_id = v_participant
    and lower(btrim(pr.title)) = lower(btrim(p_title))
  limit 1;

  if v_project is null then
    insert into public.projects (
      title, summary, problem, group_name, members, direction,
      link, instructions, equipment_needs, demo_format,
      contact, wall_visibility, participant_id
    ) values (
      btrim(p_title), btrim(p_summary), p_problem, p_group_name, p_members, p_direction,
      p_link, p_instructions, p_equipment_needs, p_demo_format,
      btrim(p_contact), p_wall_visibility, v_participant
    )
    returning id into v_project;
  else
    update public.projects set
      summary         = btrim(p_summary),
      problem         = p_problem,
      group_name      = p_group_name,
      members         = p_members,
      direction       = p_direction,
      link            = p_link,
      instructions    = p_instructions,
      equipment_needs = p_equipment_needs,
      demo_format     = p_demo_format,
      contact         = btrim(p_contact),
      wall_visibility = p_wall_visibility,
      updated_at      = now()
    where id = v_project;
  end if;

  return v_project;
end;
$$;

grant execute on function public.submit_project(
  text, text, text, text, text, text, text, text, text, text, text, text, text
) to anon, authenticated;


-- 上传完文件后回填文件清单（同样要核对归属）
create or replace function public.attach_project_files(
  p_project_id uuid,
  p_name       text,
  p_contact    text,
  p_files      jsonb
)
returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  v_name    text := lower(btrim(coalesce(p_name, '')));
  v_contact text := lower(regexp_replace(btrim(coalesce(p_contact, '')), '\s', '', 'g'));
begin
  update public.projects pr
  set files = coalesce(p_files, '[]'::jsonb),
      updated_at = now()
  where pr.id = p_project_id
    and exists (
      select 1 from public.participants p
      where p.id = pr.participant_id
        and lower(btrim(p.name)) = v_name
        and lower(regexp_replace(btrim(p.contact), '\s', '', 'g')) = v_contact
    );

  if not found then
    raise exception 'NOT_OWNER';
  end if;
end;
$$;

grant execute on function public.attach_project_files(uuid, text, text, jsonb)
  to anon, authenticated;


-- ========================== 8. 作品文件存储 ================================
-- 公开读（任何人都能通过链接看到作品图片），但只有筹备组能列出文件清单。
-- 单文件上限 50MB。

insert into storage.buckets (id, name, public, file_size_limit)
values ('project-files', 'project-files', true, 52428800)
on conflict (id) do update
  set public          = excluded.public,
      file_size_limit = excluded.file_size_limit;

-- 匿名可以上传，但只能传进「已存在的作品文件夹」里
drop policy if exists "project-files: upload" on storage.objects;
create policy "project-files: upload"
  on storage.objects for insert
  to anon, authenticated
  with check (
    bucket_id = 'project-files'
    and array_length(storage.foldername(name), 1) >= 1
    and public.project_exists((storage.foldername(name))[1])
  );

-- 筹备组可以列出所有作品文件
drop policy if exists "project-files: staff can list" on storage.objects;
create policy "project-files: staff can list"
  on storage.objects for select
  to authenticated
  using (bucket_id = 'project-files');


-- ========================== 9. 公开作品墙 ==================================
-- projects 表对匿名是关死的（里面有联系方式）。作品墙要公开，但不能顺手把
-- 联系方式也放出去 —— RLS 只能管到"行"，管不了"列"。
--
-- 所以用一个视图，只挑该公开的列。视图以属主身份执行，
-- 匿名只被授予这个视图的 select，碰不到原表。
--
-- 可见性规则（作者提交时自己选）：
--   named     上墙并署名
--   anonymous 上墙但不署名（成员名单也一并隐去，否则等于变相点名）
--   hidden    完全不上墙，视图里查不到
-- wall_visibility 为 null（早期数据）按 hidden 处理。

create or replace view public.public_projects as
select
  p.id,
  p.title,
  p.summary,
  p.problem,
  p.direction,
  p.link,
  p.created_at,

  -- 只有选了署名的才带名字：团队/社团优先，个人则回退到报名时的姓名
  case
    when p.wall_visibility = 'named'
      then coalesce(nullif(btrim(p.group_name), ''), pa.name)
    else null
  end as credit_name,

  -- 匿名展示时成员名字也隐去
  case
    when p.wall_visibility = 'named' then nullif(btrim(p.members), '')
    else null
  end as members,

  -- 只放图片，别的文件（zip、音频等）不上墙
  coalesce(
    (
      select jsonb_agg(f)
      from jsonb_array_elements(p.files) as f
      where f->>'type' like 'image/%'
    ),
    '[]'::jsonb
  ) as images

from public.projects p
left join public.participants pa on pa.id = p.participant_id
-- 选了"不上墙"的、以及早期没有表态的，一律不出现在视图里
where p.wall_visibility in ('named', 'anonymous');

-- 显式声明视图以属主身份执行。
-- 匿名角色对 projects 表没有 select 权限，如果视图改成以调用者身份执行，
-- 匿名读这个视图会拿到空结果。PG15 起该选项默认就是 false，
-- 这里写死一遍防止不同版本默认值差异。老版本没有这个选项，忽略即可。
do $$
begin
  execute 'alter view public.public_projects set (security_invoker = false)';
exception
  when others then null;
end $$;

-- 匿名和筹备组都能读这个视图；原表仍然只有筹备组能读
revoke all on public.public_projects from anon;
grant select on public.public_projects to anon, authenticated;


-- ========================== 10. 实时同步 ===================================
-- 让筹备组的看板能收到新报名，不用刷新页面
do $$
declare
  t text;
begin
  foreach t in array array['participants','volunteers','projects'] loop
    if not exists (
      select 1 from pg_publication_tables
      where pubname = 'supabase_realtime'
        and schemaname = 'public'
        and tablename = t
    ) then
      execute format('alter publication supabase_realtime add table public.%I', t);
    end if;
  end loop;
end $$;


-- ========================== 11. 自检 =======================================
-- 执行完运行这一段，结果应该是：
--   tables     3 行、每行 rls_enabled = true
--   functions  3 个
--   bucket     1 行、public = true、file_size_limit = 52428800
--   views      1 行（public_projects）

select relname as table_name, relrowsecurity as rls_enabled
from pg_class
where relnamespace = 'public'::regnamespace
  and relname in ('participants','volunteers','projects')
order by relname;

select proname as function_name
from pg_proc
where pronamespace = 'public'::regnamespace
  and proname in ('submit_project','attach_project_files','project_exists')
order by proname;

select id, public, file_size_limit
from storage.buckets
where id = 'project-files';

select viewname
from pg_views
where schemaname = 'public'
  and viewname = 'public_projects';
