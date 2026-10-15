"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useApp } from "@/components/providers";
import Section, { SectionHeading } from "@/components/ui/Section";
import { experience, t } from "@/lib/content";

export default function Experience() {
  const { side, lang } = useApp();

  return (
    <Section id="experience" className="border-t border-line">
      <SectionHeading
        label="04 — Experience"
        title={lang === "id" ? "Perjalanan Karier" : "Career Journey"}
      />

      <AnimatePresence mode="wait">
        <motion.div
          key={side}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
          className="mt-12"
        >
          <ol className="relative space-y-8 border-l-2 border-line pl-8">
            {experience[side].map((item, i) => (
              <motion.li
                key={item.company}
                initial={{ opacity: 0, x: -16 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.4, delay: i * 0.1 }}
                className="relative"
              >
                <span
                  className="absolute -left-[41px] top-1.5 h-4 w-4 rounded-full border-2"
                  style={{
                    borderColor: "var(--accent)",
                    background: i === 0 ? "var(--accent)" : "var(--bg)",
                  }}
                />
                <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
                  <h3 className="text-lg font-semibold">{t(item.role, lang)}</h3>
                  <span className="font-mono text-xs text-fg-muted">{t(item.period, lang)}</span>
                </div>
                <p className="mt-0.5 text-sm font-medium text-accent">{item.company}</p>
                <p className="mt-2 max-w-2xl text-sm leading-relaxed text-fg-muted">
                  {t(item.description, lang)}
                </p>
              </motion.li>
            ))}
          </ol>
        </motion.div>
      </AnimatePresence>
    </Section>
  );
}
