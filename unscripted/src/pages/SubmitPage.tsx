import ProjectForm from "../components/form/ProjectForm";
import NotConfigured from "../components/NotConfigured";
import { useT } from "../i18n/core";

const SubmitPage = () => {
  const t = useT();
  const p = t.pages.submit;

  return (
    <div className="mx-auto max-w-screen-2xl px-5 py-[var(--s48)] sm:px-8 lg:px-12">
      <div className="max-w-3xl">
        <div className="section-index">{p.index}</div>
        <h1 className="mt-4 text-4xl text-white">{p.title}</h1>
        <p className="mt-4 text-base leading-relaxed text-white/60">{p.intro}</p>
      </div>

      <div className="mt-10 max-w-3xl">
        <NotConfigured />

        <div className="mb-[var(--s32)] border border-white/10 bg-white/[0.02] p-5">
          <div className="text-xs tracking-widest text-white/40">{p.checklistTitle}</div>
          <ul className="mt-4 space-y-2.5 text-sm text-white/60">
            {p.checklist.map((item) => (
              <li key={item} className="flex gap-3">
                <span className="mt-2 h-1 w-1 shrink-0 bg-acid" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>

        <ProjectForm />
      </div>
    </div>
  );
};

export default SubmitPage;
