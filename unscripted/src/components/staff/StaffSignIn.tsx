import { useState, type FormEvent } from "react";
import { supabase } from "../../lib/supabase";

const StaffSignIn = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    if (!supabase) return;

    setBusy(true);
    setError("");

    const { error: signInError } = await supabase.auth.signInWithPassword({
      email: email.trim(),
      password,
    });

    if (signInError) {
      setError(
        /invalid login credentials/i.test(signInError.message)
          ? "邮箱或密码不对。"
          : signInError.message
      );
    }
    setBusy(false);
  };

  return (
    <div className="mx-auto max-w-md px-5 py-[var(--s120)]">
      <div className="font-pixel text-xs tracking-[0.3em] text-acid">STAFF ONLY</div>
      <h1 className="mt-4 text-3xl text-white">筹备组登录</h1>
      <p className="mt-3 text-sm leading-relaxed text-white/50">
        报名信息包含学生个人信息，只有筹备组成员可以查看。
      </p>

      <form onSubmit={handleSubmit} className="mt-10 space-y-5">
        <label className="block">
          <span className="text-sm text-white/80">邮箱</span>
          <input
            type="email"
            required
            autoComplete="username"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="mt-2 w-full border border-white/20 bg-white/[0.03] px-3 py-3 text-sm text-white outline-none transition-colors focus:border-acid"
          />
        </label>

        <label className="block">
          <span className="text-sm text-white/80">密码</span>
          <input
            type="password"
            required
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="mt-2 w-full border border-white/20 bg-white/[0.03] px-3 py-3 text-sm text-white outline-none transition-colors focus:border-acid"
          />
        </label>

        {error && (
          <div className="border border-red-500/40 bg-red-500/10 px-4 py-3 text-sm text-red-300">
            {error}
          </div>
        )}

        <button
          type="submit"
          disabled={busy}
          className="btn-primary w-full disabled:cursor-not-allowed disabled:opacity-50"
        >
          {busy ? "登录中…" : "登录"}
        </button>
      </form>

      <p className="mt-8 text-xs leading-relaxed text-white/30">
        账号由技术负责人（William）在 Supabase 后台创建。忘记密码或需要新账号，找他。
      </p>
    </div>
  );
};

export default StaffSignIn;
