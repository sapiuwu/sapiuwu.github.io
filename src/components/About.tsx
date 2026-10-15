"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useApp } from "@/components/providers";
import Section, { Reveal, SectionHeading } from "@/components/ui/Section";
import { about, sideLabels, t } from "@/lib/content";

export default function About() {
  const { side, lang } = useApp();
  const data = about[side];

  return (
    <Section id="about" className="border-t border-line">
      <SectionHeading label="01 — About" title={t(sideLabels[side], lang)} />

      <AnimatePresence mode="wait">
        <motion.div
          key={side}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
          className="mt-10 grid gap-8 md:grid-cols-[1.4fr_1fr]"
        >
          <div className="space-y-5">
            {data.paragraphs.map((p, i) => (
              <p key={i} className="leading-relaxed text-fg-muted">
                {t(p, lang)}
              </p>
            ))}
          </div>

          <div className="rounded-2xl border border-line bg-bg-card p-6">
            <div className="text-sm font-semibold tracking-widest uppercase text-fg-muted">
              {lang === "id" ? "Sedang fokus" : "Currently focused on"}
            </div>
            <ul className="mt-4 space-y-3 text-sm">
              {(side === "engineer"
                ? lang === "id"
                  ? ["Sistem desain & komponen yang dapat digunakan ulang", "Performa web & Core Web Vitals", "Arsitektur serverless & edge computing"]
                  : ["Design systems & reusable components", "Web performance & Core Web Vitals", "Serverless & edge computing architecture"]
                : lang === "id"
                  ? ["Riset ekuitas Indonesia (IDX)", "Model valuasi DCF & relative valuation", "Manajemen risiko portofolio"]
                  : ["Indonesian equity research (IDX)", "DCF & relative valuation models", "Portfolio risk management"]
              ).map((item) => (
                <Reveal key={item} delay={0.05}>
                  <li className="flex items-start gap-2.5 text-fg-muted">
                    <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-accent" />
                    {item}
                  </li>
                </Reveal>
              ))}
            </ul>
          </div>
        </motion.div>
      </AnimatePresence>
    </Section>
  );
}
