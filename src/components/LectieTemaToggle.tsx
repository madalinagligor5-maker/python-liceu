"use client";

import { useState } from "react";

export default function LectieTemaToggle({
  onToggle,
}: {
  onToggle?: (isDark: boolean) => void;
}) {
  const [isDark, setIsDark] = useState(() => {
    if (typeof window === "undefined") return false;
    return localStorage.getItem("academia_lectie_tema") === "dark";
  });

  const comuta = () => {
    const nouaStare = !isDark;
    setIsDark(nouaStare);
    localStorage.setItem("academia_lectie_tema", nouaStare ? "dark" : "light");
    if (onToggle) onToggle(nouaStare);
  };

  return (
    <button
      onClick={comuta}
      className={`flex items-center gap-1.5 rounded-xl border px-3 py-1.5 text-xs font-extrabold transition shadow-xs ${
        isDark
          ? "border-indigo-500/50 bg-[#1E1E2E] text-amber-300 hover:bg-[#2A2A3C]"
          : "border-slate-300 bg-white text-slate-700 hover:bg-slate-50"
      }`}
      aria-label="Comută modul întunecat de lectură"
      title="Comută modul întunecat de lectură"
    >
      <span>{isDark ? "☀️ Mod Luminos" : "🌙 Mod Întunecat (Notebook)"}</span>
    </button>
  );
}
