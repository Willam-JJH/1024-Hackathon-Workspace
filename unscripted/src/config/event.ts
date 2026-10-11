/**
 * 活动信息的唯一来源。
 *
 * ⚠️ 筹备文档明确规定：尚未批准的日期、场地、CS Hour 及教师出席
 *    不能作为已确认信息发布。
 *
 * 所以这里把所有"待学校确认"的字段留空，页面上统一渲染成占位符（TBD）。
 * 学校一确认，只改这个文件，全站同步更新，不用去文案里翻。
 *
 * 确认某项之后，把值填上，并把 confirmed 里对应的开关打开。
 */

export type Maybe<T> = T | null;

export interface EventConfig {
  /** 活动名（暂定） */
  name: string;
  /** 所属活动 */
  parentEvent: string;
  /** 标语 */
  tagline: string;
  /** 一句话说明 */
  summary: string;

  /** 已确认的信息 */
  confirmed: {
    dates: boolean;
    venue: boolean;
    registrationDeadline: boolean;
    judges: boolean;
    awards: boolean;
  };

  /** 未确认前保持 null */
  dates: Maybe<{ day1: string; day2: string }>;
  venue: Maybe<string>;
  registrationDeadline: Maybe<string>;
  contact: Maybe<string>;
}

export const event: EventConfig = {
  name: "Unscripted",
  parentEvent: "1024 Challenge",
  tagline: "做自己的项目，讲别人的作品。",
  summary:
    "1024 Challenge 中的 AI 辅助创作活动。带一个想法来，或把做了一半的项目继续做下去。",

  confirmed: {
    dates: false,
    venue: false,
    registrationDeadline: false,
    judges: false,
    awards: false,
  },

  dates: null,
  venue: null,
  registrationDeadline: null,
  contact: null,
};

/** 占位符文案：信息未确认时显示 */
export const TBD = "待确认";

/** 取一个"已确认才显示"的值，否则回退到占位符 */
export function orTbd(value: string | null | undefined): string {
  return value?.trim() ? value : TBD;
}
