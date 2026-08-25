"use client";

import { useState } from "react";
import { intreabaAsistentDemo } from "@/app/actions/ai-demo";

export default function AiAssistantWidget() {
  const [deschis, setDeschis] = useState(false);
  const [intrebare, setIntrebare] = useState("");
  const [raspuns, setRaspuns] = useState<string | null>(null);
  const [eroare, setEroare] = useState<string | null>(null);
  const [seIncarca, setSeIncarca] = useState(false);

  const intreaba = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!intrebare.trim() || seIncarca) return;

    setSeIncarca(true);
    setRaspuns(null);
    setEroare(null);

    try {
      const res = await intreabaAsistentDemo(intrebare);
      if (res.ok && res.raspuns) {
        setRaspuns(res.raspuns);
      } else {
        setEroare(res.eroare ?? "A apărut o eroare la comunicarea cu asistentul AI.");
      }
    } catch (err) {
      console.error("Eroare AI Widget:", err);
      setEroare("Serviciul AI este temporar indisponibil. Încearcă din nou mai târziu.");
    } finally {
      setSeIncarca(false);
    }
  };

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-lg text-slate-900">
      <div className="flex items-center gap-3">
        <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-blue-50 border border-blue-200 text-2xl shrink-0">
          🤖
        </div>
        <div>
          <h3 className="font-extrabold text-slate-950 text-sm">Profesor Asistent AI (Demo)</h3>
          <p className="text-xs text-slate-600 font-medium leading-snug">
            Ai o întrebare? Îți ofer răspunsuri, sfaturi și exemple de cod!
          </p>
        </div>
      </div>

      {!deschis ? (
        <button
          onClick={() => setDeschis(true)}
          className="mt-3.5 w-full rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-black text-xs py-2.5 shadow-sm transition active:scale-95 flex items-center justify-center gap-1.5"
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
            maxLength={300}
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
                setEroare(null);
              }}
              className="rounded-xl bg-slate-100 text-slate-600 px-3 py-2 text-xs hover:bg-slate-200"
            >
              ✕
            </button>
          </div>

          {raspuns && (
            <div className="rounded-xl bg-blue-50 border border-blue-200 p-3 text-xs text-blue-950 font-sans leading-relaxed animate-fadeIn">
              <strong>🤖 Profesor AI:</strong> {raspuns}
            </div>
          )}

          {eroare && (
            <div className="rounded-xl bg-amber-50 border border-amber-200 p-3 text-xs text-amber-900 font-sans leading-relaxed animate-fadeIn">
              ⚠️ {eroare}
            </div>
          )}

          <p className="text-[10px] text-slate-400 text-center font-medium pt-1">
            Ai o întrebare gratuită pe zi. Creează-ți un cont pentru acces nelimitat (în limita planului tău).
          </p>
        </form>
      )}
    </div>
  );
}
