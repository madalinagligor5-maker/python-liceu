"use client";

import { useState } from "react";
import type { ExercitiuInteractiv as ExercitiuInteractivType } from "@/lib/content";
import CodeBlock from "./CodeBlock";

export default function ExercitiuInteractiv({
  exercitiu,
}: {
  exercitiu: ExercitiuInteractivType;
}) {
  const [cod, setCod] = useState(exercitiu.cod_schelet);
  const [aratasolutie, setAratasolutie] = useState(false);

  return (
    <div className="rounded-2xl border border-black/10 bg-white p-5 shadow-sm">
      <h3 className="font-semibold text-foreground">Exercițiu</h3>
      <p className="mt-2 text-sm text-foreground/70">{exercitiu.enunt}</p>

      <label className="mt-4 block text-xs font-medium text-foreground/50" htmlFor="editor-exercitiu">
        Scrie sau completează codul tău:
      </label>
      <textarea
        id="editor-exercitiu"
        value={cod}
        onChange={(e) => setCod(e.target.value)}
        spellCheck={false}
        rows={cod.split("\n").length + 1}
        className="mt-2 w-full rounded-xl border border-black/10 bg-[#1e1b3a] p-4 font-mono text-sm text-white shadow-inner outline-none focus:border-brand"
      />

      <div className="mt-4 flex flex-wrap items-center gap-3">
        <button
          type="button"
          onClick={() => setCod(exercitiu.cod_schelet)}
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
        <span className="text-xs text-foreground/40">
          Rularea codului direct în pagină va fi disponibilă în curând.
        </span>
      </div>

      {aratasolutie && (
        <div className="mt-4">
          <CodeBlock code={exercitiu.solutie} label="solutie.py" />
        </div>
      )}
    </div>
  );
}
