"use client";

import { useApp } from "@/components/providers";
import { lore, t } from "@/lib/content";

export default function LoreCard() {
  const { side, lang } = useApp();
  const data = lore[side];
  const isEngineer = side === "engineer";

  return (
    <div
      className="w-full max-w-2xl rounded-2xl border border-line bg-bg-card/70 p-5 text-left backdrop-blur-md"
      style={isEngineer ? { fontFamily: "var(--font-geist-mono), monospace" } : undefined}
    >
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-1.5">
          <span className="h-3 w-3 rounded-full bg-red-500/80" />
          <span className="h-3 w-3 rounded-full bg-yellow-500/80" />
          <span className="h-3 w-3 rounded-full bg-green-500/80" />
        </div>
        <p className="font-mono text-[10px] tracking-widest text-fg-muted uppercase">
          {isEngineer ? "term://core.world" : "ticker://market.live"}
        </p>
      </div>

      <div className="mt-4 flex flex-wrap items-baseline gap-x-2 gap-y-1">
        <span className="font-mono text-[11px] tracking-widest text-fg-muted">
          {t(data.chapter, lang)}
        </span>
        <h3 className="font-semibold" style={{ color: "var(--accent)" }}>
          {t(data.title, lang)}
        </h3>
      </div>

      <p className="mt-3 text-sm leading-relaxed text-fg-muted">{t(data.story, lang)}</p>

      <p
        className="mt-4 font-mono text-[11px]"
        style={{ color: "var(--accent)" }}
      >
        {t(data.system, lang)}
      </p>
    </div>
  );
}