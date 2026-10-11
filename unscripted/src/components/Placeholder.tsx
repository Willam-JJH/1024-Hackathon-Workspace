import { motion } from "framer-motion";
import type { ReactNode } from "react";

interface PlaceholderProps {
  index: string;
  title: string;
  description: string;
  /** 这个板块计划包含的内容 */
  bulletPoints: string[];
  children?: ReactNode;
}

/** 尚未开工的板块占位页 */
const Placeholder = ({ index, title, description, bulletPoints, children }: PlaceholderProps) => (
  <div className="mx-auto max-w-screen-2xl px-5 py-[var(--s80)] sm:px-8 lg:px-12">
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="max-w-2xl"
    >
      <div className="section-index">[ {index} ]</div>
      <h1 className="mt-4 text-4xl text-white">{title}</h1>
      <p className="mt-4 text-base leading-relaxed text-white/60">{description}</p>

      <div className="mt-10 border border-dashed border-acid/30 p-6">
        <div className="text-xs tracking-widest text-acid/70">待建设 · 计划包含</div>
        <ul className="mt-4 space-y-3">
          {bulletPoints.map((point) => (
            <li key={point} className="flex gap-3 text-sm text-white/60">
              <span className="mt-1.5 h-1 w-1 shrink-0 bg-acid" />
              <span>{point}</span>
            </li>
          ))}
        </ul>
      </div>

      {children}
    </motion.div>
  </div>
);

export default Placeholder;
