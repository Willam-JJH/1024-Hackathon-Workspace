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
  category        text not null default 'other'
                  check (category in ('website','tool','game','interactive','other')),  -- 作品类型
  video_url       text,                                   -- 演示视频外链（可选）
  contact         text,                                   -- 提交者联系方式

  files           jsonb not null default '[]'::jsonb,     -- [{path,name,size,type}]

  -- 作品在公开作品墙上的可见性，由作者提交时自己选：
  --   'named'      公开，署名（团体名或个人姓名）+ 成员名单
  --   'group_only' 公开，只显示社团／团队名，不列成员
  --   'anonymous'  公开，完全不署名
  --   'hidden'     不上墙
  -- 团体名是组织标识、个人姓名是个人信息，分量不同，所以分成两档。
  -- 故意不给默认值：提交时必须明确选一次，null 一律按最保守的 hidden 处理。
  wall_visibility text
                  check (wall_visibility in ('named','group_only','anonymous','hidden')),

  -- 下面是「写入时算好」的公开字段，专供匿名访客读取。
  -- 之所以预先算好存起来，而不是查询时现算：
  --   算它们要 join participants（拿个人姓名）并对文件做筛选，
  --   而匿名角色对 participants 没有任何权限。放在写入时算，
  --   读取端就只需要一张表的几个列，可以用列级授权精确控制公开范围，
  --   不必再依赖 SECURITY DEFINER 视图。
  credit_display   text,                                 -- 署名行，null = 不署名
  members_display  text,                                 -- 成员名单，null = 不显示
  group_display    text,                                 -- 社团/团队名（仅公开可见时），用于筛选
  public_images    jsonb not null default '[]'::jsonb,   -- 只含图片类文件
  public_videos    jsonb not null default '[]'::jsonb,   -- 只含视频类文件

  participant_id  uuid references public.participants(id) on delete set null
);

-- 已经建过表的库，用这句补上（整段脚本可以重复执行）
alter table public.projects
  add column if not exists wall_visibility text;

alter table public.projects
  add column if not exists credit_display text;

alter table public.projects
  add column if not exists members_display text;

alter table public.projects
  add column if not exists public_images jsonb not null default '[]'::jsonb;

alter table public.projects
  drop constraint if exists projects_wall_visibility_check;

alter table public.projects
  add constraint projects_wall_visibility_check
  check (wall_visibility in ('named','group_only','anonymous','hidden'));

alter table public.projects
  add column if not exists category text not null default 'other';

alter table public.projects
  add column if not exists video_url text;

alter table public.projects
  add column if not exists group_display text;

alter table public.projects
  add column if not exists public_videos jsonb not null default '[]'::jsonb;

alter table public.projects
  drop constraint if exists projects_category_check;

alter table public.projects
  add constraint projects_category_check
  check (category in ('website','tool','game','interactive','other'));

-- 早期版本用的是布尔字段 show_credit（只区分署不署名）。迁移到 wall_visibility。
--
-- 这一段整体是"尽力而为"：任何一步失败都只记一条 notice，不中断整段脚本。
-- 理由：中断会让后面的函数和视图都建不出来，站点直接不可用（已经踩过一次）。
-- 最坏情况只是留下一个没人引用的空列，不影响任何功能。
--
-- 顺序说明：必须先删视图再动列 —— 上一版的 public_projects 引用着 show_credit，
-- PostgreSQL 会拒绝删列。视图在本节后面会重建。不用 CASCADE，那会连带删掉
-- 没预料到的依赖对象。
do $$
begin
  -- 1. 先删掉可能引用着 show_credit 的旧视图
  begin
    drop view if exists public.public_projects;
  exception when others then
    raise notice '删除旧视图失败（%），继续', sqlerrm;
  end;

  -- 2. 没有 show_credit 字段就没什么可迁移的，直接结束
  if not exists (
    select 1 from information_schema.columns
    where table_schema = 'public'
      and table_name = 'projects'
      and column_name = 'show_credit'
  ) then
    return;
  end if;

  -- 3. 迁移数据：true→named，false→anonymous，null→hidden
  --    （null 那批当时没问过"要不要公开"，按最保守处理）
  begin
    update public.projects
    set wall_visibility = case
      when show_credit is true  then 'named'
      when show_credit is false then 'anonymous'
      else 'hidden'
    end
    where wall_visibility is null;
  exception when others then
    raise notice '迁移 show_credit 数据失败（%），继续', sqlerrm;
  end;

  -- 4. 删掉旧列。删不掉也无所谓，新代码不再引用它。
  begin
    alter table public.projects drop column show_credit;
  exception when others then
    raise notice '未能删除旧列 show_credit（%）。它已无人引用，可以忽略，也可在 Supabase 表编辑器里手动删除。', sqlerrm;
  end;
