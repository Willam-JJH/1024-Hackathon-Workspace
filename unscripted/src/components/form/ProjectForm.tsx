import { useRef, useState, type FormEvent, type DragEvent } from "react";
import { TextField, TextAreaField, ChoiceRow, scrollToFirstError } from "./Fields";
import SubmitBlock from "./SubmitBlock";
import { useSubmit } from "../../lib/useSubmit";
import { submitProject, uploadProjectFiles, attachProjectFiles, MAX_FILE_BYTES } from "../../lib/api";
import { compressImage } from "../../lib/imageCompress";
import { DEMO_FORMATS, type WallVisibility } from "../../lib/types";

const demoOptions = DEMO_FORMATS.map((f) => ({ value: f, label: f }));

/** 选项顺序即展示顺序。group_only 只在填了团体名时才出现，见下面的 visibleOptions */
const VisibilityOptions = [
  {
    value: "named" as const,
    label: "公开 + 署名",
    description: "放上作品墙，显示署名和成员名单。",
  },
  {
    value: "group_only" as const,
    label: "公开 + 只显示社团／团队名",
    description: "放上作品墙，只挂着团体名，不列成员姓名。",
  },
  {
    value: "anonymous" as const,
    label: "公开 + 不署名",
    description: "放上作品墙，但署名和成员名单都不显示。",
  },
  {
    value: "hidden" as const,
    label: "不上墙",
    description: "作品只在周日现场使用，不放到公开网页上。",
  },
];

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
  demoFormat: "现场演示",
};

const formatSize = (bytes: number): string =>
  bytes >= 1024 * 1024
    ? `${(bytes / 1024 / 1024).toFixed(1)} MB`
    : `${Math.max(1, Math.round(bytes / 1024))} KB`;

