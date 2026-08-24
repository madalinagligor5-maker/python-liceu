"use client";

import { useState } from "react";
import { explicaLinieCod } from "@/app/actions/ai-evaluation";

export default function CodeBlock({ code, label }: { code: string; label?: string }) {
  const lines = code.split("\n");
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
    <div className="overflow-hidden rounded-xl border border-black/10 bg-[#1e1b3a] shadow-sm">
      {label && (
        <div className="flex items-center gap-1.5 border-b border-white/10 px-4 py-2">
          <span className="h-2.5 w-2.5 rounded-full bg-[#ff5f56]" />
          <span className="h-2.5 w-2.5 rounded-full bg-[#ffbd2e]" />
          <span className="h-2.5 w-2.5 rounded-full bg-[#27c93f]" />
          <span className="ml-2 text-xs font-medium text-white/50">{label}</span>
        </div>
      )}
      <div className="p-4 text-sm leading-relaxed text-white font-mono">
        {lines.map((line, idx) => {
          const isCode = line.trim().length > 0 && !line.trim().startsWith("#");
          return (
            <div key={idx} className="group relative py-0.5">
              <div className="flex items-center justify-between gap-4">
                <span className="whitespace-pre">{line || " "}</span>
                {isCode && (
                  <button
                    onClick={() => handleExplain(idx, line)}
                    className="opacity-0 group-hover:opacity-100 focus:opacity-100 transition-opacity rounded bg-white/10 hover:bg-white/20 px-1.5 py-0.5 text-[10px] text-white/80 shrink-0 cursor-pointer"
                    title="Explică-mi această linie"
                  >
                    {loading[idx] ? "⏳ Se încarcă..." : "💡 Explică"}
                  </button>
                )}
              </div>
              {explanations[idx] && (
                <div className="mt-1.5 mb-2.5 rounded-lg bg-brand/20 border border-brand/30 p-3 text-xs text-brand-light font-sans whitespace-normal leading-normal select-none">
                  <span className="font-bold text-amber-300 block mb-0.5">🤖 Explicare linie:</span>
                  {explanations[idx]}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
