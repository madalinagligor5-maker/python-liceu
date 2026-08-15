"use client";

import { useEffect, useState } from "react";
import ExercitiiInteractive from "@/components/ExercitiiInteractive";
import QuizSublectie from "@/components/QuizSublectie";
import type { Exercitiu } from "@/lib/exercitii-tipuri";
import type { IntrebareQuiz } from "@/lib/quizSublectii";

const KEY = "exercitii_rezolvate_v1";

/** Citește setul de exerciții rezolvate din localStorage (persistă între pagini). */
function citesteRezolvate(): Set<string> {
  if (typeof window === "undefined") return new Set();
  try {
    const raw = window.localStorage.getItem(KEY);
    return new Set(raw ? (JSON.parse(raw) as string[]) : []);
  } catch {
    return new Set();
  }
}

/**
 * Gestionează „gate-ul" de parcurgere:
 *  - exercițiile se deblochează doar după ce elevul a derulat articolul până la capăt (scroll 100%);
 *  - quiz-ul se deblochează doar după ce a rezolvat (măcar a încercat) exercițiile din acest modul
 *    (starea persistă între pagini prin localStorage, ca să nu fie blocat pe 1.X.6 doar pentru că
 *    exercițiile sunt pe 1.X.4 / 1.X.5).
 * Totul e client-side (nu blochează XP-ul server-side dacă cineva forțează), dar pentru un elev
 * obișnuit fluxul e clar: citește → exersează → verifică.
 */
export default function SublectieGate({
  exercitii,
  intrebari,
  clasa,
  sublectieCod,
  autentificat,
}: {
  exercitii: Exercitiu[];
  intrebari: IntrebareQuiz[];
  clasa: string;
  sublectieCod: string;
  autentificat: boolean;
}) {
  const [aCitit, setACitit] = useState(false);
  const [rezolvate, setRezolvate] = useState<Set<string>>(new Set());

  // La mount, citește progresul salvat (ca să deblocheze quiz-ul pe 1.X.6
  // dacă exercițiile de pe 1.X.4 / 1.X.5 au fost deja făcute).
  useEffect(() => {
    setRezolvate(citesteRezolvate());
  }, []);

  useEffect(() => {
    const el = document.getElementById("lectie-articol");
    if (!el) return;
    const onScroll = () => {
      const rect = el.getBoundingClientRect();
      const vizibil = rect.bottom <= window.innerHeight + 4;
      if (vizibil) setACitit(true);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  const marcheazaRezolvat = (id: string) => {
    setRezolvate((s) => {
      const nou = new Set(s).add(id);
      try {
        window.localStorage.setItem(KEY, JSON.stringify([...nou]));
      } catch {
        // localStorage poate fi indisponibil (mod privat) — ignorăm.
      }
      return nou;
    });
  };

  const toateRezolvate =
    exercitii.length > 0 && exercitii.every((e) => rezolvate.has(e.id));

  return (
    <>
      <ExercitiiInteractive
        exercitii={exercitii}
        deblocat={aCitit}
        onRezolvat={marcheazaRezolvat}
      />

      {intrebari.length > 0 && (
        <div className="mt-6">
          <QuizSublectie
            intrebari={intrebari}
            clasa={clasa}
            sublectieCod={sublectieCod}
            autentificat={autentificat}
            deblocat={toateRezolvate}
          />
        </div>
      )}
    </>
  );
}
