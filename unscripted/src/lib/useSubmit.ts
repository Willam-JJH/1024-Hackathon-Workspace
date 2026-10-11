import { useState } from "react";
import { describeError, type ErrorMessages } from "./errors";

export type SubmitState = "idle" | "submitting" | "success" | "error";

/**
 * 三个表单共用的提交状态机。
 *
 * 收一份错误文案词典，把底层抛出的原始报错翻成当前语言 ——
 * API 层不做翻译（它拿不到词典），翻译集中在这里。
 */
export function useSubmit(e: ErrorMessages) {
  const [state, setState] = useState<SubmitState>("idle");
  const [message, setMessage] = useState<string>("");

  const run = async (action: () => Promise<void>) => {
    setState("submitting");
    setMessage("");
    try {
      await action();
      setState("success");
    } catch (error) {
      setMessage(
        error instanceof Error ? describeError(error.message, e) : e.unknown
      );
      setState("error");
    }
  };

  const reset = () => {
    setState("idle");
    setMessage("");
  };

  return { state, message, run, reset };
}
