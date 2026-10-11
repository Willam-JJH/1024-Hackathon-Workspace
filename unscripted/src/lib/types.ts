/** 与 supabase/migrations/0001_init.sql 中的表结构对应 */

export type ParticipationType = "individual" | "team" | "club";

export const PARTICIPATION_LABEL: Record<ParticipationType, string> = {
  individual: "个人",
  team: "团队",
  club: "社团",
};

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
  contact: string | null;

  files: StoredFile[];

  /** 作者是否同意在公开作品墙上署名。null 表示未表态，按不署名处理。 */
  show_credit: boolean | null;

  participant_id: string | null;
}

/**
 * 公开作品墙上能看到的内容 —— 对应数据库里的 public_projects 视图。
 * 刻意不含 contact 等信息：视图只挑该公开的列。
 */
export interface PublicProject {
  id: string;
  title: string;
  summary: string;
  problem: string | null;
  direction: string | null;
  link: string | null;
  created_at: string;
  /** 作者同意署名时才有值，否则为 null */
  credit_name: string | null;
  members: string | null;
  /** 只含图片类文件 */
  images: StoredFile[];
}

/** 志愿者可选岗位 —— 来自 05 宣传文案里的四类工作 */
export const VOLUNTEER_ROLES = [
  "到场接待",
  "作品交换与展示",
  "布场与收场",
  "工具帮助",
] as const;

/** 作品演示形式 —— 来自活动构想"表达方式"一节 */
export const DEMO_FORMATS = [
  "现场演示",
  "图示",
  "短视频",
  "口头讲述",
] as const;
