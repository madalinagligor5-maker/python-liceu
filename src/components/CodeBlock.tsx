"use client";

import { useState } from "react";
import { explicaLinieCod } from "@/app/actions/ai-evaluation";
import { explicaEroarea, ruleazaPython } from "@/lib/pythonRunner";

export default function CodeBlock({
  code,
  label,
  ruleaza = false,
}: {
  code: string;
  label?: string;
  /** Afișează „Rulează exemplul" (doar pentru exemple complete, fără spații de completat). */
  ruleaza?: boolean;
}) {
  const lines = code.split("\n");
  const [rezultat, setRezultat] = useState<{ text: string; eroare: boolean } | null>(null);
  const [inRulare, setInRulare] = useState(false);

  const ruleazaExemplul = async () => {
    setInRulare(true);
    setRezultat(null);
    let text = "";
    const { rezultat: r } = ruleazaPython(code, {
      onStdout: (s) => (text += s),
      onStderr: (s) => (text += s),
    });
    const final = await r;
    setInRulare(false);
    if (final.status === "ok") setRezultat({ text: text || "(programul nu a afișat nimic)", eroare: false });
    else if (final.status === "eroare-python")
      setRezultat({ text: `${text}${final.eroare.traceback}\n\n${explicaEroarea(final.eroare)}`, eroare: true });
    else if (final.status === "timeout") setRezultat({ text: "Execuția a durat prea mult și a fost oprită.", eroare: true });
    else if (final.status === "eroare-incarcare")
      setRezultat({ text: "Interpretorul Python nu a putut fi încărcat. Verifică conexiunea.", eroare: true });
  };
  const [explanations, setExplanations] = useState<Record<number, string | undefined>>({});
  const [loading, setLoading] = useState<Record<number, boolean>>({});

  const handleExplain = async (index: number, lineText: string) => {
    if (explanations[index]) {
      // Toggle off if already explained
      setExplanations((prev) => {
        const copy = { ...prev };
        delete copy[index];
        return copy;
      });
      return;
    }

    setLoading((prev) => ({ ...prev, [index]: true }));
    try {
      const res = await explicaLinieCod(lineText, code);
      if (res.ok && res.explicatie) {
        setExplanations((prev) => ({ ...prev, [index]: res.explicatie }));
      } else {
        setExplanations((prev) => ({ ...prev, [index]: res.eroare || "Nu s-a putut obține explicația." }));
      }
    } catch (e) {
      setExplanations((prev) => ({ ...prev, [index]: "A apărut o eroare la comunicarea cu asistentul AI." }));
    } finally {
      setLoading((prev) => ({ ...prev, [index]: false }));
    }
  };

  return (
    <div className="overflow-hidden rounded-xl border border-black/10 bg-[#1e1b3a] shadow-depth-md">
      {(label || ruleaza) && (
        <div className="flex items-center gap-1.5 border-b border-white/10 px-4 py-2">
          <span className="h-2.5 w-2.5 rounded-full bg-[#ff5f56]" aria-hidden="true" />
          <span className="h-2.5 w-2.5 rounded-full bg-[#ffbd2e]" aria-hidden="true" />
          <span className="h-2.5 w-2.5 rounded-full bg-[#27c93f]" aria-hidden="true" />
          {label && <span className="ml-2 text-xs font-medium text-white/60">{label}</span>}
          {ruleaza && (
            <button
              type="button"
              onClick={ruleazaExemplul}
              disabled={inRulare}
              className="ml-auto rounded-md bg-amber-400 px-2.5 py-1 text-xs font-black text-slate-950 hover:bg-amber-300 disabled:opacity-60 font-sans"
            >
              {inRulare ? "Se rulează…" : "▶ Rulează exemplul"}
            </button>
          )}
        </div>
      )}
      <div className="overflow-x-auto p-4 text-sm leading-relaxed text-white font-mono">
        <div className="w-max min-w-full">
        {lines.map((line, idx) => {
          const isCode = line.trim().length > 0 && !line.trim().startsWith("#");
          return (
            <div key={idx} className="group relative py-0.5">
              <div className="flex items-center justify-between gap-4">
                <span className="whitespace-pre">{line || " "}</span>
                {isCode && (
                  <button
                    onClick={() => handleExplain(idx, line)}
                    aria-label={`Explică linia ${idx + 1}`}
                    className="opacity-0 group-hover:opacity-100 focus:opacity-100 [@media(hover:none)]:opacity-60 transition-opacity rounded bg-white/10 hover:bg-white/20 px-1.5 py-0.5 text-[10px] text-white/80 shrink-0 cursor-pointer"
                    title="Explică-mi această linie"
                  >
                    {loading[idx] ? "⏳ Se încarcă..." : "💡 Explică"}
                  </button>
                )}
              </div>
              {explanations[idx] && (
                <div className="mt-1.5 mb-2.5 rounded-lg bg-brand/20 border border-brand/30 p-3 text-xs text-amber-100 font-sans whitespace-normal leading-normal select-none">
                  <span className="font-bold text-amber-300 block mb-0.5">🤖 Explicare linie:</span>
                  {explanations[idx]}
                </div>
              )}
            </div>
          );
        })}
        </div>
      </div>
      {rezultat && (
        <div aria-live="polite" className="border-t border-white/10 bg-black/40 p-4">
          <p className="mb-1 text-[10px] font-sans font-bold uppercase tracking-widest text-white/60">Rezultat</p>
          <pre className={`overflow-x-auto whitespace-pre font-mono text-xs ${rezultat.eroare ? "text-red-300" : "text-emerald-300"}`}>
            {rezultat.text}
          </pre>
        </div>
      )}
    </div>
  );
}
