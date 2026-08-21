"use client";

import { useState } from "react";
import PythonEditor from "@/components/PythonEditor";
import { Exercitiu, Nivel, NIVELE } from "@/lib/exercitii-tipuri";

/** Widget pentru exercițiul de ordonare a pașilor. */
function ExercitiuOrdonare({
  ex,
  onVerificat,
}: {
  ex: Extract<Exercitiu, { tip: "ordonare" }>;
  onVerificat?: () => void;
}) {
  const [ordine, setOrdine] = useState<string[]>([]);
  const [folosite, setFolosite] = useState<Set<number>>(new Set());
  const [verdict, setVerdict] = useState<"ok" | "gresit" | null>(null);

  const alege = (idx: number, text: string) => {
    if (folosite.has(idx)) return;
    setFolosite((s) => new Set(s).add(idx));
    setOrdine((o) => [...o, text]);
    setVerdict(null);
  };
  const reseteaza = () => {
    setOrdine([]);
    setFolosite(new Set());
    setVerdict(null);
  };
  const verifica = () => {
    const corect =
      JSON.stringify(ordine) === JSON.stringify(ex.ordineCorecta);
    setVerdict(corect ? "ok" : "gresit");
    onVerificat?.();
  };

  return (
    <div>
      <div className="flex flex-wrap gap-2">
        {ex.pasi.map((p, i) => (
          <button
            key={i}
            type="button"
            disabled={folosite.has(i)}
            onClick={() => alege(i, p)}
            className={`rounded-full border px-3 py-1.5 text-sm transition ${
              folosite.has(i)
                ? "cursor-not-allowed border-black/10 bg-black/5 text-foreground/40"
                : "border-brand-border bg-white text-foreground hover:border-brand hover:text-brand"
            }`}
          >
            {p}
          </button>
        ))}
      </div>

      <div className="mt-3 min-h-[44px] rounded-lg border border-dashed border-black/15 p-2">
        {ordine.length === 0 ? (
          <span className="text-sm text-foreground/40">
            Apasă pașii de mai sus, în ordinea în care credi că merg.
          </span>
        ) : (
          <ol className="list-decimal space-y-1 pl-5 text-sm text-foreground">
            {ordine.map((o, i) => (
              <li key={i}>{o}</li>
            ))}
          </ol>
        )}
      </div>

      <div className="mt-2 flex items-center gap-3">
        <button
          type="button"
          onClick={verifica}
          disabled={ordine.length < ex.ordineCorecta.length}
          className="rounded-lg bg-brand px-4 py-2 text-sm font-semibold text-white transition hover:bg-brand-dark disabled:opacity-50"
        >
          Verifică ordinea
        </button>
        <button
          type="button"
          onClick={reseteaza}
          className="text-xs text-foreground/60 hover:text-foreground"
        >
          Resetează
        </button>
        {verdict === "ok" && (
          <span className="text-sm font-semibold text-success">✓ Ordine corectă!</span>
        )}
        {verdict === "gresit" && (
          <span className="text-sm font-semibold text-red-600">
            ✗ Nu e încă ordinea bună — încearcă din nou.
          </span>
        )}
      </div>
    </div>
  );
}

/** Widget pentru răspuns liber (text) cu dezvăluire model. */
function ExercitiuText({
  ex,
  onVerificat,
}: {
  ex: Extract<Exercitiu, { tip: "text" }>;
  onVerificat?: () => void;
}) {
  const [arata, setArata] = useState(false);
  const [verificat, setVerificat] = useState(false);
  const marcheaza = () => {
    setVerificat(true);
    onVerificat?.();
  };
  return (
    <div>
      <textarea
        placeholder="Scrie răspunsul tău aici..."
        className="mt-2 w-full rounded-xl border border-black/15 p-3 text-sm text-foreground outline-none focus:border-brand"
        rows={4}
      />
      <div className="mt-2 flex items-center gap-3">
        <button
          type="button"
          onClick={marcheaza}
          className="rounded-lg bg-brand px-4 py-2 text-sm font-semibold text-white transition hover:bg-brand-dark"
        >
          Marchează ca rezolvat
        </button>
        <button
          type="button"
          onClick={() => setArata((a) => !a)}
          className="text-xs font-medium text-brand hover:text-brand-dark"
        >
          {arata ? "Ascunde răspunsul model" : "Vezi un răspuns model"}
        </button>
      </div>
      {arata && ex.modelRaspuns && (
        <p className="mt-2 rounded-lg bg-brand-light/60 p-3 text-sm text-brand-dark">
          {ex.modelRaspuns}
        </p>
      )}
      {verificat && (
        <p className="mt-2 text-sm font-semibold text-success">
          ✓ Marchează ca rezolvit.
        </p>
      )}
    </div>
  );
}

