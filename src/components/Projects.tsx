"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useApp } from "@/components/providers";
import Section, { SectionHeading } from "@/components/ui/Section";
import { projects, t } from "@/lib/content";

export default function Projects() {
  const { side, lang } = useApp();

  return (
    <Section id="projects" className="border-t border-line">
      <SectionHeading
        label="03 — Projects"
        title={lang === "id" ? "Proyek Unggulan" : "Featured Projects"}
        description={
          side === "engineer"
            ? lang === "id"
              ? "Beberapa produk dan proyek yang pernah saya bangun."
              : "Some of the products and projects I've built."
            : lang === "id"
              ? "Riset, model, dan strategi yang pernah saya susun."
              : "Research, models, and strategies I've produced."
        }
      />

      <AnimatePresence mode="wait">
        <motion.div
          key={side}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
          className="mt-12 grid gap-6 sm:grid-cols-2"
        >
          {projects[side].map((project, i) => (
            <motion.a
              key={project.title.id}
              href={project.link}
              target="_blank"
              rel="noreferrer"
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: i * 0.08, ease: [0.22, 1, 0.36, 1] }}
              className="group relative flex flex-col overflow-hidden rounded-2xl border border-line bg-bg-card p-6 transition-all duration-300 hover:-translate-y-1 hover:border-accent/60"
            >
              <div
                className="absolute inset-x-0 top-0 h-px opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                style={{ background: "var(--accent)" }}
              />
              <div className="flex items-start justify-between gap-4">
                <h3 className="text-lg font-semibold transition-colors group-hover:text-accent">
                  {t(project.title, lang)}
                </h3>
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="mt-1 shrink-0 text-fg-muted transition-all group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-accent"
                >
                  <path d="M7 17 17 7M7 7h10v10" />
                </svg>
              </div>
              <p className="mt-3 flex-1 text-sm leading-relaxed text-fg-muted">
                {t(project.description, lang)}
              </p>
              <div className="mt-5 flex flex-wrap gap-2">
                {project.tags.map((tag) => (
                  <span
                    key={tag}
                    className="rounded-full border border-line bg-accent-soft px-2.5 py-1 font-mono text-[11px] text-fg-muted"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </motion.a>
          ))}
        </motion.div>
      </AnimatePresence>
    </Section>
  );
}