-- 断言。任何一条不满足就抛异常，psql 以非 0 退出。
--
-- 权限相关的断言尽量"真跑一次"：set role 成 anon 实际查一遍，
-- 而不是读脚本判断"应该没问题"。

\set ON_ERROR_STOP on

create or replace function public._assert(ok boolean, label text)
returns void language plpgsql as $$
begin
  if ok then
    raise notice '  ✓ %', label;
  else
    raise exception '  ✗ %', label;
  end if;
end $$;

-- ============================ 结构 ============================
do $$
begin
  perform public._assert(
    (select relrowsecurity from pg_class
      where relnamespace = 'public'::regnamespace and relname = 'participants'),
    'participants 开了 RLS');
  perform public._assert(
    (select relrowsecurity from pg_class
      where relnamespace = 'public'::regnamespace and relname = 'volunteers'),
    'volunteers 开了 RLS');
  perform public._assert(
    (select relrowsecurity from pg_class
      where relnamespace = 'public'::regnamespace and relname = 'projects'),
    'projects 开了 RLS');
  perform public._assert(
    exists (select 1 from storage.buckets where id = 'project-files' and public),
    'project-files 桶已建且公开');
  perform public._assert(
    (select file_size_limit from storage.buckets where id = 'project-files') = 52428800,
    '桶的单文件上限是 50MB');
  perform public._assert(
    not exists (select 1 from pg_views
                where schemaname = 'public' and viewname = 'public_projects'),
    '已废弃的 SECURITY DEFINER 视图不存在');
end $$;

-- ============================ 写入路径 ============================
do $$
declare
  v_participant uuid;
  v_project     uuid;
begin
  insert into public.participants (name, contact, direction)
  values ('检查用例', 'check-001', '测试') returning id into v_participant;

  perform public._assert(v_participant is not null, '能插入报名记录');

  begin
    perform public.submit_project('查无此人', 'nope', '标题', '简介', 'named');
    perform public._assert(false, '不存在的身份应被拒绝');
  exception when others then
    perform public._assert(sqlerrm like '%NOT_REGISTERED%', '不存在的身份被 NOT_REGISTERED 拒绝');
  end;

  begin
    perform public.submit_project('检查用例', 'check-001', '标题', '简介', null);
    perform public._assert(false, '可见性为 null 应被拒绝');
  exception when others then
    perform public._assert(sqlerrm like '%VISIBILITY_REQUIRED%', '可见性为 null 被拒绝');
  end;

  begin
    perform public.submit_project('检查用例', 'check-001', '标题', '简介', '乱填');
    perform public._assert(false, '非法可见性应被拒绝');
  exception when others then
    perform public._assert(sqlerrm like '%VISIBILITY_REQUIRED%', '非法可见性被拒绝');
  end;

  v_project := public.submit_project(
    '检查用例', 'check-001', '测试作品', '一句话简介', 'named',
    p_group_name => '测试社团', p_members => '甲、乙'
  );
  perform public._assert(v_project is not null, '正常提交作品成功');

  perform public.submit_project(
    '检查用例', 'check-001', '测试作品', '改过的简介', 'anonymous',
    p_group_name => '测试社团', p_members => '甲、乙'
  );
  perform public._assert(
    (select count(*) from public.projects where title = '测试作品') = 1,
    '同人同项目名重复提交是覆盖而不是新增');
end $$;

-- ============================ 写入时的公开字段 ============================
do $$
declare
  v_name  text := '可见性检查';
  v_cont  text := 'check-002';
