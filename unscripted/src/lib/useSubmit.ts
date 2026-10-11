import { useState } from "react";

export type SubmitState = "idle" | "submitting" | "success" | "error";

/** 三个表单共用的提交状态机 */
export function useSubmit() {
  const [state, setState] = useState<SubmitState>("idle");
  const [message, setMessage] = useState<string>("");

  const run = async (action: () => Promise<void>) => {
    setState("submitting");
    setMessage("");
    try {
      await action();
      setState("success");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "提交失败，请稍后重试。");
      setState("error");
    }
  };

  const reset = () => {
    setState("idle");
    setMessage("");
  };

  return { state, message, run, reset };
}
