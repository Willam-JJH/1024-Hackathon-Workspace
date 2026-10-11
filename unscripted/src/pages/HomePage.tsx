import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import BinaryRain from "../components/BinaryRain";
import Section from "../components/Section";
import { event, orTbd } from "../config/event";
import { useT, fill, RichText } from "../i18n/core";

const HomePage = () => {
  const t = useT();
  const h = t.home;

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
            <div className="mb-6 font-label text-xs tracking-[0.3em] text-acid">
              {event.parentEvent} · <RichText>{h.hero.kicker}</RichText>
            </div>

            <h1 className="font-display text-[2.5rem] leading-[1.05] tracking-wide text-white sm:text-6xl lg:text-7xl">
              {event.name}
            </h1>

            <p className="mt-6 text-xl text-acid glow sm:text-2xl">{t.brand.tagline}</p>

            <p className="mt-6 max-w-xl text-base leading-relaxed text-white/75">
              <RichText>{h.hero.desc}</RichText>
            </p>

            <div className="mt-10 flex flex-wrap gap-4">
              <Link to="/register" className="btn-primary">
                {h.hero.ctaRegister}
              </Link>
              <Link to="/submit" className="btn-ghost">
                {h.hero.ctaSubmit}
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
              label: t.common.date,
              value: event.dates ? `${event.dates.day1} — ${event.dates.day2}` : null,
            },
            { label: t.common.venue, value: event.venue },
            { label: t.common.deadline, value: event.registrationDeadline },
          ].map((item) => (
            <div key={item.label} className="bg-black px-2 py-8">
              <div className="text-xs tracking-widest text-white/55">{item.label}</div>
              <div className="mt-2 text-lg text-white">
                <span className="tbd">{orTbd(item.value, t.common.tbd)}</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ============================== 01 主张 ============================== */}
      <Section index="01" title={h.s01.title}>
        <div className="grid gap-6 lg:grid-cols-[1.2fr_1fr]">
          <div className="space-y-5 text-base leading-relaxed text-white/80">
            <p>
              <RichText>{fill(h.s01.p1, { parent: event.parentEvent })}</RichText>
            </p>
            <p>
              <RichText>{h.s01.p2}</RichText>
            </p>
            <p>{h.s01.p3}</p>
          </div>

          <div className="panel flex flex-col justify-center">
            <div className="font-label text-xs tracking-widest text-acid">
              {h.s01.cardKicker}
            </div>
            <p className="mt-4 text-base leading-relaxed text-white/90">
              <RichText>{h.s01.cardText}</RichText>
            </p>
          </div>
        </div>
      </Section>

      {/* ============================ 02 参加对象 ============================ */}
      <Section index="02" title={h.s02.title}>
        <div className="grid gap-6 md:grid-cols-3">
          {h.s02.cards.map((card) => (
            <div key={card.label} className="panel">
              <h3 className="text-lg text-white">{card.label}</h3>
              <p className="mt-3 text-base leading-relaxed text-white/70">{card.body}</p>
            </div>
          ))}
        </div>

        <p className="mt-8 max-w-3xl text-base leading-relaxed text-white/80">
          <RichText>{h.s02.footnote}</RichText>
        </p>
      </Section>

      {/* ========================= 03 AI 与创作成果 ========================= */}
      <Section index="03" title={h.s03.title}>
        <div className="grid gap-6 lg:grid-cols-[1fr_1fr]">
          <ul className="space-y-5">
            {h.s03.points.map((item) => (
              <li key={item} className="flex gap-4 text-base leading-relaxed text-white/80">
                <span className="mt-2.5 h-1.5 w-1.5 shrink-0 bg-acid" />
                <span>
                  <RichText>{item}</RichText>
                </span>
              </li>
            ))}
          </ul>

          <div className="border border-acid/25 bg-acid/[0.04] p-6">
            <div className="text-xs tracking-widest text-acid/80">
              {h.s03.exampleKicker}
            </div>
            <p className="mt-4 text-base leading-relaxed text-white/80">
              <RichText>{h.s03.exampleBody}</RichText>
            </p>
            <p className="mt-4 text-xs leading-relaxed text-white/50">{h.s03.exampleNote}</p>
          </div>
        </div>
      </Section>

      {/* ============================ 04 两天流程 ============================ */}
      <Section index="04" title={h.s04.title}>
        <div className="grid gap-6 lg:grid-cols-2">
          <div className="panel">
            <div className="font-label text-xs tracking-widest text-acid">DAY 1</div>
            <h3 className="mt-3 text-2xl text-white">{h.s04.day1Title}</h3>
            <ul className="mt-6 space-y-3">
              {h.s04.day1.map((item) => (
                <li key={item} className="flex gap-3 text-base leading-relaxed text-white/75">
                  <span className="text-acid">—</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="panel">
            <div className="font-label text-xs tracking-widest text-acid">DAY 2</div>
            <h3 className="mt-3 text-2xl text-white">{h.s04.day2Title}</h3>
            <ol className="mt-6 space-y-4">
              {h.s04.day2.map((step, i) => (
                <li key={step.t} className="flex gap-4 text-base leading-relaxed">
                  <span className="font-label text-xs text-acid/70">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span>
                    <span className="text-white">{step.t}</span>
                    <span className="text-white/70"> —— {step.d}</span>
                  </span>
                </li>
              ))}
            </ol>
          </div>
        </div>

        <p className="mt-8 max-w-3xl text-sm leading-relaxed text-white/55">{h.s04.note}</p>
      </Section>

      {/* =========================== 05 Pitch 四要素 =========================== */}
      <Section index="05" title={h.s05.title}>
        <p className="max-w-3xl text-base leading-relaxed text-white/80">{h.s05.intro}</p>

        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {h.s05.cards.map((item) => (
            <div key={item.n} className="panel">
              <div className="font-label text-xs tracking-widest text-acid">{item.n}</div>
              <h3 className="mt-4 text-xl text-white">{item.t}</h3>
              <p className="mt-3 text-sm leading-relaxed text-white/70">{item.d}</p>
            </div>
          ))}
        </div>

        <p className="mt-8 text-sm leading-relaxed text-white/55">{h.s05.note}</p>
      </Section>

      {/* ============================ 06 名称的含义 ============================ */}
      <Section index="06" title={h.s06.title}>
        <div className="max-w-3xl space-y-5 text-base leading-relaxed text-white/80">
          <p>
            <RichText>{h.s06.p1}</RichText>
          </p>
          <p>{h.s06.p2}</p>
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
            {h.cta.title}
          </h2>
          <p className="mx-auto mt-5 max-w-xl text-base leading-relaxed text-white/75">
            {h.cta.body}
          </p>

          <div className="mt-10 flex flex-wrap justify-center gap-4">
            <Link to="/register" className="btn-primary">
              {h.hero.ctaRegister}
            </Link>
            <Link to="/submit" className="btn-ghost">
              {h.hero.ctaSubmit}
            </Link>
          </div>

          <p className="mt-8 text-xs text-white/45">
            {t.common.deadline}{" "}
            <span className="tbd">{orTbd(event.registrationDeadline, t.common.tbd)}</span>
            {" · "}
            {t.common.contact}{" "}
            <span className="tbd">{orTbd(event.contact, t.common.tbd)}</span>
          </p>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
