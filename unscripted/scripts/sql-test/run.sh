#!/usr/bin/env bash
#
# 在本地一次性 PostgreSQL 容器里跑建表脚本，验证语法、权限边界和迁移路径。
# 每次从零建库，跑完即弃。
#
# 用法：
#   bash scripts/sql-test/run.sh              # 用当前迁移脚本跑一遍
#   bash scripts/sql-test/run.sh --from-git <ref>   # 先应用 <ref> 版本的旧脚本，
#                                                   # 再应用当前脚本，测迁移路径
#   bash scripts/sql-test/run.sh --clean      # 删掉容器
#
set -euo pipefail

CONTAINER=unscripted-sqltest
IMAGE=postgres:17-alpine
DB=unscripted_test

HERE="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
REPO="$(cd "$HERE/../.." && pwd)"
MIGRATION="$REPO/supabase/migrations/0001_init.sql"

if [[ "${1:-}" == "--clean" ]]; then
  docker rm -f "$CONTAINER" >/dev/null 2>&1 || true
  echo "容器已删除"
  exit 0
fi

FROM_GIT=""
if [[ "${1:-}" == "--from-git" ]]; then
  FROM_GIT="${2:?需要给一个 git ref，例如 HEAD~1}"
fi

# ---------- 容器 ----------
if ! docker ps --format '{{.Names}}' | grep -qx "$CONTAINER"; then
  echo "→ 启动容器（首次会拉镜像，可能要等一会儿）"
  docker rm -f "$CONTAINER" >/dev/null 2>&1 || true
  docker run -d --name "$CONTAINER" -e POSTGRES_PASSWORD=test "$IMAGE" >/dev/null
  printf "→ 等待数据库就绪"
  until docker exec "$CONTAINER" pg_isready -U postgres >/dev/null 2>&1; do
    printf "."
    sleep 1
  done
  echo " ok"
  docker exec -i "$CONTAINER" psql -U postgres -v ON_ERROR_STOP=1 -q < "$HERE/cluster-roles.sql"
fi

psql_db() { docker exec -i "$CONTAINER" psql -U postgres -d "$DB" -v ON_ERROR_STOP=1 "$@"; }

# ---------- 从零建库 ----------
echo "→ 重建测试库 $DB"
docker exec -i "$CONTAINER" psql -U postgres -q -c "drop database if exists $DB" >/dev/null 2>&1 || true
docker exec -i "$CONTAINER" psql -U postgres -q -c "create database $DB" >/dev/null

psql_db -q < "$HERE/db-stubs.sql"

# ---------- 可选：先灌入旧版本，测迁移路径 ----------
if [[ -n "$FROM_GIT" ]]; then
  echo "→ 先应用 $FROM_GIT 版本的旧脚本（模拟线上已有数据）"
  git -C "$REPO" show "$FROM_GIT:unscripted/supabase/migrations/0001_init.sql" \
    | psql_db -q -f -
  # 塞旧格式的数据，模拟线上已有内容 —— 迁移要能正确转换它们
  echo "→ 往旧结构里塞数据"
  psql_db -q -c "
    insert into public.participants (name, contact, direction)
    values ('迁移测试','migrate-001','旧的报名');
  "
  psql_db -q -c "
    do \$\$
    begin
      if exists (
        select 1 from information_schema.columns
        where table_schema='public' and table_name='projects' and column_name='show_credit'
      ) then
        insert into public.projects (title, summary, contact, show_credit, participant_id)
        select '旧-署名','s','迁移测试', true,  id from public.participants where contact='migrate-001'
        union all
        select '旧-不署名','s','迁移测试', false, id from public.participants where contact='migrate-001'
        union all
        select '旧-未表态','s','迁移测试', null,  id from public.participants where contact='migrate-001';
      end if;
    end \$\$;
  "
fi

# ---------- 当前迁移脚本 ----------
echo "→ 应用当前迁移脚本"
psql_db -q < "$MIGRATION"
echo "   ✓ 脚本执行完毕，无报错"

# ---------- 断言 ----------
# 注意：psql 跑在容器里，读不到宿主机路径，所以用管道把文件内容送进去
echo "→ 跑检查"
psql_db -f - < "$HERE/checks.sql"
