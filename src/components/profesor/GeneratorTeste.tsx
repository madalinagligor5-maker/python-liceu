"use client";

import { useState, useTransition } from "react";
import type { Capitol } from "@/lib/curriculum";
import { genereazaTest, type IntrebareTest } from "@/app/actions/teste";
import PrintButton from "@/components/PrintButton";

export default function GeneratorTeste({ capitoleLiceu }: { capitoleLiceu: Capitol[] }) {
  const [clasa, setClasa] = useState(capitoleLiceu[0]?.clasa ?? "");
  const [moduleSelectate, setModuleSelectate] = useState<Set<string>>(new Set());
  const [nrIntrebari, setNrIntrebari] = useState(10);
  const [eroare, setEroare] = useState<string | null>(null);
  const [intrebari, setIntrebari] = useState<IntrebareTest[] | null>(null);
  const [sePending, startTransition] = useTransition();

  const capitolCurent = capitoleLiceu.find((c) => c.clasa === clasa);

  function toggleModul(cod: string) {
    setModuleSelectate((prev) => {
      const next = new Set(prev);
      if (next.has(cod)) next.delete(cod);
      else next.add(cod);
      return next;
    });
  }

  function genereaza() {
    setEroare(null);
    setIntrebari(null);
    startTransition(async () => {
      const rez = await genereazaTest(Array.from(moduleSelectate), nrIntrebari);
      if (!rez.ok || !rez.intrebari) {
        setEroare(rez.eroare ?? "Eroare necunoscută.");
        return;
      }
      setIntrebari(rez.intrebari);
    });
  }

  if (intrebari) {
    return (
      <div>
        <style
          dangerouslySetInnerHTML={{
            __html: `@media print { @page { size: A4 portrait; margin: 1.5cm; } body { background: white !important; } .print-break { page-break-before: always; } }`,
          }}
        />
        <div className="print-hidden mb-6 flex flex-wrap items-center justify-between gap-3">
          <button
            type="button"
            onClick={() => setIntrebari(null)}
            className="text-sm font-semibold text-brand hover:underline"
          >
            ← Generează alt test
          </button>
          <PrintButton />
        </div>

        <h1 className="text-xl font-bold text-foreground">Test — Clasa a {clasa}-a</h1>
        <ol className="mt-6 space-y-5">
          {intrebari.map((i, idx) => (
            <li key={idx} className="rounded-xl border border-black/10 p-4">
              <p className="font-semibold text-foreground">
                {idx + 1}. {i.intrebare}
              </p>
              <ol className="mt-2 space-y-1 pl-4 text-sm text-foreground/80" type="a">
                {i.variante.map((v, vi) => (
                  <li key={vi}>{v}</li>
                ))}
              </ol>
            </li>
          ))}
        </ol>

        <div className="print-break mt-10">
          <h2 className="text-lg font-bold text-foreground">Barem</h2>
          <ol className="mt-4 space-y-2">
            {intrebari.map((i, idx) => (
              <li key={idx} className="text-sm text-foreground/80">
                <strong>{idx + 1}.</strong> {String.fromCharCode(97 + i.corect)}) {i.variante[i.corect]}
              </li>
            ))}
          </ol>
        </div>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-xl font-bold text-foreground">Generator de teste</h1>
      <p className="mt-1 text-sm text-foreground/60">
        Testul și baremul se generează din aceleași întrebări, ca să nu apară inconsecvențe.
      </p>

      <div className="mt-6 max-w-xl space-y-5">
        <div>
          <label className="block text-sm font-semibold text-foreground/80">Clasă</label>
          <select
            value={clasa}
            onChange={(e) => {
              setClasa(e.target.value);
              setModuleSelectate(new Set());
            }}
            className="mt-1 w-full rounded-lg border border-black/10 px-3 py-2 text-sm"
          >
            {capitoleLiceu.map((c) => (
              <option key={c.clasa} value={c.clasa}>
                Clasa a {c.clasa}-a
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-semibold text-foreground/80">Module</label>
          <div className="mt-2 grid max-h-56 gap-1.5 overflow-y-auto rounded-lg border border-black/10 p-3 sm:grid-cols-2">
            {capitolCurent?.module.map((m) => (
              <label key={m.cod} className="flex cursor-pointer items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  checked={moduleSelectate.has(m.cod)}
                  onChange={() => toggleModul(m.cod)}
                  className="h-4 w-4 accent-brand"
                />
                {m.cod} {m.titlu}
              </label>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-sm font-semibold text-foreground/80">
            Număr de întrebări
          </label>
          <input
            type="number"
            min={1}
            max={50}
            value={nrIntrebari}
            onChange={(e) => setNrIntrebari(Number(e.target.value) || 1)}
            className="mt-1 w-32 rounded-lg border border-black/10 px-3 py-2 text-sm"
          />
        </div>

        {eroare && <p className="text-sm text-red-600">{eroare}</p>}

        <button
          type="button"
          disabled={sePending || moduleSelectate.size === 0}
          onClick={genereaza}
          className="rounded-xl bg-brand px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-brand-dark disabled:opacity-50"
        >
          {sePending ? "Se generează..." : "Generează testul"}
        </button>
      </div>
    </div>
  );
}