const ProjectForm = () => {
  const [form, setForm] = useState<FormState>(initialState);
  const [files, setFiles] = useState<File[]>([]);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [progress, setProgress] = useState("");
  const [dragging, setDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
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
        copy.files = `这些文件超过 50MB，没有加入：${rejected.join("、")}。大文件建议改成放外链。`;
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

  // 没填团体名的（个人参加）不显示"只显示团体名"那一项 —— 选了也没东西可显示
  const hasGroupName = form.groupName.trim().length > 0;
  const visibleOptions = hasGroupName
    ? VisibilityOptions
    : VisibilityOptions.filter((option) => option.value !== "group_only");

  const validate = (): boolean => {
    const next: Record<string, string> = {};
    if (!form.name.trim()) next.name = "请填写姓名";
    if (!form.contact.trim()) {
      next.contact = "填报名时用的那个联系方式，用来确认这份作品是你交的";
    }
    if (!form.title.trim()) next.title = "请填写项目名";
    if (!form.summary.trim()) next.summary = "用一句话说清这个作品是做什么的";
    // 也要挡住"先选了只显示团体名、又把团体名清空"的情况
    if (
      form.wallVisibility === null ||
      !visibleOptions.some((option) => option.value === form.wallVisibility)
    ) {
      next.wallVisibility = "请选一项";
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
      setProgress("正在核对报名记录…");

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
        setProgress(`正在压缩并上传 ${files.length} 个文件…`);

        const estimated = await Promise.all(files.map((f) => compressImage(f)));
        const totalMb = estimated.reduce((sum, f) => sum + f.size, 0) / 1024 / 1024;
        setProgress(`正在上传 ${files.length} 个文件（约 ${totalMb.toFixed(1)}MB）…`);

        const stored = await uploadProjectFiles(projectId, files, (done, total) =>
          setProgress(`正在上传…… ${done}/${total}`)
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
        <legend className="px-2 text-xs tracking-widest text-acid">先确认这份作品是你交的</legend>
        <p className="text-xs leading-relaxed text-white/45">
          填你报名时用的姓名和联系方式，我们会去报名记录里核对。
          对不上就提交不了 —— 这样能防止别人往你的作品上乱加东西。
        </p>

        <div className="grid gap-[var(--s20)] sm:grid-cols-2">
          <TextField
            label="姓名"
            required
            placeholder="和报名时填的一致"
            value={form.name}
            error={errors.name}
            onChange={(e) => set("name", e.target.value)}
          />
          <TextField
            label="联系方式"
            required
            hint="报名时填的那个"
            placeholder="微信号或手机号"
            value={form.contact}
            error={errors.contact}
            onChange={(e) => set("contact", e.target.value)}
          />
        </div>
      </fieldset>

      {/* ---------- 项目信息 ---------- */}
      <div className="space-y-[var(--s20)]">
        <TextField
          label="项目名"
          required
          placeholder="给你的作品起个名字"
          value={form.title}
          error={errors.title}
          onChange={(e) => set("title", e.target.value)}
        />

        <TextAreaField
          label="一句话简介"
          required
          rows={2}
          placeholder="比如：帮社团找大家都有空的时间。"
          value={form.summary}
          error={errors.summary}
          onChange={(e) => set("summary", e.target.value)}
        />

        <TextAreaField
          label="你关注的问题"
          hint="选填"
          placeholder="什么问题，谁可能遇到它，为什么值得解决。"
          value={form.problem}
          onChange={(e) => set("problem", e.target.value)}
        />

        <div className="grid gap-[var(--s20)] sm:grid-cols-2">
          <TextField
            label="团队／社团"
            hint="选填"
            placeholder="个人参加可以留空"
            value={form.groupName}
            onChange={(e) => set("groupName", e.target.value)}
          />
          <TextField
            label="参与成员"
            hint="选填"
            placeholder="用逗号分开"
            value={form.members}
            onChange={(e) => set("members", e.target.value)}
          />
        </div>

        <TextField
          label="创作方向"
          hint="选填"
          placeholder="来自学习、个人生活、社团还是校园社区"
          value={form.direction}
          onChange={(e) => set("direction", e.target.value)}
        />
      </div>

      {/* ---------- 作品本体 ---------- */}
      <div className="space-y-[var(--s20)] border-t border-white/10 pt-[var(--s24)]">
        <TextField
          label="作品链接或入口"
          hint="选填，但强烈建议填"
          placeholder="https://…"
          value={form.link}
          onChange={(e) => set("link", e.target.value)}
        />

        <TextAreaField
          label="必要操作说明"
          hint="周日会交给另一队，他们要能自己打开"
          placeholder="怎么打开、需要装什么、第一步做什么、哪里容易卡住。"
          value={form.instructions}
          onChange={(e) => set("instructions", e.target.value)}
        />

        <TextField
          label="需要的设备或材料"
          hint="选填"
          placeholder="比如需要一台能联网的电脑、要投影、需要音箱。"
          value={form.equipmentNeeds}
          onChange={(e) => set("equipmentNeeds", e.target.value)}
        />

        <ChoiceRow
          label="打算怎么展示"
          options={demoOptions}
          value={form.demoFormat}
          onChange={(v) => set("demoFormat", v)}
        />
      </div>

      {/* ---------- 文件 ---------- */}
      <div className="space-y-[var(--s16)] border-t border-white/10 pt-[var(--s24)]">
        <div className="flex items-baseline gap-2 text-sm text-white/80">
          作品文件
          <span className="text-xs text-white/35">
            选填 · 单个文件不超过 50MB · 图片会自动压缩
          </span>
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
          <p className="text-sm text-white/60">
            把文件拖到这里，或者<span className="text-acid"> 点击选择</span>
          </p>
          <p className="mt-2 text-xs text-white/35">
            实体作品拍照片、本地作品录屏截图都可以。视频和特别大的文件建议直接放外链。
          </p>
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
                <span className="min-w-0 flex-1 truncate text-sm text-white/70">{file.name}</span>
                <span className="shrink-0 text-xs text-white/35">{formatSize(file.size)}</span>
                <button
                  type="button"
                  onClick={() => setFiles(files.filter((_, i) => i !== index))}
                  className="shrink-0 text-xs text-white/40 transition-colors hover:text-red-400"
                >
                  移除
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* ---------- 署名同意（必须明确选一次，不给默认值）---------- */}
      <fieldset className="space-y-[var(--s16)] border border-acid/25 bg-acid/[0.03] p-5">
        <legend className="px-2 text-xs tracking-widest text-acid">这件作品要不要公开</legend>
        <p className="text-xs leading-relaxed text-white/45">
          作品墙是公开网页，任何人都能看。
          <span className="text-white/70">这一项必须选，没有默认值</span>，
          选「不上墙」作品就只在周日现场使用。
          不管选哪个，你的联系方式都不会出现在作品墙上。
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

      <SubmitBlock
        state={state}
        message={message}
        label="提交作品"
        onRetry={handleReset}
      />
    </form>
  );
};

export default ProjectForm;
