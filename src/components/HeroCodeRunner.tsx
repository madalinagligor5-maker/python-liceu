"use client";

import { useState } from "react";
import { incarcaPyodide } from "@/lib/pyodide";

const EXEMPLE = [
  {
    titlu: "Salut & Buclă",
    cod: `for i in range(1, 6):\n    print(f"Ziua {i}: Python e fun!")\n\ndef salut():\n    return "Bine ai venit la Academia Python!"\n\nprint(salut())`,
  },
  {
    titlu: "Generator Scuze Temă 🤖",
    cod: `import random\n\nmotive = ["pisica a mâncat cablul", "wi-fi-ul a fost mâncat de monștri", "algoritmul a intrat în buclă infinită"]  \nreactie = ["dar am rezolvat acum!", "dar promit că scriu cod mai repede azi."]\n\nscuza = f"N-am făcut tema pentru că {random.choice(motive)}, {random.choice(reactie)}"\nprint("🤖 Scuză generată:", scuza)`,
  },
  {
    titlu: "Pattern de Stele ⭐",
    cod: `for i in range(1, 6):\n    print("⭐ " * i)\nprint("Gata piramida!")`,
  },
];

export default function HeroCodeRunner() {
  const [cod, setCod] = useState(EXEMPLE[0].cod);
  const [ruland, setRuland] = useState(false);
  const [invaluitWasm, setInvaluitWasm] = useState(false);
  const [output, setOutput] = useState<string | null>(null);
  const [eroare, setEroare] = useState<string | null>(null);

  const executaCod = async () => {
    setRuland(true);
    setEroare(null);
    setOutput(null);

    let lns: string[] = [];

    try {
      if (!(window as unknown as { __pyodideInstance?: unknown }).__pyodideInstance) {
        setInvaluitWasm(true);
      }

      const py = await incarcaPyodide();
      setInvaluitWasm(false);

      py.setStdout({
        batched: (s: string) => {
          lns.push(s);
        },
      });
      py.setStderr({
        batched: (s: string) => {
          lns.push(`[Eroare]: ${s}`);
        },
      });

      await py.runPythonAsync(cod);
      setOutput(lns.join("\n") || "Execuție finalizată fără ieșire text (print).");
    } catch (e: unknown) {
      console.error("Hero Pyodide err:", e);
      setInvaluitWasm(false);
      setEroare("Interpretorul Python nu a putut fi încărcat momentan — încearcă din nou sau explorează lecțiile gratuite.");
    } finally {
      setRuland(false);
    }
  };

  const reseteaza = () => {
    setCod(EXEMPLE[0].cod);
    setOutput(null);
    setEroare(null);
  };

  return (
    <div className="rounded-2xl border border-[#313244] bg-[#1E1E2E] shadow-2xl overflow-hidden font-mono">
      {/* Selector de Exemple didactice "Încearcă:" */}
      <div className="flex flex-wrap items-center gap-2 bg-[#11111b] px-4 py-2 border-b border-[#313244] text-xs">
        <span className="text-slate-400 font-sans text-[11px] font-bold">Încearcă:</span>
        {EXEMPLE.map((ex, i) => (
          <button
            key={i}
            onClick={() => {
              setCod(ex.cod);
              setOutput(null);
              setEroare(null);
            }}
            className="rounded-lg bg-[#313244]/70 hover:bg-amber-400/20 hover:border-amber-400/50 border border-slate-700/60 text-amber-300 px-2.5 py-1 text-[11px] font-sans font-semibold transition"
          >
            {ex.titlu}
          </button>
        ))}
      </div>

      {/* Bară de sus IDE macOS style */}
      <div className="flex items-center justify-between border-b border-[#313244] bg-[#181825] px-4 py-2.5">
        <div className="flex items-center gap-2">
          <span className="h-3 w-3 rounded-full bg-red-500/80" />
          <span className="h-3 w-3 rounded-full bg-yellow-500/80" />
          <span className="h-3 w-3 rounded-full bg-green-500/80" />
          <div className="ml-3 flex items-center gap-1.5 rounded-lg bg-[#313244]/80 px-3 py-1 text-xs font-mono text-indigo-300 border border-slate-700/50">
            <span>🐍</span> main.py
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={reseteaza}
            className="text-[11px] text-slate-400 hover:text-slate-200 transition font-mono px-2 py-1"
          >
            Reset
          </button>
        </div>
      </div>

      {/* Editor cod */}
      <div className="p-4 font-mono text-xs sm:text-sm text-slate-200 leading-relaxed overflow-x-auto">
        <textarea
          value={cod}
          onChange={(e) => setCod(e.target.value)}
          spellCheck={false}
          rows={7}
          className="w-full bg-transparent text-amber-300 font-mono text-xs sm:text-sm focus:outline-none resize-none leading-relaxed"
        />
      </div>

      {/* Buton Rulează & Stare */}
      <div className="flex items-center justify-between border-t border-[#313244] bg-[#181825] px-4 py-3">
        <button
          onClick={executaCod}
          disabled={ruland}
          className="flex items-center gap-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-extrabold text-xs px-4 py-2 shadow-md transition active:scale-95 disabled:opacity-50"
        >
          <span>{ruland ? "⏳" : "▶"}</span>
          <span>
            {ruland
              ? invaluitWasm
                ? "Se încarcă interpretorul Python..."
                : "Se execută..."
              : "Rulează codul"}
          </span>
        </button>

        {output && (
          <span className="text-[11px] font-bold text-emerald-400 flex items-center gap-1">
            <span>✓</span> Rulare reușită!
          </span>
        )}
      </div>

      {/* Erori Fallback */}
      {eroare && (
        <div className="border-t border-red-500/30 bg-red-950/40 p-4 font-sans text-xs text-red-300">
          ⚠️ {eroare}
        </div>
      )}

      {/* Terminal de ieșire */}
      {output && (
        <div className="border-t border-[#313244] bg-[#11111b] p-4 font-mono text-xs text-emerald-400 whitespace-pre-wrap leading-relaxed animate-fadeIn">
          <div className="text-[10px] text-slate-500 uppercase tracking-widest mb-1 select-none font-sans">
            Consolă Ieșire (Terminal):
          </div>
          {output}
        </div>
      )}
    </div>
  );
}
