import { useState, type FormEvent } from "react";
import {
  TextField,
  TextAreaField,
  ChoiceRow,
  DayPicker,
  SwitchField,
  scrollToFirstError,
} from "./Fields";
import SubmitBlock from "./SubmitBlock";
import { useSubmit } from "../../lib/useSubmit";
import { submitParticipant } from "../../lib/api";
import type { ParticipationType } from "../../lib/types";

const ParticipationOptions = [
  {
    value: "individual" as const,
    label: "个人",
    description: "自己一个人做一个项目，也可以带着已有的作品来。",
  },
  {
    value: "team" as const,
    label: "团队",
    description: "和几个同学一起，报名时写清团队名称和大致人数。",
  },
  {
    value: "club" as const,
    label: "社团",
    description: "社团组织成员围绕自身方向一起做，后续可另谈协办。",
  },
];

interface FormState {
  name: string;
  contact: string;
  email: string;
  participationType: ParticipationType;
  groupName: string;
  memberCount: string;
  direction: string;
  hasExisting: boolean;
  existingDetail: string;
  day1: boolean;
  day2: boolean;
  timeNote: string;
  equipmentNeeds: string;
  notes: string;
}

const initialState: FormState = {
  name: "",
  contact: "",
  email: "",
  participationType: "individual",
  groupName: "",
  memberCount: "",
  direction: "",
  hasExisting: false,
  existingDetail: "",
  day1: true,
  day2: true,
  timeNote: "",
  equipmentNeeds: "",
  notes: "",
};

const ParticipantForm = () => {
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
    if (!form.direction.trim()) next.direction = "写一句你的创作方向或已有的内容";
    if (!form.day1 && !form.day2) next.days = "至少选一天能到场的时段";
    if (form.participationType !== "individual" && !form.groupName.trim()) {
      next.groupName = "请填写团队或社团名称";
    }
    if (form.hasExisting && !form.existingDetail.trim()) {
      next.existingDetail = "简单说一下已有的是什么";
    }
    setErrors(next);
    if (Object.keys(next).length > 0) scrollToFirstError();
    return Object.keys(next).length === 0;
  };

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    // 在输入框里按回车也会触发表单提交，这里挡掉重复提交
    if (state === "submitting") return;
    if (!validate()) return;

    const count = Number.parseInt(form.memberCount, 10);

    run(async () => {
      await submitParticipant({
        name: form.name.trim(),
        contact: form.contact.trim(),
        email: form.email.trim() || null,
        participation_type: form.participationType,
        group_name:
          form.participationType === "individual" ? null : form.groupName.trim() || null,
        member_count:
          form.participationType !== "individual" && Number.isFinite(count) ? count : null,
        direction: form.direction.trim(),
        has_existing: form.hasExisting,
        existing_detail: form.hasExisting ? form.existingDetail.trim() || null : null,
        day1_available: form.day1,
        day2_available: form.day2,
        time_note: form.timeNote.trim() || null,
        equipment_needs: form.equipmentNeeds.trim() || null,
        notes: form.notes.trim() || null,
      });
    });
  };

  const handleReset = () => {
    setForm(initialState);
    setErrors({});
    reset();
  };

  const isGroup = form.participationType !== "individual";

  return (
    <form onSubmit={handleSubmit} className="space-y-[var(--s24)]">
      <div className="grid gap-[var(--s20)] sm:grid-cols-2">
        <TextField
          label="姓名"
          required
          placeholder="你的名字"
          value={form.name}
          error={errors.name}
          onChange={(e) => set("name", e.target.value)}
        />
        <TextField
          label="联系方式"
          required
          hint="微信号或手机号"
          placeholder="方便我们联系你"
          value={form.contact}
          error={errors.contact}
          onChange={(e) => set("contact", e.target.value)}
        />
      </div>

      <TextField
        label="邮箱"
        hint="选填"
        type="email"
        placeholder="用于接收活动通知"
        value={form.email}
        onChange={(e) => set("email", e.target.value)}
      />

      <ChoiceRow
        label="以什么身份参加"
        required
        options={ParticipationOptions}
        value={form.participationType}
        onChange={(v) => set("participationType", v)}
      />

      {isGroup && (
        <div className="grid gap-[var(--s20)] sm:grid-cols-2">
          <TextField
            label={form.participationType === "club" ? "社团名称" : "团队名称"}
            required
            placeholder={form.participationType === "club" ? "你的社团" : "你们的队名"}
            value={form.groupName}
            error={errors.groupName}
            onChange={(e) => set("groupName", e.target.value)}
          />
          <TextField
            label="大致人数"
            hint="选填"
            type="number"
            min={1}
            placeholder="包括你自己"
            value={form.memberCount}
            onChange={(e) => set("memberCount", e.target.value)}
          />
        </div>
      )}

      <TextAreaField
        label="创作方向或已有内容"
        required
        hint="可以只是几句话"
        placeholder="比如：想做一个小工具，帮社团找大家都有空的时间。"
        value={form.direction}
        error={errors.direction}
        onChange={(e) => set("direction", e.target.value)}
      />

      <SwitchField
        label="我是带着已有项目或未完成的作品来的"
        value={form.hasExisting}
        onChange={(v) => set("hasExisting", v)}
      />

      {form.hasExisting && (
        <TextAreaField
          label="已有的是什么"
          required
          placeholder="项目做到哪一步了，现在缺什么。"
          value={form.existingDetail}
          error={errors.existingDetail}
          onChange={(e) => set("existingDetail", e.target.value)}
        />
      )}

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
        placeholder="比如周六只能下午到。"
        value={form.timeNote}
        onChange={(e) => set("timeNote", e.target.value)}
      />

      <TextAreaField
        label="设备或工具需求"
        hint="选填"
        placeholder="需要借用电脑、网络、投屏，或者希望提前拿到某个工具的权限。"
        value={form.equipmentNeeds}
        onChange={(e) => set("equipmentNeeds", e.target.value)}
      />

      <TextAreaField
        label="其他想告诉我们的"
        hint="选填"
        value={form.notes}
        onChange={(e) => set("notes", e.target.value)}
      />

      <SubmitBlock state={state} message={message} onRetry={handleReset} />
    </form>
  );
};

export default ParticipantForm;
