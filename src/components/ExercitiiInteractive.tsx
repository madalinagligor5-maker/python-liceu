"use client";

import { useState } from "react";
import PythonEditor from "@/components/PythonEditor";
import type { Exercitiu } from "@/lib/exercitii";

export default function ExercitiiInteractive({
  exercitii,
}: {
  exercitii: Exercitiu[];
}) {
  const [arataHint, setArataHint] = useState<Record<string, boolean>>({});

  if (!exercitii.length) return null;

  return (
    <div className="mt-6 space-y-6">
      <h3 className="flex items-center gap-2 text-lg font-bold text-foreground">
        <span className="text-2xl" aria-hidden="true">
          💻
        </span>
        Exerciții — scrie și rulează codul
      </h3>

      {exercitii.map((ex, i) => (
        <div
          key={ex.id}
          className="rounded-2xl border border-brand-border bg-white p-5 shadow-sm"
        >
          <p className="text-sm font-medium text-foreground">
            <span className="mr-2 rounded-md bg-brand-light px-2 py-0.5 text-xs font-bold text-brand-dark">
              Exercițiul {i + 1}
            </span>
            {ex.enunt}
          </p>

          <div className="mt-3">
            <PythonEditor
              initialCode={ex.template || "# Scrie aici codul tău Python\n"}
              expectedOutput={ex.expectedOutput}
              titlu="Editor Python (rulează în browser)"
              height={ex.template ? 180 : 140}
            />
          </div>

          {ex.hint && (
            <div className="mt-2">
              <button
                type="button"
                onClick={() =>
                  setArataHint((p) => ({ ...p, [ex.id]: !p[ex.id] }))
                }
                className="text-xs font-medium text-brand hover:text-brand-dark"
              >
                {arataHint[ex.id] ? "Ascunde indiciul" : "Arată un indiciu"}
              </button>
              {arataHint[ex.id] && (
                <p className="mt-1 rounded-lg bg-brand-light/60 p-2 font-mono text-xs text-brand-dark">
                  {ex.hint}
                </p>
              )}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
