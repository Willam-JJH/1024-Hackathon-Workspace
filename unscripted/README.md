# Unscripted 活动网站

1024 Challenge 中的 AI 辅助创作活动 **Unscripted** 的官网与报名／作品提交平台。

仓库里另有 `website/`、`registration/`、`legacy/` 三个来自 TeenAIgers 的旧项目，与本项目无关，不要混用。

## 三个板块

| 路径 | 内容 |
| --- | --- |
| `/` | 主页：活动主张、参加对象、AI 与创作成果、两天流程、pitch 四要素 |
| `/register` | 报名：参加者表单、志愿者表单 |
| `/submit` | 参赛：作品提交，含文件上传 |
| `/staff` | 筹备组看板，**不在导航里**，需登录 |

## 本地运行

```sh
npm install
cp .env.example .env.local   # 填 Supabase 的 URL 和 anon key
npm run dev                  # http://127.0.0.1:5180
```

其它命令：`npm run build`（生产构建）、`npm run typecheck`。

> 这个项目用 **npm**。机器上如果没有 bun/pnpm 也能跑，不要照搬旧目录的脚本。

## 数据库

后端是 Supabase。第一次部署需要两步：

1. 在 Supabase 的 **SQL Editor** 里整段执行
   [`supabase/migrations/0001_init.sql`](supabase/migrations/0001_init.sql)。
   这个脚本是幂等的，重复执行安全，会建好表、权限策略、作品归属核对函数和文件存储桶。
2. 在 **Authentication → Users** 里给每位筹备组成员建一个邮箱 + 密码账号，
   建的时候**必须勾 Auto Confirm User**，否则登录会失败。

### 权限模型

| 角色 | 能做什么 |
| --- | --- |
| 匿名访客 | 提交报名、提交作品（作品须核对上报名记录）；**读不到任何报名数据** |
| 筹备组成员（已登录） | 读全部报名与作品、看作品文件 |

学生个人信息不公开可读。匿名角色对 `participants`、`volunteers`、`projects` 三张表
都没有 `select` 权限，这是建表脚本里显式 `revoke` 过的。

### 作品归属怎么确认

匿名读不到 `participants` 表，所以「这份作品是谁交的」不能在前端核对 —— 前端能做
就等于把报名数据敞开。核对放在数据库里，由 `security definer` 的
`submit_project()` 函数完成：参赛者填**姓名 + 报名时的联系方式**，函数内部匹配，
匹配不上就抛 `NOT_REGISTERED`。

匿名角色对 `projects` 表没有 `insert` 权限，所有写入必须走这个函数，绕不过去。
同一人对同一项目名重复提交会覆盖上一条，不会产生重复记录。

### 公开作品墙的权限

作品墙上要展示作品，但 `projects` 表里有提交者联系方式。PostgreSQL 的 RLS
只能管到「行」、管不到「列」，所以这里用的是**列级授权**：

- 匿名角色只被授予 10 个列的 `select`（`id, title, summary, problem, direction,
  link, created_at, credit_display, members_display, public_images`），
  其余列（`contact`、`instructions`、`participant_id`）连读都不允许
- 行范围由 RLS 策略限制：只放行作者选了公开的作品
- **署名和成员名单是写入时就算好的**（`credit_display` / `members_display`），
  所以读取端不需要 join `participants` —— 匿名角色也从来没有那张表的权限

> 前端查这表**必须显式列出列名**，用 `select=*` 会被数据库拒绝。
> 列清单在 `src/lib/types.ts` 的 `PUBLIC_PROJECT_COLUMNS`。

早先版本用的是 `SECURITY DEFINER` 视图，会让 Supabase 安全检查器持续报
「Security Definer View」，已废弃改为上面的方案。

### 作品在作品墙上的可见性

作者提交时**必须**四选一，没有默认值：

| 值 | 作品墙上的表现 |
| --- | --- |
| `named` | 署名行（团体名，个人则用本人姓名）+ 成员名单 |
| `group_only` | 只显示社团／团队名，不列成员 |
| `anonymous` | 都不显示 |
| `hidden` | 完全不上墙 |

团体名是组织标识、个人姓名是个人信息，分量不同，所以分成两档。
数据库侧对 `null` 直接报错，绕过前端也提交不了。

### 作品文件

存在 Supabase Storage 的 `project-files` 桶里，公开读，单文件上限 50MB。
路径是 `<作品id>/<时间戳>-<文件名>`，归属天然可追溯。图片在浏览器端先压成 webp
再上传 —— 免费档只有 1GB 存储且不含服务端图片处理，手机原图会很快吃光额度。

超过 50MB 的文件会被拦下并提示改用外链。视频不要走这里。

## 活动信息改哪里

**日期、场地、报名截止、联系方式全部未确认**，筹备文档规定未获学校批准的信息不能
作为已确认内容发布。所以这些值集中在
[`src/config/event.ts`](src/config/event.ts)，页面上统一渲染成「待确认」占位符。

学校确认后，只改这一个文件，全站（含页脚）同步更新，不用去文案里翻。

## 目录结构

```
src/
  config/event.ts        活动信息唯一来源
  lib/                   Supabase 客户端、API、类型、工具
    csv.ts               CSV 导出（纯函数，可单独测）
  components/
    form/                表单基元与三个表单
    staff/               看板表格与登录
  pages/                 五个页面
supabase/migrations/     建表与权限脚本
scripts/                 诊断脚本，见下
```

## 诊断脚本

不需要跑测试框架，直接 `node scripts/<文件>`：

```sh
# CSV 导出的编码与转义（纯函数，不连数据库）
node scripts/check-csv.mjs

# Realtime 是否真的会把新报名推给筹备组
SUPABASE_URL=... SUPABASE_KEY=... STAFF_EMAIL=... STAFF_PASSWORD=... \
  node scripts/verify-realtime.mjs
```

⚠️ `verify-realtime.mjs` 每次运行会**往报名表里插一行**测试数据（姓名带
`【实时验证-可删】` 前缀）。跑完记得删掉。

## 改数据库之前：先在本地跑一遍

`supabase/migrations/` 里的脚本改动**不要直接往线上试** —— 已经因为这样
返工过两次。本地有个一次性的 PostgreSQL 容器可以先把脚本跑通：

```sh
bash scripts/sql-test/run.sh                    # 干净库上跑一遍
bash scripts/sql-test/run.sh --from-git HEAD~1  # 从旧版本升级，测迁移路径
bash scripts/sql-test/run.sh --clean            # 删掉容器
```

它做的事：起一个 `postgres:17` 容器 → 建好 Supabase 才有的东西（`anon` /
`authenticated` 角色、`storage` schema、`supabase_realtime` 发布通道）→
应用迁移脚本 → 跑 `checks.sql` 里的断言。

断言里**权限部分是真的 `set role anon` 查一遍**，不是读脚本判断"应该没问题"。

> 容器里的 stub 不是完整复刻 Supabase。如果迁移脚本用到了没 stub 的东西，
> 测试会报错 —— 那正是我们想提前知道的。

## 部署

Netlify 配置在 [`netlify.toml`](netlify.toml)：`npm run build` → `dist`，
并已配好单页应用的路由重写（否则直接访问 `/register` 会 404）。
环境变量在 Netlify 后台配 `VITE_SUPABASE_URL` 和 `VITE_SUPABASE_ANON_KEY`。

⚠️ 只填 **anon key**。`service_role` key 能绕过所有权限，绝不能用 `VITE_` 前缀暴露 ——
带这个前缀的变量会被打包进浏览器可见的 JS。
