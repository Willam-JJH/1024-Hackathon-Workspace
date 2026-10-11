import type { ReactNode } from "react";
import { useLang } from "../../i18n/core";

export interface Column<T> {
  /** 列标识，同时用作 CSV 的表头字段名 */
  key: string;
  label: string;
  /** 单元格渲染，缺省直接取值 */
  render?: (row: T) => ReactNode;
  /** 导出 CSV 时取值，缺省用原值 */
  csv?: (row: T) => string;
  /** 手机上作为卡片标题的列 */
  primary?: boolean;
}

interface StaffTableProps<T> {
  columns: Column<T>[];
  rows: T[];
  emptyText: string;
}

const getValue = <T,>(row: T, key: string): unknown =>
  (row as Record<string, unknown>)[key];

const cell = <T,>(row: T, col: Column<T>): ReactNode =>
  col.render ? col.render(row) : String(getValue(row, col.key) ?? "—");

const StaffTable = <T extends { id: string }>({
  columns,
  rows,
  emptyText,
}: StaffTableProps<T>) => {
  if (rows.length === 0) {
    return (
      <div className="border border-dashed border-white/15 px-6 py-16 text-center text-sm text-white/55">
        {emptyText}
      </div>
    );
  }

  const primaryIndex = Math.max(
    0,
    columns.findIndex((c) => c.primary)
  );

  return (
    <>
      {/* ---------------- 宽屏：表格 ---------------- */}
      <div className="hidden overflow-x-auto border border-white/10 md:block">
        <table className="w-full min-w-[900px] border-collapse text-left text-sm">
          <thead>
            <tr className="border-b border-white/10 bg-white/[0.03]">
              {columns.map((col) => (
                <th
                  key={col.key}
                  className="whitespace-nowrap px-4 py-3 text-xs font-normal tracking-widest text-white/55"
                >
                  {col.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr
                key={row.id}
                className="border-b border-white/[0.06] align-top transition-colors last:border-0 hover:bg-white/[0.03]"
              >
                {columns.map((col) => (
                  <td key={col.key} className="px-4 py-3 text-white/88">
                    {cell(row, col)}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* ---------------- 窄屏：卡片 ---------------- */}
      <div className="space-y-3 md:hidden">
        {rows.map((row) => {
          const heading = columns[primaryIndex];
          const rest = columns.filter((_, i) => i !== primaryIndex);

          return (
            <div key={row.id} className="border border-white/10 bg-white/[0.02]">
              <div className="border-b border-white/10 bg-white/[0.03] px-4 py-3 text-base text-white">
                {cell(row, heading)}
              </div>
              <dl className="divide-y divide-white/[0.06]">
                {rest.map((col) => (
                  <div key={col.key} className="flex gap-4 px-4 py-2.5">
                    <dt className="w-24 shrink-0 text-xs leading-6 text-white/50">
                      {col.label}
                    </dt>
                    <dd className="min-w-0 flex-1 text-sm text-white/88">
                      {cell(row, col)}
                    </dd>
                  </div>
                ))}
              </dl>
            </div>
          );
        })}
      </div>
    </>
  );
};

/** 单元格里显示布尔值。显示文案由调用方从词典传入，不在这里写死。 */
export const Bool = ({ value, yes, no }: { value: boolean; yes: string; no: string }) => (
  <span className={value ? "text-acid" : "text-white/45"}>{value ? yes : no}</span>
);

/** 单元格里显示时间。跟随站点语言决定日期格式。 */
export const Time = ({ value }: { value: string }) => {
  const { lang } = useLang();
  return (
    <span className="whitespace-nowrap text-xs text-white/60">
      {new Date(value).toLocaleString(lang === "zh" ? "zh-CN" : "en-GB", {
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
      })}
    </span>
  );
};

export default StaffTable;
