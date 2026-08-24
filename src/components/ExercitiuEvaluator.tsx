"use client";

import { useState, useEffect } from "react";
import { evalueazaCodCuAI, type FeedbackAI } from "@/app/actions/ai-evaluation";

type ExercitiuModel = {
  id: number;
  titlu: string;
  enunt: string;
  template: string;
  expectedOutput: string;
};

type Props = {
  exercitii: ExercitiuModel[];
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

let pyodidePromise: Promise<void> | null = null;

async function incarcaPyodide(): Promise<PyodideApi> {
  if (typeof window === "undefined") {
    throw new Error("Rularea locală nu este disponibilă pe server.");
  }
  if (window.__pyodideInstance) {
    return window.__pyodideInstance;
  }

  if (!pyodidePromise) {
    pyodidePromise = new Promise<void>((res, rej) => {
      const dejaIncarcat = document.querySelector("script[data-pyodide]");
      if (dejaIncarcat && window.loadPyodide) {
        res();
        return;
      }

      const s = (dejaIncarcat as HTMLScriptElement) ?? document.createElement("script");
      if (!dejaIncarcat) {
        s.src = "/pyodide/pyodide.js";
        s.setAttribute("data-pyodide", "1");
        document.body.appendChild(s);
      }

      const originalOnload = s.onload;
      s.onload = (e) => {
        if (originalOnload) (originalOnload as Function)(e);
        res();
      };

      const originalOnerror = s.onerror;
      s.onerror = (e) => {
        if (originalOnerror) (originalOnerror as Function)(e);
        rej(new Error("Nu s-a putut încărca interpretorul Python."));
      };
    });
  }

  await pyodidePromise;

  if (!window.loadPyodide) {
    throw new Error("Interpretorul Python nu a putut fi inițializat.");
  }

  const existenta = (window as unknown as { pyodide?: PyodideApi }).pyodide;
  const py = existenta ?? (await window.loadPyodide({ indexURL: "/pyodide/" }));
  if (typeof window !== "undefined") window.__pyodideInstance = py;
  return py;
}

export default function ExercitiuEvaluator({ exercitii }: Props) {
  const [curentIdx, setCurentIdx] = useState(0);

  // Stocăm codul, outputs, erorile și verdictele pentru fiecare dintre cele 6 exerciții
  const [coduri, setCoduri] = useState<Record<number, string>>({});
  const [outputs, setOutputs] = useState<Record<number, string>>({});
  const [erori, setErori] = useState<Record<number, string>>({});
  const [verdicte, setVerdicte] = useState<Record<number, "ok" | "gresit" | null>>({});
  const [feedbacksAI, setFeedbacksAI] = useState<Record<number, FeedbackAI | null>>({});

  const [ruleaza, setRuleaza] = useState(false);
  const [evaluarePending, setEvaluarePending] = useState(false);
  const [folosestePy, setFolosestePy] = useState(true);

  // Inițializăm codurile cu șabloanele corespunzătoare
  useEffect(() => {
    const coduriInit: Record<number, string> = {};
    const outputsInit: Record<number, string> = {};
    const eroriInit: Record<number, string> = {};
    const verdicteInit: Record<number, "ok" | "gresit" | null> = {};
    const feedbacksInit: Record<number, FeedbackAI | null> = {};

    exercitii.forEach((ex, idx) => {
      coduriInit[idx] = ex.template;
      outputsInit[idx] = "";
      eroriInit[idx] = "";
      verdicteInit[idx] = null;
      feedbacksInit[idx] = null;
    });

    setCoduri(coduriInit);
    setOutputs(outputsInit);
    setErori(eroriInit);
    setVerdicte(verdicteInit);
    setFeedbacksAI(feedbacksInit);
  }, [exercitii]);

  const exercitiuCurent = exercitii[curentIdx];
  if (!exercitiuCurent) return null;

  const codCurent = coduri[curentIdx] ?? "";
  const outputCurent = outputs[curentIdx] ?? "";
  const eroareCurenta = erori[curentIdx] ?? "";
  const verdictCurent = verdicte[curentIdx] ?? null;
  const feedbackAICurent = feedbacksAI[curentIdx] ?? null;

  const handleUpdateCod = (valoare: string) => {
    setCoduri((prev) => ({ ...prev, [curentIdx]: valoare }));
  };

  const ruleazaCod = async () => {
    setRuleaza(true);
    setErori((prev) => ({ ...prev, [curentIdx]: "" }));
    setVerdicte((prev) => ({ ...prev, [curentIdx]: null }));
    setOutputs((prev) => ({ ...prev, [curentIdx]: "" }));
    
    try {
      const py = await incarcaPyodide();
      let capturat = "";
      
      py.setStdout({
        batched: (s: string) => {
          capturat += s;
          setOutputs((prev) => ({ ...prev, [curentIdx]: capturat }));
        },
      });
      
      py.setStderr({ 
        batched: (s: string) => {
          setErori((prev) => ({ ...prev, [curentIdx]: (prev[curentIdx] ?? "") + s }));
        } 
      });

      // Mecanism de timeout de 4 secunde (4000 ms) împotriva buclelor infinite
      const runPromise = py.runPythonAsync(codCurent);
      const timeoutPromise = new Promise<never>((_, reject) =>
        setTimeout(() => reject(new Error("TIMEOUT_EXECUTION")), 4000)
      );

      await Promise.race([runPromise, timeoutPromise]);

      const curat = (s: string) => s.replace(/\s+/g, " ").trim();
      const extrageNumere = (s: string): number[] => {
        const m = s.replace(",", ".").match(/-?\d+(\.\d+)?/g);
        return m ? m.map(Number) : [];
      };

      const nrOut = extrageNumere(capturat);
      const nrExp = extrageNumere(String(exercitiuCurent.expectedOutput));

      let potriveste = false;
      if (nrOut.length > 0 && nrExp.length > 0) {
        potriveste =
          nrOut.length === nrExp.length &&
          nrOut.every((v, i) => Math.abs(v - nrExp[i]) < 0.01);
      } else {
        potriveste = curat(capturat) === curat(exercitiuCurent.expectedOutput);
      }

      setVerdicte((prev) => ({ ...prev, [curentIdx]: potriveste ? "ok" : "gresit" }));
    } catch (e: any) {
      console.error("PYODIDE_ERR", e);
      if (e instanceof Error && e.message === "TIMEOUT_EXECUTION") {
        setErori((prev) => ({
          ...prev,
          [curentIdx]: "⚠️ Timpul de execuție a fost depășit (4s). Verifică dacă nu ai o buclă infinită (ex: while fără incrementare)!"
        }));
      } else {
        const msg = e?.message || String(e);
        // Daca eroarea provine din executia de cod Python, o afisam direct elevului
        const esteEroareCod = msg.includes("Error") || msg.includes("Traceback") || msg.includes("Exception");
        setErori((prev) => ({ 
          ...prev, 
          [curentIdx]: esteEroareCod ? msg : "Eroare tehnică la rularea codului local." 
        }));
        if (!esteEroareCod) {
          setFolosestePy(false);
        }
      }
    } finally {
      setRuleaza(false);
    }
  };

  const solicitaEvaluareAI = async () => {
    setEvaluarePending(true);
    setFeedbacksAI((prev) => ({ ...prev, [curentIdx]: null }));
    
    try {
      const res = await evalueazaCodCuAI(
        exercitiuCurent.titlu,
        exercitiuCurent.enunt,
        codCurent,
        outputCurent || eroareCurenta
      );
      if (res.ok && res.feedback) {
        setFeedbacksAI((prev) => ({ ...prev, [curentIdx]: res.feedback ?? null }));
      } else {
        setErori((prev) => ({ 
          ...prev, 
          [curentIdx]: res.eroare || "Nu s-a putut obține feedback de la asistentul AI." 
        }));
      }
    } catch (e) {
      setErori((prev) => ({ 
        ...prev, 
        [curentIdx]: "A apărut o eroare la conexiunea cu serverul de evaluare AI." 
      }));
    } finally {
      setEvaluarePending(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Selector rapid de exerciții sub formă de tab-uri orizontale compacte */}
      <div className="flex flex-wrap gap-2 border-b border-black/5 pb-4">
        {exercitii.map((ex, idx) => {
          const esteActiv = curentIdx === idx;
          const statusVerdict = verdicte[idx];
          return (
            <button
              key={ex.id}
              type="button"
              onClick={() => setCurentIdx(idx)}
              className={`rounded-xl px-4 py-2 text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
                esteActiv
                  ? "bg-brand text-white shadow-sm font-extrabold"
                  : "border border-black/10 bg-white text-foreground/75 hover:bg-slate-50"
              }`}
            >
              <span>Exercițiul {ex.id}</span>
              {statusVerdict === "ok" && <span className="text-success-dark font-black">✓</span>}
              {statusVerdict === "gresit" && <span className="text-red-500 font-black">✗</span>}
            </button>
          );
        })}
      </div>

      {/* Detalii exercițiu activ: Enunț (Fără elemente teoretice) */}
      <div className="rounded-2xl bg-white border border-black/5 p-5 shadow-inner-sm">
        <span className="text-[10px] font-bold text-brand uppercase tracking-wider block">
          Cerință Exercițiul {exercitiuCurent.id} — {exercitiuCurent.titlu}
        </span>
        <p className="mt-2 text-sm text-foreground/80 leading-relaxed font-semibold">
          {exercitiuCurent.enunt}
        </p>
        <div className="mt-3 text-[11px] text-muted font-medium bg-slate-50 p-2.5 rounded-lg border border-black/[0.03]">
          <strong>Valoare așteptată la consolă:</strong> <code className="bg-black/5 px-1 py-0.5 rounded font-mono text-foreground text-xs">{exercitiuCurent.expectedOutput}</code>
        </div>
      </div>

      {/* Editorul de Cod */}
      <div className="rounded-2xl border border-brand-border bg-white p-4 shadow-sm">
        <div className="mb-2 flex items-center gap-2">
          <span className="text-xl" aria-hidden="true">💻</span>
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
            value={codCurent}
            onChange={(e) => handleUpdateCod(e.target.value)}
            spellCheck={false}
            className="block w-full resize-y bg-transparent p-3 font-mono text-sm leading-relaxed text-white outline-none min-h-[220px]"
          />
        </div>

        <div className="mt-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 w-full">
          <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
            <button
              type="button"
              onClick={ruleazaCod}
              disabled={ruleaza}
              className="w-full sm:w-auto rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-semibold py-3 px-6 transition disabled:cursor-not-allowed disabled:opacity-50 cursor-pointer text-center text-sm"
            >
              {ruleaza ? "Se rulează…" : "▶ Rulează codul"}
            </button>
            <button
              type="button"
              onClick={solicitaEvaluareAI}
              disabled={evaluarePending}
              className="w-full sm:w-auto rounded-xl text-slate-800 border-2 border-amber-400 bg-amber-50/50 hover:bg-amber-100 py-3 px-6 text-sm font-bold text-center transition disabled:cursor-not-allowed disabled:opacity-50 cursor-pointer"
            >
              {evaluarePending ? "🧠 Analiză AI..." : "🤖 Cere Evaluare & Îndrumare AI"}
            </button>
          </div>

          <div>
            {verdictCurent === "ok" && (
              <span className="text-sm font-bold text-success flex items-center gap-1">
                ✓ Rezultatul testului: CORECT!
              </span>
            )}
            {verdictCurent === "gresit" && (
              <span className="text-sm font-bold text-red-600 flex items-center gap-1">
                ✗ Rezultatul testului: DIFERIT de cel așteptat.
              </span>
            )}
          </div>
        </div>

        {(outputCurent || eroareCurenta) && (
          <div className="mt-3">
            <p className="text-xs font-semibold text-foreground/50 mb-1">Consolă / Output:</p>
            <pre className="max-h-48 overflow-auto rounded-lg bg-black/90 p-3 font-mono text-xs leading-relaxed text-green-300">
              {outputCurent}
              {eroareCurenta && <span className="text-red-400">{eroareCurenta}</span>}
            </pre>
          </div>
        )}

        {!folosestePy && (
          <p className="mt-2 text-xs text-amber-600">
            Codul rulează local în browser folosind Pyodide. Dacă întâmpini probleme de rețea, reîncărcați pagina.
          </p>
        )}
      </div>

      {/* Caseta de Evaluare & Îndrumare AI */}
      {feedbackAICurent && (
        <div className="rounded-3xl border border-brand/20 bg-brand-light/40 p-6 shadow-sm flex flex-col md:flex-row items-start gap-5">
          <div className="rounded-2xl bg-white p-2 border border-brand-border shrink-0 mx-auto md:mx-0">
            <span className="text-4xl" aria-hidden="true">🧙‍♂️</span>
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-black/5 pb-2">
              <h4 className="font-extrabold text-foreground">Profesor Asistent AI</h4>
              <span className="rounded-full bg-brand/10 border border-brand/20 px-2.5 py-0.5 text-xs font-bold text-brand-dark">
                Calificativ: {feedbackAICurent.scor}
              </span>
            </div>

            <div className="mt-3 space-y-3">
              <div>
                <span className="text-xs font-bold text-success uppercase tracking-wider">Ce ai făcut bine:</span>
                <p className="mt-0.5 text-sm text-foreground/80 leading-relaxed">
                  {feedbackAICurent.analiza}
                </p>
              </div>

              <div>
                <span className="text-xs font-bold text-brand-dark uppercase tracking-wider">Îndrumare & Corecturi:</span>
                <p className="mt-0.5 text-sm text-foreground/80 leading-relaxed">
                  {feedbackAICurent.indrumare}
                </p>
              </div>

              {feedbackAICurent.indiciu_sintaxa && (
                <div className="mt-2 rounded-xl bg-black/90 p-3 font-mono text-xs text-green-300">
                  <span className="text-[10px] text-white/50 block mb-1"># Indiciu structură:</span>
                  {feedbackAICurent.indiciu_sintaxa}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
