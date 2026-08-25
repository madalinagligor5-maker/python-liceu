"use client";

import { useState } from "react";
import PythonEditor from "@/components/PythonEditor";

export default function LaboratorConsolidare({
  codModul,
  titluModul,
}: {
  codModul: string;
  titluModul: string;
}) {
  const [tabActiv, setTabActiv] = useState<"fillin" | "parsons" | "proiect">("fillin");

  // State Completează spațiile (...)
  const [input1, setInput1] = useState("");
  const [input2, setInput2] = useState("");
  const [validatFillin, setValidatFillin] = useState<boolean | null>(null);

  // State Parson's Problems
  const [liniiParsons, setLiniiParsons] = useState([
    { id: 1, text: 'print("Media notelor este:", media)' },
    { id: 2, text: "nota1 = 8.0" },
    { id: 3, text: "nota2 = 10.0" },
    { id: 4, text: "media = (nota1 + nota2) / 2" },
  ]);
  const [validatParsons, setValidatParsons] = useState<boolean | null>(null);

  // State Potrivire / Match
  const [potrivire, setPotrivire] = useState<Record<string, string>>({});
  const [validatMatch, setValidatMatch] = useState<boolean | null>(null);

  // State Mini-Proiect Scaffolded
  const [nivelProiect, setNivelProiect] = useState<1 | 2 | 3>(1);
  const [arataBarem, setArataBarem] = useState(false);

  // Reordonare Parson's
  const mutaLinie = (index: number, directie: -1 | 1) => {
    const nou = [...liniiParsons];
    const target = index + directie;
    if (target < 0 || target >= nou.length) return;
    const temp = nou[index];
    nou[index] = nou[target];
    nou[target] = temp;
    setLiniiParsons(nou);
    setValidatParsons(null);
  };

  const verificaParsons = () => {
    const ordineCorecta = [2, 3, 4, 1]; // nota1, nota2, media=..., print
    const esteCorect = liniiParsons.every((l, i) => l.id === ordineCorecta[i]);
    setValidatParsons(esteCorect);
  };

  const verificaFillin = () => {
    const i1 = input1.trim().toLowerCase();
    const i2 = input2.trim().toLowerCase();
    const esteCorect = (i1 === "nota1 + nota2" || i1 === "nota2 + nota1") && i2 === "media";
    setValidatFillin(esteCorect);
  };

  const verificaMatch = () => {
    const esteCorect = potrivire["1"] === "B" && potrivire["2"] === "A";
    setValidatMatch(esteCorect);
  };

  return (
    <div className="rounded-3xl border border-[#EBE7DF] bg-white shadow-lg overflow-hidden text-[#1E2430]">
      {/* Banner Titlu Laborator */}
      <div className="bg-[#1E2430] p-6 text-white">
        <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-400/20 border border-amber-400/40 px-3.5 py-1 text-xs font-black text-amber-300">
            <span>⚡</span> Laborator de Consolidare &amp; Practică ({codModul})
          </span>
          <span className="text-xs font-mono text-slate-400 font-semibold">
            Standard Didactic EdTech
          </span>
        </div>
        <h2 className="text-xl sm:text-2xl font-black">{titluModul}</h2>

        {/* Tab-uri Navigație */}
        <div className="flex flex-wrap gap-2 mt-5">
          <button
            onClick={() => setTabActiv("fillin")}
            className={`rounded-xl px-4 py-2.5 text-xs font-black transition active:scale-95 flex items-center gap-2 ${
              tabActiv === "fillin"
                ? "bg-amber-400 text-slate-950 shadow-md"
                : "bg-slate-800 text-slate-300 hover:bg-slate-700"
            }`}
          >
            <span>✏️</span> 1. Completează &amp; Corectează
          </button>
          <button
            onClick={() => setTabActiv("parsons")}
            className={`rounded-xl px-4 py-2.5 text-xs font-black transition active:scale-95 flex items-center gap-2 ${
              tabActiv === "parsons"
                ? "bg-amber-400 text-slate-950 shadow-md"
                : "bg-slate-800 text-slate-300 hover:bg-slate-700"
            }`}
          >
            <span>🧩</span> 2. Reordonare Logică
          </button>
          <button
            onClick={() => setTabActiv("proiect")}
            className={`rounded-xl px-4 py-2.5 text-xs font-black transition active:scale-95 flex items-center gap-2 ${
              tabActiv === "proiect"
                ? "bg-amber-400 text-slate-950 shadow-md"
                : "bg-slate-800 text-slate-300 hover:bg-slate-700"
            }`}
          >
            <span>🚀</span> 3. Mini-Proiect (3 Niveluri)
          </button>
        </div>
      </div>

      {/* TAB 1: COMPLETEAZĂ & CORTECTEAZĂ */}
      {tabActiv === "fillin" && (
        <div className="p-6 space-y-6">
          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-extrabold text-slate-900 text-sm flex items-center gap-2">
                <span>✏️</span> Completează spațiile punctate (...)
              </h3>
              <span className="text-[11px] font-bold text-indigo-900 bg-indigo-100 px-2.5 py-0.5 rounded-full">
                Exercițiu de Sintaxă
              </span>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              Completează instrucțiunile Python pentru a calcula media aritmetică a celor două note:
            </p>

            <div className="bg-[#1E1E2E] text-slate-200 p-4 rounded-2xl font-mono text-xs space-y-2.5 shadow-inner">
              <div>nota1 = 8.0</div>
              <div>nota2 = 10.0</div>
              <div className="flex items-center gap-1.5 flex-wrap">
                <span>media = (</span>
                <input
                  type="text"
                  value={input1}
                  onChange={(e) => {
                    setInput1(e.target.value);
                    setValidatFillin(null);
                  }}
                  placeholder="nota1 + nota2"
                  className="bg-slate-800 border border-amber-400/50 text-amber-300 px-2 py-1 rounded text-xs focus:outline-none w-40 text-center font-bold"
                />
                <span>) / 2</span>
              </div>
              <div className="flex items-center gap-1.5 flex-wrap">
                <span>print("Media este:", </span>
                <input
                  type="text"
                  value={input2}
                  onChange={(e) => {
                    setInput2(e.target.value);
                    setValidatFillin(null);
                  }}
                  placeholder="media"
                  className="bg-slate-800 border border-amber-400/50 text-amber-300 px-2 py-1 rounded text-xs focus:outline-none w-28 text-center font-bold"
                />
                <span>)</span>
              </div>
            </div>

            <div className="flex items-center gap-3 pt-1">
              <button
                onClick={verificaFillin}
                className="rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-black text-xs px-5 py-2.5 transition active:scale-95 shadow-xs"
              >
                Verifică Răspunsul
              </button>
              {validatFillin === true && (
                <span className="text-xs font-bold text-emerald-600 flex items-center gap-1">
                  <span>✅</span> Corect! Ai completat variabilele perfect.
                </span>
              )}
              {validatFillin === false && (
                <span className="text-xs font-bold text-red-600 flex items-center gap-1">
                  <span>❌</span> Mai încearcă! Indiciu: <code>nota1 + nota2</code> și <code>media</code>.
                </span>
              )}
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: REORDONARE LOGICĂ (PARSON'S PROBLEMS & MATCH) */}
      {tabActiv === "parsons" && (
        <div className="p-6 space-y-6">
          {/* Parson's */}
          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-extrabold text-slate-900 text-sm flex items-center gap-2">
                <span>🧩</span> Reordonează liniile în ordinea lor logică de execuție
              </h3>
              <span className="text-[11px] font-bold text-amber-900 bg-amber-100 px-2.5 py-0.5 rounded-full">
                Parson's Problem
              </span>
            </div>
            <p className="text-xs text-slate-600">
              Folosește butoanele ↑ și ↓ pentru a așeza liniile de cod în ordine:
            </p>

            <div className="space-y-2">
              {liniiParsons.map((l, i) => (
                <div
                  key={l.id}
                  className="flex items-center justify-between bg-white border border-[#EBE7DF] p-3.5 rounded-xl shadow-xs font-mono text-xs text-[#1E2430]"
                >
                  <span className="font-bold text-slate-400 mr-2">{i + 1}.</span>
                  <span className="flex-1 font-bold text-indigo-950">{l.text}</span>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => mutaLinie(i, -1)}
                      disabled={i === 0}
                      className="h-8 w-8 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-800 disabled:opacity-30 font-bold text-xs"
                    >
                      ↑
                    </button>
                    <button
                      onClick={() => mutaLinie(i, 1)}
                      disabled={i === liniiParsons.length - 1}
                      className="h-8 w-8 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-800 disabled:opacity-30 font-bold text-xs"
                    >
                      ↓
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex items-center gap-3 pt-2">
              <button
                onClick={verificaParsons}
                className="rounded-xl bg-amber-400 hover:bg-amber-500 text-slate-950 font-black text-xs px-5 py-2.5 transition active:scale-95 shadow-xs"
              >
                Verifică Ordinea Logica
              </button>
              {validatParsons === true && (
                <span className="text-xs font-bold text-emerald-600">🎉 Felicitări! Ordinea este 100% corectă!</span>
              )}
              {validatParsons === false && (
                <span className="text-xs font-bold text-red-600">❌ Ordine greșită. Începe cu inițializarea valorilor!</span>
              )}
            </div>
          </div>

          {/* Potrivire */}
          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5 space-y-4">
            <h3 className="font-extrabold text-slate-900 text-sm flex items-center gap-2">
              <span>🔗</span> Potrivire de Concepte &amp; Expresii
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 font-mono text-xs">
              <div className="p-3.5 bg-white border border-slate-200 rounded-xl flex items-center justify-between">
                <span className="font-bold text-indigo-900">type(10 / 2)</span>
                <select
                  value={potrivire["1"] || ""}
                  onChange={(e) => setPotrivire({ ...potrivire, "1": e.target.value })}
                  className="bg-slate-100 border border-slate-300 rounded px-2.5 py-1 text-xs font-bold"
                >
                  <option value="">Alege...</option>
                  <option value="A">int</option>
                  <option value="B">float</option>
                </select>
              </div>
              <div className="p-3.5 bg-white border border-slate-200 rounded-xl flex items-center justify-between">
                <span className="font-bold text-indigo-900">17 % 5</span>
                <select
                  value={potrivire["2"] || ""}
                  onChange={(e) => setPotrivire({ ...potrivire, "2": e.target.value })}
                  className="bg-slate-100 border border-slate-300 rounded px-2.5 py-1 text-xs font-bold"
                >
                  <option value="">Alege...</option>
                  <option value="A">2 (restul)</option>
                  <option value="B">3 (câtul)</option>
                </select>
              </div>
            </div>
            <button
              onClick={verificaMatch}
              className="rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-black text-xs px-5 py-2.5 transition active:scale-95 shadow-xs"
            >
              Verifică Potrivirea
            </button>
            {validatMatch === true && <span className="text-xs font-bold text-emerald-600 ml-3">✅ Corect!</span>}
            {validatMatch === false && <span className="text-xs font-bold text-red-600 ml-3">❌ Încearcă din nou!</span>}
          </div>
        </div>
      )}

      {/* TAB 3: MINI-PROIECT SCAFFOLDED (3 NIVELURI) */}
      {tabActiv === "proiect" && (
        <div className="p-6 space-y-5">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <div>
              <h3 className="font-black text-slate-900 text-base">
                🚀 Mini-Proiect: Calculator de Taxe &amp; Reducere Librărie
              </h3>
              <p className="text-xs text-slate-500">
                Alege nivelul de dificultate dorit și rezolvă provocarea direct în editor:
              </p>
            </div>

            {/* Selector Nivel */}
            <div className="flex rounded-xl bg-slate-100 p-1 border border-slate-200">
              <button
                onClick={() => setNivelProiect(1)}
                className={`px-3 py-1.5 text-xs font-black rounded-lg transition ${
                  nivelProiect === 1 ? "bg-emerald-500 text-white shadow-xs" : "text-slate-600"
                }`}
              >
                🟢 Începător
              </button>
              <button
                onClick={() => setNivelProiect(2)}
                className={`px-3 py-1.5 text-xs font-black rounded-lg transition ${
                  nivelProiect === 2 ? "bg-amber-500 text-white shadow-xs" : "text-slate-600"
                }`}
              >
                🟡 Intermediar
              </button>
              <button
                onClick={() => setNivelProiect(3)}
                className={`px-3 py-1.5 text-xs font-black rounded-lg transition ${
                  nivelProiect === 3 ? "bg-rose-500 text-white shadow-xs" : "text-slate-600"
                }`}
              >
                🔴 Avansat
              </button>
            </div>
          </div>

          {/* Enunț Nivel */}
          <div className="p-4 rounded-2xl border border-indigo-200 bg-indigo-50/50 text-xs text-indigo-950 font-medium leading-relaxed">
            {nivelProiect === 1 && (
              <p>
                <strong>🟢 Nivel 1 (Începător):</strong> Calculează suma totală pentru cărțile cumpărate și aplică o reducere fixă de 10 lei dacă totalul depășește 50 lei.
              </p>
            )}
            {nivelProiect === 2 && (
              <p>
                <strong>🟡 Nivel 2 (Intermediar):</strong> Solicită statutul de elev (<code>"da/nu"</code>). Dacă este elev ȘI cumpără minim 3 cărți, aplică 20% reducere!
              </p>
            )}
            {nivelProiect === 3 && (
              <p>
                <strong>🔴 Nivel 3 (Avansat):</strong> Validează datele cu <code>try/except</code> și asigură-te că pretul &gt; 0. Generează un bon fiscal formatat cu <code>f-strings</code>.
              </p>
            )}
          </div>

          {/* Editor Python Live */}
          <PythonEditor
            initialCode={
              nivelProiect === 1
                ? `pret = 25.0\ncantitate = 3\ntotal = pret * cantitate\n\nif total > 50:\n    total = total - 10\n\nprint("Total de plată:", total)`
                : nivelProiect === 2
                ? `pret = 30.0\ncantitate = 4\neste_elev = True\n\ntotal = pret * cantitate\nif este_elev and cantitate >= 3:\n    total = total * 0.8\n\nprint("Total de plată:", total)`
                : `try:\n    pret = float(input("Preț: "))\n    cant = int(input("Cantitate: "))\n    if cant <= 0:\n        print("Eroare!")\n    else:\n        total = pret * cant\n        print(f"TOTAL: {total:8.2f} lei")\nexcept ValueError:\n    print("Eroare cifra!")`
            }
            height={220}
            titlu={`Editor Python — Nivelul ${nivelProiect}`}
          />

          {/* Barem Toggle */}
          <div className="pt-2">
            <button
              onClick={() => setArataBarem(!arataBarem)}
              className="text-xs font-bold text-indigo-600 hover:underline flex items-center gap-1"
            >
              <span>🔑</span> {arataBarem ? "Ascunde Baremul de Corectare" : "Vezi Baremul & Soluția Oficială"}
            </button>
            {arataBarem && (
              <div className="mt-3 p-4 rounded-2xl bg-[#1E1E2E] text-amber-300 font-mono text-xs leading-relaxed">
                <p className="text-white font-sans font-bold mb-2">Soluție Oficială (Nivel 3):</p>
{`pret = float(input("Preț: "))
cant = int(input("Cantitate: "))
total = pret * cant
print(f"Total net: {total:.2f} lei")`}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
