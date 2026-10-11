import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import ParticipantForm from "../components/form/ParticipantForm";
import VolunteerForm from "../components/form/VolunteerForm";
import NotConfigured from "../components/NotConfigured";
import { useT } from "../i18n/core";

type Role = "participant" | "volunteer";

const ROLE_VALUES: Role[] = ["participant", "volunteer"];

const RegisterPage = () => {
  const t = useT();
  const p = t.pages.register;
  const [role, setRole] = useState<Role>("participant");

  return (
    <div className="mx-auto max-w-screen-2xl px-5 py-[var(--s48)] sm:px-8 lg:px-12">
      <div className="max-w-3xl">
        <div className="section-index">{p.index}</div>
        <h1 className="mt-4 text-4xl text-white">{p.title}</h1>
        <p className="mt-4 text-base leading-relaxed text-white/75">{p.intro}</p>
      </div>

      {/* 身份切换 */}
      <div className="mt-10 flex flex-wrap gap-3">
        {ROLE_VALUES.map((value) => {
          const isActive = value === role;
          return (
            <button
              key={value}
              type="button"
              onClick={() => setRole(value)}
              className={`border px-5 py-3 text-sm tracking-wider transition-colors ${
                isActive
                  ? "border-acid bg-acid/15 text-acid"
                  : "border-white/20 text-white/75 hover:border-white/40 hover:text-white"
              }`}
            >
              {p.roles[value].label}
            </button>
          );
        })}
      </div>

      <p className="mt-4 text-sm text-white/60">{p.roles[role].blurb}</p>

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

      <p className="mt-10 max-w-3xl text-xs leading-relaxed text-white/45">{p.privacy}</p>
    </div>
  );
};

export default RegisterPage;
