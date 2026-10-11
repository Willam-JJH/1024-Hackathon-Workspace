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
import { useT } from "../../i18n/core";

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
    if (form.roles.length === 0) next.roles = f.volunteer.errRoles;
    if (!form.day1 && !form.day2) next.days = f.shared.errDays;
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

  // value 是存进数据库的键，label 跟着语言走
  const roleOptions = VOLUNTEER_ROLES.map((value) => ({
    value,
    label: t.enums.volunteerRole[value],
  }));

  return (
    <form onSubmit={handleSubmit} className="space-y-[var(--s24)]">
      <div className="grid gap-[var(--s20)] sm:grid-cols-2">
        <TextField
          label={f.shared.name}
          required
          value={form.name}
          error={errors.name}
          onChange={(e) => set("name", e.target.value)}
        />
        <TextField
          label={f.shared.contact}
          required
          hint={f.shared.contactHint}
          value={form.contact}
          error={errors.contact}
          onChange={(e) => set("contact", e.target.value)}
        />
      </div>

      <TextField
        label={f.shared.email}
        hint={f.shared.optional}
        type="email"
        value={form.email}
        onChange={(e) => set("email", e.target.value)}
      />

      <ChipMultiSelect
        label={f.volunteer.roles}
        required
        hint={f.volunteer.rolesHint}
        options={roleOptions}
        value={form.roles}
        error={errors.roles}
        onChange={(v) => set("roles", v)}
      />

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
        label={f.volunteer.experience}
        hint={f.shared.optional}
        placeholder={f.volunteer.experiencePlaceholder}
        value={form.experience}
        onChange={(e) => set("experience", e.target.value)}
      />

      <TextAreaField
        label={f.shared.more}
        hint={f.shared.optional}
        value={form.notes}
        onChange={(e) => set("notes", e.target.value)}
      />

      <SubmitBlock
        state={state}
        message={message}
        label={f.volunteer.submit}
        onRetry={handleReset}
      />
    </form>
  );
};

export default VolunteerForm;
