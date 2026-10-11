import { useEffect, useState } from "react";
import type { Session } from "@supabase/supabase-js";
import { supabase, isSupabaseConfigured } from "../lib/supabase";
import { useLiveTable } from "../lib/useLiveTable";
import {
  fetchParticipants,
  fetchProjects,
  fetchVolunteers,
  publicFileUrl,
  toCsv,
  downloadCsv,
} from "../lib/api";
import {
  PARTICIPATION_LABEL,
  type Participant,
  type Project,
  type StoredFile,
  type Volunteer,
} from "../lib/types";
import StaffSignIn from "../components/staff/StaffSignIn";
import StaffTable, { Bool, Time, type Column } from "../components/staff/StaffTable";

type Tab = "participants" | "volunteers" | "projects";

/* ------------------------------------------------------------ 列定义 */

const participantColumns: Column<Participant>[] = [
  { key: "created_at", label: "提交时间", render: (r) => <Time value={r.created_at} /> },
  { key: "name", label: "姓名", primary: true },
  { key: "contact", label: "联系方式" },
  { key: "email", label: "邮箱", render: (r) => r.email || "—" },
  {
    key: "participation_type",
    label: "身份",
    render: (r) => PARTICIPATION_LABEL[r.participation_type],
    csv: (r) => PARTICIPATION_LABEL[r.participation_type],
  },
  { key: "group_name", label: "团队／社团", render: (r) => r.group_name || "—" },
  { key: "member_count", label: "人数", render: (r) => r.member_count ?? "—" },
  {
    key: "direction",
    label: "创作方向／已有内容",
    render: (r) => <span className="block max-w-[22rem] whitespace-pre-wrap">{r.direction}</span>,
  },
  {
    key: "has_existing",
    label: "已有项目",
    render: (r) => (
      <span>
        <Bool value={r.has_existing} yes="是" no="否" />
        {r.has_existing && r.existing_detail && (
          <span className="mt-1 block max-w-[18rem] whitespace-pre-wrap text-xs text-white/45">
            {r.existing_detail}
          </span>
        )}
      </span>
    ),
    csv: (r) =>
      r.has_existing ? `是：${r.existing_detail ?? ""}` : "否",
  },
  {
    key: "day1_available",
    label: "周六",
    render: (r) => <Bool value={r.day1_available} />,
    csv: (r) => (r.day1_available ? "可到" : "不可"),
  },
  {
    key: "day2_available",
    label: "周日",
    render: (r) => <Bool value={r.day2_available} />,
    csv: (r) => (r.day2_available ? "可到" : "不可"),
  },
  {
    key: "time_note",
    label: "时段说明",
    render: (r) => (
      <span className="block max-w-[14rem] whitespace-pre-wrap">{r.time_note || "—"}</span>
    ),
  },
  {
    key: "equipment_needs",
    label: "设备需求",
    render: (r) => (
      <span className="block max-w-[16rem] whitespace-pre-wrap">{r.equipment_needs || "—"}</span>
    ),
  },
  {
    key: "notes",
    label: "备注",
    render: (r) => (
      <span className="block max-w-[16rem] whitespace-pre-wrap">{r.notes || "—"}</span>
    ),
  },
];

const volunteerColumns: Column<Volunteer>[] = [
  { key: "created_at", label: "提交时间", render: (r) => <Time value={r.created_at} /> },
  { key: "name", label: "姓名", primary: true },
  { key: "contact", label: "联系方式" },
  { key: "email", label: "邮箱", render: (r) => r.email || "—" },
  {
    key: "roles",
    label: "岗位意愿",
    render: (r) => r.roles.join(" · ") || "—",
    csv: (r) => r.roles.join(" / "),
  },
  {
    key: "day1_available",
    label: "周六",
    render: (r) => <Bool value={r.day1_available} />,
    csv: (r) => (r.day1_available ? "可到" : "不可"),
  },
  {
    key: "day2_available",
    label: "周日",
    render: (r) => <Bool value={r.day2_available} />,
    csv: (r) => (r.day2_available ? "可到" : "不可"),
  },
  {
    key: "time_note",
    label: "时段说明",
    render: (r) => (
      <span className="block max-w-[14rem] whitespace-pre-wrap">{r.time_note || "—"}</span>
    ),
  },
  {
    key: "experience",
    label: "经验",
    render: (r) => (
      <span className="block max-w-[18rem] whitespace-pre-wrap">{r.experience || "—"}</span>
    ),
  },
  {
    key: "notes",
    label: "备注",
    render: (r) => (
      <span className="block max-w-[16rem] whitespace-pre-wrap">{r.notes || "—"}</span>
    ),
  },
];

