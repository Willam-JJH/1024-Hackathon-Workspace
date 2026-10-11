import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import zh, { type Dict } from "./zh";
import en from "./en";

export type Lang = "zh" | "en";

const STORAGE_KEY = "unscripted-lang";
const DICTS: Record<Lang, Dict> = { zh, en };

const LANG_LABEL: Record<Lang, string> = { zh: "中", en: "EN" };

/**
 * 首次访问跟随浏览器语言：中文环境显示中文，其余显示英文。
 * 用户手动切过一次之后，以本地存的为准。
 *
 * localStorage 在隐私模式下可能读不到或抛错 —— 一律吞掉，回退到浏览器语言。
 */
function detectLang(): Lang {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved === "zh" || saved === "en") return saved;
  } catch {
    /* 读不到就用浏览器语言 */
  }
  const nav = typeof navigator === "undefined" ? "" : navigator.language;
  return nav.toLowerCase().startsWith("zh") ? "zh" : "en";
}

interface LangContextValue {
  lang: Lang;
  setLang: (lang: Lang) => void;
}

const LangContext = createContext<LangContextValue>({
  lang: "zh",
  setLang: () => {},
});

export const LanguageProvider = ({ children }: { children: ReactNode }) => {
  const [lang, setLangState] = useState<Lang>(detectLang);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, lang);
    } catch {
      /* 存不了也不影响本次会话 */
    }
    // 让浏览器知道页面语言，影响断词、朗读和字体回退
    document.documentElement.lang = lang === "zh" ? "zh-CN" : "en";
  }, [lang]);

  const value = useMemo<LangContextValue>(
    () => ({ lang, setLang: setLangState }),
    [lang]
  );

  return <LangContext.Provider value={value}>{children}</LangContext.Provider>;
};

export const useLang = (): LangContextValue => useContext(LangContext);

/** 取当前语言的词典 */
export function useT(): Dict {
  const { lang } = useContext(LangContext);
  return DICTS[lang];
}

export { LANG_LABEL };

/* --------------------------------------------------------------- 插值 */

/**
 * 把模板里的 {name} 换掉。词典里需要插入变量时用这个，例如
 * "共 {count} 件"。
 */
export function fill(template: string, vars: Record<string, string | number>): string {
  return template.replace(/\{(\w+)\}/g, (whole, key: string) =>
    key in vars ? String(vars[key]) : whole
  );
}

/* ----------------------------------------------------------- 富文本 */

/**
 * 带内联高亮的句子。
 *
 * 译文里直接用 **双星号** 标出要高亮的部分，例如：
 *   "问题可以来自**学习、个人生活、社团或校园社区**，范围可以很小。"
 *
 * 之所以不用"前缀 / 高亮 / 后缀"拆成三个键：那样译者要对着两段残句翻译，
 * 很容易译出不通顺的中文或英文。整句在一起，语序怎么调都行。
 */
export const RichText = ({ children }: { children: string }) => {
  const parts = children.split("**");
  return (
    // whitespace-pre-line 让译文里手写的 \n 变成真正的换行（没有 \n 就没有影响）
    <span className="whitespace-pre-line">
      {parts.map((part, i) =>
        // 奇数段是被 ** 包起来的高亮部分
        i % 2 === 1 ? (
          <em key={i} className="not-italic text-acid">
            {part}
          </em>
        ) : (
          <span key={i}>{part}</span>
        )
      )}
    </span>
  );
};

/** 收藏用的回调包装，避免切换语言时重建 */
export const useSetLang = () => {
  const { setLang } = useContext(LangContext);
  return useCallback((lang: Lang) => setLang(lang), [setLang]);
};
