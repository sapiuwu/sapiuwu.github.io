"use client";

import dynamic from "next/dynamic";
import { useApp } from "@/components/providers";
import Section, { SectionHeading } from "@/components/ui/Section";
import { projects } from "@/lib/content";

const ProjectStack = dynamic(() => import("@/components/three/ProjectStack"), {
  ssr: false,
  loading: () => (
    <div className="grid h-[420px] w-full place-items-center rounded-3xl border border-line bg-bg-card grid-bg sm:h-[520px] lg:h-[560px]">
      <p className="font-mono text-sm text-fg-muted">LOADING BLUEPRINT…</p>
    </div>
  ),
});

export default function Projects() {
  const { side, lang } = useApp();
  const list = projects[side];

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

      <div className="mt-12">
        <ProjectStack key={side} projects={list} lang={lang} />
        <p className="mt-4 text-center text-xs text-fg-muted">
          {lang === "id"
            ? "Geser kertas untuk berpindah proyek · klik untuk membuka"
            : "Swipe the paper to browse projects · click to open"}
        </p>
      </div>
    </Section>
  );
}
