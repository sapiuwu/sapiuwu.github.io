"use client";

import { motion } from "framer-motion";
import { useApp } from "@/components/providers";
import { sideLabels, sideToggleHint, t } from "@/lib/content";
import type { Side } from "@/lib/types";

const sides: Side[] = ["engineer", "analyst"];

export default function SideToggle() {
  const { side, setSide, lang } = useApp();

  return (
    <div className="flex flex-col items-center gap-3">
      <p className="text-xs tracking-wide text-fg-muted uppercase">{t(sideToggleHint, lang)}</p>
      <div className="relative flex rounded-full border border-line bg-bg-card p-1 shadow-sm">
        {sides.map((s) => (
          <button
            key={s}
            onClick={() => setSide(s)}
            className={`relative z-10 rounded-full px-5 py-2 text-sm font-medium transition-colors duration-300 sm:px-7 ${
              side === s ? "text-bg" : "text-fg-muted hover:text-fg"
            }`}
            aria-pressed={side === s}
          >
            {side === s && (
              <motion.span
                layoutId="side-pill"
                className="absolute inset-0 -z-10 rounded-full bg-accent"
                transition={{ type: "spring", stiffness: 400, damping: 32 }}
              />
            )}
            <span className="whitespace-nowrap">{t(sideLabels[s], lang)}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