begin
  insert into public.participants (name, contact, direction)
  values (v_name, v_cont, '测试');

  perform public.submit_project(v_name, v_cont, '命名作品', 's', 'named',
    p_group_name => '某社团', p_members => '张三、李四');
  perform public.submit_project(v_name, v_cont, '团体作品', 's', 'group_only',
    p_group_name => '某社团', p_members => '张三、李四');
  perform public.submit_project(v_name, v_cont, '匿名作品', 's', 'anonymous',
    p_group_name => '某社团', p_members => '张三、李四');
  perform public.submit_project(v_name, v_cont, '隐藏作品', 's', 'hidden',
    p_group_name => '某社团', p_members => '张三、李四');

  perform public._assert(
    (select credit_display from public.projects where title = '命名作品') = '某社团'
    and (select members_display from public.projects where title = '命名作品') = '张三、李四',
    'named：署名和成员名单都写入');

  perform public._assert(
    (select credit_display from public.projects where title = '团体作品') = '某社团'
    and (select members_display from public.projects where title = '团体作品') is null,
    'group_only：只写署名，不写成员名单');

  perform public._assert(
    (select credit_display from public.projects where title = '匿名作品') is null
    and (select members_display from public.projects where title = '匿名作品') is null,
    'anonymous：署名和成员名单都为空');

  perform public._assert(
    (select credit_display from public.projects where title = '隐藏作品') is null,
    'hidden：署名也为空');

  -- 个人报名（没有团体名）选了署名时，回退到本人姓名
  perform public.submit_project(v_name, v_cont, '个人署名作品', 's', 'named',
    p_group_name => null, p_members => null);
  perform public._assert(
    (select credit_display from public.projects where title = '个人署名作品') = v_name,
    'named + 无团体名：回退到报名时的个人姓名');
end $$;

-- ============================ 作品文件与公开图片 ============================
-- 这一段是补的：改成列级授权之后一直没测过"带文件"的路径，
-- 之前所有用例都是不带文件的提交，等于 public_images 那段逻辑完全没被覆盖。
do $$
declare
  v_pid   uuid;
  v_files jsonb := '[
    {"path":"p/a.webp","name":"a.webp","size":1000,"type":"image/webp"},
    {"path":"p/b.png", "name":"b.png", "size":2000,"type":"image/png"},
    {"path":"p/c.zip", "name":"c.zip", "size":3000,"type":"application/zip"},
    {"path":"p/d.mp3", "name":"d.mp3", "size":4000,"type":"audio/mpeg"}
  ]'::jsonb;
begin
  v_pid := public.submit_project('检查用例', 'check-001', '带图作品', 's', 'named');

  -- 新提交的作品，public_images 一开始是空的
  perform public._assert(
    jsonb_array_length((select public_images from public.projects where id = v_pid)) = 0,
    '新作品在传文件之前 public_images 为空');

  perform public.attach_project_files(v_pid, '检查用例', 'check-001', v_files);

  perform public._assert(
    (select files from public.projects where id = v_pid) = v_files,
    'attach_project_files 把完整文件清单写进 files（筹备组看得到全部）');

  perform public._assert(
    jsonb_array_length((select public_images from public.projects where id = v_pid)) = 2,
    'public_images 只留下图片（webp + png），过滤掉 zip 和 mp3');

  perform public._assert(
    not exists (
      select 1
      from jsonb_array_elements((select public_images from public.projects where id = v_pid)) f
      where f->>'type' not like 'image/%'
    ),
    'public_images 里没有任何非图片类型');
end $$;

-- ============================ 匿名能看到什么 ============================
-- 列权限用 has_column_privilege 判断（声明式，不用切角色）
do $$
declare
  granted text[];
