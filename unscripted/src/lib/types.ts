/** 与 supabase/migrations/0001_init.sql 中的表结构对应 */

/**
 * 身份、可见性、岗位、演示形式这几组值都**以稳定的英文键存进数据库**，
 * 显示名放在词典里（zh.ts / en.ts 的 enums 段）。
 *
 * 早先版本直接存中文显示串，加英文之后就不成立了 ——
 * 英文用户选 "Reception" 会往库里写"到场接待"，看板上就成了中英混杂。
 */
export type ParticipationType = "individual" | "team" | "club";

export interface Participant {
  id: string;
  created_at: string;

  name: string;
  contact: string;
  email: string | null;

  participation_type: ParticipationType;
  group_name: string | null;
  member_count: number | null;

  direction: string;
  has_existing: boolean;
  existing_detail: string | null;

  day1_available: boolean;
  day2_available: boolean;
  time_note: string | null;

  equipment_needs: string | null;
  notes: string | null;
}

export type ParticipantInsert = Omit<Participant, "id" | "created_at">;

export interface Volunteer {
  id: string;
  created_at: string;

  name: string;
  contact: string;
  email: string | null;

  roles: string[];
  day1_available: boolean;
  day2_available: boolean;
  time_note: string | null;

  experience: string | null;
  notes: string | null;
}

export type VolunteerInsert = Omit<Volunteer, "id" | "created_at">;

export interface StoredFile {
  path: string;
  name: string;
  size: number;
  type: string;
}

export interface Project {
  id: string;
  created_at: string;
  updated_at: string;

  title: string;
  summary: string;
  problem: string | null;

  group_name: string | null;
  members: string | null;
  direction: string | null;

  link: string | null;
  instructions: string | null;
  equipment_needs: string | null;
  demo_format: string | null;
  category: Category;
  video_url: string | null;
  contact: string | null;

  files: StoredFile[];

  /** 作者选的作品墙可见性。null 表示未表态（早期数据），按 hidden 处理。 */
  wall_visibility: WallVisibility | null;

  participant_id: string | null;
}

/**
 * 作品在公开作品墙上的可见性 —— 由作者提交时自己选。
 * group_only 是单独一档：团体名是组织标识，个人姓名是个人信息，分量不同。
 */
export type WallVisibility = "named" | "group_only" | "anonymous" | "hidden";

/** 作品墙可见性的四种取值，顺序即展示顺序 */
export const WALL_VISIBILITY_VALUES = [
  "named",
  "group_only",
  "anonymous",
  "hidden",
] as const satisfies readonly WallVisibility[];

/**
 * 公开作品墙上能看到的内容。
 *
 * 字段名和数据库里被授权给匿名的那几个列一一对应 —— 见
 * supabase/migrations/0001_init.sql 的列级授权。
 * 刻意不含 contact、files、participant_id：匿名角色对那几列连读权限都没有。
 */
export interface PublicProject {
  id: string;
  title: string;
  summary: string;
  problem: string | null;
  direction: string | null;
  link: string | null;
  created_at: string;
  category: Category;
  /** 署名行：团体名，或个人姓名；null 表示不署名 */
  credit_display: string | null;
  /** 成员名单；null 表示不显示 */
  members_display: string | null;
  /** 社团/团队名（仅公开可见时非空），用于筛选 */
  group_display: string | null;
  /** 只含图片类文件 */
  public_images: StoredFile[];
  /** 只含视频类文件 */
  public_videos: StoredFile[];
  /** 演示视频外链 */
  video_url: string | null;
  /** 操作说明（下载运行需要） */
  instructions: string | null;
  /** 设备需求（下载运行需要） */
  equipment_needs: string | null;
}

/** 匿名角色被授权读取的列。改这里之前先改数据库的列级授权。 */
export const PUBLIC_PROJECT_COLUMNS = [
  "id",
  "title",
  "summary",
  "problem",
  "direction",
  "link",
  "created_at",
  "category",
  "group_display",
  "credit_display",
  "members_display",
  "public_images",
  "public_videos",
  "video_url",
  "instructions",
  "equipment_needs",
].join(",");

/** 志愿者可选岗位 —— 来自 05 宣传文案里的四类工作 */
export const VOLUNTEER_ROLES = ["reception", "swap", "setup", "tools"] as const;
export type VolunteerRole = (typeof VOLUNTEER_ROLES)[number];

/** 作品演示形式 —— 来自活动构想"表达方式"一节 */
export const DEMO_FORMATS = ["live", "diagram", "video", "spoken"] as const;
export type DemoFormat = (typeof DEMO_FORMATS)[number];

/** 作品类型 —— 用于作品墙筛选，提交时必填 */
export type Category = "website" | "tool" | "game" | "interactive" | "other";
export const CATEGORY_VALUES = [
  "website",
  "tool",
  "game",
  "interactive",
  "other",
] as const satisfies readonly Category[];

export const PARTICIPATION_VALUES = [
  "individual",
  "team",
  "club",
] as const satisfies readonly ParticipationType[];
