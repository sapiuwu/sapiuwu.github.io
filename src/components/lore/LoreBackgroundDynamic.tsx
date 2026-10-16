"use client";

import dynamic from "next/dynamic";

const LoreBackgroundBase = dynamic(() => import("@/components/lore/LoreBackground"), {
  ssr: false,
});

export default function LoreBackground() {
  return <LoreBackgroundBase />;
}