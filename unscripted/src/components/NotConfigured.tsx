import { isSupabaseConfigured } from "../lib/supabase";

/**
 * 数据库还没接上时显示。
 * 页面永远不因为这个白屏 —— 没配置只是不能提交，别的都能看。
 */
const NotConfigured = () => {
  if (isSupabaseConfigured) return null;

  return (
    <div className="mb-[var(--s32)] border border-amber-500/40 bg-amber-500/[0.07] px-5 py-4">
      <div className="font-pixel text-xs tracking-widest text-amber-400">
        NOT CONNECTED
      </div>
      <p className="mt-2 text-sm leading-relaxed text-amber-100/80">
        数据库还没接上，表单现在提交不了。把项目根目录的{" "}
        <code className="bg-black/40 px-1.5 py-0.5 text-amber-200">.env.example</code>{" "}
        复制成 <code className="bg-black/40 px-1.5 py-0.5 text-amber-200">.env.local</code>
        ，填好 Supabase 的 URL 和 anon key，重启开发服务器即可。
      </p>
    </div>
  );
};

export default NotConfigured;
