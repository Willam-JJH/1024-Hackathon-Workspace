/**
 * 把 i18n 词典导成一份可以手工编辑的纯文本。
 *
 *   node scripts/export-copy.mjs > ../unscripted-copy.txt
 *
 * 格式是 `键 = 值`，一语言一段。改完拿回来按同样的键写回词典。
 * 键名取自词典的路径，所以不会对不上。
 */
import zh from "../src/i18n/zh.ts";
import en from "../src/i18n/en.ts";

/** 顶层分组的显示名，方便在文本里定位 */
const SECTIONS = {
  brand: "品牌与标语",
  common: "通用词",
  nav: "顶部导航",
  footer: "页脚",
  home: "首页",
  enums: "选项与类别",
  forms: "表单",
  pages: "各页面",
  staff: "筹备组看板",
  notConfigured: "数据库未连接提示",
  submitBlock: "提交反馈",
  notFound: "404 页面",
  errors: "报错文案",
};

function flatten(obj, prefix = "") {
  const out = [];
  for (const [k, v] of Object.entries(obj)) {
    const key = prefix ? `${prefix}.${k}` : k;
    if (v !== null && typeof v === "object") out.push(...flatten(v, key));
    else out.push([key, String(v)]);
  }
  return out;
}

const HEADER = `════════════════════════════════════════════════════════════
 Unscripted 网站文案（可直接编辑）
════════════════════════════════════════════════════════════

怎么用
  1. 只改等号右边的文字，等号左边的键名不要动，行也不要删
  2. 不需要改的行原样留着
  3. 改完发回来，我按键名逐条写回

标记的含义
  \\n         换行（只在少数几处用到）
  **文字**    这段显示成荧光绿（重点高亮）
  %%文字%%    这段保留像素字体 —— 目前只用于 "AI" 这个词
  {parent}   自动替换成 "1024 Challenge"
  {count} / {size} / {done} / {total} / {n} / {year} / {name} / {label} / {time} / {names}
             自动替换成数字或名称，位置可以随语序调整
`;

function dump(label, dict) {
  const lines = ["", "═".repeat(60), ` ${label}`, "═".repeat(60)];
  for (const [section, title] of Object.entries(SECTIONS)) {
    if (!dict[section]) continue;
    lines.push("", `── ${title} ${"─".repeat(Math.max(0, 48 - title.length))}`);
    for (const [key, value] of flatten(dict[section], section)) {
      lines.push(`${key} = ${value}`);
    }
  }
  return lines.join("\n");
}

process.stdout.write(HEADER);
process.stdout.write(dump("中文", zh));
process.stdout.write("\n\n");
process.stdout.write(dump("English", en));
process.stdout.write("\n");
