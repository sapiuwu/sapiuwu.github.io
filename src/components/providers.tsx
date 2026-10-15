"use client";

import { createContext, useContext, useEffect, type ReactNode } from "react";
import { ThemeProvider as NextThemesProvider } from "next-themes";
import { useStoredState } from "@/lib/store";
import type { Lang, Side } from "@/lib/types";

interface AppState {
  side: Side;
  setSide: (side: Side) => void;
  lang: Lang;
  setLang: (lang: Lang) => void;
}

const AppContext = createContext<AppState | null>(null);

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useApp must be used within AppProvider");
  return ctx;
}

const isSide = (value: string): value is Side => value === "engineer" || value === "analyst";
const isLang = (value: string): value is Lang => value === "id" || value === "en";

export function Providers({ children }: { children: ReactNode }) {
  const [side, setSide] = useStoredState<Side>("portfolio-side", "engineer", isSide);
  const [lang, setLang] = useStoredState<Lang>("portfolio-lang", "id", isLang);

  useEffect(() => {
    document.documentElement.dataset.side = side;
  }, [side]);

  useEffect(() => {
    document.documentElement.lang = lang;
  }, [lang]);

  return (
    <NextThemesProvider attribute="class" defaultTheme="dark" enableSystem={false}>
      <AppContext.Provider value={{ side, setSide, lang, setLang }}>
        {children}
      </AppContext.Provider>
    </NextThemesProvider>
  );
}
