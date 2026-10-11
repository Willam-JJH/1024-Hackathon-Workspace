import { Link } from "react-router-dom";
import { event, orTbd } from "../config/event";
import { SECTIONS } from "./TopNav";
import { useT, fill } from "../i18n/core";

const Footer = () => {
  const t = useT();
  const year = new Date().getFullYear();

  const info: [string, string][] = [
    [t.common.date, orTbd(event.dates?.day1, t.common.tbd)],
    [t.common.venue, orTbd(event.venue, t.common.tbd)],
    [t.common.contact, orTbd(event.contact, t.common.tbd)],
  ];

  return (
    <footer className="border-t border-white/10 bg-black">
      <div className="mx-auto max-w-screen-2xl px-5 py-12 sm:px-8 lg:px-12">
        <div className="grid gap-10 md:grid-cols-3">
          {/* 品牌 */}
          <div>
            <div className="font-display text-2xl tracking-wide text-white">{event.name}</div>
            <div className="mt-2 font-label text-[10px] tracking-widest text-acid/70">
              {event.parentEvent}
            </div>
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-white/50">
              {t.brand.tagline}
            </p>
          </div>

          {/* 板块 */}
          <div>
            <h4 className="mb-4 text-sm tracking-widest text-white/40">{t.footer.sections}</h4>
            <ul className="space-y-2">
              {SECTIONS.map((section) => (
                <li key={section.to}>
                  <Link
                    to={section.to}
                    className="text-sm text-white/70 transition-colors hover:text-acid"
                  >
                    {t.nav[section.key]}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* 信息 */}
          <div>
            <h4 className="mb-4 text-sm tracking-widest text-white/40">{t.footer.info}</h4>
            <ul className="space-y-2 text-sm text-white/70">
              {info.map(([label, value]) => (
                <li key={label}>
                  {label}: <span className="tbd">{value}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="line my-8" />

        <div className="flex flex-col gap-3 text-xs text-white/35 sm:flex-row sm:items-center sm:justify-between">
          <span>
            {fill(t.footer.copyright, {
              year,
              parent: event.parentEvent,
              name: event.name,
            })}
          </span>
          <span className="font-label tracking-widest">{t.footer.motto}</span>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
