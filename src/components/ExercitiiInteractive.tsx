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
          className="rounded-lg bg-amber-400 hover:bg-amber-500 px-4 py-2 text-sm font-black text-slate-950 transition disabled:opacity-50 shadow-xs cursor-pointer"
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

/** Amestecă o listă (Fisher-Yates) — folosit pentru opțiunile de unire. */
function amesteca<T>(lista: T[]): T[] {
  const copie = [...lista];
  for (let i = copie.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copie[i], copie[j]] = [copie[j], copie[i]];
  }
  return copie;
}

/** Widget pentru exercițiul de unire (matching) — fiecare element din stânga primește o pereche aleasă din dreapta. */
function ExercitiuUnire({
  ex,
  onVerificat,
}: {
  ex: Extract<Exercitiu, { tip: "unire" }>;
  onVerificat?: () => void;
}) {
  const [optiuniDreapta] = useState(() => amesteca(ex.perechi.map((p) => p.dreapta)));
  const [alegeri, setAlegeri] = useState<Record<number, string>>({});
  const [verdict, setVerdict] = useState<"ok" | "gresit" | null>(null);

  const alegeriComplete = ex.perechi.every((_, i) => alegeri[i]);

  const verifica = () => {
    const corect = ex.perechi.every((p, i) => alegeri[i] === p.dreapta);
    setVerdict(corect ? "ok" : "gresit");
    onVerificat?.();
  };

  return (
    <div>
      <div className="space-y-2">
        {ex.perechi.map((p, i) => (
          <div key={i} className="flex flex-wrap items-center gap-2 text-sm">
            <span className="min-w-[140px] rounded-lg bg-black/5 px-3 py-1.5 text-foreground">{p.stanga}</span>
            <span className="text-foreground/40">→</span>
            <select
              value={alegeri[i] ?? ""}
              onChange={(e) => {
                setAlegeri((a) => ({ ...a, [i]: e.target.value }));
                setVerdict(null);
              }}
              className="rounded-lg border border-black/15 px-2.5 py-1.5 text-sm text-foreground outline-none focus:border-brand"
            >
              <option value="" disabled>
                alege...
              </option>
              {optiuniDreapta.map((opt) => (
                <option key={opt} value={opt}>
                  {opt}
                </option>
              ))}
            </select>
          </div>
        ))}
      </div>
      <div className="mt-3 flex items-center gap-3">
        <button
          type="button"
          onClick={verifica}
          disabled={!alegeriComplete}
          className="rounded-lg bg-amber-400 hover:bg-amber-500 px-4 py-2 text-sm font-black text-slate-950 transition disabled:opacity-50 shadow-xs cursor-pointer"
        >
          Verifică
        </button>
        {verdict === "ok" && (
          <span className="text-sm font-semibold text-success">✓ Toate perechile sunt corecte!</span>
        )}
        {verdict === "gresit" && (
          <span className="text-sm font-semibold text-red-600">✗ Mai sunt perechi greșite — încearcă din nou.</span>
        )}
      </div>
    </div>
  );
}