end $$;

-- 重算三个公开字段。整体重算而不是只补 null：
-- 这三个字段是可推导的，全量重算能保证它们和 wall_visibility 永远一致，
-- 而且幂等 —— 重复执行结果相同。表就这么几十行，代价可以忽略。
do $$
begin
  update public.projects p
  set credit_display = case
        when p.wall_visibility = 'named'
          then coalesce(
                 nullif(btrim(p.group_name), ''),
                 (select pa.name from public.participants pa where pa.id = p.participant_id)
               )
        when p.wall_visibility = 'group_only'
          then nullif(btrim(p.group_name), '')
        else null
      end,
      members_display = case
        when p.wall_visibility = 'named' then nullif(btrim(p.members), '')
        else null
      end,
      group_display = case
        when p.wall_visibility in ('named','group_only') then nullif(btrim(p.group_name), '')
        else null
      end,
      public_images = coalesce(
        (
          select jsonb_agg(f)
          from jsonb_array_elements(p.files) f
          where f->>'type' like 'image/%'
        ),
        '[]'::jsonb
      ),
      public_videos = coalesce(
        (
          select jsonb_agg(f)
          from jsonb_array_elements(p.files) f
          where f->>'type' like 'video/%'
        ),
        '[]'::jsonb
      );
exception when others then
  raise notice '重算公开字段失败（%），继续', sqlerrm;
end $$;

create index if not exists projects_created_at_idx on public.projects (created_at desc);
create index if not exists projects_participant_idx on public.projects (participant_id);


-- ========================== 4. 开启行级安全 ================================
alter table public.participants enable row level security;
alter table public.volunteers   enable row level security;
alter table public.projects     enable row level security;


-- ========================== 5. 私有 schema =================================
-- 放"只给数据库内部用、不该暴露成 API"的东西：权限判断、存在性检查。
-- PostgREST 只暴露 public，所以 private 里的函数不会被 /rest/v1/rpc/ 调用到。
create schema if not exists private;

grant usage on schema private to anon, authenticated;


-- ========================== 6. 筹备组名单 ==================================
-- 「登录了就能读」是不够的 —— 只要注册开关被误开，任何自助注册的人都会
-- 变成 authenticated，进而读到全部学生信息。所以再加一道名单：
-- 只有被显式加进 staff 表的人才是筹备组。
--
-- 表本身开了 RLS 且**不建任何策略** —— 只有 SECURITY DEFINER 的
-- private.is_staff() 能读它，前台和 API 都碰不到名单内容。

create table if not exists public.staff (
  user_id    uuid primary key,
  email      text,
  note       text,
  created_at timestamptz not null default now()
);

alter table public.staff enable row level security;

-- 放在 private schema：放 public 会被 PostgREST 暴露成公开 RPC
create or replace function private.is_staff()
returns boolean
language sql
security definer
stable
set search_path = public
as $$
  select exists (select 1 from public.staff s where s.user_id = auth.uid());
$$;

revoke all on function private.is_staff() from public;
grant execute on function private.is_staff() to authenticated;

-- 往名单里加人。只能从 Supabase 的 SQL Editor 调用（那里以 postgres 身份连接），
-- anon / authenticated 都没有执行权限 —— 否则任何人都能把自己加进筹备组。
create or replace function public.add_staff(p_email text, p_note text default null)
returns text
language plpgsql
security definer
set search_path = public
as $$
declare
  v_id uuid;
begin
  select id into v_id from auth.users where lower(email) = lower(btrim(p_email));

  if v_id is null then
    raise exception '找不到邮箱为 % 的账号。请先在 Authentication → Users 里建好账号。', p_email;
  end if;

  insert into public.staff (user_id, email, note)
  values (v_id, lower(btrim(p_email)), p_note)
  on conflict (user_id) do update
    set email = excluded.email, note = excluded.note;

  return format('已把 %s 加入筹备组名单', p_email);
