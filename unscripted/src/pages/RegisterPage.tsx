import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import ParticipantForm from "../components/form/ParticipantForm";
import VolunteerForm from "../components/form/VolunteerForm";
import NotConfigured from "../components/NotConfigured";

type Role = "participant" | "volunteer";

const ROLES: { value: Role; label: string; blurb: string }[] = [
  {
    value: "participant",
    label: "我要参加",
    blurb: "带着想法或已有项目来做作品，周日交换体验、上台 pitch。",
  },
  {
    value: "volunteer",
    label: "我要做志愿者",
    blurb: "到场接待、准备作品交换、布场收场、工具帮助，按你能来的时段排班。",
  },
];

const RegisterPage = () => {
  const [role, setRole] = useState<Role>("participant");
  const active = ROLES.find((r) => r.value === role)!;

  return (
    <div className="mx-auto max-w-screen-2xl px-5 py-[var(--s48)] sm:px-8 lg:px-12">
      <div className="max-w-3xl">
        <div className="section-index">[ 02 ]</div>
        <h1 className="mt-4 text-4xl text-white">报名</h1>
        <p className="mt-4 text-base leading-relaxed text-white/60">
          只有一个想法也可以报名，已有项目可以继续做。写下你的创作方向、参加成员和两天
          可来的时段，设备或工具需求也一并告诉我们。
        </p>
      </div>

      {/* 身份切换 */}
      <div className="mt-10 flex flex-wrap gap-3">
        {ROLES.map((item) => {
          const isActive = item.value === role;
          return (
            <button
              key={item.value}
              type="button"
              onClick={() => setRole(item.value)}
              className={`border px-5 py-3 text-sm tracking-wider transition-colors ${
                isActive
                  ? "border-acid bg-acid/15 text-acid"
                  : "border-white/20 text-white/60 hover:border-white/40 hover:text-white"
              }`}
            >
              {item.label}
            </button>
          );
        })}
      </div>

      <p className="mt-4 text-sm text-white/45">{active.blurb}</p>

      <div className="mt-10 max-w-3xl">
        <NotConfigured />

        <AnimatePresence mode="wait">
          <motion.div
            key={role}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2 }}
          >
            {role === "participant" ? <ParticipantForm /> : <VolunteerForm />}
          </motion.div>
        </AnimatePresence>
      </div>

      <p className="mt-10 max-w-3xl text-xs leading-relaxed text-white/30">
        你填写的信息只有筹备组成员登录后可以查看，不会公开展示。活动日期、场地与时段
        以学校确认为准，确定后会通过你留下的联系方式通知。
      </p>
    </div>
  );
};

export default RegisterPage;
