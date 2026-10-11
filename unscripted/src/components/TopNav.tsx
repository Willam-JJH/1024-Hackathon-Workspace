import { useState } from "react";
import { NavLink, Link } from "react-router-dom";
import { event } from "../config/event";

/** 三个板块，按需求做网页顶部分栏 */
export const SECTIONS = [
  { to: "/", label: "主页", end: true },
  { to: "/register", label: "报名", end: false },
  { to: "/submit", label: "参赛", end: false },
] as const;

const TopNav = () => {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-black/85 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-screen-2xl items-center justify-between px-5 sm:px-8 lg:px-12">
        {/* 品牌 */}
        <Link
          to="/"
          className="group flex items-baseline gap-2"
          onClick={() => setOpen(false)}
        >
          <span className="font-display text-2xl tracking-wide text-white transition-colors group-hover:text-acid">
            {event.name}
          </span>
          <span className="font-pixel text-[10px] tracking-widest text-acid/70">
            {event.parentEvent}
          </span>
        </Link>

        {/* 桌面端分栏 */}
        <nav className="hidden items-center gap-1 md:flex">
          {SECTIONS.map((section) => (
            <NavLink
              key={section.to}
              to={section.to}
              end={section.end}
              className={({ isActive }) =>
                `nav-link ${isActive ? "nav-link-active" : ""}`
              }
            >
              {({ isActive }) => (
                <>
                  {section.label}
                  {/* 当前板块下方的荧光标记 */}
                  <span
                    className={`absolute inset-x-2 -bottom-px h-0.5 bg-acid transition-opacity duration-200 ${
                      isActive ? "opacity-100" : "opacity-0"
                    }`}
                  />
                </>
              )}
            </NavLink>
          ))}
        </nav>

        {/* 移动端菜单按钮 */}
        <button
          type="button"
          aria-label="打开菜单"
          aria-expanded={open}
          className="flex h-10 w-10 flex-col items-center justify-center gap-1.5 md:hidden"
          onClick={() => setOpen((v) => !v)}
        >
          <span
            className={`h-px w-6 bg-white transition-transform duration-200 ${open ? "translate-y-[7px] rotate-45" : ""}`}
          />
          <span className={`h-px w-6 bg-white transition-opacity duration-200 ${open ? "opacity-0" : ""}`} />
          <span
            className={`h-px w-6 bg-white transition-transform duration-200 ${open ? "-translate-y-[7px] -rotate-45" : ""}`}
          />
        </button>
      </div>

      {/* 移动端分栏 */}
      {open && (
        <nav className="border-t border-white/10 md:hidden">
          {SECTIONS.map((section) => (
            <NavLink
              key={section.to}
              to={section.to}
              end={section.end}
              onClick={() => setOpen(false)}
              className={({ isActive }) =>
                `block border-b border-white/5 px-5 py-4 text-base tracking-wider transition-colors ${
                  isActive ? "bg-acid/10 text-acid" : "text-white/70 hover:text-white"
                }`
              }
            >
              {section.label}
            </NavLink>
          ))}
        </nav>
      )}
    </header>
  );
};

export default TopNav;
