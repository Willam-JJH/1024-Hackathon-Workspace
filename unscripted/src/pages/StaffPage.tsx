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
  type Participant,
  type Project,
  type StoredFile,
  type Volunteer,
} from "../lib/types";
import { describeError } from "../lib/errors";
import StaffSignIn from "../components/staff/StaffSignIn";
import StaffTable, { Bool, Time, type Column } from "../components/staff/StaffTable";
import { useT, useLang, fill, type Dict } from "../i18n/core";

type Tab = "participants" | "volunteers" | "projects";

const TAB_VALUES: Tab[] = ["participants", "volunteers", "projects"];

/* ------------------------------------------------------------ 列定义 */

/*
 * 列定义做成"接收词典、返回列数组"的函数 —— 因为列名要跟着语言变，
 * 而且 CSV 的表头也用同一份文案，翻译一处就够。
 */
const participantColumns = (t: Dict): Column<Participant>[] => {
  const c = t.staff.columns;
  const b = t.staff.bool;
  return [
    { key: "created_at", label: c.createdAt, render: (r) => <Time value={r.created_at} /> },
    { key: "name", label: c.name, primary: true },
    { key: "contact", label: c.contact },
    { key: "email", label: c.email, render: (r) => r.email || "—" },
    {
      key: "participation_type",
      label: c.participationType,
      render: (r) => t.enums.participation[r.participation_type],
      csv: (r) => t.enums.participation[r.participation_type],
    },
    { key: "group_name", label: c.groupName, render: (r) => r.group_name || "—" },
    { key: "member_count", label: c.memberCount, render: (r) => r.member_count ?? "—" },
    {
      key: "direction",
      label: c.direction,
      render: (r) => (
        <span className="block max-w-[22rem] whitespace-pre-wrap">{r.direction}</span>
      ),
    },
    {
      key: "has_existing",
      label: c.hasExisting,
      render: (r) => (
        <span>
          <Bool value={r.has_existing} yes={b.yes} no={b.no} />
          {r.has_existing && r.existing_detail && (
            <span className="mt-1 block max-w-[18rem] whitespace-pre-wrap text-xs text-white/45">
              {r.existing_detail}
            </span>
          )}
        </span>
      ),
      csv: (r) =>
        r.has_existing ? `${t.staff.hasExistingPrefix}${r.existing_detail ?? ""}` : b.no,
    },
    {
      key: "day1_available",
      label: c.day1,
      render: (r) => <Bool value={r.day1_available} yes={b.canAttend} no={b.cannotAttend} />,
      csv: (r) => (r.day1_available ? b.canAttend : b.cannotAttend),
    },
    {
      key: "day2_available",
      label: c.day2,
      render: (r) => <Bool value={r.day2_available} yes={b.canAttend} no={b.cannotAttend} />,
      csv: (r) => (r.day2_available ? b.canAttend : b.cannotAttend),
    },
    {
      key: "time_note",
      label: c.timeNote,
      render: (r) => (
        <span className="block max-w-[14rem] whitespace-pre-wrap">{r.time_note || "—"}</span>
      ),
    },
    {
      key: "equipment_needs",
      label: c.equipmentNeeds,
      render: (r) => (
        <span className="block max-w-[16rem] whitespace-pre-wrap">
          {r.equipment_needs || "—"}
        </span>
      ),
    },
    {
      key: "notes",
      label: c.notes,
      render: (r) => (
        <span className="block max-w-[16rem] whitespace-pre-wrap">{r.notes || "—"}</span>
      ),
    },
  ];
};

const volunteerColumns = (t: Dict): Column<Volunteer>[] => {
  const c = t.staff.columns;
  const b = t.staff.bool;
  return [
    { key: "created_at", label: c.createdAt, render: (r) => <Time value={r.created_at} /> },
    { key: "name", label: c.name, primary: true },
    { key: "contact", label: c.contact },
    { key: "email", label: c.email, render: (r) => r.email || "—" },
    {
      key: "roles",
      label: c.roles,
      // 库里存的是稳定键，显示时翻成当前语言
      render: (r) =>
        r.roles.map((role) => t.enums.volunteerRole[role as never] ?? role).join(" · ") ||
        "—",
      csv: (r) => r.roles.map((role) => t.enums.volunteerRole[role as never] ?? role).join(" / "),
    },
    {
      key: "day1_available",
      label: c.day1,
      render: (r) => <Bool value={r.day1_available} yes={b.canAttend} no={b.cannotAttend} />,
      csv: (r) => (r.day1_available ? b.canAttend : b.cannotAttend),
    },
    {
      key: "day2_available",
      label: c.day2,
      render: (r) => <Bool value={r.day2_available} yes={b.canAttend} no={b.cannotAttend} />,
      csv: (r) => (r.day2_available ? b.canAttend : b.cannotAttend),
    },
    {
      key: "time_note",
      label: c.timeNote,
      render: (r) => (
        <span className="block max-w-[14rem] whitespace-pre-wrap">{r.time_note || "—"}</span>
      ),
    },
    {
      key: "experience",
      label: c.experience,
      render: (r) => (
        <span className="block max-w-[18rem] whitespace-pre-wrap">{r.experience || "—"}</span>
      ),
    },
    {
      key: "notes",
      label: c.notes,
      render: (r) => (
        <span className="block max-w-[16rem] whitespace-pre-wrap">{r.notes || "—"}</span>
      ),
    },
  ];
};

