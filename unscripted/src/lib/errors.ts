import type { Dict } from "../i18n/zh";

export type ErrorMessages = Dict["errors"];

/**
 * 把数据库和网络层的原始报错翻成当前语言的可读文案。
 *
 * API 层只负责把原始错误抛出来（它拿不到词典），翻译放在这里由界面调用 ——
 * 这样同一段报错逻辑不用为了语言复制一遍。
 * 认不出来的原样返回，至少不会丢信息。
 */
export function describeError(raw: string, e: ErrorMessages): string {
  if (!raw.trim()) return e.unknown;
  if (raw.includes("NOT_REGISTERED")) return e.notRegistered;
  if (raw.includes("NOT_OWNER")) return e.notOwner;
  if (raw.includes("NAME_OR_CONTACT_REQUIRED")) return e.nameOrContactRequired;
  if (raw.includes("TITLE_OR_SUMMARY_REQUIRED")) return e.titleOrSummaryRequired;
  if (raw.includes("VISIBILITY_REQUIRED")) return e.visibilityRequired;

  // 匿名身份查需要登录的表时会收到这个 —— 通常是登录态没带上或已失效
  if (/permission denied for table/i.test(raw)) return e.permissionDenied;
  if (/row-level security|violates row-level/i.test(raw)) return e.policyRejected;
  if (/duplicate key|already exists/i.test(raw)) return e.duplicateFile;
  if (/exceeded the maximum allowed size/i.test(raw)) return e.fileTooLarge;
  if (/bucket not found/i.test(raw)) return e.storageMissing;
  if (/failed to fetch|networkerror/i.test(raw)) return e.network;

  return raw;
}
