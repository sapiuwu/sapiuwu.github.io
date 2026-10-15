"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useApp } from "@/components/providers";
import SideToggle from "@/components/SideToggle";
import { hero, t } from "@/lib/content";

const fade = {
  initial: { opacity: 0, y: 24 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -24 },
  transition: { duration: 0.4, ease: [0.22, 1, 0.36, 1] as const },
};

export default function Hero() {
  const { side, lang } = useApp();
  const data = hero[side];

  return (
    <section id="top" className="relative overflow-hidden pt-32 pb-20">
      <div className="grid-bg pointer-events-none absolute inset-0" aria-hidden />
      <div
        className="pointer-events-none absolute -top-40 left-1/2 h-[480px] w-[720px] -translate-x-1/2 rounded-full blur-3xl"
        style={{ background: "var(--accent-soft)" }}
        aria-hidden
      />

      <div className="relative mx-auto flex max-w-6xl flex-col items-center px-5 text-center">
        <SideToggle />

        <AnimatePresence mode="wait">
          <motion.div key={side} {...fade} className="mt-14 flex flex-col items-center">
            <p className="text-lg text-fg-muted">{t(data.greeting, lang)}</p>
            <h1 className="mt-2 text-5xl font-bold tracking-tight sm:text-7xl">Wahyu Pratama</h1>
            <h2
              className="mt-3 text-2xl font-semibold sm:text-3xl"
              style={{ color: "var(--accent)" }}
            >
              {t(data.subtitle, lang)}
            </h2>
            <p className="mt-6 max-w-2xl text-base leading-relaxed text-fg-muted sm:text-lg">
              {t(data.description, lang)}
            </p>

            <div className="mt-9 flex flex-wrap items-center justify-center gap-4">
              <a
                href="#projects"
                className="rounded-full bg-accent px-7 py-3 text-sm font-semibold text-bg transition-transform hover:scale-105"
              >
                {t(data.ctaPrimary, lang)}
              </a>
              <a
                href="#contact"
                className="rounded-full border border-line px-7 py-3 text-sm font-semibold text-fg transition-colors hover:border-accent hover:text-accent"
              >
                {t(data.ctaSecondary, lang)}
              </a>
            </div>

            <div className="mt-14 grid w-full max-w-2xl grid-cols-3 gap-4">
              {data.stats.map((stat) => (
                <div
                  key={stat.value + stat.label.id}
                  className="rounded-2xl border border-line bg-bg-card p-4 sm:p-5"
                >
                  <div className="text-2xl font-bold sm:text-3xl" style={{ color: "var(--accent)" }}>
                    {stat.value}
                  </div>
                  <div className="mt-1 text-xs text-fg-muted sm:text-sm">{t(stat.label, lang)}</div>
                </div>
              ))}
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  );
}