end $$;

revoke all on function public.add_staff(text, text) from public, anon, authenticated;

-- 首次迁移时把已有账号全部纳入名单 —— 它们都是管理员手工建的。
-- 只在名单为空时做一次，避免以后把被移除的人又加回来。
do $$
begin
  if not exists (select 1 from public.staff) then
    insert into public.staff (user_id, email)
    select u.id, lower(u.email) from auth.users u
    on conflict (user_id) do nothing;
  end if;
exception when others then
  raise notice '初始化筹备组名单失败（%）。请手动执行 add_staff 添加成员。', sqlerrm;
end $$;


-- ========================== 7. 策略 ========================================

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
  using (private.is_staff());

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
  using (private.is_staff());

-- ---- 作品：只允许筹备组读。写入一律走 submit_project() 函数 ----
-- （不开放匿名 insert，保证每一件作品都关联到一条核对过的报名记录）
drop policy if exists "projects: public can submit" on public.projects;
drop policy if exists "projects: staff can read" on public.projects;
create policy "projects: staff can read"
  on public.projects for select
  to authenticated
  using (private.is_staff());


-- ========================== 8. 表级授权 ====================================
revoke all on public.participants from anon;
revoke all on public.volunteers   from anon;
revoke all on public.projects     from anon;

grant insert on public.participants to anon, authenticated;
grant insert on public.volunteers   to anon, authenticated;

grant select on public.participants to authenticated;
grant select on public.volunteers   to authenticated;
grant select on public.projects     to authenticated;


-- ========================== 9. 作品归属核对 + 提交 =========================

-- 用于存储策略的辅助函数：判断某个作品 id 是否真实存在。
-- 必须是 security definer —— 存储策略的表达式是以调用者（匿名）身份求值的，
-- 而匿名对 projects 表没有权限，不这么写策略根本跑不起来。
--
-- 放在 private schema 而不是 public：放在 public 会被 PostgREST 自动暴露成
-- /rest/v1/rpc/project_exists，任何人都能拿它试探某个 uuid 是不是真实作品。
-- 它只是存储策略的内部依赖，不该成为一个公开接口。

create schema if not exists private;
grant usage on schema private to anon, authenticated;

-- 旧策略引用着下面那个函数，先删策略，否则删不掉函数
do $$
begin
  drop policy if exists "project-files: upload" on storage.objects;
exception when others then null;
end $$;

-- 清掉早期放在 public 里的那个（会被暴露成公开 RPC）
drop function if exists public.project_exists(text);

create or replace function private.project_exists(p_id text)
returns boolean
language sql
security definer
stable
set search_path = public
as $$
  select exists (select 1 from public.projects where id::text = p_id);
$$;

revoke all on function private.project_exists(text) from public;
grant execute on function private.project_exists(text) to anon, authenticated;


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

-- 加了 category 之前的 13 参数版本也清掉
drop function if exists public.submit_project(
  text, text, text, text, text, text, text, text, text, text, text, text, text
);

create or replace function public.submit_project(
  p_name            text,
  p_contact         text,
  p_title           text,
  p_summary         text,
  p_wall_visibility text,
  p_category        text,
  p_problem         text default null,
  p_group_name      text default null,
  p_members         text default null,
  p_direction       text default null,
  p_link            text default null,
  p_instructions    text default null,
  p_equipment_needs text default null,
  p_demo_format     text default null,
  p_video_url       text default null
)
returns uuid
language plpgsql
security definer
set search_path = public
as $$
declare
  v_participant      uuid;
  v_participant_name text;
  v_project          uuid;
  v_credit           text;
  v_members          text;
  v_group            text;
  v_name             text := lower(btrim(coalesce(p_name, '')));
  v_contact          text := lower(regexp_replace(btrim(coalesce(p_contact, '')), '\s', '', 'g'));
