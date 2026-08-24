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
    <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-lg text-slate-900">
      <div className="flex items-center gap-3">
        <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-indigo-50 border border-indigo-200 text-2xl shrink-0">
          🤖
        </div>
        <div>
          <h3 className="font-extrabold text-slate-900 text-sm">Profesor Asistent AI</h3>
          <p className="text-xs text-slate-500 font-medium leading-snug">
            Ai o întrebare? Îți ofer răspunsuri, sfaturi și exemple de cod!
          </p>
        </div>
      </div>

      {!deschis ? (
        <button
          onClick={() => setDeschis(true)}
          className="mt-3.5 w-full rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-black text-xs py-2.5 shadow-sm transition active:scale-95 flex items-center justify-center gap-1.5"
        >
          <span>Întreabă-mă</span>
          <span className="text-amber-300">✨</span>
        </button>
      ) : (
        <form onSubmit={intreaba} className="mt-3.5 space-y-2.5">
          <input
            type="text"
            value={intrebare}
            onChange={(e) => setIntrebare(e.target.value)}
            placeholder="Ex: Cum funcționează bucla for?"
            className="w-full rounded-xl bg-slate-50 border border-slate-300 px-3 py-2 text-xs font-medium text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-indigo-500"
          />
          <div className="flex gap-2">
            <button
              type="submit"
              disabled={seIncarca || !intrebare.trim()}
              className="flex-1 rounded-xl bg-amber-400 hover:bg-amber-500 text-slate-950 font-black text-xs py-2 transition shadow-xs disabled:opacity-50"
            >
              {seIncarca ? "Se gândește..." : "Trimite întrebarea"}
            </button>
            <button
              type="button"
              onClick={() => {
                setDeschis(false);
                setRaspuns(null);
              }}
              className="rounded-xl bg-slate-100 text-slate-600 px-3 py-2 text-xs hover:bg-slate-200"
            >
              ✕
            </button>
          </div>
          {raspuns && (
            <div className="rounded-xl bg-indigo-50 border border-indigo-200 p-3 text-xs text-indigo-950 font-sans leading-relaxed animate-fadeIn">
              {raspuns}
            </div>
          )}
        </form>
      )}
    </div>
  );
}
