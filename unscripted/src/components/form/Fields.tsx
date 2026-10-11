import {
  useId,
  type ReactNode,
  type InputHTMLAttributes,
  type TextareaHTMLAttributes,
} from "react";

/* ---------------------------------------------------------------- 外壳 */

interface FieldShellProps {
  label: string;
  required?: boolean;
  hint?: string;
  error?: string;
  /** 传入时把 label 关联到对应控件；按钮组这类没有单一控件的字段留空 */
  htmlFor?: string;
  children: ReactNode;
}

/**
 * 注意：这里用 div 而不是 label 包住整块。
 * 按钮也是 labelable 元素，用 label 包住按钮组会让"点击标签文字"
 * 误触发第一个选项。
 */
const FieldShell = ({ label, required, hint, error, htmlFor, children }: FieldShellProps) => (
  <div>
    {label && (
      <label htmlFor={htmlFor} className="flex items-baseline gap-2 text-sm text-white/80">
        {label}
        {required && <span className="text-acid">*</span>}
        {hint && <span className="text-xs text-white/35">{hint}</span>}
      </label>
    )}
    <div className={label ? "mt-2" : ""}>{children}</div>
    {error && (
      <span data-field-error className="mt-2 block text-xs text-red-400">
        {error}
      </span>
    )}
  </div>
);

/** 校验失败后把第一个出错的字段滚到视野中间，长表单不至于让人找不着 */
export function scrollToFirstError(): void {
  requestAnimationFrame(() => {
    document
      .querySelector("[data-field-error]")
      ?.scrollIntoView({ block: "center", behavior: "smooth" });
  });
}

/* --------------------------------------------------------------- 输入框 */

const inputClass =
  "w-full border border-white/20 bg-white/[0.03] px-3 py-3 text-sm text-white placeholder:text-white/25 outline-none transition-colors focus:border-acid focus:bg-white/[0.05]";

interface TextFieldProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  hint?: string;
  error?: string;
}

export const TextField = ({ label, hint, error, required, ...rest }: TextFieldProps) => {
  const id = useId();
  return (
    <FieldShell label={label} required={required} hint={hint} error={error} htmlFor={id}>
      <input id={id} className={inputClass} {...rest} />
    </FieldShell>
  );
};

interface TextAreaFieldProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label: string;
  hint?: string;
  error?: string;
}

export const TextAreaField = ({ label, hint, error, required, ...rest }: TextAreaFieldProps) => {
  const id = useId();
  return (
    <FieldShell label={label} required={required} hint={hint} error={error} htmlFor={id}>
      <textarea id={id} rows={4} className={`${inputClass} resize-y leading-relaxed`} {...rest} />
    </FieldShell>
  );
};

/* ------------------------------------------------------------- 单选一行 */

interface ChoiceRowProps<T extends string | boolean> {
  label: string;
  required?: boolean;
  hint?: string;
  error?: string;
  options: readonly { value: T; label: string; description?: string }[];
  /** 允许为 null —— 用于"必须明确选一次、不给默认值"的场景 */
  value: T | null;
  onChange: (value: T) => void;
}

export function ChoiceRow<T extends string | boolean>({
  label,
  required,
  hint,
  error,
  options,
  value,
  onChange,
}: ChoiceRowProps<T>) {
  return (
    <FieldShell label={label} required={required} hint={hint} error={error}>
      <div className="flex flex-wrap gap-3">
        {options.map((option) => {
          const active = option.value === value;
          return (
            <button
              key={String(option.value)}
              type="button"
              onClick={() => onChange(option.value)}
              className={`border px-4 py-2.5 text-sm transition-colors ${
                active
                  ? "border-acid bg-acid/15 text-acid"
                  : "border-white/20 text-white/60 hover:border-white/40 hover:text-white"
              }`}
            >
              {option.label}
            </button>
          );
        })}
      </div>
      {options.find((o) => o.value === value)?.description && (
        <p className="mt-2 text-xs text-white/35">
          {options.find((o) => o.value === value)?.description}
        </p>
      )}
    </FieldShell>
  );
}

/* ----------------------------------------------------------- 多选 chip */

interface ChipMultiSelectProps {
  label: string;
  required?: boolean;
  hint?: string;
  error?: string;
  options: readonly string[];
  value: string[];
  onChange: (value: string[]) => void;
}

export const ChipMultiSelect = ({
  label,
  required,
  hint,
  error,
  options,
  value,
  onChange,
}: ChipMultiSelectProps) => {
  const toggle = (option: string) => {
    onChange(
      value.includes(option) ? value.filter((v) => v !== option) : [...value, option]
    );
  };

  return (
    <FieldShell label={label} required={required} hint={hint} error={error}>
      <div className="flex flex-wrap gap-3">
        {options.map((option) => {
          const active = value.includes(option);
          return (
            <button
              key={option}
              type="button"
              onClick={() => toggle(option)}
              className={`border px-4 py-2.5 text-sm transition-colors ${
                active
                  ? "border-acid bg-acid/15 text-acid"
                  : "border-white/20 text-white/60 hover:border-white/40 hover:text-white"
              }`}
            >
              {option}
            </button>
          );
        })}
      </div>
    </FieldShell>
  );
};

/* ------------------------------------------------------------- 天数选择 */

interface DayPickerProps {
  label: string;
  value: { day1: boolean; day2: boolean };
  onChange: (value: { day1: boolean; day2: boolean }) => void;
  error?: string;
}

export const DayPicker = ({ label, value, onChange, error }: DayPickerProps) => (
  <FieldShell label={label} required hint="两天都可选，按实际情况勾" error={error}>
    <div className="flex flex-wrap gap-3">
      {(
        [
          { key: "day1" as const, text: "周六 · 集中制作" },
          { key: "day2" as const, text: "周日 · 交换与评议" },
        ]
      ).map((day) => {
        const active = value[day.key];
        return (
          <button
            key={day.key}
            type="button"
            onClick={() => onChange({ ...value, [day.key]: !active })}
            className={`flex items-center gap-3 border px-4 py-2.5 text-sm transition-colors ${
              active
                ? "border-acid bg-acid/15 text-acid"
                : "border-white/20 text-white/60 hover:border-white/40 hover:text-white"
            }`}
          >
            <span
              className={`flex h-4 w-4 items-center justify-center border ${
                active ? "border-acid" : "border-white/30"
              }`}
            >
              {active && (
                <svg viewBox="0 0 12 12" className="h-3 w-3 fill-none stroke-acid stroke-2">
                  <path d="M2 6.2 4.6 8.8 10 3.4" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              )}
            </span>
            {day.text}
          </button>
        );
      })}
    </div>
  </FieldShell>
);

/* --------------------------------------------------------------- 开关 */

interface SwitchFieldProps {
  label: string;
  value: boolean;
  onChange: (value: boolean) => void;
}

export const SwitchField = ({ label, value, onChange }: SwitchFieldProps) => (
  <button
    type="button"
    onClick={() => onChange(!value)}
    className="flex w-full items-center justify-between border border-white/20 bg-white/[0.03] px-4 py-3 text-left text-sm text-white/80 transition-colors hover:border-white/40"
  >
    <span>{label}</span>
    <span
      className={`relative h-5 w-9 shrink-0 rounded-full transition-colors ${
        value ? "bg-acid" : "bg-white/20"
      }`}
    >
      <span
        className="absolute left-0.5 top-0.5 h-4 w-4 rounded-full bg-black transition-transform duration-200"
        style={{ transform: value ? "translateX(1rem)" : "translateX(0)" }}
      />
    </span>
  </button>
);
