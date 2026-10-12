import { useCallback, useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { fetchPublicProjects, publicFileUrl } from "../lib/api";
import { isSupabaseConfigured } from "../lib/supabase";
import {
  CATEGORY_VALUES,
  type Category,
  type PublicProject,
  type StoredFile,
} from "../lib/types";
import NotConfigured from "../components/NotConfigured";
import { useT, fill, type Dict } from "../i18n/core";

type CategoryFilter = Category | "all";
type ClubFilter = string | "all";

/** 筛选 chip 按钮 */
const FilterChip = ({
  label,
  active,
  onClick,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
}) => (
  <button
    type="button"
    onClick={onClick}
    className={`shrink-0 border px-3 py-1.5 text-xs tracking-wide transition-colors ${
      active
        ? "border-acid bg-acid/15 text-acid"
        : "border-white/20 text-white/65 hover:border-white/40 hover:text-white"
    }`}
  >
    {label}
  </button>
);

/** 卡片：封面 + 缩略图切换，整卡链接到详情页 */
const ProjectCard = ({
  project,
  index,
  t,
}: {
  project: PublicProject;
  index: number;
  t: Dict;
}) => {
  const p = t.pages.projects;
  const [active, setActive] = useState(0);
  const images = project.public_images ?? [];
  const cover = images[active];
  const detailUrl = `/projects/${project.id}`;

  return (
    <motion.article
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: Math.min(index * 0.05, 0.4) }}
      className="panel flex flex-col"
    >
      {/* 封面 → 详情页 */}
      <Link
        to={detailUrl}
        className="block aspect-[4/3] overflow-hidden border border-white/10 bg-black"
      >
        {cover ? (
          <img
            src={publicFileUrl(cover.path)}
            alt={project.title}
            loading="lazy"
            className="h-full w-full object-cover transition-transform duration-300 hover:scale-[1.03]"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center">
            <span className="font-label text-xs tracking-widest text-white/35">
              {p.noImage}
            </span>
          </div>
        )}
      </Link>

      {/* 多图时给一排缩略图 */}
      {images.length > 1 && (
        <div className="mt-3 flex gap-2 overflow-x-auto pb-1">
          {images.map((img: StoredFile, i: number) => (
            <button
              key={img.path}
              type="button"
              onClick={() => setActive(i)}
              className={`h-12 w-12 shrink-0 overflow-hidden border transition-colors ${
                i === active ? "border-acid" : "border-white/15 hover:border-white/40"
              }`}
              aria-label={fill(p.imageAlt, { n: i + 1 })}
            >
              <img
                src={publicFileUrl(img.path)}
                alt=""
                loading="lazy"
                className="h-full w-full object-cover"
              />
            </button>
          ))}
        </div>
      )}

      <div className="mt-4 flex flex-1 flex-col">
        {/* 类型徽标 */}
        <div className="mb-2 flex flex-wrap gap-2">
          <span className="border border-acid/40 px-2 py-0.5 font-label text-[11px] tracking-wide text-acid">
            {t.enums.category[project.category]}
          </span>
          {project.group_display && (
            <span className="border border-white/15 px-2 py-0.5 font-label text-[11px] tracking-wide text-white/55">
              {project.group_display}
            </span>
          )}
        </div>

        <Link to={detailUrl} className="group">
          <h3 className="text-lg leading-snug text-white transition-colors group-hover:text-acid">
            {project.title}
          </h3>
        </Link>

        {/* 署名 —— 作者没同意时这里什么都没有 */}
        {project.credit_display ? (
          <p className="mt-1.5 text-xs text-acid/80">{project.credit_display}</p>
        ) : (
          <p className="mt-1.5 text-xs text-white/40">{p.uncredited}</p>
        )}

        <p className="mt-3 text-sm leading-relaxed text-white/75">{project.summary}</p>

        <Link
          to={detailUrl}
          className="mt-4 inline-flex items-center gap-1.5 self-start text-sm text-acid underline decoration-acid/40 transition-colors hover:decoration-acid"
        >
          {p.detail.view}
          <span aria-hidden="true">→</span>
        </Link>
      </div>
    </motion.article>
  );
};

