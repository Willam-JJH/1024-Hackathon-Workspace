import { Link } from "react-router-dom";
import { event, orTbd } from "../config/event";
import { SECTIONS } from "./TopNav";

const Footer = () => {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-white/10 bg-black">
      <div className="mx-auto max-w-screen-2xl px-5 py-12 sm:px-8 lg:px-12">
        <div className="grid gap-10 md:grid-cols-3">
          {/* 品牌 */}
          <div>
            <div className="font-display text-2xl tracking-wide text-white">{event.name}</div>
            <div className="mt-2 font-pixel text-[10px] tracking-widest text-acid/70">
              {event.parentEvent}
            </div>
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-white/50">
              {event.tagline}
            </p>
          </div>

          {/* 板块 */}
          <div>
            <h4 className="mb-4 text-sm tracking-widest text-white/40">板块</h4>
            <ul className="space-y-2">
              {SECTIONS.map((section) => (
                <li key={section.to}>
                  <Link
                    to={section.to}
                    className="text-sm text-white/70 transition-colors hover:text-acid"
                  >
                    {section.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* 信息 */}
          <div>
            <h4 className="mb-4 text-sm tracking-widest text-white/40">活动信息</h4>
            <ul className="space-y-2 text-sm text-white/70">
              <li>
                日期：<span className="tbd">{orTbd(event.dates?.day1)}</span>
              </li>
              <li>
                场地：<span className="tbd">{orTbd(event.venue)}</span>
              </li>
              <li>
                咨询：<span className="tbd">{orTbd(event.contact)}</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="line my-8" />

        <div className="flex flex-col gap-3 text-xs text-white/35 sm:flex-row sm:items-center sm:justify-between">
          <span>
            © {year} {event.parentEvent} · {event.name}
          </span>
          <span className="font-pixel tracking-widest">
            做自己的项目，讲别人的作品
          </span>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
