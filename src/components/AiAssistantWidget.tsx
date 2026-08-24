"use client";

import { useState } from "react";

export default function AiAssistantWidget() {
  const [deschis, setDeschis] = useState(false);
  const [intrebare, setIntrebare] = useState("");
  const [raspuns, setRaspuns] = useState<string | null>(null);
  const [seIncarca, setSeIncarca] = useState(false);

  const intreaba = (e: React.FormEvent) => {
    e.preventDefault();
    if (!intrebare.trim()) return;
    setSeIncarca(true);
    setRaspuns(null);

    setTimeout(() => {
      setSeIncarca(false);
      setRaspuns(
        `🤖 **Profesor AI:** Excelentă întrebare! În Python, ` +
          `\`for i in range(1, 6)\` generează o secvență de numere de la 1 la 5. ` +
          `Dacă ai nevoie de ajutor la orice exercițiu, te ajut pas cu pas!`
      );
    }, 800);
  };

  return (
    <div className="rounded-2xl border border-indigo-500/30 bg-gradient-to-br from-indigo-950/80 via-slate-900/90 to-purple-950/80 p-5 shadow-2xl backdrop-blur-md">
      <div className="flex items-center gap-3">
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-500/20 text-3xl border border-indigo-400/40 shadow-inner">
          🤖
        </div>
        <div>
          <h3 className="font-extrabold text-white text-sm">Profesor Asistent AI</h3>
          <p className="text-xs text-indigo-200/80 leading-snug">
            Ai o întrebare? Îți ofer răspunsuri, sfaturi și exemple de cod!
          </p>
        </div>
      </div>

      {!deschis ? (
        <button
          onClick={() => setDeschis(true)}
          className="mt-4 w-full rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-extrabold text-xs py-2.5 shadow-lg transition active:scale-95 flex items-center justify-center gap-1.5"
        >
          <span>Întreabă-mă</span>
          <span className="text-amber-300">✨</span>
        </button>
      ) : (
        <form onSubmit={intreaba} className="mt-4 space-y-3">
          <input
            type="text"
            value={intrebare}
            onChange={(e) => setIntrebare(e.target.value)}
            placeholder="Ex: Cum funcționează bucla for?"
            className="w-full rounded-xl bg-slate-950/80 border border-indigo-400/40 px-3 py-2 text-xs font-medium text-white placeholder:text-slate-500 focus:outline-none focus:border-indigo-400"
          />
          <div className="flex gap-2">
            <button
              type="submit"
              disabled={seIncarca || !intrebare.trim()}
              className="flex-1 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-xs py-2 transition shadow-md disabled:opacity-50"
            >
              {seIncarca ? "Se gândește..." : "Trimite întrebarea"}
            </button>
            <button
              type="button"
              onClick={() => {
                setDeschis(false);
                setRaspuns(null);
              }}
              className="rounded-xl bg-slate-800 text-slate-400 px-3 py-2 text-xs hover:text-white"
            >
              ✕
            </button>
          </div>
          {raspuns && (
            <div className="rounded-xl bg-indigo-950/90 border border-indigo-500/40 p-3 text-xs text-indigo-100 font-sans leading-relaxed animate-fadeIn">
              {raspuns}
            </div>
          )}
        </form>
      )}
    </div>
  );
}