const ProjectsPage = () => {
  const t = useT();
  const p = t.pages.projects;
  const [projects, setProjects] = useState<PublicProject[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<CategoryFilter>("all");
  const [clubFilter, setClubFilter] = useState<ClubFilter>("all");

  const load = useCallback(
    async (showSpinner = false) => {
      if (!isSupabaseConfigured) {
        setLoading(false);
        return;
      }
      if (showSpinner) setLoading(true);
      try {
        setProjects(await fetchPublicProjects());
        setError("");
      } catch (err) {
        setError(err instanceof Error ? err.message : p.errLoad);
      } finally {
        setLoading(false);
      }
    },
    [p.errLoad]
  );

  useEffect(() => {
    void load(true);
  }, [load]);

  // 作品墙可能挂在现场屏幕上，隔一会儿自己刷新一次
  useEffect(() => {
    const timer = window.setInterval(() => void load(), 30000);
    const onFocus = () => void load();
    window.addEventListener("focus", onFocus);
    return () => {
      window.clearInterval(timer);
      window.removeEventListener("focus", onFocus);
    };
  }, [load]);

  // 社团列表 = 所有公开作品的 group_display 去重
  const clubs = useMemo(() => {
    const set = new Set<string>();
    for (const project of projects) {
      if (project.group_display) set.add(project.group_display);
    }
    return Array.from(set).sort();
  }, [projects]);

  // 客户端筛选，数据本来就全量拉下来了
  const filtered = useMemo(
    () =>
      projects.filter(
        (project) =>
          (categoryFilter === "all" || project.category === categoryFilter) &&
          (clubFilter === "all" || project.group_display === clubFilter)
      ),
    [projects, categoryFilter, clubFilter]
  );

  return (
    <div className="mx-auto max-w-screen-2xl px-5 py-[var(--s48)] sm:px-8 lg:px-12">
      <div className="flex flex-wrap items-end justify-between gap-6">
        <div className="max-w-2xl">
          <div className="section-index">{p.index}</div>
          <h1 className="mt-4 text-4xl text-white">{p.title}</h1>
          <p className="mt-4 text-base leading-relaxed text-white/75">{p.intro}</p>
        </div>

        <div className="flex items-center gap-4">
          <span className="text-xs text-white/50">
            {loading ? t.common.loading : fill(p.count, { count: filtered.length })}
          </span>
          <button
            type="button"
            onClick={() => void load(true)}
            className="btn-ghost !px-4 !py-2.5 text-xs"
          >
            {p.refresh}
          </button>
        </div>
      </div>

      {/* 筛选栏 */}
      <div className="mt-8 space-y-4">
        <div className="flex flex-wrap items-center gap-2">
          <span className="mr-1 text-xs tracking-widest text-white/45">
            {p.filter.category}
          </span>
          <FilterChip
            label={p.filter.all}
            active={categoryFilter === "all"}
            onClick={() => setCategoryFilter("all")}
          />
          {CATEGORY_VALUES.map((value) => (
            <FilterChip
              key={value}
              label={t.enums.category[value]}
              active={categoryFilter === value}
              onClick={() => setCategoryFilter(value)}
            />
          ))}
        </div>

        {clubs.length > 0 && (
          <div className="flex flex-wrap items-center gap-2">
            <span className="mr-1 text-xs tracking-widest text-white/45">
              {p.filter.club}
            </span>
            <FilterChip
              label={p.filter.all}
              active={clubFilter === "all"}
              onClick={() => setClubFilter("all")}
            />
            {clubs.map((club) => (
              <FilterChip
                key={club}
                label={club}
                active={clubFilter === club}
                onClick={() => setClubFilter(club)}
              />
            ))}
          </div>
        )}
      </div>

      <div className="mt-8">
        <NotConfigured />

        {error && (
          <div className="mb-6 border border-red-500/40 bg-red-500/10 px-4 py-3 text-sm text-red-300">
            {error}
          </div>
        )}

        {!loading && projects.length === 0 && !error && isSupabaseConfigured && (
          <div className="border border-dashed border-white/15 px-6 py-20 text-center">
            <p className="text-white/60">{p.empty}</p>
            <Link to="/submit" className="btn-primary mt-8">
              {p.emptyCta}
            </Link>
          </div>
        )}

        {!loading && projects.length > 0 && filtered.length === 0 && (
          <div className="border border-dashed border-white/15 px-6 py-16 text-center text-sm text-white/45">
            {p.filter.empty}
          </div>
        )}

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((project, index) => (
            <ProjectCard key={project.id} project={project} index={index} t={t} />
          ))}
        </div>
      </div>

      <p className="mt-12 max-w-3xl text-xs leading-relaxed text-white/45">{p.footnote}</p>
    </div>
  );
};

export default ProjectsPage;