const projectColumns = (t: Dict): Column<Project>[] => {
  const c = t.staff.columns;
  return [
    { key: "created_at", label: c.createdAt, render: (r) => <Time value={r.created_at} /> },
    { key: "title", label: c.projectTitle, primary: true },
    {
      key: "summary",
      label: c.projectSummary,
      render: (r) => (
        <span className="block max-w-[20rem] whitespace-pre-wrap">{r.summary}</span>
      ),
    },
    {
      key: "problem",
      label: c.problem,
      render: (r) => (
        <span className="block max-w-[18rem] whitespace-pre-wrap">{r.problem || "—"}</span>
      ),
    },
    { key: "group_name", label: c.groupName, render: (r) => r.group_name || "—" },
    { key: "members", label: c.members, render: (r) => r.members || "—" },
    {
      key: "link",
      label: c.link,
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
      label: c.instructions,
      render: (r) => (
        <span className="block max-w-[20rem] whitespace-pre-wrap">{r.instructions || "—"}</span>
      ),
    },
    {
      key: "equipment_needs",
      label: c.equipmentNeeds,
      render: (r) => (
        <span className="block max-w-[16rem] whitespace-pre-wrap">
          {r.equipment_needs || "—"}
        </span>
      ),
    },
    {
      key: "demo_format",
      label: c.demoFormat,
      // 库里存的是稳定键，显示时翻成当前语言
      render: (r) =>
        r.demo_format
          ? (t.enums.demoFormat[r.demo_format as never] ?? r.demo_format)
          : "—",
      csv: (r) =>
        r.demo_format
          ? (t.enums.demoFormat[r.demo_format as never] ?? r.demo_format)
          : "",
    },
    { key: "contact", label: c.contact, render: (r) => r.contact || "—" },
    {
      key: "wall_visibility",
      label: c.wallVisibility,
      render: (r) => (
        <span className={r.wall_visibility === "hidden" ? "text-white/35" : "text-acid"}>
          {r.wall_visibility ? t.enums.wallVisibility[r.wall_visibility] : t.staff.notStated}
        </span>
      ),
      csv: (r) =>
        r.wall_visibility ? t.enums.wallVisibility[r.wall_visibility] : t.staff.notStated,
    },
    {
      key: "files",
      label: c.files,
      render: (r) => <FileLinks files={r.files} />,
      csv: (r) => (r.files ?? []).map((f) => f.name).join(" / "),
    },
  ];
};

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

/** 把当前栏目的数据导成 CSV，表头用当前语言的列名 */
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

/**
 * 看板主体。**只在已登录时才挂载** —— 这一点很关键。
 *
 * 数据请求和 Realtime 订阅都在 useLiveTable 的挂载副作用里发起。
 * 如果这个组件在未登录时就渲染，请求会以匿名身份发出，被数据库直接拒绝，
 * 报 "permission denied for table participants"；而且 Realtime 频道也会用
 * 匿名身份订阅，登录后收不到推送。
 *
 * 所以认证门（下面的 StaffPage）必须先挡住，登录成功再挂载这里。
 */
