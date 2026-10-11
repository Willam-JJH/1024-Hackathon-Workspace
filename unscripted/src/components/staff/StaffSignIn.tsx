import { useState, type FormEvent } from "react";
import { supabase } from "../../lib/supabase";
import { useT } from "../../i18n/core";

const StaffSignIn = () => {
  const t = useT();
  const s = t.staff.signIn;
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
      // Supabase 的原始报错是英文的，认得出的换成当前语言的说法
      setError(
        /invalid login credentials/i.test(signInError.message)
          ? s.errCredentials
          : signInError.message
      );
    }
    setBusy(false);
  };

  return (
    <div className="mx-auto max-w-md px-5 py-[var(--s120)]">
      <div className="font-label text-xs tracking-[0.3em] text-acid">{s.badge}</div>
      <h1 className="mt-4 text-3xl text-white">{s.title}</h1>
      <p className="mt-3 text-sm leading-relaxed text-white/65">{s.intro}</p>

      <form onSubmit={handleSubmit} className="mt-10 space-y-5">
        <label className="block">
          <span className="text-sm text-white/90">{s.email}</span>
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
          <span className="text-sm text-white/90">{s.password}</span>
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
          {busy ? s.submitting : s.submit}
        </button>
      </form>

      <p className="mt-8 text-xs leading-relaxed text-white/45">{s.accountNote}</p>
    </div>
  );
};

export default StaffSignIn;
