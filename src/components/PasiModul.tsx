"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import {
  citesteExercitiiRezolvate,
  citestePasiDeschisi,
  citestePasiReusiti,
  EVENIMENT_PROGRES,
} from "@/lib/progresLocal";

export type PasModul = {
  cod: string;
  titlu: string;
  descriere: string;
  tip: "recapitulare" | "concept" | "prezice" | "ghidat" | "independent" | "verificare";
  icon: string;
  href: string;
  /** Id-urile exercițiilor care trebuie rezolvate ca pasul să fie „finalizat". */
  exercitii: string[];
};

type StarePas = "finalizat" | "deschis" | "neinceput";

const ETICHETA: Record<StarePas, string> = {
  finalizat: "finalizat",
  deschis: "deschis",
  neinceput: "neînceput",
};

const STIL: Record<StarePas, string> = {
  finalizat: "bg-success/15 text-success",
  deschis: "bg-amber-100 text-amber-900",
  neinceput: "bg-surface text-foreground/70",
};

/**
 * Starea reală a fiecărui pas:
 *  - recapitulare / concept: nu au un exercițiu de verificare, deci pot fi
 *    doar „deschis" (niciodată „înțeles");
 *  - prezice: finalizat la o predicție corectă;
 *  - exerciții ghidate / independente: finalizat când toate exercițiile de
 *    bază sunt rezolvate corect;
 *  - verificare: finalizat când testul e trecut (≥ 60%).
 */
function calculeazaStare(
  p: PasModul,
  reusiteCont: Set<string>,
  reusiteLocal: Set<string>,
  exercitii: Set<string>,
  deschise: Set<string>
): StarePas {
  if (p.tip === "prezice" || p.tip === "verificare") {
    if (reusiteCont.has(p.cod) || reusiteLocal.has(p.cod)) return "finalizat";
  } else if (p.tip === "ghidat" || p.tip === "independent") {
    if (p.exercitii.length > 0 && p.exercitii.every((id) => exercitii.has(id))) return "finalizat";
  }
  return deschise.has(p.cod) ? "deschis" : "neinceput";
}

export default function PasiModul({
  pasi,
  reusiteCont,
  areAcces,
  areContinut,
  autentificat,
  hrefBlocat,
}: {
  pasi: PasModul[];
  /** Coduri de sublecții salvate ca reușite în cont (server). */
  reusiteCont: string[];
  areAcces: boolean;
  areContinut: boolean;
  autentificat: boolean;
  hrefBlocat: string;
}) {
  const [stari, setStari] = useState<StarePas[] | null>(null);

  useEffect(() => {
    const actualizeaza = () => {
      const cont = new Set(reusiteCont);
      const local = citestePasiReusiti();
      const ex = citesteExercitiiRezolvate();
      const deschise = citestePasiDeschisi();
      setStari(pasi.map((p) => calculeazaStare(p, cont, local, ex, deschise)));
    };
    actualizeaza();
    window.addEventListener(EVENIMENT_PROGRES, actualizeaza);
    window.addEventListener("storage", actualizeaza);
    return () => {
      window.removeEventListener(EVENIMENT_PROGRES, actualizeaza);
      window.removeEventListener("storage", actualizeaza);
    };
  }, [pasi, reusiteCont]);

  // Pasul la care se continuă: primul pas cu o verificare care nu e încă
  // finalizat; pașii de lectură (1–2) contează ca parcurși dacă au fost deschiși.
  const indexContinuare = (() => {
    if (!stari) return 0;
    const i = stari.findIndex((s, idx) => {
      const lectura = pasi[idx].tip === "recapitulare" || pasi[idx].tip === "concept";
      return lectura ? s === "neinceput" : s !== "finalizat";
    });
    return i === -1 ? 0 : i;
  })();
  const aInceput = Boolean(stari?.some((s) => s !== "neinceput"));
  const toateFinalizate =
    Boolean(stari) &&
    pasi.every((p, i) => (p.tip === "recapitulare" || p.tip === "concept" ? stari![i] !== "neinceput" : stari![i] === "finalizat"));

  const nrFinalizate = stari?.filter((s) => s === "finalizat").length ?? 0;
  const nrVerificabile = pasi.filter((p) => p.tip !== "recapitulare" && p.tip !== "concept").length;

  return (
    <div>
      {areContinut && (
        <div className="flex flex-wrap items-center gap-3">
          {areAcces ? (
            <Link
              href={pasi[toateFinalizate ? 0 : indexContinuare].href}
              className="rounded-xl bg-amber-400 px-6 py-3 text-base font-black text-slate-950 shadow-xs transition hover:bg-amber-500 active:scale-95"
            >
              {toateFinalizate
                ? "Recapitulează lecția"
                : aInceput
                  ? `Continuă lecția · Pasul ${indexContinuare + 1}`
                  : "Începe lecția"}{" "}
              →
            </Link>
          ) : (
            <Link
              href={hrefBlocat}
              className="rounded-xl bg-amber-400 px-6 py-3 text-base font-black text-slate-950 shadow-xs transition hover:bg-amber-500"
            >
              Vezi cum deblochezi lecția →
            </Link>
          )}
          {stari && areAcces && (
            <span className="text-sm text-foreground/70">
              {nrFinalizate} din {nrVerificabile} pași cu verificare finalizați
            </span>
          )}
        </div>
      )}

      <ol className="mt-6 space-y-3">
        {pasi.map((p, i) => {
          const stare = stari?.[i];
          const continut = (
            <>
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-surface text-lg">
                <span aria-hidden="true">{p.icon}</span>
              </span>
              <span className="min-w-0 flex-1">
                <span className="block text-xs font-semibold text-foreground/70">Pasul {i + 1} din 6</span>
                <span className="mt-0.5 block font-semibold text-foreground">{p.titlu}</span>
                <span className="mt-1 block text-sm text-foreground/70">{p.descriere}</span>
              </span>
              {!areContinut ? (
                <span className="self-center rounded-full bg-surface px-2 py-1 text-[11px] font-semibold text-locked">
                  în pregătire
                </span>
              ) : !areAcces ? (
                <span className="self-center rounded-full bg-surface px-2 py-1 text-[11px] font-semibold text-locked">
                  🔒 abonament
                </span>
              ) : stare ? (
                <span className={`self-center whitespace-nowrap rounded-full px-2 py-1 text-[11px] font-bold ${STIL[stare]}`}>
                  {stare === "finalizat" ? "✓ " : ""}
                  {ETICHETA[stare]}
                </span>
              ) : null}
            </>
          );
          return (
            <li key={p.cod}>
              {areContinut && areAcces ? (
                <Link
                  href={p.href}
                  className="flex items-start gap-4 rounded-2xl border border-border bg-white p-4 shadow-sm transition hover:border-brand/40 hover:shadow-md"
                >
                  {continut}
                </Link>
              ) : (
                <div className="flex items-start gap-4 rounded-2xl border border-border bg-white p-4 shadow-sm">{continut}</div>
              )}
            </li>
          );
        })}
      </ol>

      {areAcces && areContinut && (
        <p className="mt-3 text-xs text-foreground/70">
          „Deschis” înseamnă doar că ai vizitat pasul. Un pas devine „finalizat” după o predicție corectă, după
          rezolvarea exercițiilor sau după trecerea testului.{" "}
          {autentificat
            ? "Predicțiile și testele trecute se salvează și în cont; exercițiile rezolvate se rețin în acest browser."
            : "Fără cont, progresul se reține doar în acest browser."}
        </p>
      )}
    </div>
  );
}
