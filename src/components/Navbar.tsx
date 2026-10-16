"use client";

import { useEffect, useState } from "react";
import { useTheme } from "next-themes";
import { useApp } from "@/components/providers";
import { NAME, cv, nav, t } from "@/lib/content";

const links = ["about", "skills", "projects", "experience", "contact"] as const;

export default function Navbar() {
  const { lang, setLang } = useApp();
  const { setTheme, theme } = useTheme();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-bg/80 backdrop-blur-md border-b border-line"
          : "border-b border-transparent"
      }`}
    >
      <nav className="mx-auto flex h-16 max-w-6xl items-center justify-between px-5">
        <a href="#top" className="flex items-center gap-2.5 font-semibold tracking-tight">
          <span className="grid h-8 w-8 place-items-center rounded-lg bg-accent text-sm font-bold text-bg">
            {NAME.split(" ").map((w) => w[0]).join("")}
          </span>
          <span className="hidden sm:inline">{NAME}</span>
        </a>

        <div className="hidden items-center gap-1 md:flex">
          {links.map((key) => (
            <a
              key={key}
              href={`#${key}`}
              className="rounded-lg px-3 py-2 text-sm text-fg-muted transition-colors hover:bg-accent-soft hover:text-accent"
            >
              {t(nav[key], lang)}
            </a>
          ))}
          <a
            href={cv.file}
            download
            className="ml-2 flex items-center gap-1.5 rounded-lg border border-line bg-bg-card px-3 py-2 text-sm font-medium text-fg-muted transition-colors hover:border-accent hover:text-accent"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 3v12M7 10l5 5 5-5M5 21h14" />
            </svg>
            {t(cv.label, lang)}
          </a>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex items-center rounded-lg border border-line bg-bg-card p-0.5 text-xs font-medium">
            {(["id", "en"] as const).map((l) => (
              <button
                key={l}
                onClick={() => setLang(l)}
                className={`rounded-md px-2.5 py-1.5 uppercase transition-colors ${
                  lang === l ? "bg-accent text-bg" : "text-fg-muted hover:text-fg"
                }`}
                aria-label={l === "id" ? "Bahasa Indonesia" : "English"}
              >
                {l}
              </button>
            ))}
          </div>

          <button
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            className="grid h-9 w-9 place-items-center rounded-lg border border-line bg-bg-card text-fg-muted transition-colors hover:text-accent"
            aria-label="Toggle theme"
          >
            <svg
              className="hidden dark:block"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
            >
              <circle cx="12" cy="12" r="4" />
              <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41" />
            </svg>
            <svg
              className="block dark:hidden"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
            </svg>
          </button>

          <button
            onClick={() => setOpen(!open)}
            className="grid h-9 w-9 place-items-center rounded-lg border border-line bg-bg-card text-fg-muted md:hidden"
            aria-label="Menu"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              {open ? <path d="M18 6 6 18M6 6l12 12" /> : <path d="M3 6h18M3 12h18M3 18h18" />}
            </svg>
          </button>
        </div>
      </nav>

      {open && (
        <div className="border-t border-line bg-bg/95 backdrop-blur-md md:hidden">
          <div className="mx-auto flex max-w-6xl flex-col px-5 py-3">
            {links.map((key) => (
              <a
                key={key}
                href={`#${key}`}
                onClick={() => setOpen(false)}
                className="rounded-lg px-3 py-2.5 text-sm text-fg-muted transition-colors hover:bg-accent-soft hover:text-accent"
              >
                {t(nav[key], lang)}
              </a>
            ))}
            <a
              href={cv.file}
              download
              onClick={() => setOpen(false)}
              className="flex items-center gap-1.5 rounded-lg px-3 py-2.5 text-sm font-medium text-fg-muted transition-colors hover:bg-accent-soft hover:text-accent"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 3v12M7 10l5 5 5-5M5 21h14" />
              </svg>
              {t(cv.label, lang)}
            </a>
          </div>
        </div>
      )}
    </header>
  );
}
