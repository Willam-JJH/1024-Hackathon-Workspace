import type { SubmitState } from "../../lib/useSubmit";
import { useT } from "../../i18n/core";

interface SubmitBlockProps {
  state: SubmitState;
  message: string;
  label?: string;
  onRetry: () => void;
}

/** 提交按钮 + 成功／错误反馈 */
const SubmitBlock = ({ state, message, label, onRetry }: SubmitBlockProps) => {
  const t = useT();

  if (state === "success") {
    return (
      <div className="border border-acid/40 bg-acid/[0.06] p-6">
        <div className="font-label text-xs tracking-widest text-acid">
          {t.submitBlock.badge}
        </div>
        <p className="mt-3 text-base text-white">{t.submitBlock.successTitle}</p>
        <p className="mt-2 text-sm text-white/50">{t.submitBlock.successBody}</p>
        <button type="button" onClick={onRetry} className="btn-ghost mt-6">
          {t.submitBlock.again}
        </button>
      </div>
    );
  }

  return (
    <div>
      {state === "error" && (
        <div className="mb-4 border border-red-500/40 bg-red-500/10 px-4 py-3 text-sm text-red-300">
          {message}
        </div>
      )}

      <button
        type="submit"
        disabled={state === "submitting"}
        className="btn-primary disabled:cursor-not-allowed disabled:opacity-50"
      >
        {state === "submitting" ? t.submitBlock.submitting : (label ?? t.submitBlock.defaultLabel)}
      </button>
    </div>
  );
};

export default SubmitBlock;
