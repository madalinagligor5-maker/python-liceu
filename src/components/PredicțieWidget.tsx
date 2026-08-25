"use client";

import { useState } from "react";
import CodeBlock from "@/components/CodeBlock";
import { finalizeazaPredicție } from "@/app/actions/progres";

type Predic = {
  cod: string;
  enunt: string;
  variante: string[];
  corect: number;
};

let pyodidePromisiune: Promise<unknown> | null = null;

async function incarcaPyodide(): Promise<{
  setStdout: (o: { batched: (s: string) => void }) => void;
  runPythonAsync: (c: string) => Promise<void>;
}> {
  if (pyodidePromisiune) return pyodidePromisiune as Promise<{
    setStdout: (o: { batched: (s: string) => void }) => void;
    runPythonAsync: (c: string) => Promise<void>;
  }>;
  pyodidePromisiune = (async () => {
    await new Promise<void>((res) => {
      const s = document.createElement("script");
      s.src = "https://cdn.jsdelivr.net/pyodide/v0.26.4/full/pyodide.js";
      s.onload = () => res();
      s.onerror = () => res();
      document.body.appendChild(s);
    });
    const w = window as unknown as {
      loadPyodide?: (o: { indexURL: string }) => Promise<{
        setStdout: (o: { batched: (s: string) => void }) => void;
        runPythonAsync: (c: string) => Promise<void>;
      }>;
    };
    return w.loadPyodide!({
      indexURL: "https://cdn.jsdelivr.net/pyodide/v0.26.4/full/",
    });
  })();
  return pyodidePromisiune as Promise<{
    setStdout: (o: { batched: (s: string) => void }) => void;
    runPythonAsync: (c: string) => Promise<void>;
  }>;
}

export default function PredicțieWidget({
  predic,
  sublectieCod,
}: {
  predic: Predic;
  sublectieCod: string;
}) {
  const [ales, setAles] = useState<number | null>(null);
  const [dezv, setDezv] = useState(false);
  const [outputReal, setOutputReal] = useState<string>("");
  const [xpMesaj, setXpMesaj] = useState<string>("");

  const verifica = async () => {
    setDezv(true);
    let out = "";
    try {
      const py = await incarcaPyodide();
      py.setStdout({ batched: (s: string) => (out += s) });
      await py.runPythonAsync(predic.cod);
    } catch {
      out = "";
    }
    setOutputReal(out.trim());

    if (ales === predic.corect) {
      try {
        const res = await finalizeazaPredicție("IX", sublectieCod, true);
        if (res.ok) {
          setXpMesaj(
            res.insigneNoi?.includes("predictie-reusita")
              ? "Ai câștigat XP și ai deblocat insigna Predicție! 🏅"
              : "Ai câștigat XP pentru predicția corectă! 🎉"
          );
        }
      } catch {
        // XP-ul e best-effort; nu blocăm afișarea rezultatului.
      }
    }
  };

  const corect = ales === predic.corect;

  return (
    <div className="mt-5 rounded-2xl border border-brand-border bg-white p-5 shadow-sm">
      <div className="flex items-center gap-2">
        <span className="text-2xl" aria-hidden="true">
          🔮
        </span>
        <h4 className="text-base font-bold text-foreground">Predicție</h4>
      </div>
      <p className="mt-2 text-sm text-foreground/70">{predic.enunt}</p>

      <div className="mt-3">
        <CodeBlock code={predic.cod} label="python" />
      </div>

      <div className="mt-3 space-y-2">
        {predic.variante.map((v, i) => {
          let cls =
            "w-full rounded-lg border px-3 py-2 text-left text-sm cursor-pointer transition ";
          if (!dezv) {
            cls +=
              "border-black/15 bg-white hover:border-brand hover:text-brand";
          } else if (i === predic.corect) {
            cls += "border-success bg-green-50 font-semibold text-[#15803d]";
          } else if (i === ales) {
            cls += "border-red-300 bg-red-50 text-red-700";
          } else {
            cls += "border-black/10 bg-black/5 text-foreground/50";
          }
          return (
            <button
              key={i}
              type="button"
              disabled={dezv}
              className={cls}
              onClick={() => setAles(i)}
            >
              {v}
            </button>
          );
        })}
      </div>

      <div className="mt-3 flex items-center gap-3">
        {!dezv ? (
          <button
            type="button"
            disabled={ales === null}
            onClick={verifica}
            className="rounded-lg bg-amber-400 hover:bg-amber-500 px-4 py-2 text-sm font-black text-slate-950 transition disabled:opacity-50"
          >
            Verifică predicția
          </button>
        ) : (
          <button
            type="button"
            onClick={() => {
              setDezv(false);
              setAles(null);
            }}
            className="text-xs text-foreground/60 hover:text-foreground"
          >
            Încearcă din nou
          </button>
        )}
      </div>

      {dezv && (
        <div
          className={`mt-3 rounded-lg p-3 text-sm ${
            corect
              ? "bg-green-50 text-[#15803d]"
              : "bg-red-50 text-red-700"
          }`}
        >
          {corect ? "✓ Corect! " : "✗ Nu chiar. "}
          Codul afișează de fapt:{" "}
          <code className="font-mono">{outputReal || "—"}</code>
          {xpMesaj && <div className="mt-1 font-semibold">{xpMesaj}</div>}
        </div>
      )}
    </div>
  );
}
