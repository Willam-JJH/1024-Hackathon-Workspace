import { useState } from "react";
import { NavLink, Link } from "react-router-dom";
import { event } from "../config/event";
import { useT, useLang, LANG_LABEL, type Lang } from "../i18n/core";
import type { Dict } from "../i18n/zh";

/**
 * 顶部导航的四个分栏。label 从词典里按 key 取，不写死文字 ——
 * 这样切换语言时导航跟着变。
 */
export const SECTIONS = [
  { to: "/", key: "home", end: true },
  { to: "/register", key: "register", end: false },
  { to: "/submit", key: "submit", end: false },
  { to: "/projects", key: "projects", end: false },
] as const satisfies readonly { to: string; key: keyof Dict["nav"]; end: boolean }[];

/** 中／EN 分段切换 */
const LanguageSwitch = () => {
  const { lang, setLang } = useLang();

  return (
    <div className="flex shrink-0 items-center overflow-hidden rounded border border-white/20">
      {(["zh", "en"] as const).map((code: Lang) => {
        const active = code === lang;
        return (
          <button
            key={code}
            type="button"
            aria-pressed={active}
            aria-label={code === "zh" ? "切换到中文" : "Switch to English"}
            onClick={() => setLang(code)}
            className={`px-2 py-1 font-pixel text-[10px] tracking-widest transition-colors ${
              active ? "bg-acid text-black" : "text-white/50 hover:text-white"
            }`}
          >
            {LANG_LABEL[code]}
          </button>
        );
      })}
    </div>
  );
};

const TopNav = () => {
  const [open, setOpen] = useState(false);
  const t = useT();

  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-black/85 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-screen-2xl items-center justify-between gap-4 px-5 sm:px-8 lg:px-12">
        {/* 品牌 */}
        <Link
          to="/"
          className="group flex min-w-0 items-baseline gap-2"
          onClick={() => setOpen(false)}
        >
          <span className="truncate font-display text-2xl tracking-wide text-white transition-colors group-hover:text-acid">
            {event.name}
          </span>
          <span className="hidden font-pixel text-[10px] tracking-widest text-acid/70 sm:inline">
            {event.parentEvent}
          </span>
        </Link>

        {/* 右侧：分栏 + 语言切换 + 移动端菜单按钮 */}
        <div className="flex items-center gap-3">
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
                    {t.nav[section.key]}
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

          <LanguageSwitch />

          {/* 移动端菜单按钮 */}
          <button
            type="button"
            aria-label={t.nav.openMenu}
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
              {t.nav[section.key]}
            </NavLink>
          ))}
        </nav>
      )}
    </header>
  );
};

export default TopNav;
