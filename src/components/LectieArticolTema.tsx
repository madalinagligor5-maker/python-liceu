"use client";

import type { ReactNode } from "react";
import { useTemaLectie } from "@/components/TemaLectieContext";

/**
 * Wrapper client pentru articolul unei lecții — aplică fundalul întunecat
 * de tip notebook (sincronizat cu LectieTemaToggle prin TemaLectieContext)
 * peste conținutul randat pe server (BlocuriSublectie).
 */
export default function LectieArticolTema({ children }: { children: ReactNode }) {
  const tema = useTemaLectie();
  const isDark = tema?.isDark ?? false;

  return (
    <article
      id="lectie-articol"
      className={`mt-6 rounded-2xl border p-6 shadow-sm sm:p-8 transition-colors ${
        isDark ? "tema-dark border-[#322F4A] bg-[#1E1E2E]" : "border-border bg-white"
      }`}
    >
      {children}
    </article>
  );
}