begin
  select array_agg(column_name order by column_name) into granted
  from information_schema.column_privileges
  where table_schema = 'public' and table_name = 'projects'
    and grantee = 'anon' and privilege_type = 'SELECT';

  perform public._assert(
    not has_column_privilege('anon', 'public.projects', 'contact', 'select'),
    '匿名读不到 contact（联系方式）');
  perform public._assert(
    not has_column_privilege('anon', 'public.projects', 'instructions', 'select'),
    '匿名读不到 instructions（操作说明）');
  perform public._assert(
    not has_column_privilege('anon', 'public.projects', 'participant_id', 'select'),
    '匿名读不到 participant_id');
  perform public._assert(
    not has_column_privilege('anon', 'public.projects', 'wall_visibility', 'select'),
    '匿名读不到 wall_visibility');
  perform public._assert(
    has_column_privilege('anon', 'public.projects', 'credit_display', 'select'),
    '匿名能读 credit_display');
  perform public._assert(
    granted = array['created_at','credit_display','direction','id','link','members_display',
                    'problem','public_images','summary','title'],
    '匿名被授权的正好是这 10 个列');

  perform public._assert(
    not has_table_privilege('anon', 'public.participants', 'select'),
    '匿名读不到 participants 整张表');
  perform public._assert(
    not has_table_privilege('anon', 'public.volunteers', 'select'),
    '匿名读不到 volunteers 整张表');

  -- 被 PostgREST 暴露的 public schema 里不该有可被匿名调用的辅助函数
  perform public._assert(
    not exists (
      select 1 from pg_proc
      where pronamespace = 'public'::regnamespace
        and proname = 'project_exists'
    ),
    'project_exists 不在 public schema（不会暴露成公开 RPC）');
  perform public._assert(
    exists (
      select 1 from pg_proc
      where pronamespace = 'private'::regnamespace
        and proname = 'project_exists'
    ),
    'project_exists 已挪到 private schema');
end $$;

-- 存储桶不该有任何 select 策略（否则调用者能列出全部文件）
do $$
begin
  perform public._assert(
    not exists (
      select 1 from pg_policies
      where schemaname = 'storage' and tablename = 'objects'
        and cmd = 'SELECT'
    ),
    'storage.objects 上没有 select 策略（不能列出文件）');
  perform public._assert(
    exists (
      select 1 from pg_policies
      where schemaname = 'storage' and tablename = 'objects'
        and cmd = 'INSERT'
    ),
    'storage.objects 上的上传策略仍在');
end $$;

-- 行级：真的以 anon 身份查一次，把结果落进临时表再断言
set role anon;
create temp table anon_sees as
  select title, credit_display, members_display, public_images
  from public.projects;
reset role;

do $$
begin
  perform public._assert(
    (select count(*) from anon_sees where title = '隐藏作品') = 0,
    '匿名查不到 hidden 的作品');
  perform public._assert(
    (select count(*) from anon_sees where title = '命名作品') = 1,
    '匿名查得到 named 的作品');
  perform public._assert(
    (select credit_display from anon_sees where title = '命名作品') = '某社团',
    '匿名看到的 named 署名是团体名');
  perform public._assert(
    (select credit_display from anon_sees where title = '团体作品') = '某社团'
    and (select members_display from anon_sees where title = '团体作品') is null,
    '匿名看到的 group_only 只有团体名、没有成员名单');
  perform public._assert(
    (select credit_display from anon_sees where title = '匿名作品') is null,
    '匿名看到的 anonymous 没有署名');
  -- 逐个说清楚"应该看到什么"，避免把"该显示的"误判成"泄漏"：
  --   命名作品   → 团体名 + 成员名单（作者选了完整署名）
  --   个人署名作品 → 作者本人的姓名（个人参加且选了署名，本来就该显示）
  --   团体作品   → 只有团体名，没有成员名单
  --   匿名作品   → 什么都没有
  --   隐藏作品   → 压根看不到
  perform public._assert(
    (select count(*) from anon_sees where title = '隐藏作品') = 0,
    '隐藏作品对匿名完全不可见');

  perform public._assert(
    (select credit_display from anon_sees where title = '匿名作品') is null
    and (select members_display from anon_sees where title = '匿名作品') is null,
    '匿名作品既无署名也无成员名单');

  perform public._assert(
    (select credit_display from anon_sees where title = '团体作品') = '某社团'
    and (select members_display from anon_sees where title = '团体作品') is null,
    '团体作品只显示团体名，成员名单为空');

  perform public._assert(
    (select members_display from anon_sees where title = '个人署名作品') is null,
    '个人署名作品不带成员名单');
