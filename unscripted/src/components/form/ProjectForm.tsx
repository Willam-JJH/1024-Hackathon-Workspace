import { useRef, useState, type FormEvent, type DragEvent } from "react";
import { TextField, TextAreaField, ChoiceRow, scrollToFirstError } from "./Fields";
import SubmitBlock from "./SubmitBlock";
import { useSubmit } from "../../lib/useSubmit";
import {
  submitProject,
  uploadProjectFiles,
  attachProjectFiles,
  MAX_FILE_BYTES,
} from "../../lib/api";
import { compressImage } from "../../lib/imageCompress";
import {
  DEMO_FORMATS,
  WALL_VISIBILITY_VALUES,
  type WallVisibility,
} from "../../lib/types";
import { useT, fill, RichText } from "../../i18n/core";

interface FormState {
  name: string;
  contact: string;
  title: string;
  summary: string;
  /** null = 还没选。提交前必须明确选一次 */
  wallVisibility: WallVisibility | null;
  problem: string;
  groupName: string;
  members: string;
  direction: string;
  link: string;
  instructions: string;
  equipmentNeeds: string;
  demoFormat: string;
}

const initialState: FormState = {
  name: "",
  contact: "",
  title: "",
  summary: "",
  wallVisibility: null,
  problem: "",
  groupName: "",
  members: "",
  direction: "",
  link: "",
  instructions: "",
  equipmentNeeds: "",
  demoFormat: DEMO_FORMATS[0],
};

const formatSize = (bytes: number): string =>
  bytes >= 1024 * 1024
    ? `${(bytes / 1024 / 1024).toFixed(1)} MB`
    : `${Math.max(1, Math.round(bytes / 1024))} KB`;

