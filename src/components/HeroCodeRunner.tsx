"use client";

import { useRef, useState } from "react";
import { esteInterpretorIncarcat, explicaEroarea, ruleazaPython, type EroarePython } from "@/lib/pythonRunner";

// Exemple scurte, pentru cineva care n-a scris niciodată cod: fiecare arată
// o singură idee și produce imediat un rezultat vizibil.
const EXEMPLE = [
  {
    titlu: "Primul program",
    cod: `print("Salut! Acesta este primul meu program.")`,
  },
  {
    titlu: "Un calcul",
    cod: `nota1 = 8\nnota2 = 10\nmedia = (nota1 + nota2) / 2\nprint("Media este", media)`,
  },
  {
    titlu: "O repetare",
    cod: `for i in range(1, 4):\n    print("Pasul", i)`,
  },
];

type Stare = "inactiv" | "incarcare" | "rulare";

export default function HeroCodeRunner() {
  const [cod, setCod] = useState(EXEMPLE[0].cod);
  const [stare, setStare] = useState<Stare>("inactiv");
  const [output, setOutput] = useState<string | null>(null);
  const [eroare, setEroare] = useState<EroarePython | null>(null);
  const [mesaj, setMesaj] = useState<string | null>(null);
  const opresteRef = useRef<(() => void) | null>(null);

  const executaCod = async () => {
    setEroare(null);
    setMesaj(null);
    setOutput(null);
    setStare(esteInterpretorIncarcat() ? "rulare" : "incarcare");

    let text = "";
    const { rezultat, opreste } = ruleazaPython(cod, {
      onStart: () => setStare("rulare"),
      onStdout: (s) => {
        text += s;
        setOutput(text);
      },
      onStderr: (s) => {
        text += s;
        setOutput(text);
      },
    });
    opresteRef.current = opreste;
    const r = await rezultat;
    opresteRef.current = null;
    setStare("inactiv");

    if (r.status === "ok") {
      if (!text) setOutput("Programul a rulat, dar nu a afișat nimic. Adaugă un print().");
    } else if (r.status === "eroare-python") {
      setEroare(r.eroare);
    } else if (r.status === "timeout") {
      setMesaj("Execuția a fost oprită după 8 secunde — probabil o buclă care nu se termină.");
    } else if (r.status === "oprit") {
      setMesaj("Execuția a fost oprită.");
    } else {
      setMesaj("Interpretorul Python nu a putut fi încărcat. Verifică conexiunea și încearcă din nou.");
    }
  };

  const alegeExemplu = (c: string) => {
    setCod(c);
    setOutput(null);
    setEroare(null);
    setMesaj(null);
  };

  const ruleaza = stare !== "inactiv";

  return (
    <div className="rounded-2xl border border-[#313244] bg-[#1E1E2E] shadow-2xl overflow-hidden font-mono">
      <div className="flex flex-wrap items-center gap-2 bg-[#11111b] px-4 py-2 border-b border-[#313244] text-xs">
        <span className="text-slate-300 font-sans text-[11px] font-bold">Încearcă:</span>
        {EXEMPLE.map((ex) => (
          <button
            key={ex.titlu}
            type="button"
            onClick={() => alegeExemplu(ex.cod)}
            aria-pressed={cod === ex.cod}
            className={`rounded-lg border px-2.5 py-1 text-[11px] font-sans font-semibold transition ${
              cod === ex.cod
                ? "border-amber-400 bg-amber-400/20 text-amber-200"
                : "border-slate-700/60 bg-[#313244]/70 text-amber-300 hover:bg-amber-400/20"
            }`}
          >
            {ex.titlu}
          </button>
        ))}
      </div>

      <div className="flex items-center justify-between border-b border-[#313244] bg-[#181825] px-4 py-2.5">
        <div className="flex items-center gap-2" aria-hidden="true">
          <span className="h-3 w-3 rounded-full bg-red-500/80" />
          <span className="h-3 w-3 rounded-full bg-yellow-500/80" />
          <span className="h-3 w-3 rounded-full bg-green-500/80" />
          <span className="ml-3 rounded-lg bg-[#313244]/80 px-3 py-1 text-xs text-blue-300 border border-slate-700/50">
            main.py
          </span>
        </div>
        <button
          type="button"
          onClick={() => alegeExemplu(EXEMPLE[0].cod)}
          className="text-[11px] text-slate-300 hover:text-white transition px-2 py-1"
        >
          Resetează
        </button>
      </div>

      <div className="p-4">
        <label htmlFor="hero-cod" className="sr-only">
          Cod Python de încercat
        </label>
        <textarea
          id="hero-cod"
          value={cod}
          onChange={(e) => setCod(e.target.value)}
          spellCheck={false}
          autoCapitalize="off"
          autoCorrect="off"
          wrap="off"
          rows={5}
          className="w-full overflow-x-auto bg-transparent text-amber-200 font-mono text-sm resize-none leading-relaxed rounded focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-300"
        />
      </div>

      <div className="flex flex-wrap items-center justify-between gap-2 border-t border-[#313244] bg-[#181825] px-4 py-3">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={executaCod}
            disabled={ruleaza}
            className="flex items-center gap-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-extrabold text-xs px-4 py-2 shadow-md transition active:scale-95 disabled:opacity-60 font-sans"
          >
            <span aria-hidden="true">{ruleaza ? "⏳" : "▶"}</span>
            <span>
              {stare === "incarcare" ? "Se încarcă Python…" : stare === "rulare" ? "Se execută…" : "Rulează codul"}
            </span>
          </button>
          {ruleaza && (
            <button
              type="button"
              onClick={() => opresteRef.current?.()}
              className="rounded-xl border border-red-400/60 px-3 py-2 text-xs font-bold text-red-300 hover:bg-red-950/50 font-sans"
            >
              Oprește
            </button>
          )}
        </div>
        <span className="text-[11px] text-slate-400 font-sans">Rulează în browser, fără instalare</span>
      </div>

      <div aria-live="polite">
        {(eroare || mesaj) && (
          <div className="border-t border-red-500/30 bg-red-950/40 p-4 font-sans text-xs text-red-200">
            {eroare ? (
              <>
                <pre className="mb-2 overflow-x-auto font-mono text-red-300">{eroare.traceback}</pre>
                <p>{explicaEroarea(eroare)}</p>
              </>
            ) : (
              <p>{mesaj}</p>
            )}
          </div>
        )}

        {output && (
          <div className="border-t border-[#313244] bg-[#11111b] p-4 font-mono text-xs text-emerald-300 whitespace-pre-wrap break-words leading-relaxed">
            <div className="text-[10px] text-slate-400 uppercase tracking-widest mb-1 select-none font-sans">
              Rezultat
            </div>
            {output}
          </div>
        )}
      </div>
    </div>
  );
}
