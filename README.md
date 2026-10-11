# Hackathon Workspace

Hackathon 网站协作仓库，以 [sparkr / teensparkr](https://github.com/teensparkr) 的 TeenAIgers 源码作为起点。

## 仓库远程设置（重要）

这个本地仓库配了**双推** —— `git push` 会同时推到两个 GitHub 仓库：

| 用途 | 仓库 |
| --- | --- |
| **主仓库**（fetch 和 Netlify 部署都读这个） | [Willam-JJH/1024-Hackathon-Workspace](https://github.com/Willam-JJH/1024-Hackathon-Workspace) |
| **镜像**（自动同步，保持一致） | [Alvin0412/hackathon-workspace](https://github.com/Alvin0412/hackathon-workspace) |

所以 `git remote -v` 会看到 **两条 (push) 记录**，这是正常的：

```
origin  https://github.com/Willam-JJH/1024-Hackathon-Workspace.git (fetch)
origin  https://github.com/Willam-JJH/1024-Hackathon-Workspace.git (push)
origin  https://github.com/Alvin0412/hackathon-workspace.git        (push)
```

⚠️ **只保证「从这里推出去」时两边同步。** 如果有人直接往 Alvin 的仓库提交（比如在
GitHub 网页上改了文件），本地 fetch 的只有主仓库，看不到那些改动，两边就会分叉。
要长期保持同步的话，**统一往主仓库推**，把 Alvin 的仓库当只读镜像。

## 从哪里开始

| 目录 | 内容 | 原仓库 |
| --- | --- | --- |
| [unscripted/](unscripted/) | **本次活动的官网**：主页、报名、参赛三个板块 | 新建，不是导入 |
| [website/](website/) | 活动官网：首页、介绍、FAQ、时间线、学生／教师报名 | [teenaigers-web](https://github.com/teensparkr/teenaigers-web) |
| [registration/](registration/) | 独立的学校／教师报名页 | [teenaigers-form](https://github.com/teensparkr/teenaigers-form) |
| [legacy/teenAIgers/](legacy/teenAIgers/) | 较早的 Vue / uni-app H5、小程序项目，保留供参考 | [teenAIgers](https://github.com/teensparkr/teenAIgers) |

当前在开发的是 [unscripted/](unscripted/)（1024 Challenge 的 Unscripted 活动），
它有自己的 [README](unscripted/README.md)，用 npm 运行：`npm install && npm run dev`。

其余三个目录是从 sparkr/teensparkr 导入的历史项目，保留供参考。它们各自安装依赖和运行，仓库根目录没有统一构建命令。

本次导入保留源码文件内容，新增此说明、来源记录、根目录忽略规则和两份环境变量示例。来源提交见 [sources.json](sources.json)；原仓库的 Git 历史仍保留在上面的链接中。

## 本地运行官网

```sh
git clone https://github.com/Alvin0412/hackathon-workspace.git
cd hackathon-workspace/website
bun install --frozen-lockfile
cp .env.example .env.local
# 在本地填写 .env.local 中的 Supabase 配置后运行
bun run dev --host 127.0.0.1
```

生产构建：`bun run build`。依赖和 scripts 见 [website/package.json](website/package.json)。原项目同时保留 Bun、pnpm 锁文件；已有 Netlify 配置使用 Bun。

独立报名页使用同样的命令，目录改为 `registration/`。较早的 uni-app 项目可在 `legacy/teenAIgers/` 中使用 `pnpm install --frozen-lockfile`、`pnpm dev:h5`。

以上命令依据原项目配置整理；本次代码导入没有执行构建、部署或连接数据库。

## 修改入口

- [website/src/App.tsx](website/src/App.tsx)：页面路由。
- [website/src/pages/](website/src/pages/)：官网页面和两种报名表。
- [website/src/locales/](website/src/locales/)：中英文文案。
- [website/public/](website/public/)：Logo、图片等资源。
- [website/src/lib/api/registration.ts](website/src/lib/api/registration.ts)：报名提交。
- [website/supabase/migrations/](website/supabase/migrations/)：已有数据库 SQL 记录。

页面里目前保留 2025 年活动信息。新活动的日期、地点、规则和报名说明需要按当前安排更新。

## 报名与配置

官网和独立报名页都需要 `VITE_SUPABASE_URL`、`VITE_SUPABASE_ANON_KEY`。将具体值放在各项目的 `.env.local`，不要提交本地环境文件。这里应使用浏览器端的 Supabase anon key；服务端管理密钥不能填入 `VITE_` 变量。

两份报名实现使用不同的数据表：

- `website/`：`student_registrations`、`school_registrations`、`school_students`。
- `registration/`：`registrations`。

恢复报名功能时，需要核对目标数据库、表结构和访问策略；当前仓库不包含历史报名数据。

## 协作方式

从 `main` 新建功能分支，完成后提交 Pull Request。已有的另一份 website 可以先作为独立目录提交，或在分支里修改 `website/`，方便比较后再合并。

根仓库没有部署 workflow，也没有连接新部署服务。子目录里的 Netlify 配置来自原项目，只作为构建配置保留。