export default function ExercitiiInteractive({
  exercitii,
  deblocat = true,
  onRezolvat,
}: {
  exercitii: Exercitiu[];
  deblocat?: boolean;
  onRezolvat?: (id: string) => void;
}) {
  const [nivelActiv, setNivelActiv] = useState<Nivel>("de-baza");
  const [arataHint, setArataHint] = useState<Record<string, boolean>>({});

  if (!exercitii.length) return null;

  const niveleDisponibile = NIVELE.filter((n) =>
    exercitii.some((e) => e.nivel === n.id)
  );
  // Dacă nivelul activ nu există în acest set, folosește primul disponibil.
  const activ =
    niveleDisponibile.find((n) => n.id === nivelActiv) ?? niveleDisponibile[0];
  const lista = exercitii.filter((e) => e.nivel === activ?.id);

  return (
    <div className="mt-6 space-y-6">
      {!deblocat && (
        <div className="flex flex-col items-center gap-2 rounded-2xl border border-brand-border bg-white p-6 text-center shadow-sm">
          <span className="text-3xl" aria-hidden="true">
            🔒
          </span>
          <h3 className="text-lg font-bold text-foreground">
            Citește mai întâi lecția
          </h3>
          <p className="max-w-sm text-sm text-foreground/60">
            Derulează până la capătul lecției de mai sus, apoi se deblochează
            exercițiile.
          </p>
        </div>
      )}

      {deblocat && (
        <>
          <h3 className="flex items-center gap-2 text-lg font-bold text-foreground">
            <span className="text-2xl" aria-hidden="true">
              💻
            </span>
            Exerciții — scrie și verifică
          </h3>

          {niveleDisponibile.length > 1 && (
            <div className="flex flex-wrap gap-2">
              {niveleDisponibile.map((n) => (
                <button
                  key={n.id}
                  type="button"
                  onClick={() => setNivelActiv(n.id)}
                  className={`rounded-full border px-4 py-1.5 text-sm font-semibold transition ${
                    n.id === activ?.id
                      ? "border-brand bg-brand text-white"
                      : "border-brand-border bg-white text-foreground/70 hover:border-brand"
                  }`}
                >
                  {n.eticheta}
                </button>
              ))}
            </div>
          )}

          {lista.map((ex, i) => (
            <div
              key={ex.id}
              className="rounded-2xl border border-brand-border bg-white p-5 shadow-sm"
            >
              <p className="text-sm font-medium text-foreground">
                <span className="mr-2 rounded-md bg-brand-light px-2 py-0.5 text-xs font-bold text-brand-dark">
                  {activ?.eticheta} · Ex. {i + 1}
                </span>
                {ex.enunt}
              </p>

              <div className="mt-3">
                {ex.tip === "cod" && (
                  <PythonEditor
                    initialCode={ex.template || "# Scrie aici codul tău Python\n"}
                    expectedOutput={ex.expectedOutput}
                    titlu="Editor Python (rulează în browser)"
                    height={ex.template ? 180 : 140}
                    onVerificat={() => onRezolvat?.(ex.id)}
                  />
                )}
                {ex.tip === "ordonare" && (
                  <ExercitiuOrdonare ex={ex} onVerificat={() => onRezolvat?.(ex.id)} />
                )}
                {ex.tip === "text" && (
                  <ExercitiuText ex={ex} onVerificat={() => onRezolvat?.(ex.id)} />
                )}
              </div>

              {ex.hint && ex.tip !== "text" && (
                <div className="mt-2">
                  <button
                    type="button"
                    onClick={() =>
                      setArataHint((p) => ({ ...p, [ex.id]: !p[ex.id] }))
                    }
                    className="text-xs font-medium text-brand hover:text-brand-dark"
                  >
                    {arataHint[ex.id] ? "Ascunde indiciul" : "Arată un indiciu"}
                  </button>
                  {arataHint[ex.id] && (
                    <div className="mt-1 space-y-1">
                      <p className="rounded-lg bg-brand-light/60 p-2 font-mono text-xs text-brand-dark">
                        {ex.hint}
                      </p>
                      {ex.hint2 && (
                        <p className="rounded-lg bg-brand-light/60 p-2 font-mono text-xs text-brand-dark">
                          <span className="font-semibold">Alt indiciu: </span>
                          {ex.hint2}
                        </p>
                      )}
                    </div>
                  )}
                </div>
              )}

              {ex.extindere && (
                <div className="mt-2">
                  <details className="rounded-lg border border-dashed border-brand-border bg-brand-light/30 p-2">
                    <summary className="cursor-pointer text-xs font-semibold text-brand-dark">
                      Vrei mai mult? Încearcă varianta de extindere →
                    </summary>
                    <p className="mt-2 text-sm text-foreground/80">{ex.extindere}</p>
                  </details>
                </div>
              )}
            </div>
          ))}
        </>
      )}
    </div>
  );
}