const StaffDashboard = ({ session }: { session: Session }) => {
  const t = useT();
  const s = t.staff;
  const { lang } = useLang();
  const [tab, setTab] = useState<Tab>("participants");

  const participants = useLiveTable<Participant>("participants", fetchParticipants);
  const volunteers = useLiveTable<Volunteer>("volunteers", fetchVolunteers);
  const projects = useLiveTable<Project>("projects", fetchProjects);

  const columnsByTab = {
    participants: participantColumns(t),
    volunteers: volunteerColumns(t),
    projects: projectColumns(t),
  };

  const tabs: { value: Tab; label: string; count: number; loading: boolean }[] = [
    {
      value: "participants",
      label: s.tabs.participants,
      count: participants.rows.length,
      loading: participants.loading,
    },
    {
      value: "volunteers",
      label: s.tabs.volunteers,
      count: volunteers.rows.length,
      loading: volunteers.loading,
    },
    {
      value: "projects",
      label: s.tabs.projects,
      count: projects.rows.length,
      loading: projects.loading,
    },
  ];

  const active = tabs.find((item) => item.value === tab)!;

  const exportCurrent = () => {
    if (tab === "participants") {
      exportTable("unscripted-participants", columnsByTab.participants, participants.rows);
    } else if (tab === "volunteers") {
      exportTable("unscripted-volunteers", columnsByTab.volunteers, volunteers.rows);
    } else {
      exportTable("unscripted-projects", columnsByTab.projects, projects.rows);
    }
  };

  const lastSync = Math.max(
    participants.lastSyncAt ?? 0,
    volunteers.lastSyncAt ?? 0,
    projects.lastSyncAt ?? 0
  );

  const timeLocale = lang === "zh" ? "zh-CN" : "en-GB";

  return (
    <div className="mx-auto max-w-screen-2xl px-5 py-[var(--s48)] sm:px-8 lg:px-12">
      {/* 头部 */}
      <div className="flex flex-wrap items-start justify-between gap-6">
        <div>
          <div className="section-index">{s.index}</div>
          <h1 className="mt-4 text-3xl text-white">{s.title}</h1>
          <p className="mt-2 text-sm text-white/45">
            {s.subtitle}
            {lastSync > 0 && (
              <span className="ml-2 text-acid">
                {fill(s.lastSync, {
                  time: new Date(lastSync).toLocaleTimeString(timeLocale, {
                    hour: "2-digit",
                    minute: "2-digit",
                    second: "2-digit",
                  }),
                })}
              </span>
            )}
          </p>
        </div>

        <div className="flex items-center gap-4">
          <span className="hidden text-xs text-white/35 sm:inline">{session.user.email}</span>
          <button
            type="button"
            onClick={() => {
              void participants.refresh();
              void volunteers.refresh();
              void projects.refresh();
            }}
            className="btn-ghost !px-4 !py-2.5 text-xs"
          >
            {s.reload}
          </button>
          <button
            type="button"
            onClick={exportCurrent}
            className="btn-ghost !px-4 !py-2.5 text-xs"
          >
            {s.exportCsv}
          </button>
          <button
            type="button"
            onClick={() => void supabase?.auth.signOut()}
            className="btn-ghost !px-4 !py-2.5 text-xs"
          >
            {s.signOut}
          </button>
        </div>
      </div>

      {/* 分栏 */}
      <div className="mt-10 flex flex-wrap gap-3">
        {TAB_VALUES.map((value) => {
          const item = tabs.find((x) => x.value === value)!;
          const isActive = value === tab;
          return (
            <button
              key={value}
              type="button"
              onClick={() => setTab(value)}
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
            {participants.error && (
              <ErrorNote text={describeError(participants.error, t.errors)} />
            )}
            <StaffTable
              columns={columnsByTab.participants}
              rows={participants.rows}
              emptyText={s.empty.participants}
            />
          </>
        )}

        {tab === "volunteers" && (
          <>
            {volunteers.error && <ErrorNote text={describeError(volunteers.error, t.errors)} />}
            <StaffTable
              columns={columnsByTab.volunteers}
              rows={volunteers.rows}
              emptyText={s.empty.volunteers}
            />
          </>
        )}

        {tab === "projects" && (
          <>
            {projects.error && <ErrorNote text={describeError(projects.error, t.errors)} />}
            <StaffTable
              columns={columnsByTab.projects}
              rows={projects.rows}
              emptyText={s.empty.projects}
            />
          </>
        )}
      </div>

      <p className="mt-8 text-xs leading-relaxed text-white/30">
        {fill(s.footer, { label: active.label, count: active.count })}
      </p>

      <p className="mt-3 text-xs leading-relaxed text-white/25">{s.allowlistNote}</p>
    </div>
  );
};

const ErrorNote = ({ text }: { text: string }) => (
  <div className="mb-4 border border-red-500/40 bg-red-500/10 px-4 py-3 text-sm text-red-300">
    {text}
  </div>
);

/**
 * 认证门。职责只有两件：确认登录状态、决定渲染登录页还是看板。
 * 数据相关的 hook 全在 StaffDashboard 里，登录成功后才挂载。
 */
const StaffPage = () => {
  const t = useT();
  const [session, setSession] = useState<Session | null>(null);
  const [authReady, setAuthReady] = useState(false);

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

  if (!isSupabaseConfigured) {
    return (
      <div className="mx-auto max-w-screen-2xl px-5 py-[var(--s120)] sm:px-8 lg:px-12">
        <h1 className="text-3xl text-white">{t.staff.notConfiguredTitle}</h1>
        <p className="mt-4 text-sm text-white/50">{t.staff.notConfiguredBody}</p>
      </div>
    );
  }

  if (!authReady) {
    return (
      <div className="px-5 py-[var(--s120)] text-sm text-white/40">{t.common.loading}</div>
    );
  }

  if (!session) return <StaffSignIn />;

  // key 用 user id：换账号时强制重新挂载，避免沿用上一个账号的数据与订阅
  return <StaffDashboard key={session.user.id} session={session} />;
};

export default StaffPage;
