/**
 * CSV 导出。纯函数，不依赖 Supabase，也不依赖浏览器 ——
 * 这样它既能被前端调用，也能单独跑测试。
 */

/** 把一组对象按指定列转成 CSV 文本 */
export function toCsv(rows: Record<string, unknown>[], columns: string[]): string {
  const escape = (value: unknown): string => {
    if (value === null || value === undefined) return "";
    const text = Array.isArray(value) ? value.join(" / ") : String(value);
    // 含逗号、引号或换行的字段要用引号包起来，内部引号翻倍
    return /[",\n\r]/.test(text) ? `"${text.replace(/"/g, '""')}"` : text;
  };

  const header = columns.map(escape).join(",");
  const body = rows.map((row) => columns.map((col) => escape(row[col])).join(","));

  // 开头的 BOM 是给 Excel 看的 —— 没有它，Excel 打开中文会乱码
  return "﻿" + [header, ...body].join("\r\n");
}

/** 触发浏览器下载 */
export function downloadCsv(filename: string, csv: string): void {
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  link.click();
  URL.revokeObjectURL(url);
}
