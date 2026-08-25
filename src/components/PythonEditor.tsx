"use client";

import { useState } from "react";

type Props = {
  /** Codul inițial (poate conține găuri ___ care devin input-uri). */
  initialCode?: string;
  /** Output-ul așteptat pentru verificare automată (opțional). */
  expectedOutput?: string;
  /** Label afișat deasupra editorului. */
  titlu?: string;
  /** Înălțimea în px a zonei de cod. */
  height?: number;
  /** Apelat când elevul apasă „Rulează codul" (indiferent de rezultat). */
  onVerificat?: () => void;
  /** Apelat când se modifică codul în editor. */
  onCodeChange?: (code: string) => void;
};

// Pyodide se încarcă o singură dată per pagină. Ținem instanța Pyodide
// (nu doar promisiunea de apel loadPyodide) într-o variabilă globală, ca să
// o putem refolosi între toate editorele de pe pagină fără să re-inițializăm
// (loadPyodide aruncă eroare dacă e apelat de 2 ori).
import { incarcaPyodide } from "@/lib/pyodide";

export default function PythonEditor({
  initialCode = 'print("Salut, lume!")',
  expectedOutput,
  titlu = "Scrie codul tău Python",
  height = 220,
  onVerificat,
  onCodeChange,
}: Props) {
  const [cod, setCod] = useState(initialCode);
  const [output, setOutput] = useState("");
  const [eroare, setEroare] = useState("");
  const [ruleaza, setRuleaza] = useState(false);
  const [verdict, setVerdict] = useState<"ok" | "gresit" | null>(null);
  const [folosestePy, setFolosestePy] = useState(true);

  const ruleazaCod = async () => {
    setRuleaza(true);
    setEroare("");
    setVerdict(null);
    setOutput("");
    try {
      const py = await incarcaPyodide();
      let capturat = "";
      py.setStdout({ batched: (s: string) => { capturat += s; setOutput(capturat); } });
      py.setStderr({ batched: (s: string) => setEroare((e) => e + s) });
      await py.runPythonAsync(cod);
      if (expectedOutput !== undefined) {
        const curat = (s: string) => s.replace(/\s+/g, " ").trim();
        // Extrage toate numerele din text (indiferent de cuvintele din jur).
        // Rezolvă cazul în care elevul scrie „Media este: 8.67” iar
        // așteptarea e doar „8.67”, sau afișează 8.67 în loc de 8.666… .
        const extrageNumere = (s: string): number[] => {
          const m = s.replace(",", ".").match(/-?\d+(\.\d+)?/g);
          return m ? m.map(Number) : [];
        };
        const nrOut = extrageNumere(capturat);
        const nrExp = extrageNumere(String(expectedOutput));
        if (nrOut.length > 0 && nrExp.length > 0) {
          const potrivite =
            nrOut.length === nrExp.length &&
            nrOut.every((v, i) => Math.abs(v - nrExp[i]) < 0.01);
          setVerdict(potrivite ? "ok" : "gresit");
        } else {
          setVerdict(curat(capturat) === curat(expectedOutput) ? "ok" : "gresit");
        }
      }
      onVerificat?.();
    } catch (e) {
      console.error("PYODIDE_ERR", e);
      setEroare("Interpretorul Python nu a putut fi încărcat.");
      setFolosestePy(false);
    } finally {
      setRuleaza(false);
    }
  };

  return (
    <div className="rounded-2xl border border-brand-border bg-white p-4 shadow-sm">
      {titlu && (
        <div className="mb-2 flex items-center gap-2">
          <span className="text-xl" aria-hidden="true">
            🐍
          </span>
          <h4 className="text-sm font-semibold text-foreground">{titlu}</h4>
        </div>
      )}

      <div className="relative rounded-xl border border-black/10 bg-[#1e1b3a] overflow-hidden">
        <div className="flex items-center gap-1.5 border-b border-white/10 px-3 py-1.5">
          <span className="h-2.5 w-2.5 rounded-full bg-[#ff5f56]" />
          <span className="h-2.5 w-2.5 rounded-full bg-[#ffbd2e]" />
          <span className="h-2.5 w-2.5 rounded-full bg-[#27c93f]" />
          <span className="ml-2 text-xs text-white/50">python</span>
        </div>
        <textarea
          value={cod}
          onChange={(e) => {
            const val = e.target.value;
            setCod(val);
            onCodeChange?.(val);
          }}
          spellCheck={false}
          className="block w-full resize-y bg-transparent p-3 font-mono text-sm leading-relaxed text-white outline-none"
          style={{ minHeight: height }}
        />
      </div>

      <div className="mt-3 flex flex-wrap items-center gap-3">
        <button
          type="button"
          onClick={ruleazaCod}
          disabled={ruleaza}
          className="rounded-lg bg-amber-400 hover:bg-amber-500 px-4 py-2 text-sm font-black text-slate-950 transition disabled:cursor-not-allowed disabled:opacity-50 shadow-xs cursor-pointer"
        >
          {ruleaza ? "Se rulează…" : "▶ Rulează codul"}
        </button>
        {verdict === "ok" && (
          <span className="text-sm font-semibold text-success">
            ✓ Corect! Output-ul e exact cum trebuie.
          </span>
        )}
        {verdict === "gresit" && (
          <span className="text-sm font-semibold text-red-600">
            ✗ Output-ul tău diferă de cel așteptat. Încearcă din nou.
          </span>
        )}
      </div>

      {(output || eroare) && (
        <pre className="mt-3 max-h-48 overflow-auto rounded-lg bg-black/90 p-3 font-mono text-xs leading-relaxed text-green-300">
          {output}
          {eroare && <span className="text-red-400">{eroare}</span>}
        </pre>
      )}

      {!folosestePy && (
        <p className="mt-2 text-xs text-amber-600">
          Interpretorul Python nu a putut fi încărcat (necesită conexiune la
          CDN și cross-origin isolation). Verificarea automată a output-ului e
          suspendată.
        </p>
      )}
    </div>
  );
}