begin
  if v_name = '' or v_contact = '' then
    raise exception 'NAME_OR_CONTACT_REQUIRED';
  end if;

  if btrim(coalesce(p_title, '')) = '' or btrim(coalesce(p_summary, '')) = '' then
    raise exception 'TITLE_OR_SUMMARY_REQUIRED';
  end if;

  -- 可见性必须明确选一次，不能靠默认值蒙混过去
  if p_wall_visibility is null
     or p_wall_visibility not in ('named','group_only','anonymous','hidden') then
    raise exception 'VISIBILITY_REQUIRED';
  end if;

  -- 作品类型必须明确给，且是合法枚举
  if p_category is null
     or p_category not in ('website','tool','game','interactive','other') then
    raise exception 'CATEGORY_REQUIRED';
  end if;

  -- 核对归属：姓名 + 报名时填的联系方式，两者都要对上
  select p.id, p.name into v_participant, v_participant_name
  from public.participants p
  where lower(btrim(p.name)) = v_name
    and lower(regexp_replace(btrim(p.contact), '\s', '', 'g')) = v_contact
  order by p.created_at desc
  limit 1;

  if v_participant is null then
    raise exception 'NOT_REGISTERED';
  end if;

  -- 把公开展示用的两个字段在这里算好。
  -- 个人报名没有团体名时回退到本人姓名；匿名/不上墙的一律留空。
  v_credit := case
    when p_wall_visibility = 'named'
      then coalesce(nullif(btrim(p_group_name), ''), v_participant_name)
    when p_wall_visibility = 'group_only'
      then nullif(btrim(p_group_name), '')
    else null
  end;

  v_members := case
    when p_wall_visibility = 'named' then nullif(btrim(p_members), '')
    else null
  end;

  -- 社团/团队名只在作者选了公开署名时才对观众可见，用于作品墙的社团筛选
  v_group := case
    when p_wall_visibility in ('named','group_only') then nullif(btrim(p_group_name), '')
    else null
  end;

  -- 同一个人、同一个项目名 = 修改已有提交
  select pr.id into v_project
  from public.projects pr
  where pr.participant_id = v_participant
    and lower(btrim(pr.title)) = lower(btrim(p_title))
  limit 1;

  if v_project is null then
    insert into public.projects (
      title, summary, problem, group_name, members, direction,
      link, instructions, equipment_needs, demo_format, category, video_url,
      contact, wall_visibility, credit_display, members_display, group_display, participant_id
    ) values (
      btrim(p_title), btrim(p_summary), p_problem, p_group_name, p_members, p_direction,
      p_link, p_instructions, p_equipment_needs, p_demo_format, p_category, p_video_url,
      btrim(p_contact), p_wall_visibility, v_credit, v_members, v_group, v_participant
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
      category        = p_category,
      video_url       = p_video_url,
      contact         = btrim(p_contact),
      wall_visibility = p_wall_visibility,
      credit_display  = v_credit,
      members_display = v_members,
      group_display   = v_group,
      updated_at      = now()
    where id = v_project;
  end if;

  return v_project;
end;
$$;

grant execute on function public.submit_project(
  text, text, text, text, text, text, text, text, text, text, text, text, text, text, text
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
  v_images  jsonb;
  v_videos  jsonb;
begin
  -- 图片和视频分别筛好，供公开作品墙和详情页读取
  select coalesce(jsonb_agg(f), '[]'::jsonb) into v_images
  from jsonb_array_elements(coalesce(p_files, '[]'::jsonb)) f
  where f->>'type' like 'image/%';

  select coalesce(jsonb_agg(f), '[]'::jsonb) into v_videos
  from jsonb_array_elements(coalesce(p_files, '[]'::jsonb)) f
  where f->>'type' like 'video/%';

  update public.projects pr
  set files         = coalesce(p_files, '[]'::jsonb),
      public_images = v_images,
      public_videos = v_videos,
      updated_at    = now()
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


-- ========================== 10. 作品文件存储 ===============================
-- 公开读（任何人都能通过链接看到作品图片），但只有筹备组能列出文件清单。
-- 单文件上限 50MB。

insert into storage.buckets (id, name, public, file_size_limit)
values ('project-files', 'project-files', true, 52428800)
on conflict (id) do update
  set public          = excluded.public,
      file_size_limit = excluded.file_size_limit;

-- 匿名可以上传，但只能传进「已存在的作品文件夹」里
create policy "project-files: upload"
  on storage.objects for insert
  to anon, authenticated
  with check (
    bucket_id = 'project-files'
    and array_length(storage.foldername(name), 1) >= 1
    and private.project_exists((storage.foldername(name))[1])
  );

-- 这里**故意不建** select 策略。
--
-- 桶是公开的，文件通过 /object/public/ 路径访问，本来就不需要 select 策略。
-- 而任何一条针对 storage.objects 的宽泛 select 策略，都会让调用者能
-- 「列出桶里所有文件」—— 超出实际需要。Supabase 的安全检查器也会就这一点告警。
-- 筹备组要看文件，用 Supabase 后台的 Storage 浏览器即可（走 service_role）。
drop policy if exists "project-files: staff can list" on storage.objects;


-- ========================== 11. 公开作品墙的读取权限 =======================
-- projects 表对匿名是关死的（里面有联系方式）。作品墙要公开，但不能顺手把
-- 联系方式也放出去。
--
-- 做法是**列级授权**：匿名角色只被授予下面这几个列的 select，
-- 其余列（contact、participant_id、files 等）连读都不允许。
-- 行范围由一条 RLS 策略限制，只放行作者选了公开的作品。
--
-- 为什么不用 SECURITY DEFINER 视图：那种视图会绕开查询者的 RLS，
-- Supabase 的安全检查器会持续报「Security Definer View」；
-- 而且将来有人改动视图定义时，容易在无意间扩大暴露面。
-- 列级授权把"什么算公开"直接写在授权语句里，改动时一眼就能看见。
--
-- 署名和成员名单在写入时就已算好（credit_display / members_display），
-- 所以这里不需要 join 到 participants —— 匿名角色也从来没有那张表的权限。

revoke all on public.projects from anon;

grant select (
  id,
  title,
  summary,
  problem,
  direction,
  link,
  created_at,
  category,          -- 作品类型（筛选用）
  group_display,     -- 社团/团队名（仅公开可见时非空，筛选用）
  credit_display,    -- 署名行，null 表示不署名
  members_display,   -- 成员名单，null 表示不显示
  public_images,     -- 只含图片类文件
  public_videos,     -- 只含视频类文件
  video_url,         -- 演示视频外链
  instructions,      -- 操作说明（下载运行需要）
  equipment_needs    -- 设备需求（下载运行需要）
) on public.projects to anon;

-- 行范围：作者选「不上墙」的、以及早期没表态的，匿名一律读不到
drop policy if exists "projects: public can read published" on public.projects;
create policy "projects: public can read published"
  on public.projects for select
  to anon
  using (wall_visibility in ('named', 'group_only', 'anonymous'));

-- 旧的 SECURITY DEFINER 视图已废弃。第 3 节已经删过一次，这里再兜一次，
-- 保证从任何历史版本升级上来都不会残留。
drop view if exists public.public_projects;


-- ---- 收紧 Supabase 自建函数的执行权限 ----
-- 项目创建时若勾了「Enable automatic RLS」，Supabase 会建一个 rls_auto_enable()
-- 挂在 DDL 事件触发器上。它不需要被 API 调用 —— 触发器是以执行 DDL 的角色
-- （postgres）运行的，撤回授权不影响触发器本身。
do $$
begin
  revoke execute on function public.rls_auto_enable() from anon, authenticated, public;
exception when others then null;  -- 没勾那个选项时该函数不存在，忽略
end $$;


-- ========================== 12. 实时同步 ===================================
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


-- ========================== 13. 自检 =======================================
-- 执行完运行这一段，结果应该是：
--   tables     3 行、每行 rls_enabled = true
--   functions  3 个
--   bucket     1 行、public = true、file_size_limit = 52428800
--   grants     匿名对 projects 只有 16 个列的 select 权限
--   views      public_projects 应该查不到（已废弃）

select relname as table_name, relrowsecurity as rls_enabled
from pg_class
where relnamespace = 'public'::regnamespace
  and relname in ('participants','volunteers','projects')
order by relname;

-- public 里应只有 2 个：submit_project、attach_project_files
-- （project_exists 在 private schema，不暴露给 API）
select proname as public_function
from pg_proc
where pronamespace = 'public'::regnamespace
  and proname in ('submit_project','attach_project_files','project_exists')
order by proname;

select id, public, file_size_limit
from storage.buckets
where id = 'project-files';

-- 匿名到底能读 projects 的哪些列（应该只有 16 个，且不含 contact / files）
select column_name
from information_schema.column_privileges
where table_schema = 'public'
  and table_name = 'projects'
  and grantee = 'anon'
  and privilege_type = 'SELECT'
order by column_name;

-- 已废弃的视图应该不存在（返回 0 行）
select viewname
from pg_views
where schemaname = 'public'
  and viewname = 'public_projects';
