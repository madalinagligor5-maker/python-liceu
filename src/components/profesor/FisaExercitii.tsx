"use client";

import { useState } from "react";
import type { Exercitiu } from "@/lib/exercitii-tipuri";
import PrintButton from "@/components/PrintButton";

function Barem({ ex }: { ex: Exercitiu }) {
  if (ex.tip === "cod") {
    return ex.expectedOutput ? (
      <p className="mt-2 rounded-lg bg-emerald-50 px-3 py-2 text-xs text-emerald-800">
        <strong>Barem — output așteptat:</strong> <code>{ex.expectedOutput}</code>
      </p>
    ) : null;
  }
  if (ex.tip === "ordonare") {
    return (
      <p className="mt-2 rounded-lg bg-emerald-50 px-3 py-2 text-xs text-emerald-800">
        <strong>Barem — ordinea corectă:</strong> {ex.ordineCorecta.join(" → ")}
      </p>
    );
  }
  return ex.modelRaspuns ? (
    <p className="mt-2 rounded-lg bg-emerald-50 px-3 py-2 text-xs text-emerald-800">
      <strong>Barem — model de răspuns:</strong> {ex.modelRaspuns}
    </p>
  ) : null;
}

function CorpExercitiu({ ex }: { ex: Exercitiu }) {
  if (ex.tip === "cod") {
    return ex.template ? (
      <pre className="mt-2 overflow-x-auto rounded-lg bg-black/[0.04] p-3 text-xs">{ex.template}</pre>
    ) : (
      <div className="mt-2 h-24 rounded-lg border border-dashed border-black/15" />
    );
  }
  if (ex.tip === "ordonare") {
    return (
      <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-foreground/80">
        {ex.pasi.map((p, i) => (
          <li key={i}>{p}</li>
        ))}
      </ul>
    );
  }
  return <div className="mt-2 h-20 rounded-lg border border-dashed border-black/15" />;
}

export default function FisaExercitii({
  grupeExercitii,
}: {
  grupeExercitii: { sublectieCod: string; sublectieTitlu: string; exercitii: Exercitiu[] }[];
}) {
  const [arataBarem, setArataBarem] = useState(false);

  return (
    <div>
      <div className="print-hidden mb-6 flex flex-wrap items-center justify-between gap-3">
        <label className="flex cursor-pointer items-center gap-2 text-sm font-semibold text-foreground">
          <input
            type="checkbox"
            checked={arataBarem}
            onChange={(e) => setArataBarem(e.target.checked)}
            className="h-4 w-4 accent-brand"
          />
          Arată baremul / soluțiile
        </label>
        <PrintButton />
      </div>

      {arataBarem && (
        <p className="print-hidden mb-4 rounded-xl border border-amber-200 bg-amber-50 px-4 py-2 text-xs font-semibold text-amber-800">
          Varianta cu barem — nu o da direct elevilor.
        </p>
      )}

      <div className="space-y-8">
        {grupeExercitii.map((g) => (
          <div key={g.sublectieCod}>
            <h2 className="text-sm font-bold uppercase tracking-wide text-foreground/50">
              {g.sublectieCod} {g.sublectieTitlu}
            </h2>
            <div className="mt-3 space-y-4">
              {g.exercitii.map((ex) => (
                <div key={ex.id} className="rounded-xl border border-black/10 p-4">
                  <p className="text-sm font-semibold text-foreground">{ex.enunt}</p>
                  <CorpExercitiu ex={ex} />
                  {arataBarem && <Barem ex={ex} />}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
