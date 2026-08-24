"use client";

import { useState } from "react";

export default function HeroCodeRunner() {
  const [cod, setCod] = useState(
    `for i in range(1, 6):\n    print(f"Ziua {i}: Python e fun!")\n\ndef salut():\n    return "Bine ai venit la Academia Python!"\n\nprint(salut())`
  );
  const [ruland, setRuland] = useState(false);
  const [output, setOutput] = useState<string | null>(null);

  const executaCod = () => {
    setRuland(true);
    setOutput(null);

    setTimeout(() => {
      setRuland(false);
      setOutput(
        `Ziua 1: Python e fun!\nZiua 2: Python e fun!\nZiua 3: Python e fun!\nZiua 4: Python e fun!\nZiua 5: Python e fun!\nBine ai venit la Academia Python!`
      );
    }, 600);
  };

  const reseteaza = () => {
    setCod(
      `for i in range(1, 6):\n    print(f"Ziua {i}: Python e fun!")\n\ndef salut():\n    return "Bine ai venit la Academia Python!"\n\nprint(salut())`
    );
    setOutput(null);
  };

  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900/90 shadow-2xl overflow-hidden backdrop-blur-md">
      {/* Bară de sus IDE macOS style */}
      <div className="flex items-center justify-between border-b border-slate-800 bg-slate-950/80 px-4 py-3">
        <div className="flex items-center gap-2">
          <span className="h-3 w-3 rounded-full bg-red-500/80" />
          <span className="h-3 w-3 rounded-full bg-yellow-500/80" />
          <span className="h-3 w-3 rounded-full bg-green-500/80" />
          <div className="ml-3 flex items-center gap-1.5 rounded-lg bg-slate-800/80 px-3 py-1 text-xs font-mono text-indigo-300 border border-slate-700/50">
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
          className="w-full bg-transparent text-slate-100 font-mono text-xs sm:text-sm focus:outline-none resize-none leading-relaxed"
        />
      </div>

      {/* Buton Rulează & Stare */}
      <div className="flex items-center justify-between border-t border-slate-800 bg-slate-950/60 px-4 py-3">
        <button
          onClick={executaCod}
          disabled={ruland}
          className="flex items-center gap-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-extrabold text-xs px-4 py-2 shadow-lg transition active:scale-95 disabled:opacity-50"
        >
          <span>{ruland ? "⏳" : "▶"}</span>
          <span>{ruland ? "Se execută..." : "Rulează codul"}</span>
        </button>

        {output && (
          <span className="text-[11px] font-bold text-emerald-400 flex items-center gap-1">
            <span>✓</span> Codul a rulat cu succes!
          </span>
        )}
      </div>

      {/* Terminal de ieșire */}
      {output && (
        <div className="border-t border-slate-800 bg-black/90 p-4 font-mono text-xs text-emerald-400 whitespace-pre-wrap leading-relaxed animate-fadeIn">
          <div className="text-[10px] text-slate-500 uppercase tracking-widest mb-1 select-none">
            Consolă Ieșire (Terminal):
          </div>
          {output}
        </div>
      )}
    </div>
  );
}
