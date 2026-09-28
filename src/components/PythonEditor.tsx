"use client";

import { useId, useRef, useState } from "react";
import {
  esteInterpretorIncarcat,
  explicaEroarea,
  LIMITA_IMPLICITA_MS,
  ruleazaPython,
  type EroarePython,
} from "@/lib/pythonRunner";
import { comparaOutput } from "@/lib/verificareOutput";

type Props = {
  /** Codul inițial (poate conține găuri ___ care devin input-uri). */
  initialCode?: string;
  /** Output-ul așteptat pentru verificare automată (opțional). */
  expectedOutput?: string;
  /** Label afișat deasupra editorului. */
  titlu?: string;
  /** Înălțimea în px a zonei de cod. */
  height?: number;
  /**
   * Apelat doar când rularea reușește: fără erori și, dacă există un output
   * așteptat, cu rezultatul corect. Un cod greșit nu mai marchează exercițiul
   * ca rezolvat.
   */
  onVerificat?: () => void;
  /** Apelat când se modifică codul în editor. */
  onCodeChange?: (code: string) => void;
  /** Date de intrare implicite pentru input() (câte una pe rând). */
  intrareInitiala?: string;
};

type Stare = "inactiv" | "incarcare" | "rulare";

export default function PythonEditor({
  initialCode = 'print("Salut, lume!")',
  expectedOutput,
  titlu = "Scrie codul tău Python",
  height = 220,
  onVerificat,
  onCodeChange,
  intrareInitiala = "",
}: Props) {
  const idEditor = useId();
  const [cod, setCod] = useState(initialCode);
  const [intrare, setIntrare] = useState(intrareInitiala);
  const [output, setOutput] = useState("");
  const [eroare, setEroare] = useState<EroarePython | null>(null);
  const [mesajSistem, setMesajSistem] = useState<string | null>(null);
  const [stare, setStare] = useState<Stare>("inactiv");
  const [verdict, setVerdict] = useState<"ok" | "gresit" | null>(null);
  const [aRulat, setARulat] = useState(false);
  const opresteRef = useRef<(() => void) | null>(null);

  const folosesteInput = /\binput\s*\(/.test(cod);

  const ruleazaCod = async () => {
    setEroare(null);
    setMesajSistem(null);
    setVerdict(null);
    setOutput("");
    setARulat(true);
    setStare(esteInterpretorIncarcat() ? "rulare" : "incarcare");

    // `capturat` = doar stdout (se compară cu rezultatul așteptat);
    // `afisat` = tot ce vede elevul, inclusiv avertismentele din stderr.
    let capturat = "";
    let afisat = "";
    const { rezultat, opreste } = ruleazaPython(cod, {
      intrare,
      onStart: () => setStare("rulare"),
      onStdout: (s) => {
        capturat += s;
        afisat += s;
        setOutput(afisat);
      },
      onStderr: (s) => {
        afisat += s;
        setOutput(afisat);
      },
    });
    opresteRef.current = opreste;
    const r = await rezultat;
    opresteRef.current = null;
    setStare("inactiv");

    if (r.status === "ok") {
      if (r.trunchiat) setMesajSistem("Ieșirea a fost scurtată: programul a afișat prea mult text.");
      if (expectedOutput !== undefined) {
        const corect = comparaOutput(capturat, expectedOutput);
        setVerdict(corect ? "ok" : "gresit");
        if (corect) onVerificat?.();
      } else {
        onVerificat?.();
      }
    } else if (r.status === "eroare-python") {
      setEroare(r.eroare);
    } else if (r.status === "timeout") {
      setMesajSistem(
        `Execuția a fost oprită după ${LIMITA_IMPLICITA_MS / 1000} secunde. Verifică dacă ai o buclă care nu se termină (de exemplu, un while a cărui condiție rămâne mereu adevărată).`
      );
    } else if (r.status === "oprit") {
      setMesajSistem("Execuția a fost oprită.");
    } else {
      setMesajSistem(
        "Interpretorul Python (~15 MB) nu a putut fi încărcat. Verifică conexiunea la internet și apasă din nou „Rulează codul”."
      );
    }
  };

  const ruleaza = stare !== "inactiv";

  return (
    <div className="rounded-2xl border border-brand-border bg-white p-4 shadow-sm">
      {titlu && (
        <div className="mb-2 flex items-center gap-2">
          <span className="text-xl" aria-hidden="true">
            🐍
          </span>
          <label htmlFor={`${idEditor}-cod`} className="text-sm font-semibold text-foreground">
            {titlu}
          </label>
        </div>
      )}

      <div className="relative rounded-xl border border-black/10 bg-[#1e1b3a] overflow-hidden">
        <div className="flex items-center gap-1.5 border-b border-white/10 px-3 py-1.5" aria-hidden="true">
          <span className="h-2.5 w-2.5 rounded-full bg-[#ff5f56]" />
          <span className="h-2.5 w-2.5 rounded-full bg-[#ffbd2e]" />
          <span className="h-2.5 w-2.5 rounded-full bg-[#27c93f]" />
          <span className="ml-2 text-xs text-white/60">python</span>
        </div>
        <textarea
          id={`${idEditor}-cod`}
          aria-label={titlu ? undefined : "Cod Python"}
          value={cod}
          onChange={(e) => {
            const val = e.target.value;
            setCod(val);
            onCodeChange?.(val);
          }}
          onKeyDown={(e) => {
            // Tab inserează indentare (4 spații) în loc să mute focusul;
            // Esc eliberează focusul, ca editorul să nu fie o capcană de tastatură.
            if (e.key === "Tab" && !e.shiftKey && !e.altKey && !e.ctrlKey && !e.metaKey) {
              const el = e.currentTarget;
              if (el.dataset.tabLiber === "1") return;
              e.preventDefault();
              const { selectionStart: a, selectionEnd: b } = el;
              const nou = cod.slice(0, a) + "    " + cod.slice(b);
              setCod(nou);
              onCodeChange?.(nou);
              requestAnimationFrame(() => el.setSelectionRange(a + 4, a + 4));
            } else if (e.key === "Escape") {
              e.currentTarget.dataset.tabLiber = "1";
            } else if ((e.ctrlKey || e.metaKey) && e.key === "Enter") {
              e.preventDefault();
              if (!ruleaza) ruleazaCod();
            }
          }}
          onFocus={(e) => {
            e.currentTarget.dataset.tabLiber = "0";
          }}
          spellCheck={false}
          autoCapitalize="off"
          autoCorrect="off"
          wrap="off"
          className="block w-full resize-y overflow-x-auto bg-transparent p-3 font-mono text-sm leading-relaxed text-white outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-amber-300"
          style={{ minHeight: height }}
        />
      </div>
      <p className="mt-1 text-[11px] text-foreground/60">
        Tab adaugă 4 spații · Esc, apoi Tab, iese din editor · Ctrl+Enter rulează codul
      </p>

      {folosesteInput && (
        <div className="mt-3">
          <label htmlFor={`${idEditor}-intrare`} className="text-xs font-semibold text-foreground">
            Date de intrare pentru input() — câte una pe rând
          </label>
          <textarea
            id={`${idEditor}-intrare`}
            value={intrare}
            onChange={(e) => setIntrare(e.target.value)}
            rows={2}
            spellCheck={false}
            placeholder={"8\n10"}
            className="mt-1 block w-full rounded-lg border border-black/15 bg-surface p-2 font-mono text-sm text-foreground focus:border-brand focus:outline-none focus-visible:ring-2 focus-visible:ring-brand/30"
          />
        </div>
      )}

      <div className="mt-3 flex flex-wrap items-center gap-3">
        <button
          type="button"
          onClick={ruleazaCod}
          disabled={ruleaza}
          className="rounded-lg bg-amber-400 hover:bg-amber-500 px-4 py-2 text-sm font-black text-slate-950 transition disabled:cursor-not-allowed disabled:opacity-60 shadow-xs cursor-pointer"
        >
          {stare === "incarcare"
            ? "Se încarcă Python…"
            : stare === "rulare"
              ? "Se rulează…"
              : "▶ Rulează codul"}
        </button>
        {ruleaza && (
          <button
            type="button"
            onClick={() => opresteRef.current?.()}
            className="rounded-lg border border-red-300 bg-white px-3 py-2 text-sm font-bold text-red-700 hover:bg-red-50"
          >
            ■ Oprește
          </button>
        )}
        <div aria-live="polite" className="text-sm font-semibold">
          {verdict === "ok" && (
            <span className="text-success">✓ Corect! Rezultatul obținut este cel așteptat.</span>
          )}
          {verdict === "gresit" && (
            <span className="text-red-700">✗ Rezultatul obținut diferă de cel așteptat.</span>
          )}
        </div>
      </div>

      {verdict === "gresit" && expectedOutput !== undefined && (
        <div className="mt-3 grid gap-2 text-xs sm:grid-cols-2">
          <div className="rounded-lg border border-black/10 bg-surface p-2">
            <p className="font-bold text-foreground">Rezultat așteptat</p>
            <pre className="mt-1 overflow-x-auto whitespace-pre font-mono text-foreground/80">{expectedOutput}</pre>
          </div>
          <div className="rounded-lg border border-red-200 bg-red-50 p-2">
            <p className="font-bold text-red-800">Rezultatul tău</p>
            <pre className="mt-1 overflow-x-auto whitespace-pre font-mono text-red-900">
              {output.trim() || "(programul nu a afișat nimic — ai folosit print()?)"}
            </pre>
          </div>
        </div>
      )}

      {(output || eroare) && (
        <pre
          aria-label="Rezultatul rulării"
          className="mt-3 max-h-60 overflow-auto rounded-lg bg-black/90 p-3 font-mono text-xs leading-relaxed text-green-300"
        >
          {output}
          {eroare && <span className="text-red-300">{eroare.traceback}</span>}
        </pre>
      )}

      {eroare && (
        <p className="mt-2 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-900" role="status">
          <strong>{eroare.tip}</strong> — {explicaEroarea(eroare)}
        </p>
      )}

      {mesajSistem && (
        <p className="mt-2 rounded-lg border border-amber-200 bg-amber-50 p-3 text-sm text-amber-900" role="status">
          {mesajSistem}
        </p>
      )}

      {aRulat && !ruleaza && !output && !eroare && !mesajSistem && expectedOutput === undefined && (
        <p className="mt-2 text-xs text-foreground/60">Programul a rulat fără să afișeze nimic. Folosește print() ca să vezi un rezultat.</p>
      )}
    </div>
  );
}