end $$;

-- 把匿名视角的结果原样打出来，供人工核对
\echo ''
\echo '  —— 匿名访客实际能看到的内容 ——'
select title, credit_display as 署名, members_display as 成员名单
from anon_sees order by title;
\echo ''

-- ============================ 筹备组名单 ============================
-- 造两个账号：一个加进名单，一个不加。然后以各自身份真的查一次。
do $$
begin
  insert into auth.users (id, email)
  values ('11111111-1111-1111-1111-111111111111', 'staff-on-list@test')
  on conflict (id) do nothing;
  insert into auth.users (id, email)
  values ('22222222-2222-2222-2222-222222222222', 'stranger@test')
  on conflict (id) do nothing;
end $$;

select public.add_staff('staff-on-list@test', '检查用例');

set role authenticated;
set request.jwt.claim.sub = '11111111-1111-1111-1111-111111111111';
create temp table on_list_sees as
  select (select count(*) from public.participants) as participants,
         (select count(*) from public.volunteers)     as volunteers,
         (select count(*) from public.projects)       as projects;
reset role;

set role authenticated;
set request.jwt.claim.sub = '22222222-2222-2222-2222-222222222222';
create temp table off_list_sees as
  select (select count(*) from public.participants) as participants,
         (select count(*) from public.volunteers)     as volunteers,
         (select count(*) from public.projects)       as projects;
reset role;

set request.jwt.claim.sub = '';

do $$
begin
  perform public._assert(
    (select participants from on_list_sees) > 0
    and (select projects from on_list_sees) > 0,
    '名单内的账号能读到报名与作品数据');

  perform public._assert(
    (select participants from off_list_sees) = 0
    and (select volunteers from off_list_sees) = 0
    and (select projects from off_list_sees) = 0,
    '名单外的登录账号读不到任何数据（这道防线不依赖注册开关）');

  perform public._assert(
    not has_table_privilege('authenticated', 'public.staff', 'select'),
    '登录用户读不到筹备组名单本身');
end $$;

-- ============================ 迁移路径 ============================
do $$
begin
  if not exists (select 1 from public.projects where title = '旧-署名') then
    raise notice '  – 跳过迁移检查（本次没有灌旧数据）';
    return;
  end if;

  perform public._assert(
    (select wall_visibility from public.projects where title = '旧-署名') = 'named',
    '迁移：旧 true → named');
  perform public._assert(
    (select wall_visibility from public.projects where title = '旧-不署名') = 'anonymous',
    '迁移：旧 false → anonymous');
  perform public._assert(
    (select wall_visibility from public.projects where title = '旧-未表态') = 'hidden',
    '迁移：旧 null → hidden（当时没问过"要不要公开"）');
  perform public._assert(
    (select credit_display from public.projects where title = '旧-署名') = '迁移测试',
    '迁移：旧数据的署名行被回填（无团体名时用个人姓名）');
  perform public._assert(
    (select credit_display from public.projects where title = '旧-未表态') is null,
    '迁移：未表态的署名行为空');
  perform public._assert(
    not exists (
      select 1 from information_schema.columns
      where table_schema = 'public' and table_name = 'projects' and column_name = 'show_credit'
    ),
    '旧列 show_credit 已清除');

  -- 旧数据里已经传过图的，迁移要把图片回填进 public_images
  perform public._assert(
    jsonb_array_length((select public_images from public.projects where title = '旧-带图')) = 1,
    '迁移：回填 public_images 只留图片，滤掉 zip');
  perform public._assert(
    (select public_images -> 0 ->> 'name' from public.projects where title = '旧-带图') = 'a.webp',
    '迁移：回填的正是那张图片');
end $$;

select '全部通过' as result;
