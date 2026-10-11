import ProjectForm from "../components/form/ProjectForm";
import NotConfigured from "../components/NotConfigured";

const SubmitPage = () => (
  <div className="mx-auto max-w-screen-2xl px-5 py-[var(--s48)] sm:px-8 lg:px-12">
    <div className="max-w-3xl">
      <div className="section-index">[ 03 ]</div>
      <h1 className="mt-4 text-4xl text-white">参赛</h1>
      <p className="mt-4 text-base leading-relaxed text-white/60">
        把你作品的入口、必要操作说明和材料需求写清楚。周日这件作品会交给另一队，
        他们要能自己打开、自己体验，再按自己的理解介绍它。
      </p>
    </div>

    <div className="mt-10 max-w-3xl">
      <NotConfigured />

      <div className="mb-[var(--s32)] border border-white/10 bg-white/[0.02] p-5">
        <div className="text-xs tracking-widest text-white/40">提交前先看一眼</div>
        <ul className="mt-4 space-y-2.5 text-sm text-white/60">
          <li className="flex gap-3">
            <span className="mt-2 h-1 w-1 shrink-0 bg-acid" />
            <span>
              没在「报名」板块报过名的提交不了 —— 我们要先知道你是谁，才能把作品算在你头上。
            </span>
          </li>
          <li className="flex gap-3">
            <span className="mt-2 h-1 w-1 shrink-0 bg-acid" />
            <span>作品可以还在早期阶段，重点是让别人能试到核心想法。</span>
          </li>
          <li className="flex gap-3">
            <span className="mt-2 h-1 w-1 shrink-0 bg-acid" />
            <span>
              用同一个项目名再交一次，会覆盖上一次的内容，不会产生两条记录。
            </span>
          </li>
        </ul>
      </div>

      <ProjectForm />
    </div>
  </div>
);

export default SubmitPage;
