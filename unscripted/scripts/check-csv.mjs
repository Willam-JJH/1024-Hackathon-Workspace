/**
 * 检查 CSV 导出的编码与转义。跑：node scripts/check-csv.mjs
 * 只依赖纯函数，不需要数据库。
 */
import { toCsv } from "../src/lib/csv.ts";

const rows = [
  { 姓名: "张三", 联系方式: "13800138000", 身份: "个人", 创作方向: "一个帮社团找共同空闲时间的小工具" },
  { 姓名: '李"四"', 联系方式: "wechat_id", 身份: "团队", 创作方向: "做视频,还要加字幕\n换行也要能处理" },
];
const cols = ["姓名", "联系方式", "身份", "创作方向"];
const csv = toCsv(rows, cols);

const checks = [
  ["带 BOM（Excel 中文不乱码）", csv.charCodeAt(0) === 0xfeff],
  ["中文表头原样保留", csv.includes("姓名,联系方式,身份,创作方向")],
  ["中文内容原样保留", csv.includes("一个帮社团找共同空闲时间的小工具")],
  ["含逗号的字段被引号包住", csv.includes('"做视频,还要加字幕')],
  ["内部引号被翻倍转义", csv.includes('"李""四"""')],
  ["字段内换行不破坏结构", csv.includes("换行也要能处理")],
  ["行数与预期一致", csv.split("\r\n").length === 3],
];

let pass = 0;
for (const [name, ok] of checks) {
  console.log(`${ok ? "✓" : "✗"} ${name}`);
  if (ok) pass++;
}
console.log(`\n${pass}/${checks.length} 通过`);
console.log("\n--- 实际输出 ---");
console.log(JSON.stringify(csv));
process.exit(pass === checks.length ? 0 : 1);