const projectColumns: Column<Project>[] = [
  { key: "created_at", label: "提交时间", render: (r) => <Time value={r.created_at} /> },
  { key: "title", label: "项目名", primary: true },
  {
    key: "summary",
    label: "一句话简介",
    render: (r) => <span className="block max-w-[20rem] whitespace-pre-wrap">{r.summary}</span>,
  },
  {
    key: "problem",
    label: "关注的问题",
    render: (r) => (
      <span className="block max-w-[18rem] whitespace-pre-wrap">{r.problem || "—"}</span>
    ),
  },
  { key: "group_name", label: "团队／社团", render: (r) => r.group_name || "—" },
  { key: "members", label: "成员", render: (r) => r.members || "—" },
  {
    key: "link",
    label: "作品入口",
    render: (r) =>
      r.link ? (
        <a
          href={r.link}
          target="_blank"
          rel="noreferrer noopener"
          className="break-all text-acid underline decoration-acid/40 hover:decoration-acid"
        >
          {r.link}
        </a>
      ) : (
        "—"
      ),
  },
  {
    key: "instructions",
    label: "操作说明",
    render: (r) => (
      <span className="block max-w-[20rem] whitespace-pre-wrap">{r.instructions || "—"}</span>
    ),
  },
  {
    key: "equipment_needs",
    label: "设备需求",
    render: (r) => (
      <span className="block max-w-[16rem] whitespace-pre-wrap">{r.equipment_needs || "—"}</span>
    ),
  },
  { key: "demo_format", label: "演示形式", render: (r) => r.demo_format || "—" },
  { key: "contact", label: "联系方式", render: (r) => r.contact || "—" },
  {
    key: "show_credit",
    label: "同意署名",
    render: (r) => (
      <span className={r.show_credit ? "text-acid" : "text-white/35"}>
        {r.show_credit === true ? "同意" : r.show_credit === false ? "不同意" : "未表态"}
      </span>
    ),
    csv: (r) => (r.show_credit === true ? "同意" : r.show_credit === false ? "不同意" : "未表态"),
  },
  {
    key: "files",
    label: "文件",
    render: (r) => <FileLinks files={r.files} />,
    csv: (r) => (r.files ?? []).map((f) => f.name).join(" / "),
  },
];

/** 作品文件的公开链接 */
const FileLinks = ({ files }: { files: StoredFile[] | null }) => {
  const list = files ?? [];
  if (list.length === 0) return <span className="text-white/30">—</span>;

  return (
    <ul className="space-y-1">
      {list.map((file) => (
        <li key={file.path}>
          <a
            href={publicFileUrl(file.path)}
            target="_blank"
            rel="noreferrer noopener"
            className="break-all text-acid underline decoration-acid/40 hover:decoration-acid"
          >
            {file.name}
          </a>
        </li>
      ))}
    </ul>
  );
};

/** 把当前栏目的数据导成 CSV，表头用中文列名 */
function exportTable<T extends { id: string }>(
  name: string,
  columns: Column<T>[],
  rows: T[]
): void {
  const headers = columns.map((col) => col.label);

  const csvRows = rows.map((row) => {
    const record = row as unknown as Record<string, unknown>;
    const out: Record<string, unknown> = {};
    for (const col of columns) {
      const raw = record[col.key];
      out[col.label] = col.csv
        ? col.csv(row)
        : Array.isArray(raw)
          ? raw.join(" / ")
          : raw;
    }
    return out;
  });

  const date = new Date().toISOString().slice(0, 10);
  downloadCsv(`${name}-${date}.csv`, toCsv(csvRows, headers));
}

/* --------------------------------------------------------------- 页面 */