/** Widget pentru exercițiul adevărat/fals — elevul marchează valoarea de adevăr a fiecărei afirmații. */
function ExercitiuAdevaratFals({
  ex,
  onVerificat,
}: {
  ex: Extract<Exercitiu, { tip: "adevarat-fals" }>;
  onVerificat?: () => void;
}) {
  const [raspunsuri, setRaspunsuri] = useState<Record<number, boolean>>({});
  const [verificat, setVerificat] = useState(false);

  const toateRaspunse = ex.afirmatii.every((_, i) => raspunsuri[i] !== undefined);
  const corecte = ex.afirmatii.filter((a, i) => raspunsuri[i] === a.corect).length;

  const verifica = () => {
    setVerificat(true);
    onVerificat?.();
  };

  return (
    <div>
      <div className="space-y-2">
        {ex.afirmatii.map((a, i) => (
          <div
            key={i}
            className="flex flex-wrap items-center justify-between gap-2 rounded-lg border border-black/10 px-3 py-2 text-sm"
          >
            <span className="text-foreground">{a.text}</span>
            <div className="flex gap-1.5">
              {(["Adevărat", "Fals"] as const).map((eticheta, idx) => {
                const valoare = idx === 0;
                const ales = raspunsuri[i] === valoare;
                const corectAfisat = verificat && valoare === a.corect;
                return (
                  <button
                    key={eticheta}
                    type="button"
                    onClick={() => {
                      setRaspunsuri((r) => ({ ...r, [i]: valoare }));
                      setVerificat(false);
                    }}
                    className={`rounded-full border px-3 py-1 text-xs font-bold transition ${
                      verificat
                        ? corectAfisat
                          ? "border-success bg-success/10 text-success"
                          : ales
                            ? "border-red-400 bg-red-50 text-red-600"
                            : "border-black/10 text-foreground/40"
                        : ales
                          ? "border-amber-400 bg-amber-400 text-slate-950"
                          : "border-black/15 text-foreground/70 hover:border-brand"
                    }`}
                  >
                    {eticheta}
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>
      <div className="mt-3 flex items-center gap-3">
        <button
          type="button"
          onClick={verifica}
          disabled={!toateRaspunse}
          className="rounded-lg bg-amber-400 hover:bg-amber-500 px-4 py-2 text-sm font-black text-slate-950 transition disabled:opacity-50 shadow-xs cursor-pointer"
        >
          Verifică
        </button>
        {verificat && (
          <span
            className={`text-sm font-semibold ${corecte === ex.afirmatii.length ? "text-success" : "text-red-600"}`}
          >
            {corecte}/{ex.afirmatii.length} corecte
          </span>
        )}
      </div>
    </div>
  );
}

/** Widget pentru exercițiul de completare (cloze) — elevul scrie cuvântul care lipsește în fiecare gol marcat "___". */
function ExercitiuCompletare({
  ex,
  onVerificat,
}: {
  ex: Extract<Exercitiu, { tip: "completare" }>;
  onVerificat?: () => void;
}) {
  const segmente = ex.text.split("___");
  const [valori, setValori] = useState<string[]>(() => ex.raspunsuri.map(() => ""));
  const [verificat, setVerificat] = useState(false);

  const normalizeaza = (s: string) => s.trim().toLowerCase();
  const corecte = ex.raspunsuri.filter((r, i) => normalizeaza(valori[i] ?? "") === normalizeaza(r)).length;
  const toateCompletate = valori.every((v) => v.trim().length > 0);

  const verifica = () => {
    setVerificat(true);
    onVerificat?.();
  };

  return (
    <div>
      <p className="flex flex-wrap items-center gap-1.5 text-sm leading-loose text-foreground">
        {segmente.map((seg, i) => (
          <span key={i} className="flex flex-wrap items-center gap-1.5">
            {seg}
            {i < ex.raspunsuri.length && (
              <input
                type="text"
                value={valori[i] ?? ""}
                onChange={(e) => {
                  const noi = [...valori];
                  noi[i] = e.target.value;
                  setValori(noi);
                  setVerificat(false);
                }}
                className={`w-28 rounded-md border px-2 py-0.5 text-sm outline-none ${
                  verificat
                    ? normalizeaza(valori[i] ?? "") === normalizeaza(ex.raspunsuri[i])
                      ? "border-success bg-success/10"
                      : "border-red-400 bg-red-50"
                    : "border-black/15 focus:border-brand"
                }`}
              />
            )}
          </span>
        ))}
      </p>
      <div className="mt-3 flex items-center gap-3">
        <button
          type="button"
          onClick={verifica}
          disabled={!toateCompletate}
          className="rounded-lg bg-amber-400 hover:bg-amber-500 px-4 py-2 text-sm font-black text-slate-950 transition disabled:opacity-50 shadow-xs cursor-pointer"
        >
          Verifică
        </button>
        {verificat && (
          <span
            className={`text-sm font-semibold ${corecte === ex.raspunsuri.length ? "text-success" : "text-red-600"}`}
          >
            {corecte}/{ex.raspunsuri.length} corecte
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
          className="rounded-lg bg-amber-400 hover:bg-amber-500 px-4 py-2 text-sm font-black text-slate-950 transition shadow-xs cursor-pointer"
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
        <div className="space-y-6">
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
                  className={`rounded-full border px-4 py-1.5 text-sm font-black transition ${
                    n.id === activ?.id
                      ? "border-amber-400 bg-amber-400 text-slate-950 shadow-xs"
                      : "border-brand-border bg-white text-foreground/80 hover:border-brand"
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
                {ex.tip === "unire" && (
                  <ExercitiuUnire ex={ex} onVerificat={() => onRezolvat?.(ex.id)} />
                )}
                {ex.tip === "adevarat-fals" && (
                  <ExercitiuAdevaratFals ex={ex} onVerificat={() => onRezolvat?.(ex.id)} />
                )}
                {ex.tip === "completare" && (
                  <ExercitiuCompletare ex={ex} onVerificat={() => onRezolvat?.(ex.id)} />
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
        </div>
      )}
    </div>
  );
}
