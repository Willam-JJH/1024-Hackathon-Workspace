import { requireSupabase } from "./supabase";
import { compressImage } from "./imageCompress";
import { PUBLIC_PROJECT_COLUMNS } from "./types";
import type {
  Participant,
  ParticipantInsert,
  Project,
  PublicProject,
  StoredFile,
  Volunteer,
  VolunteerInsert,
  WallVisibility,
} from "./types";

/** 免费档 Supabase Storage 的单文件硬上限 */
export const MAX_FILE_BYTES = 50 * 1024 * 1024;
export const STORAGE_BUCKET = "project-files";

/* ------------------------------------------------------------ 提交 */

export async function submitParticipant(input: ParticipantInsert): Promise<void> {
  const { error } = await requireSupabase().from("participants").insert(input);
  if (error) throw new Error(friendlyError(error.message));
}

export async function submitVolunteer(input: VolunteerInsert): Promise<void> {
  const { error } = await requireSupabase().from("volunteers").insert(input);
  if (error) throw new Error(friendlyError(error.message));
}

/* --------------------------------------------------- 参赛作品（走 RPC） */

export interface ProjectInput {
  name: string;
  contact: string;
  title: string;
  summary: string;
  /** 作品墙可见性。必须明确选，不接受 undefined。 */
  wallVisibility: WallVisibility;
  problem: string | null;
  groupName: string | null;
  members: string | null;
  direction: string | null;
  link: string | null;
  instructions: string | null;
  equipmentNeeds: string | null;
  demoFormat: string | null;
}

/**
 * 提交作品。
 *
 * 不走直接 insert —— 匿名角色对 projects 没有写权限。
 * 归属核对在数据库的 submit_project() 里做，前端拿不到任何报名数据，
 * 只能知道"对不上"这个结论。
 *
 * @returns 作品的 uuid，用来给上传的文件分文件夹
 */
export async function submitProject(input: ProjectInput): Promise<string> {
  const { data, error } = await requireSupabase().rpc("submit_project", {
    p_name: input.name,
    p_contact: input.contact,
    p_title: input.title,
    p_summary: input.summary,
    p_wall_visibility: input.wallVisibility,
    p_problem: input.problem,
    p_group_name: input.groupName,
    p_members: input.members,
    p_direction: input.direction,
    p_link: input.link,
    p_instructions: input.instructions,
    p_equipment_needs: input.equipmentNeeds,
    p_demo_format: input.demoFormat,
  });

  if (error) throw new Error(friendlyError(error.message));
  return data as string;
}

/** 文件名里不能有路径分隔符，也不能太长 */
function safeFileName(name: string): string {
  const cleaned = name
    .replace(/[/\\]/g, "-")
    // eslint-disable-next-line no-control-regex
    .replace(/[\u0000-\u001f\u007f]/g, "")
    .replace(/\s+/g, "-")
    .trim();
  const shortened = cleaned.length > 80 ? cleaned.slice(-80) : cleaned;
  return shortened || "file";
}

/**
 * 把文件传到作品自己的文件夹里，返回文件清单。
 * 图片会先在浏览器端压缩。
 */
export async function uploadProjectFiles(
  projectId: string,
  files: File[],
  onProgress?: (done: number, total: number) => void
): Promise<StoredFile[]> {
  const client = requireSupabase();
  const stored: StoredFile[] = [];

  for (let i = 0; i < files.length; i++) {
    const original = files[i];
    const file = await compressImage(original);

    if (file.size > MAX_FILE_BYTES) {
      throw new Error(
        `「${original.name}」有 ${(file.size / 1024 / 1024).toFixed(1)}MB，超过了 50MB 的上限。大文件建议改成放外链。`
      );
    }

    const path = `${projectId}/${Date.now()}-${safeFileName(file.name)}`;

    const { error } = await client.storage.from(STORAGE_BUCKET).upload(path, file, {
      cacheControl: "31536000",
      upsert: false,
      contentType: file.type || "application/octet-stream",
    });

    if (error) throw new Error(friendlyError(error.message));

    stored.push({ path, name: file.name, size: file.size, type: file.type });
    onProgress?.(i + 1, files.length);
  }

  return stored;
}