const ProjectForm = () => {
  const t = useT();
  const p = t.forms.project;
  const [form, setForm] = useState<FormState>(initialState);
  const [files, setFiles] = useState<File[]>([]);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [progress, setProgress] = useState("");
  const [dragging, setDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
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

  const addFiles = (incoming: FileList | null) => {
    if (!incoming) return;
    const next = [...files];
    const rejected: string[] = [];

    for (const file of Array.from(incoming)) {
      // 图片会被压缩，先不拦；其他类型在这里就挡住超大文件
      if (!file.type.startsWith("image/") && file.size > MAX_FILE_BYTES) {
        rejected.push(file.name);
        continue;
      }
      if (!next.some((f) => f.name === file.name && f.size === file.size)) {
        next.push(file);
      }
    }

    setFiles(next);
    setErrors((prev) => {
      const copy = { ...prev };
      if (rejected.length > 0) {
        copy.files = fill(p.errFiles, { names: rejected.join(", ") });
      } else {
        delete copy.files;
      }
      return copy;
    });
  };

  const handleDrop = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setDragging(false);
    addFiles(event.dataTransfer.files);
  };

  // 选项顺序即展示顺序，标签和说明跟着语言走
  const allVisibilityOptions = WALL_VISIBILITY_VALUES.map((value) => ({
    value,
    label: p.visibilityOptions[value].label,
    description: p.visibilityOptions[value].desc,
  }));

  // 没填团体名的（个人参加）不显示"只显示团体名"那一项 —— 选了也没东西可显示
  const hasGroupName = form.groupName.trim().length > 0;
  const visibleOptions = hasGroupName
    ? allVisibilityOptions
    : allVisibilityOptions.filter((option) => option.value !== "group_only");

  const demoOptions = DEMO_FORMATS.map((value) => ({
    value,
    label: t.enums.demoFormat[value],
  }));

  const validate = (): boolean => {
    const next: Record<string, string> = {};
    if (!form.name.trim()) next.name = t.forms.shared.errName;
    if (!form.contact.trim()) next.contact = p.errContact;
    if (!form.title.trim()) next.title = p.errTitle;
    if (!form.summary.trim()) next.summary = p.errSummary;
    // 也要挡住"先选了只显示团体名、又把团体名清空"的情况
    if (
      form.wallVisibility === null ||
      !visibleOptions.some((option) => option.value === form.wallVisibility)
    ) {
      next.wallVisibility = p.errVisibility;
    }
    setErrors(next);
    if (Object.keys(next).length > 0) scrollToFirstError();
    return Object.keys(next).length === 0;
  };

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    if (state === "submitting") return;
    if (!validate()) return;

    // validate() 已经保证了非空，这里只是让类型收窄
    const visibility = form.wallVisibility;
    if (visibility === null) return;

    run(async () => {
      setProgress(p.progressVerify);

      const projectId = await submitProject({
        name: form.name.trim(),
        contact: form.contact.trim(),
        title: form.title.trim(),
        summary: form.summary.trim(),
        wallVisibility: visibility,
        problem: form.problem.trim() || null,
        groupName: form.groupName.trim() || null,
        members: form.members.trim() || null,
        direction: form.direction.trim() || null,
        link: form.link.trim() || null,
        instructions: form.instructions.trim() || null,
        equipmentNeeds: form.equipmentNeeds.trim() || null,
        demoFormat: form.demoFormat || null,
      });

      if (files.length > 0) {
        setProgress(fill(p.progressCompress, { count: files.length }));

        const estimated = await Promise.all(files.map((f) => compressImage(f)));
        const totalMb = estimated.reduce((sum, f) => sum + f.size, 0) / 1024 / 1024;
        setProgress(
          fill(p.progressUpload, { count: files.length, size: totalMb.toFixed(1) })
        );

        const stored = await uploadProjectFiles(projectId, files, (done, total) =>
          setProgress(fill(p.progressUploading, { done, total }))
        );
        await attachProjectFiles(projectId, form.name.trim(), form.contact.trim(), stored);
      }

      setProgress("");
    });
  };

  const handleReset = () => {
    setForm(initialState);
    setFiles([]);
    setErrors({});
    setProgress("");
    reset();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-[var(--s32)]">
      {/* ---------- 身份确认 ---------- */}
      <fieldset className="space-y-[var(--s20)] border border-acid/25 bg-acid/[0.03] p-5">
        <legend className="px-2 text-xs tracking-widest text-acid">
          {p.identityLegend}
        </legend>
        <p className="text-xs leading-relaxed text-white/60">{p.identityBody}</p>

        <div className="grid gap-[var(--s20)] sm:grid-cols-2">
          <TextField
            label={t.forms.shared.name}
            required
            placeholder={p.namePlaceholder}
            value={form.name}
            error={errors.name}
            onChange={(e) => set("name", e.target.value)}
          />
          <TextField
            label={t.forms.shared.contact}
            required
            hint={p.contactHint}
            placeholder={p.contactPlaceholder}
            value={form.contact}
            error={errors.contact}
            onChange={(e) => set("contact", e.target.value)}
          />
        </div>
      </fieldset>

      {/* ---------- 项目信息 ---------- */}
      <div className="space-y-[var(--s20)]">
        <TextField
          label={p.title}
          required
          placeholder={p.titlePlaceholder}
          value={form.title}
          error={errors.title}
          onChange={(e) => set("title", e.target.value)}
        />

        <TextAreaField
          label={p.summary}
          required
          rows={2}
          placeholder={p.summaryPlaceholder}
          value={form.summary}
          error={errors.summary}
          onChange={(e) => set("summary", e.target.value)}
        />

        <TextAreaField
          label={p.problem}
          hint={t.forms.shared.optional}
          placeholder={p.problemPlaceholder}
          value={form.problem}
          onChange={(e) => set("problem", e.target.value)}
        />

        <div className="grid gap-[var(--s20)] sm:grid-cols-2">
          <TextField
            label={p.groupName}
            hint={t.forms.shared.optional}
            placeholder={p.groupNamePlaceholder}
            value={form.groupName}
            onChange={(e) => set("groupName", e.target.value)}
          />
          <TextField
            label={p.members}
            hint={t.forms.shared.optional}
            placeholder={p.membersPlaceholder}
            value={form.members}
            onChange={(e) => set("members", e.target.value)}
          />
        </div>

        <TextField
          label={p.direction}
          hint={t.forms.shared.optional}
          placeholder={p.directionPlaceholder}
          value={form.direction}
          onChange={(e) => set("direction", e.target.value)}
        />
      </div>

      {/* ---------- 作品本体 ---------- */}
      <div className="space-y-[var(--s20)] border-t border-white/10 pt-[var(--s24)]">
        <TextField
          label={p.link}
          hint={p.linkHint}
          placeholder="https://…"
          value={form.link}
          onChange={(e) => set("link", e.target.value)}
        />

        <TextAreaField
          label={p.instructions}
          hint={p.instructionsHint}
          placeholder={p.instructionsPlaceholder}
          value={form.instructions}
          onChange={(e) => set("instructions", e.target.value)}
        />

        <TextField
          label={p.equipment}
          hint={t.forms.shared.optional}
          placeholder={p.equipmentPlaceholder}
          value={form.equipmentNeeds}
          onChange={(e) => set("equipmentNeeds", e.target.value)}
        />

        <ChoiceRow
          label={p.demo}
          options={demoOptions}
          value={form.demoFormat}
          onChange={(v) => set("demoFormat", v)}
        />
      </div>

      {/* ---------- 文件 ---------- */}
      <div className="space-y-[var(--s16)] border-t border-white/10 pt-[var(--s24)]">
        <div className="flex flex-wrap items-baseline gap-2 text-sm text-white/90">
          {p.files}
          <span className="text-xs text-white/50">{p.filesHint}</span>
        </div>

        <div
          onDragOver={(e) => {
            e.preventDefault();
            setDragging(true);
          }}
          onDragLeave={() => setDragging(false)}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className={`cursor-pointer border border-dashed px-6 py-10 text-center transition-colors ${
            dragging ? "border-acid bg-acid/[0.06]" : "border-white/20 hover:border-white/40"
          }`}
        >
          <p className="text-sm text-white/75">
            {p.dropPre}
            <span className="text-acid"> {p.dropAction}</span>
          </p>
          <p className="mt-2 text-xs text-white/50">{p.dropNote}</p>
        </div>

        <input
          ref={fileInputRef}
          type="file"
          multiple
          className="hidden"
          onChange={(e) => {
            addFiles(e.target.files);
            e.target.value = "";
          }}
        />

        {errors.files && <p className="text-xs text-red-400">{errors.files}</p>}

        {files.length > 0 && (
          <ul className="space-y-2">
            {files.map((file, index) => (
              <li
                key={`${file.name}-${file.size}-${index}`}
                className="flex items-center justify-between gap-4 border border-white/10 bg-white/[0.02] px-4 py-2.5"
              >
                <span className="min-w-0 flex-1 truncate text-sm text-white/85">
                  {file.name}
                </span>
                <span className="shrink-0 text-xs text-white/50">
                  {formatSize(file.size)}
                </span>
                <button
                  type="button"
                  onClick={() => setFiles(files.filter((_, i) => i !== index))}
                  className="shrink-0 text-xs text-white/55 transition-colors hover:text-red-400"
                >
                  {p.remove}
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* ---------- 作品墙可见性（必须明确选一次，不给默认值）---------- */}
      <fieldset className="space-y-[var(--s16)] border border-acid/25 bg-acid/[0.03] p-5">
        <legend className="px-2 text-xs tracking-widest text-acid">
          {p.visibilityLegend}
        </legend>
        <p className="text-xs leading-relaxed text-white/60">
          <RichText>{p.visibilityBody}</RichText>
        </p>

        <ChoiceRow
          label=""
          required
          options={visibleOptions}
          value={form.wallVisibility}
          error={errors.wallVisibility}
          onChange={(v) => set("wallVisibility", v)}
        />
      </fieldset>

      {progress && state === "submitting" && (
        <p className="text-sm text-acid">{progress}</p>
      )}

      <SubmitBlock state={state} message={message} label={p.submit} onRetry={handleReset} />
    </form>
  );
};

export default ProjectForm;
