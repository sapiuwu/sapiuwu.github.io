"use client";

import { useApp } from "@/components/providers";
import { footer, NAME, sideLabels, t } from "@/lib/content";

export default function Footer({ year }: { year: number }) {
  const { side, lang } = useApp();

  return (
    <footer className="relative z-10 border-t border-line">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-5 py-8 sm:flex-row">
        <div className="text-sm text-fg-muted">
          © {year} {NAME} — {t(footer.rights, lang)}
        </div>
        <div className="flex items-center gap-3 text-xs text-fg-muted">
          <span className="flex items-center gap-1.5">
            <span className="h-1.5 w-1.5 rounded-full bg-accent" />
            {t(sideLabels[side], lang)}
          </span>
          <span className="hidden sm:inline">·</span>
          <span className="hidden sm:inline">{t(footer.built, lang)}</span>
        </div>
      </div>
    </footer>
  );
}
