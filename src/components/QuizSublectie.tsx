"use client";

import { useState, useTransition } from "react";
import type { IntrebareQuiz } from "@/lib/quizSublectii";
import { finalizeazaSublectie, type RezultatFinalizare } from "@/app/actions/progres";

type Props = {
  intrebari: IntrebareQuiz[];
  clasa: string;
  sublectieCod: string;
  autentificat?: boolean;
};

const LITERE = ["a", "b", "c", "d"];

export default function QuizSublectie({
  intrebari,
  clasa,
  sublectieCod,
  autentificat = false,
}: Props) {
  const [raspunsuri, setRaspunsuri] = useState<Record<number, number>>({});
  const [dezvaltat, setDezvaltat] = useState(false);
  const [rezultat, setRezultat] = useState<RezultatFinalizare | null>(null);
  const [inLucru, startTransition] = useTransition();

  const scorLocal = intrebari.reduce(
    (acc, intrebare, i) => acc + (raspunsuri[i] === intrebare.corect ? 1 : 0),
    0
  );
  const toateCompletate = intrebari.every((_, i) => raspunsuri[i] !== undefined);
  const poateSalva = autentificat && Boolean(intrebari.length);

  function verifica() {
    setDezvaltat(true);
    if (!poateSalva) return;
    startTransition(async () => {
      const r = await finalizeazaSublectie(clasa, sublectieCod, raspunsuri);
      setRezultat(r);
    });
  }

  function reseteaza() {
    setRaspunsuri({});
    setDezvaltat(false);
    setRezultat(null);
  }

  return (
    <div className="rounded-2xl border border-brand-border bg-white p-6 shadow-sm">
      <div className="flex items-center gap-2">
        <span className="text-2xl" aria-hidden="true">
          🧠
        </span>
        <h3 className="text-lg font-bold text-foreground">Verifică-ți înțelegerea</h3>
      </div>
      <p className="mt-1 text-sm text-foreground/60">
        Răspunde la cele {intrebari.length} întrebări. Vezi explicația imediat ce
        verifici — sau după fiecare răspuns, dacă vrei feedback pe loc.
      </p>

      <div className="mt-5 space-y-6">
        {intrebari.map((intrebare, i) => {
          const selectat = raspunsuri[i];
          const raspunsDat = selectat !== undefined;
          return (
            <fieldset key={i} className="rounded-xl border border-black/5 bg-brand-light/30 p-4">
              <legend className="px-1 text-sm font-semibold text-foreground">
                {i + 1}. {intrebare.intrebare}
              </legend>

              <div className="mt-3 space-y-2">
                {intrebare.variante.map((varianta, j) => {
                  const eCorect = j === intrebare.corect;
                  const eSelectat = selectat === j;
                  const arataBine = dezvaltat && eCorect;
                  const arataRau = dezvaltat && eSelectat && !eCorect;

                  return (
                    <button
                      type="button"
                      key={j}
                      disabled={inLucru}
                      onClick={() => {
                        setRaspunsuri((prev) => ({ ...prev, [i]: j }));
                        setRezultat(null);
                      }}
                      className={[
                        "flex w-full items-center gap-3 rounded-lg border px-3 py-2 text-left text-sm transition",
                        arataBine
                          ? "border-success bg-success/10 text-success"
                          : arataRau
                            ? "border-red-400 bg-red-50 text-red-600"
                            : eSelectat
                              ? "border-brand bg-brand-light text-brand-dark"
                              : "border-black/10 text-foreground/80 hover:border-brand/50",
                      ].join(" ")}
                    >
                      <span
                        className={[
                          "flex h-6 w-6 shrink-0 items-center justify-center rounded-full border text-xs font-bold",
                          arataBine
                            ? "border-success text-success"
                            : arataRau
                              ? "border-red-400 text-red-600"
                              : eSelectat
                                ? "border-brand bg-brand text-white"
                                : "border-black/20 text-foreground/50",
                        ].join(" ")}
                      >
                        {LITERE[j] ?? j + 1}
                      </span>
                      <span>{varianta}</span>
                      {arataBine && <span className="ml-auto text-success">✓</span>}
                      {arataRau && <span className="ml-auto text-red-600">✗</span>}
                    </button>
                  );
                })}
              </div>

              {dezvaltat && !raspunsDat && (
                <p className="mt-2 text-xs italic text-foreground/50">
                  N-ai selectat un răspuns pentru această întrebare.
                </p>
              )}
            </fieldset>
          );
        })}
      </div>

      <div className="mt-6 flex flex-wrap items-center gap-3">
        {!dezvaltat ? (
          <button
            type="button"
            disabled={!toateCompletate || inLucru}
            onClick={verifica}
            className="rounded-lg bg-brand px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-brand-dark disabled:cursor-not-allowed disabled:opacity-40"
          >
            Verifică răspunsurile
          </button>
        ) : (
          <button
            type="button"
            disabled={inLucru}
            onClick={reseteaza}
            className="rounded-lg border border-black/10 px-5 py-2.5 text-sm font-semibold text-foreground transition hover:border-brand"
          >
            Încearcă din nou
          </button>
        )}

        {dezvaltat && (
          <span className="text-sm font-semibold text-foreground/70">
            Scor: {scorLocal} / {intrebari.length}
          </span>
        )}
      </div>

      {rezultat?.ok && (
        <div
          className="mt-4 rounded-xl border border-success/30 bg-success/10 p-4"
          role="status"
          aria-live="polite"
        >
          <p className="text-sm font-semibold text-foreground">
            Felicitări! Ai câștigat {rezultat.xpTotal} XP · nivel {rezultat.nivel}
            {rezultat.streakZile > 0 && ` · 🔥 ${rezultat.streakZile} zile`}
          </p>
        </div>
      )}

      {rezultat && !rezultat.ok && (
        <p className="mt-4 text-sm text-red-600" role="status" aria-live="polite">
          {rezultat.eroare}
        </p>
      )}

      {dezvaltat && !poateSalva && (
        <p className="mt-4 text-xs text-foreground/55">
          Autentifică-te ca să-ți salvezi progresul și să câștigi XP.
        </p>
      )}
    </div>
  );
}
