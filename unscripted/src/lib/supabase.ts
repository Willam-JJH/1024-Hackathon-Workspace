import { createClient, type SupabaseClient } from "@supabase/supabase-js";

const url = import.meta.env.VITE_SUPABASE_URL as string | undefined;
const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined;

/**
 * 没有配置环境变量时不抛错 —— 抛错会让整站白屏。
 * 改为导出一个 null，由用到的地方显示"尚未配置"的提示。
 *
 * 配置方式：复制 .env.example 为 .env.local 并填值，然后重启 dev server。
 */
export const isSupabaseConfigured = Boolean(url && anonKey);

export const supabase: SupabaseClient | null = isSupabaseConfigured
  ? createClient(url!, anonKey!, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: false,
      },
      db: { schema: "public" },
    })
  : null;

/** 取到客户端，没配置就抛一个可读的错误 */
export function requireSupabase(): SupabaseClient {
  if (!supabase) {
    throw new Error(
      "Supabase 尚未配置：请把 .env.local 里的 VITE_SUPABASE_URL 和 VITE_SUPABASE_ANON_KEY 填好，然后重启开发服务器。"
    );
  }
  return supabase;
}