/** 回填文件清单（同样要核对归属，防止往别人的作品里塞文件） */
export async function attachProjectFiles(
  projectId: string,
  name: string,
  contact: string,
  files: StoredFile[]
): Promise<void> {
  const { error } = await requireSupabase().rpc("attach_project_files", {
    p_project_id: projectId,
    p_name: name,
    p_contact: contact,
    p_files: files,
  });
  if (error) throw new Error(friendlyError(error.message));
}

/** 取文件的公开访问地址 */
export function publicFileUrl(path: string): string {
  const client = requireSupabase();
  return client.storage.from(STORAGE_BUCKET).getPublicUrl(path).data.publicUrl;
}

/* ------------------------------------------------------------ 读取（仅筹备组） */

export async function fetchParticipants(): Promise<Participant[]> {
  const { data, error } = await requireSupabase()
    .from("participants")
    .select("*")
    .order("created_at", { ascending: false });
  if (error) throw new Error(friendlyError(error.message));
  return (data ?? []) as Participant[];
}

export async function fetchVolunteers(): Promise<Volunteer[]> {
  const { data, error } = await requireSupabase()
    .from("volunteers")
    .select("*")
    .order("created_at", { ascending: false });
  if (error) throw new Error(friendlyError(error.message));
  return (data ?? []) as Volunteer[];
}

export async function fetchProjects(): Promise<Project[]> {
  const { data, error } = await requireSupabase()
    .from("projects")
    .select("*")
    .order("created_at", { ascending: false });
  if (error) throw new Error(friendlyError(error.message));
  return (data ?? []) as Project[];
}

/**
 * 公开作品墙的数据。
 *
 * 读的是 projects 表，但**必须显式列出列名** —— 匿名角色只有这几列的
 * select 权限，用 select=* 会被数据库拒绝。行范围由 RLS 策略限制在
 * 作者选了公开的作品上。
 */
export async function fetchPublicProjects(): Promise<PublicProject[]> {
  const { data, error } = await requireSupabase()
    .from("projects")
    .select(PUBLIC_PROJECT_COLUMNS)
    .order("created_at", { ascending: false });
  if (error) throw new Error(friendlyError(error.message));
  return (data ?? []) as unknown as PublicProject[];
}

/* ------------------------------------------------------------ 工具 */

/** 把数据库的错误信息翻成能看懂的话 */
function friendlyError(message: string): string {
  if (message.includes("NOT_REGISTERED")) {
    return "没有找到对应的报名记录。请确认姓名和联系方式和你报名时填的完全一致；如果还没报名，先去「报名」板块报个名。";
  }
  if (message.includes("NOT_OWNER")) {
    return "这份作品不是你提交的，无法修改。";
  }
  if (message.includes("NAME_OR_CONTACT_REQUIRED")) {
    return "请填写姓名和报名时用的联系方式，用来确认作品归属。";
  }
  if (message.includes("TITLE_OR_SUMMARY_REQUIRED")) {
    return "项目名和一句话简介都要填。";
  }
  if (message.includes("VISIBILITY_REQUIRED")) {
    return "请选择作品要不要公开、要不要署名。";
  }
  // 匿名身份查需要登录的表时会收到这个 —— 通常是登录态没带上或已失效
  if (/permission denied for table/i.test(message)) {
    return "没有读取权限。多半是登录状态失效了，请退出后重新登录；如果重新登录后仍然如此，说明这个账号还没被加入筹备组名单。";
  }
  if (/row-level security|violates row-level/i.test(message)) {
    return "提交被数据库策略拒绝，请检查填写内容是否完整。";
  }
  if (/duplicate key|already exists/i.test(message)) {
    return "同名文件已经传过了，换个文件名再试。";
  }
  if (/exceeded the maximum allowed size/i.test(message)) {
    return "文件超过 50MB 上限，大文件建议改成放外链。";
  }
  if (/bucket not found/i.test(message)) {
    return "存储还没初始化，请先在 Supabase 里执行建表 SQL。";
  }
  if (/failed to fetch|networkerror/i.test(message)) {
    return "网络连接失败，请检查网络后重试。";
  }
  return message;
}

// CSV 相关工具已拆到 ./csv（纯函数，不依赖 Supabase），这里转出去方便调用方少记一个路径
export { toCsv, downloadCsv } from "./csv";