const StaffPage = () => {
  const [session, setSession] = useState<Session | null>(null);
  const [authReady, setAuthReady] = useState(false);
  const [tab, setTab] = useState<Tab>("participants");

  // 看板不进搜索引擎。robots.txt 挡不住被别处链接的情况，这里再加一道。
  useEffect(() => {
    const meta = document.createElement("meta");
    meta.name = "robots";
    meta.content = "noindex, nofollow";
    document.head.appendChild(meta);
    return () => {
      document.head.removeChild(meta);
    };
  }, []);

  useEffect(() => {
    if (!supabase) {
      setAuthReady(true);
      return;
    }

    void supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
      setAuthReady(true);
    });

    const { data } = supabase.auth.onAuthStateChange((_event, next) => {
      setSession(next);
    });

    return () => data.subscription.unsubscribe();
  }, []);

  const participants = useLiveTable<Participant>("participants", fetchParticipants);
  const volunteers = useLiveTable<Volunteer>("volunteers", fetchVolunteers);
  const projects = useLiveTable<Project>("projects", fetchProjects);

  if (!isSupabaseConfigured) {
    return (
      <div className="mx-auto max-w-screen-2xl px-5 py-[var(--s120)] sm:px-8 lg:px-12">
        <h1 className="text-3xl text-white">筹备组看板</h1>
        <p className="mt-4 text-sm text-white/50">
          数据库还没接上。先配置 <code className="text-acid">.env.local</code>，
          再执行 <code className="text-acid">supabase/migrations/0001_init.sql</code>。
        </p>
      </div>
    );
  }

  if (!authReady) {
    return <div className="px-5 py-[var(--s120)] text-sm text-white/40">加载中…</div>;
  }

  if (!session) return <StaffSignIn />;

  const tabs: { value: Tab; label: string; count: number; loading: boolean }[] = [
    { value: "participants", label: "参加者", count: participants.rows.length, loading: participants.loading },
    { value: "volunteers", label: "志愿者", count: volunteers.rows.length, loading: volunteers.loading },
    { value: "projects", label: "作品", count: projects.rows.length, loading: projects.loading },
  ];

  const active = tabs.find((t) => t.value === tab)!;

  const exportCurrent = () => {
    if (tab === "participants") {
      exportTable("unscripted-participants", participantColumns, participants.rows);
    } else if (tab === "volunteers") {
      exportTable("unscripted-volunteers", volunteerColumns, volunteers.rows);
    } else {
      exportTable("unscripted-projects", projectColumns, projects.rows);
    }
  };

  const lastSync = Math.max(
    participants.lastSyncAt ?? 0,
    volunteers.lastSyncAt ?? 0,
    projects.lastSyncAt ?? 0
  );

  return (
    <div className="mx-auto max-w-screen-2xl px-5 py-[var(--s48)] sm:px-8 lg:px-12">
      {/* 头部 */}
      <div className="flex flex-wrap items-start justify-between gap-6">
        <div>
          <div className="section-index">[ STAFF ]</div>
          <h1 className="mt-4 text-3xl text-white">筹备组看板</h1>
          <p className="mt-2 text-sm text-white/45">
            报名实时同步，有人提交这里会自动刷新。
            {lastSync > 0 && (
              <span className="ml-2 text-acid">
                最近更新{" "}
                {new Date(lastSync).toLocaleTimeString("zh-CN", {
                  hour: "2-digit",
                  minute: "2-digit",
                  second: "2-digit",
                })}
              </span>
            )}
          </p>
        </div>

        <div className="flex items-center gap-4">
          <span className="hidden text-xs text-white/35 sm:inline">{session.user.email}</span>
          <button type="button" onClick={exportCurrent} className="btn-ghost !px-4 !py-2.5 text-xs">
            导出 CSV
          </button>
          <button
            type="button"
            onClick={() => void supabase?.auth.signOut()}
            className="btn-ghost !px-4 !py-2.5 text-xs"
          >
            退出
          </button>
        </div>
      </div>

      {/* 分栏 */}
      <div className="mt-10 flex flex-wrap gap-3">
        {tabs.map((item) => {
          const isActive = item.value === tab;
          return (
            <button
              key={item.value}
              type="button"
              onClick={() => setTab(item.value)}
              className={`flex items-center gap-2 border px-5 py-3 text-sm transition-colors ${
                isActive
                  ? "border-acid bg-acid/15 text-acid"
                  : "border-white/20 text-white/60 hover:border-white/40 hover:text-white"
              }`}
            >
              {item.label}
              <span className={`text-xs ${isActive ? "text-acid/70" : "text-white/35"}`}>
                {item.loading ? "…" : item.count}
              </span>
            </button>
          );
        })}
      </div>

      {/* 内容 */}
      <div className="mt-6">
        {tab === "participants" && (
          <>
            {participants.error && <ErrorNote text={participants.error} />}
            <StaffTable
              columns={participantColumns}
              rows={participants.rows}
              emptyText="还没有人报名。"
            />
          </>
        )}

        {tab === "volunteers" && (
          <>
            {volunteers.error && <ErrorNote text={volunteers.error} />}
            <StaffTable
              columns={volunteerColumns}
              rows={volunteers.rows}
              emptyText="还没有志愿者报名。"
            />
          </>
        )}

        {tab === "projects" && (
          <>
            {projects.error && <ErrorNote text={projects.error} />}
            <StaffTable
              columns={projectColumns}
              rows={projects.rows}
              emptyText="还没有作品提交。"
            />
          </>
        )}
      </div>

      <p className="mt-8 text-xs leading-relaxed text-white/30">
        当前查看的是「{active.label}」，共 {active.count} 条。导出 CSV 会把当前这一栏的
        全部字段带上，可以直接给 Tommy 做名单。
      </p>
    </div>
  );
};

const ErrorNote = ({ text }: { text: string }) => (
  <div className="mb-4 border border-red-500/40 bg-red-500/10 px-4 py-3 text-sm text-red-300">
    {text}
  </div>
);

export default StaffPage;
