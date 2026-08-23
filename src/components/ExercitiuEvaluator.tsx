"use client";

import { useState } from "react";
import { evalueazaCodCuAI, type FeedbackAI } from "@/app/actions/ai-evaluation";

type Props = {
  titlu: string;
  enunt: string;
  template: string;
  expectedOutput: string;
};

type PyodideApi = {
  setStdout: (o: { batched: (s: string) => void }) => void;
  setStderr: (o: { batched: (s: string) => void }) => void;
  runPythonAsync: (code: string) => Promise<void>;
};

declare global {
  interface Window {
    loadPyodide?: (opts: { indexURL: string }) => Promise<PyodideApi>;
    __pyodideInstance?: PyodideApi | null;
  }
}

async function incarcaPyodide(): Promise<PyodideApi> {
  if (typeof window !== "undefined" && window.__pyodideInstance) {
    return window.__pyodideInstance;
  }
  if (
    typeof window !== "undefined" &&
    !window.loadPyodide &&
    !document.querySelector("script[data-pyodide]")
  ) {
    await new Promise<void>((res, rej) => {
      const s = document.createElement("script");
      s.src = "/pyodide/pyodide.js";
      s.setAttribute("data-pyodide", "1");
      s.onload = () => res();
      s.onerror = () => rej(new Error("Nu s-a putut încărca interpretorul Python."));
      document.body.appendChild(s);
    });
  }
  if (typeof window === "undefined" || !window.loadPyodide) {
    throw new Error("Interpretorul Python nu a putut fi inițializat.");
  }
  const existenta = (window as unknown as { pyodide?: PyodideApi }).pyodide;
  const py = existenta ?? (await window.loadPyodide({ indexURL: "/pyodide/" }));
  if (typeof window !== "undefined") window.__pyodideInstance = py;
  return py;
}

