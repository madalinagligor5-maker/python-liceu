"use client";

import { createContext, useContext, useState, type ReactNode } from "react";

const CHEIE_STOCARE = "academia_lectie_tema";

type TemaLectieContextValue = {
  isDark: boolean;
  comutaTema: () => void;
};

const TemaLectieContext = createContext<TemaLectieContextValue | null>(null);

function citesteTemaInitiala(): boolean {
  if (typeof window === "undefined") return false;
  const salvata = localStorage.getItem(CHEIE_STOCARE);
  if (salvata === "dark") return true;
  if (salvata === "light") return false;
  return window.matchMedia?.("(prefers-color-scheme: dark)").matches ?? false;
}

/**
 * Ține starea modului întunecat de lectură pentru o singură pagină de lecție.
 * Butonul (LectieTemaToggle) și articolul (LectieArticolTema) citesc din
 * același context ca să rămână sincronizate, deși nu sunt elemente adiacente
 * în arborele JSX al paginii.
 */
export function TemaLectieProvider({ children }: { children: ReactNode }) {
  const [isDark, setIsDark] = useState(citesteTemaInitiala);

  const comutaTema = () => {
    setIsDark((prev) => {
      const nou = !prev;
      localStorage.setItem(CHEIE_STOCARE, nou ? "dark" : "light");
      return nou;
    });
  };

  return (
    <TemaLectieContext.Provider value={{ isDark, comutaTema }}>
      {children}
    </TemaLectieContext.Provider>
  );
}

export function useTemaLectie() {
  return useContext(TemaLectieContext);
}
