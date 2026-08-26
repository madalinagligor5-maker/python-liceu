"use client";

import { useState, useEffect } from "react";
import LectieTemaToggle from "@/components/LectieTemaToggle";

export default function LectieContainer({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isDark, setIsDark] = useState(false);
  const [montat, setMontat] = useState(false);

  useEffect(() => {
    setMontat(true);
    const salvat = localStorage.getItem("academia_lectie_tema");
    if (salvat === "dark") {
      setIsDark(true);
    } else if (!salvat && typeof window !== "undefined" && window.matchMedia("(prefers-color-scheme: dark)").matches) {
      setIsDark(true);
    }
  }, []);

  const comutaTema = () => {
    const nouaStare = !isDark;
    setIsDark(nouaStare);
    localStorage.setItem("academia_lectie_tema", nouaStare ? "dark" : "light");
  };

  return (
    <div data-lectie-tema={isDark ? "dark" : "light"}>
      <div className="flex justify-end mb-3">
        <LectieTemaToggle isDark={isDark} onToggle={comutaTema} />
      </div>

      <article
        id="lectie-articol"
        className={`mt-2 rounded-3xl border p-6 transition-colors duration-300 sm:p-8 ${
          montat && isDark
            ? "tema-dark border-slate-700/70 bg-[#1E1E2E] text-slate-100 shadow-2xl [&_h2]:text-amber-300 [&_h3]:text-amber-400 [&_p]:text-slate-200 [&_code]:text-amber-300 [&_strong]:text-amber-400"
            : "border-border bg-white text-foreground shadow-sm"
        }`}
      >
        {children}
      </article>
    </div>
  );
}
