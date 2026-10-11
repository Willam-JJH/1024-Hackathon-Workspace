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
import { PARTICIPATION_VALUES, type ParticipationType } from "../../lib/types";
import { useT } from "../../i18n/core";

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
  const t = useT();
  const f = t.forms;
  const [form, setForm] = useState<FormState>(initialState);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const { state, message, run, reset } = useSubmit(t.errors);

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
    if (!form.name.trim()) next.name = f.shared.errName;
    if (!form.contact.trim()) next.contact = f.shared.errContact;
    if (!form.direction.trim()) next.direction = f.participant.errDirection;
    if (!form.day1 && !form.day2) next.days = f.shared.errDays;
    if (form.participationType !== "individual" && !form.groupName.trim()) {
      next.groupName = f.participant.errGroupName;
    }
    if (form.hasExisting && !form.existingDetail.trim()) {
      next.existingDetail = f.participant.errExistingDetail;
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
  const isClub = form.participationType === "club";

  // 选项的 value 是存进数据库的键，label / description 跟着语言走
  const identityOptions = PARTICIPATION_VALUES.map((value) => ({
    value,
    label: t.enums.participation[value],
    description: t.enums.participationDesc[value],
  }));

  return (
    <form onSubmit={handleSubmit} className="space-y-[var(--s24)]">
      <div className="grid gap-[var(--s20)] sm:grid-cols-2">
        <TextField
          label={f.shared.name}
          required
          placeholder={f.participant.namePlaceholder}
          value={form.name}
          error={errors.name}
          onChange={(e) => set("name", e.target.value)}
        />
        <TextField
          label={f.shared.contact}
          required
          hint={f.shared.contactHint}
          placeholder={f.participant.contactPlaceholder}
          value={form.contact}
          error={errors.contact}
          onChange={(e) => set("contact", e.target.value)}
        />
      </div>

      <TextField
        label={f.shared.email}
        hint={f.shared.optional}
        type="email"
        placeholder={f.participant.emailPlaceholder}
        value={form.email}
        onChange={(e) => set("email", e.target.value)}
      />

      <ChoiceRow
        label={f.participant.identity}
        required
        options={identityOptions}
        value={form.participationType}
        onChange={(v) => set("participationType", v)}
      />

      {isGroup && (
        <div className="grid gap-[var(--s20)] sm:grid-cols-2">
          <TextField
            label={isClub ? f.participant.groupNameClub : f.participant.groupNameTeam}
            required
            placeholder={
              isClub
                ? f.participant.groupNameClubPlaceholder
                : f.participant.groupNameTeamPlaceholder
            }
            value={form.groupName}
            error={errors.groupName}
            onChange={(e) => set("groupName", e.target.value)}
          />
          <TextField
            label={f.participant.memberCount}
            hint={f.shared.optional}
            type="number"
            min={1}
            placeholder={f.participant.memberCountPlaceholder}
            value={form.memberCount}
            onChange={(e) => set("memberCount", e.target.value)}
          />
        </div>
      )}

      <TextAreaField
        label={f.participant.direction}
        required
        hint={f.participant.directionHint}
        placeholder={f.participant.directionPlaceholder}
        value={form.direction}
        error={errors.direction}
        onChange={(e) => set("direction", e.target.value)}
      />

      <SwitchField
        label={f.participant.hasExisting}
        value={form.hasExisting}
        onChange={(v) => set("hasExisting", v)}
      />

      {form.hasExisting && (
        <TextAreaField
          label={f.participant.existingDetail}
          required
          placeholder={f.participant.existingDetailPlaceholder}
          value={form.existingDetail}
          error={errors.existingDetail}
          onChange={(e) => set("existingDetail", e.target.value)}
        />
      )}

      <DayPicker
        label={f.shared.days}
        value={{ day1: form.day1, day2: form.day2 }}
        error={errors.days}
        onChange={(v) => {
          set("day1", v.day1);
          set("day2", v.day2);
        }}
      />

      <TextAreaField
        label={f.shared.timeNote}
        hint={f.shared.optional}
        placeholder={f.shared.timeNotePlaceholder}
        value={form.timeNote}
        onChange={(e) => set("timeNote", e.target.value)}
      />

      <TextAreaField
        label={f.participant.equipment}
        hint={f.shared.optional}
        placeholder={f.participant.equipmentPlaceholder}
        value={form.equipmentNeeds}
        onChange={(e) => set("equipmentNeeds", e.target.value)}
      />

      <TextAreaField
        label={f.shared.more}
        hint={f.shared.optional}
        value={form.notes}
        onChange={(e) => set("notes", e.target.value)}
      />

      <SubmitBlock state={state} message={message} onRetry={handleReset} />
    </form>
  );
};

export default ParticipantForm;
