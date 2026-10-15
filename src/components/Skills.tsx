"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useApp } from "@/components/providers";
import Section, { SectionHeading } from "@/components/ui/Section";
import { skills, t } from "@/lib/content";

export default function Skills() {
  const { side, lang } = useApp();

  return (
    <Section id="skills" className="border-t border-line">
      <SectionHeading
        label="02 — Skills"
        title={lang === "id" ? "Keahlian & Tools" : "Skills & Tools"}
        description={
          lang === "id"
            ? "Teknologi dan kompetensi yang saya gunakan sehari-hari di sisi ini."
            : "Technologies and competencies I use daily on this side."
        }
      />

      <AnimatePresence mode="wait">
        <motion.div
          key={side}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
          className="mt-12 grid gap-6 md:grid-cols-3"
        >
          {skills[side].map((group) => (
            <div
              key={group.title.id}
              className="rounded-2xl border border-line bg-bg-card p-6 transition-colors hover:border-accent/50"
            >
              <h3 className="font-semibold">{t(group.title, lang)}</h3>
              <div className="mt-5 space-y-4">
                {group.items.map((item, i) => (
                  <div key={item.name}>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-fg-muted">{item.name}</span>
                      <span className="font-mono text-xs text-fg-muted">{item.level}%</span>
                    </div>
                    <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-line">
                      <motion.div
                        className="h-full rounded-full"
                        style={{ background: "var(--accent)" }}
                        initial={{ width: 0 }}
                        animate={{ width: `${item.level}%` }}
                        transition={{ duration: 0.9, delay: 0.1 + i * 0.08, ease: [0.22, 1, 0.36, 1] }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </motion.div>
      </AnimatePresence>
    </Section>
  );
}