export default function ExercitiuEvaluator({
  titlu,
  enunt,
  template,
  expectedOutput,
}: Props) {
  const [cod, setCod] = useState(template);
  const [output, setOutput] = useState("");
  const [eroare, setEroare] = useState("");
  const [ruleaza, setRuleaza] = useState(false);
  const [verdict, setVerdict] = useState<"ok" | "gresit" | null>(null);
  const [folosestePy, setFolosestePy] = useState(true);

  // Stări pentru evaluare AI
  const [evaluarePending, setEvaluarePending] = useState(false);
  const [feedbackAI, setFeedbackAI] = useState<FeedbackAI | null>(null);

  const ruleazaCod = async () => {
    setRuleaza(true);
    setEroare("");
    setVerdict(null);
    setOutput("");
    try {
      const py = await incarcaPyodide();
      let capturat = "";
      py.setStdout({
        batched: (s: string) => {
          capturat += s;
          setOutput(capturat);
        },
      });
      py.setStderr({ batched: (s: string) => setEroare((e) => e + s) });
      await py.runPythonAsync(cod);

      const curat = (s: string) => s.replace(/\s+/g, " ").trim();
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
    } catch (e) {
      console.error("PYODIDE_ERR", e);
      setEroare("Interpretorul Python nu a putut fi încărcat.");
      setFolosestePy(false);
    } finally {
      setRuleaza(false);
    }
  };

  const solicitaEvaluareAI = async () => {
    setEvaluarePending(true);
    setFeedbackAI(null);
    try {
      const res = await evalueazaCodCuAI(titlu, enunt, cod, output || eroare);
      if (res.ok && res.feedback) {
        setFeedbackAI(res.feedback);
      } else {
        setEroare(res.eroare || "Nu s-a putut obține feedback de la asistentul AI.");
      }
    } catch (e) {
      setEroare("A apărut o eroare la conexiunea cu serverul de evaluare.");
    } finally {
      setEvaluarePending(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Editorul de Cod */}
      <div className="rounded-2xl border border-brand-border bg-white p-4 shadow-sm">
        <div className="mb-2 flex items-center gap-2">
          <span className="text-xl" aria-hidden="true">
            💻
          </span>
          <h4 className="text-sm font-bold text-foreground">Scrie rezolvarea ta în editor</h4>
        </div>

        <div className="relative rounded-xl border border-black/10 bg-[#1e1b3a] overflow-hidden">
          <div className="flex items-center gap-1.5 border-b border-white/10 px-3 py-1.5">
            <span className="h-2.5 w-2.5 rounded-full bg-[#ff5f56]" />
            <span className="h-2.5 w-2.5 rounded-full bg-[#ffbd2e]" />
            <span className="h-2.5 w-2.5 rounded-full bg-[#27c93f]" />
            <span className="ml-2 text-xs text-white/50">sandbox.py</span>
          </div>
          <textarea
            value={cod}
            onChange={(e) => setCod(e.target.value)}
            spellCheck={false}
            className="block w-full resize-y bg-transparent p-3 font-mono text-sm leading-relaxed text-white outline-none"
            style={{ minHeight: 220 }}
          />
        </div>

        <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={ruleazaCod}
              disabled={ruleaza}
              className="rounded-xl bg-brand px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-brand-dark disabled:cursor-not-allowed disabled:opacity-50 cursor-pointer"
            >
              {ruleaza ? "Se rulează…" : "▶ Rutează codul"}
            </button>
            <button
              type="button"
              onClick={solicitaEvaluareAI}
              disabled={evaluarePending}
              className="rounded-xl border border-brand-border bg-brand-light/50 hover:bg-brand-light px-5 py-2.5 text-sm font-semibold text-brand-dark transition disabled:cursor-not-allowed disabled:opacity-50 cursor-pointer"
            >
              {evaluarePending ? "🧠 Analiză AI..." : "🧠 Cere Evaluare & Îndrumare"}
            </button>
          </div>

          <div>
            {verdict === "ok" && (
              <span className="text-sm font-bold text-success flex items-center gap-1">
                ✓ Rezultatul testului: CORECT!
              </span>
            )}
            {verdict === "gresit" && (
              <span className="text-sm font-bold text-red-600 flex items-center gap-1">
                ✗ Rezultatul testului: DIFERIT de cel așteptat.
              </span>
            )}
          </div>
        </div>

        {(output || eroare) && (
          <div className="mt-3">
            <p className="text-xs font-semibold text-foreground/50 mb-1">Consolă / Output:</p>
            <pre className="max-h-48 overflow-auto rounded-lg bg-black/90 p-3 font-mono text-xs leading-relaxed text-green-300">
              {output}
              {eroare && <span className="text-red-400">{eroare}</span>}
            </pre>
          </div>
        )}

        {!folosestePy && (
          <p className="mt-2 text-xs text-amber-600">
            Codul rulează local în browser folosind Pyodide. Dacă întâmpini probleme de rețea, reîncărcați pagina.
          </p>
        )}
      </div>

      {/* Caseta de Evaluare & Îndrumare (Afișată când primim feedback de la AI) */}
      {feedbackAI && (
        <div className="rounded-3xl border border-brand/20 bg-brand-light/40 p-6 shadow-sm flex flex-col md:flex-row items-start gap-5">
          <div className="rounded-2xl bg-white p-2 border border-brand-border shrink-0 mx-auto md:mx-0">
            <span className="text-4xl" aria-hidden="true">🧙‍♂️</span>
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-black/5 pb-2">
              <h4 className="font-extrabold text-foreground">Profesor Asistent AI</h4>
              <span className="rounded-full bg-brand/10 border border-brand/20 px-2.5 py-0.5 text-xs font-bold text-brand-dark">
                Calificativ: {feedbackAI.scor}
              </span>
            </div>

            <div className="mt-3 space-y-3">
              <div>
                <span className="text-xs font-bold text-success uppercase tracking-wider">Ce ai făcut bine:</span>
                <p className="mt-0.5 text-sm text-foreground/80 leading-relaxed">
                  {feedbackAI.analiza}
                </p>
              </div>

              <div>
                <span className="text-xs font-bold text-brand-dark uppercase tracking-wider">Îndrumare & Corecturi:</span>
                <p className="mt-0.5 text-sm text-foreground/80 leading-relaxed">
                  {feedbackAI.indrumare}
                </p>
              </div>

              {feedbackAI.indiciu_sintaxa && (
                <div className="mt-2 rounded-xl bg-black/90 p-3 font-mono text-xs text-green-300">
                  <span className="text-[10px] text-white/50 block mb-1"># Indiciu structură:</span>
                  {feedbackAI.indiciu_sintaxa}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
