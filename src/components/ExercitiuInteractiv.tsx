"use client";

import { useState } from "react";
import type { ExercitiuInteractiv as ExercitiuInteractivType } from "@/lib/content";
import PythonEditor from "./PythonEditor";
import CodeBlock from "./CodeBlock";

export default function ExercitiuInteractiv({
  exercitiu,
}: {
  exercitiu: ExercitiuInteractivType;
}) {
  const [resetKey, setResetKey] = useState(0);
  const [aratasolutie, setAratasolutie] = useState(false);

  return (
    <div className="rounded-2xl border border-black/10 bg-white p-5 shadow-sm">
      <div className="flex items-center gap-2 mb-3">
        <span className="text-2xl" aria-hidden="true">💻</span>
        <h3 className="font-bold text-lg text-foreground">Exercițiu Practic</h3>
      </div>
      <p className="mb-4 text-sm leading-relaxed text-foreground/80 bg-brand-light/35 p-3.5 rounded-xl border border-black/5">
        {exercitiu.enunt}
      </p>

      <div className="mb-4">
        <PythonEditor
          key={resetKey}
          initialCode={exercitiu.cod_schelet}
          titlu="Scrie și testează codul tău Python în browser:"
          height={200}
        />
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <button
          type="button"
          onClick={() => setResetKey((prev) => prev + 1)}
          className="rounded-lg border border-black/10 px-4 py-2 text-sm font-medium text-foreground/70 transition hover:border-brand hover:text-brand"
        >
          Resetează codul
        </button>
        <button
          type="button"
          onClick={() => setAratasolutie((v) => !v)}
          className="rounded-lg bg-brand px-4 py-2 text-sm font-semibold text-white transition hover:bg-brand-dark"
        >
          {aratasolutie ? "Ascunde soluția" : "Arată soluția"}
        </button>
      </div>

      {aratasolutie && (
        <div className="mt-4 border-t border-black/5 pt-4">
          <CodeBlock code={exercitiu.solutie} label="solutie.py" />
        </div>
      )}
    </div>
  );
}
