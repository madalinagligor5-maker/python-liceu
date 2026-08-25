"use client";

import { useState, useTransition } from "react";
import type { QuizIntrebare } from "@/lib/content";
import { finalizeazaLectie, type RezultatFinalizare } from "@/app/actions/progres";

type Props = {
  intrebari: QuizIntrebare[];
  /** Când lipsesc, quiz-ul rămâne pur local (fără acordare de XP). */
  clasa?: string;
  unitateSlug?: string;
  lectieSlug?: string;
  autentificat?: boolean;
};

const ETICHETE_INSIGNE: Record<string, string> = {
  "prima-lectie": "Prima lecție",
  "cinci-lectii": "5 lecții",
  "zece-lectii": "10 lecții",
  "serie-3-zile": "Serie de 3 zile",
  "serie-7-zile": "Serie de 7 zile",
  "quiz-perfect": "Quiz perfect",
};

export default function QuizWidget({
  intrebari,
  clasa,
  unitateSlug,
  lectieSlug,
  autentificat = false,
}: Props) {
  const [raspunsuri, setRaspunsuri] = useState<Record<number, number>>({});
  const [verificat, setVerificat] = useState(false);
  const [rezultat, setRezultat] = useState<RezultatFinalizare | null>(null);
  const [inLucru, startTransition] = useTransition();

  const scorLocal = intrebari.reduce(
    (acc, intrebare, i) => acc + (raspunsuri[i] === intrebare.corect ? 1 : 0),
    0
  );
  const toateCompletate = intrebari.every((_, i) => raspunsuri[i] !== undefined);
  const poateSalva = Boolean(autentificat && clasa && unitateSlug && lectieSlug);

  function verifica() {
    setVerificat(true);

    if (!poateSalva) return;

    startTransition(async () => {
      const r = await finalizeazaLectie(clasa!, unitateSlug!, lectieSlug!, raspunsuri);
      setRezultat(r);
    });
  }

  return (
    <div className="rounded-2xl border border-black/10 bg-white p-5 shadow-sm">
      <h3 className="font-semibold text-foreground">Quiz de verificare</h3>

      <div className="mt-4 space-y-6">
        {intrebari.map((intrebare, i) => (
          <fieldset key={intrebare.intrebare}>
            <legend className="text-sm font-medium text-foreground">
              {i + 1}. {intrebare.intrebare}
            </legend>
            <div className="mt-2 space-y-2">
              {intrebare.variante.map((varianta, j) => {
                const selectat = raspunsuri[i] === j;
                const esteCorect = verificat && j === intrebare.corect;
                const esteGresit = verificat && selectat && j !== intrebare.corect;

                return (
                  <label
                    key={varianta}
                    className={[
                      "flex cursor-pointer items-center gap-2 rounded-lg border px-3 py-2 text-sm transition",
                      esteCorect
                        ? "border-success bg-success/10 text-success"
                        : esteGresit
                          ? "border-red-400 bg-red-50 text-red-600"
                          : selectat
                            ? "border-brand bg-brand-light text-brand-dark"
                            : "border-black/10 text-foreground/80 hover:border-brand/50",
                    ].join(" ")}
                  >
                    <input
                      type="radio"
                      name={`intrebare-${i}`}
                      className="accent-[var(--brand)]"
                      checked={selectat}
                      disabled={inLucru}
                      onChange={() => {
                        setRaspunsuri((prev) => ({ ...prev, [i]: j }));
                        setVerificat(false);
                        setRezultat(null);
                      }}
                    />
                    {varianta}
                  </label>
                );
              })}
            </div>
          </fieldset>
        ))}
      </div>

      <div className="mt-5 flex flex-wrap items-center gap-4">
        <button
          type="button"
          disabled={!toateCompletate || inLucru}
          onClick={verifica}
          className="rounded-lg bg-amber-400 hover:bg-amber-500 px-4 py-2 text-sm font-black text-slate-950 transition disabled:cursor-not-allowed disabled:opacity-40 shadow-xs cursor-pointer"
        >
          {inLucru ? "Se salvează…" : "Verifică răspunsurile"}
        </button>
        {verificat && (
          <span className="text-sm font-medium text-foreground/70">
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
            Lecție finalizată! {rezultat.xpTotal} XP · nivel {rezultat.nivel}
            {rezultat.streakZile > 0 && ` · 🔥 ${rezultat.streakZile}`}
          </p>
          {rezultat.insigneNoi.length > 0 && (
            <p className="mt-1 text-xs text-foreground/70">
              Insigne noi: {rezultat.insigneNoi.map((s) => ETICHETE_INSIGNE[s] ?? s).join(", ")}
            </p>
          )}
        </div>
      )}

      {rezultat && !rezultat.ok && (
        <p className="mt-4 text-sm text-red-600" role="status" aria-live="polite">
          {rezultat.eroare}
        </p>
      )}

      {verificat && !poateSalva && (
        <p className="mt-4 text-xs text-foreground/55">
          Autentifică-te ca să-ți salvezi progresul și să câștigi XP.
        </p>
      )}
    </div>
  );
}
