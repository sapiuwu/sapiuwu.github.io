"use client";

import { useState, type FormEvent } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useApp } from "@/components/providers";
import Section, { SectionHeading } from "@/components/ui/Section";
import { contact, t } from "@/lib/content";

const socials = [
  { label: "GitHub", href: "https://github.com", icon: "M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.4 5.4 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" },
  { label: "LinkedIn", href: "https://linkedin.com", icon: "M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-4 0v7h-4v-7a6 6 0 0 1 6-6zM2 9h4v12H2zM4 2a2 2 0 1 1 0 4 2 2 0 0 1 0-4z" },
  { label: "Email", href: "mailto:hello@example.com", icon: "M4 4h16a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2zM22 6l-10 7L2 6" },
];

export default function Contact() {
  const { lang } = useApp();
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");

  const inputClass =
    "w-full rounded-xl border border-line bg-bg-card px-4 py-3 text-sm text-fg placeholder:text-fg-muted focus:border-accent focus:outline-none transition-colors";

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const data = new FormData(form);
    const name = String(data.get("name") ?? "").trim();
    const email = String(data.get("email") ?? "").trim();
    const message = String(data.get("message") ?? "").trim();

    if (!name || !email || !message) {
      setErrorMsg(t(contact.required, lang));
      setStatus("error");
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setErrorMsg(t(contact.invalidEmail, lang));
      setStatus("error");
      return;
    }

    setStatus("success");
    form.reset();
    setTimeout(() => setStatus("idle"), 5000);
  }

  return (
    <Section id="contact" className="border-t border-line">
      <SectionHeading
        label="05 — Contact"
        title={t(contact.title, lang)}
        description={t(contact.description, lang)}
      />

      <div className="mt-12 grid gap-10 md:grid-cols-[1fr_1.2fr]">
        <RevealCard lang={lang} />

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="name" className="mb-1.5 block text-sm text-fg-muted">
              {t(contact.name, lang)}
            </label>
            <input id="name" name="name" type="text" className={inputClass} placeholder="Jane Doe" />
          </div>
          <div>
            <label htmlFor="email" className="mb-1.5 block text-sm text-fg-muted">
              {t(contact.email, lang)}
            </label>
            <input
              id="email"
              name="email"
              type="email"
              className={inputClass}
              placeholder="jane@company.com"
            />
          </div>
          <div>
            <label htmlFor="message" className="mb-1.5 block text-sm text-fg-muted">
              {t(contact.message, lang)}
            </label>
            <textarea id="message" name="message" rows={5} className={inputClass} placeholder="..." />
          </div>

          <AnimatePresence>
            {status !== "idle" && (
              <motion.p
                initial={{ opacity: 0, y: -6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className={`text-sm ${status === "success" ? "text-accent" : "text-red-500"}`}
                role="status"
              >
                {status === "success" ? t(contact.success, lang) : errorMsg}
              </motion.p>
            )}
          </AnimatePresence>

          <button
            type="submit"
            className="w-full rounded-xl bg-accent px-6 py-3.5 text-sm font-semibold text-bg transition-transform hover:scale-[1.02] sm:w-auto"
          >
            {t(contact.submit, lang)}
          </button>
        </form>
      </div>
    </Section>
  );
}

function RevealCard({ lang }: { lang: "id" | "en" }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.5 }}
      className="flex h-full flex-col justify-between rounded-2xl border border-line bg-bg-card p-6"
    >
      <div>
        <p className="text-sm leading-relaxed text-fg-muted">
          {lang === "id"
            ? "Selain formulir, Anda juga bisa menghubungi saya langsung melalui kanal berikut:"
            : "Besides the form, you can also reach me directly through these channels:"}
        </p>
        <div className="mt-6 space-y-3">
          {socials.map((s) => (
            <a
              key={s.label}
              href={s.href}
              target={s.href.startsWith("mailto") ? undefined : "_blank"}
              rel="noreferrer"
              className="flex items-center gap-3 rounded-xl border border-line px-4 py-3 text-sm text-fg-muted transition-all hover:-translate-y-0.5 hover:border-accent/60 hover:text-accent"
            >
              <svg
                width="17"
                height="17"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d={s.icon} />
              </svg>
              {s.label}
            </a>
          ))}
        </div>
      </div>
      <p className="mt-8 font-mono text-xs text-fg-muted">
        {lang === "id" ? "Waktu respon rata-rata: < 24 jam" : "Average response time: < 24 hrs"}
      </p>
    </motion.div>
  );
}
