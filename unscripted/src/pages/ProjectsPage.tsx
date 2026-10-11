import { useCallback, useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { fetchPublicProjects, publicFileUrl } from "../lib/api";
import { isSupabaseConfigured } from "../lib/supabase";
import type { PublicProject, StoredFile } from "../lib/types";
import NotConfigured from "../components/NotConfigured";
import { useT, fill, type Dict } from "../i18n/core";

/** 卡片：封面 + 缩略图切换 */
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

  return (
    <motion.article
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: Math.min(index * 0.05, 0.4) }}
      className="panel flex flex-col"
    >
      {/* 封面 */}
      {cover ? (
        <a
          href={publicFileUrl(cover.path)}
          target="_blank"
          rel="noreferrer noopener"
          className="block aspect-[4/3] overflow-hidden border border-white/10 bg-black"
        >
          <img
            src={publicFileUrl(cover.path)}
            alt={project.title}
            loading="lazy"
            className="h-full w-full object-cover transition-transform duration-300 hover:scale-[1.03]"
          />
        </a>
      ) : (
        <div className="flex aspect-[4/3] items-center justify-center border border-dashed border-white/10 bg-white/[0.02]">
          <span className="font-pixel text-xs tracking-widest text-white/20">
            {p.noImage}
          </span>
        </div>
      )}

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
        <h3 className="text-lg leading-snug text-white">{project.title}</h3>

        {/* 署名 —— 作者没同意时这里什么都没有 */}
        {project.credit_display ? (
          <p className="mt-1.5 text-xs text-acid/80">{project.credit_display}</p>
        ) : (
          <p className="mt-1.5 text-xs text-white/25">{p.uncredited}</p>
        )}

        <p className="mt-3 text-sm leading-relaxed text-white/60">{project.summary}</p>

        {project.problem && (
          <p className="mt-3 text-xs leading-relaxed text-white/40">
            <span className="text-white/55">{p.problemLabel}: </span>
            {project.problem}
          </p>
        )}

        {project.direction && (
          <p className="mt-1.5 text-xs text-white/35">
            {p.directionLabel}: {project.direction}
          </p>
        )}

        {project.members_display && (
          <p className="mt-1.5 text-xs text-white/35">
            {p.membersLabel}: {project.members_display}
          </p>
        )}

        {project.link && (
          <a
            href={project.link}
            target="_blank"
            rel="noreferrer noopener"
            className="mt-4 inline-flex items-center gap-1.5 self-start text-sm text-acid underline decoration-acid/40 transition-colors hover:decoration-acid"
          >
            {p.open}
            <span aria-hidden="true">↗</span>
          </a>
        )}
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

  return (
    <div className="mx-auto max-w-screen-2xl px-5 py-[var(--s48)] sm:px-8 lg:px-12">
      <div className="flex flex-wrap items-end justify-between gap-6">
        <div className="max-w-2xl">
          <div className="section-index">{p.index}</div>
          <h1 className="mt-4 text-4xl text-white">{p.title}</h1>
          <p className="mt-4 text-base leading-relaxed text-white/60">{p.intro}</p>
        </div>

        <div className="flex items-center gap-4">
          <span className="text-xs text-white/35">
            {loading ? t.common.loading : fill(p.count, { count: projects.length })}
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

      <div className="mt-10">
        <NotConfigured />

        {error && (
          <div className="mb-6 border border-red-500/40 bg-red-500/10 px-4 py-3 text-sm text-red-300">
            {error}
          </div>
        )}

        {!loading && projects.length === 0 && !error && isSupabaseConfigured && (
          <div className="border border-dashed border-white/15 px-6 py-20 text-center">
            <p className="text-white/45">{p.empty}</p>
            <Link to="/submit" className="btn-primary mt-8">
              {p.emptyCta}
            </Link>
          </div>
        )}

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {projects.map((project, index) => (
            <ProjectCard key={project.id} project={project} index={index} t={t} />
          ))}
        </div>
      </div>

      <p className="mt-12 max-w-3xl text-xs leading-relaxed text-white/30">{p.footnote}</p>
    </div>
  );
};

export default ProjectsPage;
