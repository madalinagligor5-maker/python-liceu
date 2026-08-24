"use client";
import { useState } from "react";

type Props = {
  cod: string;
  vizibil: boolean;
};

export default function PythonPanel({ cod, vizibil }: Props) {
  const [deschis, setDeschis] = useState(false);

  if (!vizibil) return null;

  return (
    <div className="rounded-2xl border-2 border-indigo-300 bg-slate-900 overflow-hidden shadow-md transition-all">
      {/* Header cu buton de colapsare */}
      <button
        onClick={() => setDeschis(!deschis)}
        className="w-full flex items-center gap-2 bg-slate-800 hover:bg-slate-750 px-4 py-2.5 text-left transition select-none cursor-pointer"
      >
        <span className="text-lg">🐍</span>
        <span className="text-xs font-black text-indigo-300 uppercase tracking-wider">
          Limba secretă Python
        </span>
        <span className="ml-auto rounded-lg bg-indigo-950 px-2 py-0.5 text-[10px] font-bold text-indigo-200 border border-indigo-700">
          {deschis ? "Ascunde ▲" : "Vezi codul Python ▼"}
        </span>
      </button>

      {/* Corp cod colapsabil */}
      {deschis && (
        <pre className="p-4 text-xs sm:text-sm text-emerald-300 font-mono leading-relaxed overflow-x-auto whitespace-pre-wrap max-h-48 border-t border-slate-800 bg-slate-950">
          {cod || (
            <span className="text-slate-500 italic">
              # Adaugă blocuri în stânga ca să generezi codul Python...
            </span>
          )}
        </pre>
      )}
    </div>
  );
}
