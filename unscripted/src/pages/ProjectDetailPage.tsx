import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { fetchPublicProject, publicFileUrl } from "../lib/api";
import { isSupabaseConfigured } from "../lib/supabase";
import type { PublicProject, StoredFile } from "../lib/types";
import { useT } from "../i18n/core";

/** 主图 + 缩略图切换 */
const MediaGallery = ({ images }: { images: StoredFile[] }) => {
  const [active, setActive] = useState(0);
  if (images.length === 0) return null;
  const cover = images[active];

  return (
    <div>
      <img
        src={publicFileUrl(cover.path)}
        alt=""
        className="aspect-[16/9] w-full border border-white/10 bg-black object-cover"
      />
      {images.length > 1 && (
        <div className="mt-3 flex gap-2 overflow-x-auto pb-1">
          {images.map((img, i) => (
            <button
              key={img.path}
              type="button"
              onClick={() => setActive(i)}
              className={`h-16 w-16 shrink-0 overflow-hidden border transition-colors ${
                i === active ? "border-acid" : "border-white/15 hover:border-white/40"
              }`}
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
    </div>
  );
};

/** 演示视频：上传的视频 + 外链 */
const Videos = ({ project, t }: { project: PublicProject; t: ReturnType<typeof useT> }) => {
  const p = t.pages.projects.detail;
  const videos = project.public_videos ?? [];

  return (
    <div className="space-y-4">
      {videos.map((video) => (
        <video
          key={video.path}
          controls
          preload="metadata"
          className="aspect-[16/9] w-full border border-white/10 bg-black"
          src={publicFileUrl(video.path)}
        />
      ))}

      {project.video_url && (
        <a
          href={project.video_url}
          target="_blank"
          rel="noreferrer noopener"
          className="inline-flex items-center gap-1.5 text-sm text-acid underline decoration-acid/40 hover:decoration-acid"
        >
          {p.video}
          <span aria-hidden="true">↗</span>
        </a>
      )}
    </div>
  );
};

const ProjectDetailPage = () => {
  const t = useT();
  const p = t.pages.projects.detail;
  const { id } = useParams<{ id: string }>();
  const [project, setProject] = useState<PublicProject | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;
    async function load() {
      if (!isSupabaseConfigured || !id) {
        setLoading(false);
        return;
      }
      try {
        const data = await fetchPublicProject(id);
        if (!cancelled) {
          setProject(data);
          setError("");
        }
      } catch (err) {
        if (!cancelled) setError(err instanceof Error ? err.message : p.notFound);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    void load();
    return () => {
      cancelled = true;
    };
  }, [id, p.notFound]);

  if (loading) {
    return (
      <div className="mx-auto max-w-screen-2xl px-5 py-[var(--s120)] text-sm text-white/50 sm:px-8 lg:px-12">
        {t.common.loading}
      </div>
    );
  }

  if (!project) {
    return (
      <div className="mx-auto max-w-screen-2xl px-5 py-[var(--s120)] sm:px-8 lg:px-12">
        <h1 className="text-3xl text-white">{p.notFound}</h1>
        {error && <p className="mt-3 text-sm text-white/50">{error}</p>}
        <Link to="/projects" className="btn-ghost mt-8">
          {p.back}
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-screen-2xl px-5 py-[var(--s48)] sm:px-8 lg:px-12">
      <Link to="/projects" className="text-sm text-white/55 transition-colors hover:text-acid">
        ← {p.back}
      </Link>

      {/* 头部 */}
      <div className="mt-6 flex flex-wrap items-start justify-between gap-6">
        <div className="max-w-2xl">
          <div className="mb-3 flex flex-wrap gap-2">
            <span className="border border-acid/40 px-2 py-0.5 font-label text-[11px] tracking-wide text-acid">
              {t.enums.category[project.category]}
            </span>
            {project.group_display && (
              <span className="border border-white/15 px-2 py-0.5 font-label text-[11px] tracking-wide text-white/55">
                {project.group_display}
              </span>
            )}
          </div>

          <h1 className="text-4xl text-white">{project.title}</h1>

          {project.credit_display ? (
            <p className="mt-2 text-sm text-acid/80">{project.credit_display}</p>
          ) : (
            <p className="mt-2 text-sm text-white/40">
              {t.pages.projects.uncredited}
            </p>
          )}
        </div>

        {project.link && (
          <a
            href={project.link}
            target="_blank"
            rel="noreferrer noopener"
            className="btn-primary"
          >
            {p.download}
            <span aria-hidden="true">↗</span>
          </a>
        )}
      </div>

      {/* 简介 + 问题 + 方向 */}
      <div className="mt-8 max-w-3xl space-y-4 text-base leading-relaxed text-white/75">
        <p>{project.summary}</p>

        {project.problem && (
          <p>
            <span className="text-white/55">{t.pages.projects.problemLabel}：</span>
            {project.problem}
          </p>
        )}

        {project.direction && (
          <p className="text-sm text-white/55">
            <span className="text-white/40">{t.pages.projects.directionLabel}：</span>
            {project.direction}
          </p>
        )}
      </div>

      {/* 媒体：图片 + 视频 */}
      <div className="mt-10 grid gap-10 lg:grid-cols-[1.3fr_1fr]">
        <MediaGallery images={project.public_images ?? []} />
        <div>
          <h2 className="mb-4 text-sm tracking-widest text-white/45">{p.video}</h2>
          <Videos project={project} t={t} />
        </div>
      </div>

      {/* 操作说明 + 设备需求 */}
      {(project.instructions || project.equipment_needs) && (
        <div className="mt-12 grid gap-6 md:grid-cols-2">
          {project.instructions && (
            <div className="panel">
              <h2 className="text-sm tracking-widest text-white/45">{p.instructions}</h2>
              <p className="mt-3 whitespace-pre-wrap text-sm leading-relaxed text-white/75">
                {project.instructions}
              </p>
            </div>
          )}
          {project.equipment_needs && (
            <div className="panel">
              <h2 className="text-sm tracking-widest text-white/45">{p.equipment}</h2>
              <p className="mt-3 whitespace-pre-wrap text-sm leading-relaxed text-white/75">
                {project.equipment_needs}
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ProjectDetailPage;
