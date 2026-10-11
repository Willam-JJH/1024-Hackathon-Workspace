import type { ReactNode } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import BinaryRain from "../components/BinaryRain";
import Section from "../components/Section";
import { event, orTbd } from "../config/event";

/** 强调：荧光绿内联高亮 */
const Em = ({ children }: { children: ReactNode }) => (
  <em className="not-italic text-acid">{children}</em>
);

const HomePage = () => {
  return (
    <div>
      {/* ============================== Hero ============================== */}
      <section className="relative overflow-hidden border-b border-white/10">
        <div className="absolute inset-x-0 top-0 opacity-40">
          <BinaryRain height={260} />
        </div>
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-transparent via-black/40 to-black" />

        <div className="relative mx-auto max-w-screen-2xl px-5 pb-[var(--s80)] pt-[var(--s64)] sm:px-8 lg:px-12">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-3xl"
          >
            <div className="mb-6 font-pixel text-xs tracking-[0.3em] text-acid">
              {event.parentEvent} · AI 辅助创作
            </div>

            <h1 className="font-display text-[2.5rem] leading-[1.05] tracking-wide text-white sm:text-6xl lg:text-7xl">
              {event.name}
            </h1>

            <p className="mt-6 text-xl text-acid glow sm:text-2xl">{event.tagline}</p>

            <p className="mt-6 max-w-xl text-base leading-relaxed text-white/60">
              带一个想法来，或者把做了一半的项目继续做下去。用 AI 辅助制作，推进你
              自己选的项目。
            </p>

            <div className="mt-10 flex flex-wrap gap-4">
              <Link to="/register" className="btn-primary">
                我要报名
              </Link>
              <Link to="/submit" className="btn-ghost">
                提交作品
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ====================== 活动信息条（未确认项显示占位） ====================== */}
      <section className="border-b border-white/10">
        <div className="mx-auto grid max-w-screen-2xl gap-px bg-white/10 px-5 sm:grid-cols-3 sm:px-8 lg:px-12">
          {[
            {
              label: "日期",
              value: event.dates ? `${event.dates.day1} — ${event.dates.day2}` : null,
            },
            { label: "场地", value: event.venue },
            { label: "报名截止", value: event.registrationDeadline },
          ].map((item) => (
            <div key={item.label} className="bg-black px-2 py-8">
              <div className="text-xs tracking-widest text-white/40">{item.label}</div>
              <div className="mt-2 text-lg text-white">
                <span className="tbd">{orTbd(item.value)}</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ============================== 01 主张 ============================== */}
      <Section index="01" title="选择一个问题，做出可能的解法">
        <div className="grid gap-10 lg:grid-cols-[1.2fr_1fr]">
          <div className="space-y-5 text-base leading-relaxed text-white/65">
            <p>
              Unscripted 是 <Em>{event.parentEvent}</Em> 中的 AI 辅助项目创作与交流
              活动。参加者选择一个自己在意、认为值得做成产品的问题，动手做出可能的
              解决方案，让其他人实际体验，再通过 pitch 说明它为什么可能奏效。
            </p>
            <p>
              问题可以来自<Em>学习、个人生活、社团或校园社区</Em>
              ，范围可以很小，意义由参加者自己说明。
            </p>
            <p>
              活动希望让同学经历从发现问题、形成想法到制作和表达的过程，也把制作中
              遇到的困难、使用者的理解和反馈带进讨论。
            </p>
          </div>

          <div className="panel flex flex-col justify-center">
            <div className="font-pixel text-xs tracking-widest text-acid">
              WHY UNSCRIPTED
            </div>
            <p className="mt-4 text-lg leading-relaxed text-white/80">
              不是照着题目做作业，而是你自己选一个问题，
              <br />
              再证明它值得被解决。
            </p>
          </div>
        </div>
      </Section>

      {/* ============================ 02 参加对象 ============================ */}
      <Section index="02" title="个人、团队和社团都可以参加">
        <div className="grid gap-6 md:grid-cols-3">
          {[
            {
              label: "从想法开始",
              body: "有一个想试的小工具或没做完的游戏，都可以带来。还没有方向的人，可以参考筹备组提供的可选题目。",
            },
            {
              label: "继续已有项目",
              body: "手里已经有 CS Project、个人项目或未完成作品的，可以带着原有工作继续完善。",
            },
            {
              label: "社团组队",
              body: "社团可以围绕自身关注的问题组织成员参加，把一个方向做成可体验的作品。",
            },
          ].map((card) => (
            <div key={card.label} className="panel">
              <h3 className="text-lg text-white">{card.label}</h3>
              <p className="mt-3 text-sm leading-relaxed text-white/55">{card.body}</p>
            </div>
          ))}
        </div>

        <p className="mt-8 max-w-3xl text-base leading-relaxed text-white/65">
          同一项目中可以包含问题梳理、编程、设计、内容制作、试用和展示等工作，
          <Em>不同兴趣和技能的同学可以共同完成作品</Em>。
        </p>
      </Section>

      {/* ========================= 03 AI 与创作成果 ========================= */}
      <Section index="03" title="AI 是工具，但作品得你自己讲明白">
        <div className="grid gap-10 lg:grid-cols-[1fr_1fr]">
          <ul className="space-y-5">
            {[
              "AI 可以协助构思、编程、制作内容和测试，帮助你把想法落实成作品。",
              "最终产品不必内置 AI 模型，也不要求完全零代码。",
              "你需要理解自己做出的东西，并能解释它怎样回应所选问题。",
              "成果可以是网站、小工具、小游戏、交互作品，或其他能够演示关键过程的原型。",
              "作品可以处于早期阶段，重点是让别人能够尝试其中的核心想法，并据此展开讨论。",
            ].map((item) => (
              <li key={item} className="flex gap-4 text-base leading-relaxed text-white/65">
                <span className="mt-2.5 h-1.5 w-1.5 shrink-0 bg-acid" />
                <span>{item}</span>
              </li>
            ))}
          </ul>

          <div className="border border-acid/25 bg-acid/[0.04] p-6">
            <div className="text-xs tracking-widest text-acid/80">举个例子</div>
            <p className="mt-4 text-sm leading-relaxed text-white/65">
              一个社团想减少寻找共同活动时间的麻烦，可以尝试做一个
              <Em>收集可用时段、呈现重合时间</Em>
              的小工具。现场让其他同学输入时间、查看结果，再说明这个方案能帮助解决
              哪一步、目前仍有哪些限制。
            </p>
            <p className="mt-4 text-xs leading-relaxed text-white/35">
              这个例子只展示从问题到作品的关系，选题由参加者自己决定。
            </p>
          </div>
        </div>
      </Section>

      {/* ============================ 04 两天流程 ============================ */}
      <Section index="04" title="一个周末，两个部分">
        <div className="grid gap-6 lg:grid-cols-2">
          <div className="panel">
            <div className="font-pixel text-xs tracking-widest text-acid">DAY 1</div>
            <h3 className="mt-3 text-2xl text-white">周六 · 集中制作</h3>
            <ul className="mt-6 space-y-3">
              {[
                "到场登记与活动说明",
                "自由制作，筹备组提供工具帮助与现场支持",
                "整理作品入口、必要操作说明",
                "确认次日体验所需的设备与材料，完成人员与物品交接",
              ].map((item) => (
                <li key={item} className="flex gap-3 text-sm leading-relaxed text-white/60">
                  <span className="text-acid">—</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="panel">
            <div className="font-pixel text-xs tracking-widest text-acid">DAY 2</div>
            <h3 className="mt-3 text-2xl text-white">周日 · 交换与评议</h3>
            <ol className="mt-6 space-y-4">
              {[
                { t: "抽签交换", d: "每队接手另一队的作品，取得必要的操作说明。" },
                { t: "独立体验", d: "接手者亲手尝试作品，形成自己的理解。" },
                {
                  t: "接手方介绍",
                  d: "介绍作品能做什么、哪里有意思、自己会如何使用 —— 无需复述作者原意。",
                },
                {
                  t: "作者补充",
                  d: "补充项目背景、实现过程和制作中遇到的问题，回应交流中的疑问。",
                },
                {
                  t: "评委评议",
                  d: "结合试用、介绍和作者回应，进行提问、讨论与反馈。",
                },
              ].map((step, i) => (
                <li key={step.t} className="flex gap-4 text-sm leading-relaxed">
                  <span className="font-pixel text-xs text-acid/70">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span>
                    <span className="text-white">{step.t}</span>
                    <span className="text-white/55"> —— {step.d}</span>
                  </span>
                </li>
              ))}
            </ol>
          </div>
        </div>

        <p className="mt-8 max-w-3xl text-sm leading-relaxed text-white/40">
          具体日期、时段与场地以学校确认为准。评分与奖项安排另行讨论，本页不作承诺。
        </p>
      </Section>

      {/* =========================== 05 Pitch 四要素 =========================== */}
      <Section index="05" title="用 pitch 说明它为什么可能奏效">
        <p className="max-w-3xl text-base leading-relaxed text-white/65">
          Pitch 把作品演示与方案说明结合起来，让其他参加者和老师理解问题、解决思路
          以及当前成果。可以围绕下面四件事组织：
        </p>

        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {[
            {
              n: "01",
              t: "问题",
              d: "你关注什么问题，谁可能遇到它，为什么认为它值得解决。",
            },
            {
              n: "02",
              t: "方案",
              d: "你做了什么、如何使用；用作品展示关键过程。",
            },
            {
              n: "03",
              t: "理由",
              d: "哪些功能、演示结果或实际体验支持这个方案可能有用，别人的试用又带来了什么反馈。",
            },
            {
              n: "04",
              t: "后续",
              d: "当前版本还有哪些未完成之处，下一步希望继续改进或尝试什么。",
            },
          ].map((item) => (
            <div key={item.n} className="panel">
              <div className="font-pixel text-xs tracking-widest text-acid">{item.n}</div>
              <h3 className="mt-4 text-xl text-white">{item.t}</h3>
              <p className="mt-3 text-sm leading-relaxed text-white/55">{item.d}</p>
            </div>
          ))}
        </div>

        <p className="mt-8 text-sm leading-relaxed text-white/40">
          表达方式可以结合现场演示、图示、短视频或口头讲述。
        </p>
      </Section>

      {/* ============================ 06 名称的含义 ============================ */}
      <Section index="06" title="Unscripted：没有预先写好的剧本">
        <div className="max-w-3xl space-y-5 text-base leading-relaxed text-white/65">
          <p>
            参加者自己选择问题和探索解决办法；作品进入他人的实际体验后，也会产生
            <Em>创作者没有预先安排的理解和反馈</Em>。
          </p>
          <p>
            活动为这些发现留出空间，让创作与交流共同推动项目发展。
          </p>
        </div>
      </Section>

      {/* ================================ CTA ================================ */}
      <section className="relative overflow-hidden border-t border-white/10">
        <div className="absolute inset-x-0 bottom-0 rotate-180 opacity-30">
          <BinaryRain height={180} />
        </div>
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-black via-black/50 to-transparent" />

        <div className="relative mx-auto max-w-screen-2xl px-5 py-[var(--s96)] text-center sm:px-8 lg:px-12">
          <h2 className="mx-auto max-w-2xl text-3xl leading-tight text-white sm:text-4xl">
            把一个周末，留给你自己的项目
          </h2>
          <p className="mx-auto mt-5 max-w-xl text-base leading-relaxed text-white/60">
            只有一个想法也可以报名，已有项目可以继续做。写下你的创作方向、参加成员和
            两天可来的时段，设备或工具需求也一并告诉我们。
          </p>

          <div className="mt-10 flex flex-wrap justify-center gap-4">
            <Link to="/register" className="btn-primary">
              我要报名
            </Link>
            <Link to="/submit" className="btn-ghost">
              提交作品
            </Link>
          </div>

          <p className="mt-8 text-xs text-white/30">
            报名截止 <span className="tbd">{orTbd(event.registrationDeadline)}</span>
            {" · "}
            咨询 <span className="tbd">{orTbd(event.contact)}</span>
          </p>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
