import { isSupabaseConfigured } from "../lib/supabase";
import { useT } from "../i18n/core";

/**
 * 数据库还没接上时显示。
 * 页面永远不因为这个白屏 —— 没配置只是不能提交，别的都能看。
 */
const NotConfigured = () => {
  const t = useT();
  if (isSupabaseConfigured) return null;

  return (
    <div className="mb-[var(--s32)] border border-amber-500/40 bg-amber-500/[0.07] px-5 py-4">
      <div className="font-label text-xs tracking-widest text-amber-400">
        {t.notConfigured.badge}
      </div>
      <p className="mt-2 text-sm leading-relaxed text-amber-100/80">
        {t.notConfigured.body}
      </p>
    </div>
  );
};

export default NotConfigured;
