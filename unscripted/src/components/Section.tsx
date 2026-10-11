import type { ReactNode } from "react";
import { motion } from "framer-motion";
import { RichText } from "../i18n/core";

interface SectionProps {
  index: string;
  title: string;
  /** 标题上方的小标签 */
  kicker?: string;
  children: ReactNode;
  /** 是否用分割线与其他区块隔开 */
  divided?: boolean;
}

/** 主页统一的区块容器：[ 序号 ] + 标题 + 内容 */
const Section = ({ index, title, kicker, children, divided = true }: SectionProps) => (
  <section className={divided ? "border-t border-white/10" : ""}>
    <div className="mx-auto max-w-screen-2xl px-5 py-[var(--s64)] sm:px-8 md:py-[var(--s96)] lg:px-12">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.5 }}
      >
        <div className="section-index">[ {index} ]</div>
        {kicker && (
          <div className="mt-3 text-xs tracking-[0.25em] text-white/50">{kicker}</div>
        )}
        <h2 className="mt-3 max-w-3xl text-3xl leading-tight text-white sm:text-4xl">
          {/* 标题里可能带 %%AI%% 这类标记，交给 RichText 解析 */}
          <RichText>{title}</RichText>
        </h2>
        <div className="mt-10">{children}</div>
      </motion.div>
    </div>
  </section>
);

export default Section;
