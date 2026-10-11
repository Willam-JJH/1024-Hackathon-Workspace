import { useState, type FormEvent } from "react";
import {
  TextField,
  TextAreaField,
  ChipMultiSelect,
  DayPicker,
  scrollToFirstError,
} from "./Fields";
import SubmitBlock from "./SubmitBlock";
import { useSubmit } from "../../lib/useSubmit";
import { submitVolunteer } from "../../lib/api";
import { VOLUNTEER_ROLES } from "../../lib/types";

interface FormState {
  name: string;
  contact: string;
  email: string;
  roles: string[];
  day1: boolean;
  day2: boolean;
  timeNote: string;
  experience: string;
  notes: string;
}

const initialState: FormState = {
  name: "",
  contact: "",
  email: "",
  roles: [],
  day1: true,
  day2: true,
  timeNote: "",
  experience: "",
  notes: "",
};

const VolunteerForm = () => {
  const [form, setForm] = useState<FormState>(initialState);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const { state, message, run, reset } = useSubmit();

  const set = <K extends keyof FormState>(key: K, value: FormState[K]) => {
    setForm((prev) => ({ ...prev, [key]: value }));
    setErrors((prev) => {
      if (!prev[key]) return prev;
      const next = { ...prev };
      delete next[key];
      return next;
    });
  };

  const validate = (): boolean => {
    const next: Record<string, string> = {};
    if (!form.name.trim()) next.name = "请填写姓名";
    if (!form.contact.trim()) next.contact = "请留一个能联系到你的方式";
    if (form.roles.length === 0) next.roles = "至少选一项你愿意做的工作";
    if (!form.day1 && !form.day2) next.days = "至少选一天能到场的时段";
    setErrors(next);
    if (Object.keys(next).length > 0) scrollToFirstError();
    return Object.keys(next).length === 0;
  };

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    if (state === "submitting") return;
    if (!validate()) return;

    run(async () => {
      await submitVolunteer({
        name: form.name.trim(),
        contact: form.contact.trim(),
        email: form.email.trim() || null,
        roles: form.roles,
        day1_available: form.day1,
        day2_available: form.day2,
        time_note: form.timeNote.trim() || null,
        experience: form.experience.trim() || null,
        notes: form.notes.trim() || null,
      });
    });
  };

  const handleReset = () => {
    setForm(initialState);
    setErrors({});
    reset();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-[var(--s24)]">
      <div className="grid gap-[var(--s20)] sm:grid-cols-2">
        <TextField
          label="姓名"
          required
          value={form.name}
          error={errors.name}
          onChange={(e) => set("name", e.target.value)}
        />
        <TextField
          label="联系方式"
          required
          hint="微信号或手机号"
          value={form.contact}
          error={errors.contact}
          onChange={(e) => set("contact", e.target.value)}
        />
      </div>

      <TextField
        label="邮箱"
        hint="选填"
        type="email"
        value={form.email}
        onChange={(e) => set("email", e.target.value)}
      />

      <ChipMultiSelect
        label="愿意做哪些工作"
        required
        hint="可多选"
        options={VOLUNTEER_ROLES}
        value={form.roles}
        error={errors.roles}
        onChange={(v) => set("roles", v)}
      />

      <DayPicker
        label="两天能到场的时段"
        value={{ day1: form.day1, day2: form.day2 }}
        error={errors.days}
        onChange={(v) => {
          set("day1", v.day1);
          set("day2", v.day2);
        }}
      />

      <TextAreaField
        label="时段补充说明"
        hint="选填"
        placeholder="比如周六下午才能到。"
        value={form.timeNote}
        onChange={(e) => set("timeNote", e.target.value)}
      />

      <TextAreaField
        label="熟悉的工具或相关经验"
        hint="选填"
        placeholder="比如用过某种编程语言、做过视频、熟悉投影设备。"
        value={form.experience}
        onChange={(e) => set("experience", e.target.value)}
      />

      <TextAreaField
        label="其他想告诉我们的"
        hint="选填"
        value={form.notes}
        onChange={(e) => set("notes", e.target.value)}
      />

      <SubmitBlock state={state} message={message} label="提交志愿者报名" onRetry={handleReset} />
    </form>
  );
};

export default VolunteerForm;
