"use client";

import { useState } from "react";
import type { QuizIntrebare } from "@/lib/content";

export default function QuizWidget({ intrebari }: { intrebari: QuizIntrebare[] }) {
  const [raspunsuri, setRaspunsuri] = useState<Record<number, number>>({});
  const [verificat, setVerificat] = useState(false);

  const scor = intrebari.reduce(
    (acc, intrebare, i) => acc + (raspunsuri[i] === intrebare.corect ? 1 : 0),
    0
  );
  const toateCompletate = intrebari.every((_, i) => raspunsuri[i] !== undefined);

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
                      onChange={() => {
                        setRaspunsuri((prev) => ({ ...prev, [i]: j }));
                        setVerificat(false);
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

      <div className="mt-5 flex items-center gap-4">
        <button
          type="button"
          disabled={!toateCompletate}
          onClick={() => setVerificat(true)}
          className="rounded-lg bg-brand px-4 py-2 text-sm font-semibold text-white transition hover:bg-brand-dark disabled:cursor-not-allowed disabled:opacity-40"
        >
          Verifică răspunsurile
        </button>
        {verificat && (
          <span className="text-sm font-medium text-foreground/70">
            Scor: {scor} / {intrebari.length}
          </span>
        )}
      </div>
    </div>
  );
}
