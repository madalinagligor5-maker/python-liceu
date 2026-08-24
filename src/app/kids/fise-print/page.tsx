import type { Metadata } from "next";
import Link from "next/link";
import PrintButton from "@/components/PrintButton";

export const metadata: Metadata = {
  title: "Fișe Didactice Printabile — Academia Python Kids",
  description: "Descarcă și printează fișe didactice unplugged pentru învățarea logicii de programare pe hârtie.",
};

export default function KidsPrintPage() {
  return (
    <div className="min-h-screen bg-slate-100 py-10 px-4">
      {/* PRINT STYLING DECLARATION */}
      <style dangerouslySetInnerHTML={{ __html: `
        @media print {
          body {
            background-color: white !important;
            color: black !important;
          }
          .print-hidden {
            display: none !important;
          }
          .print-break {
            page-break-before: always;
          }
          .print-card {
            border: none !important;
            box-shadow: none !important;
            padding: 0 !important;
            margin: 0 !important;
          }
        }
      `}} />

      <div className="mx-auto max-w-4xl">
        {/* Navigation & Print Actions (Hidden when printing) */}
        <div className="print-hidden mb-6 flex items-center justify-between bg-white p-4 rounded-3xl border border-black/5 shadow-sm">
          <Link
            href="/kids"
            className="text-xs font-bold text-slate-500 hover:text-indigo-600 transition"
          >
            ← Înapoi la Hartă
          </Link>
          
          <PrintButton />
        </div>

        {/* WORKBOOK CONTAINER */}
        <div className="space-y-12">
          {/* FIȘA 1 */}
          <div className="print-card bg-white rounded-3xl border border-black/5 p-8 shadow-sm">
            <div className="border-b-2 border-dashed border-indigo-100 pb-4 text-center">
              <h1 className="text-2xl font-black text-indigo-900">
                Aventura lui Pippy — Fișă Didactică 1
              </h1>
              <p className="text-xs text-slate-500 font-bold mt-1 uppercase tracking-wider">
                Nivelul: Începător (Clasele I–II) · Tema: Direcții și Secvențialitate
              </p>
            </div>

            <div className="mt-6">
              <h2 className="text-sm font-bold text-slate-800">
                Cerință: Scrie drumul lui Pippy!
              </h2>
              <p className="text-xs text-slate-600 mt-1">
                Pippy se află în colțul din stânga sus 🤖 și vrea să ajungă la steluță ⭐, apoi la destinație 🏁. Completează casetele de jos cu direcțiile corecte folosind săgeți: **Sus (↑)**, **Jos (↓)**, **Stânga (←)**, **Dreapta (→)**.
              </p>
            </div>

            {/* Grid-ul desenat pentru desenat manual */}
            <div className="mt-8 flex justify-center">
              <div className="grid grid-cols-4 gap-4 max-w-[280px] w-full aspect-square border-4 border-slate-300 p-3 rounded-2xl bg-slate-50">
                {Array.from({ length: 16 }).map((_, idx) => {
                  const y = Math.floor(idx / 4);
                  const x = idx % 4;

                  const esteStart = x === 0 && y === 0;
                  const esteStar = x === 2 && y === 1;
                  const esteTinta = x === 3 && y === 3;
                  const esteObstacol = (x === 1 && y === 1) || (x === 2 && y === 2);

                  return (
                    <div
                      key={idx}
                      className="relative flex items-center justify-center rounded-xl border border-slate-300 bg-white font-bold text-lg aspect-square"
                    >
                      {esteStart && "🤖"}
                      {esteStar && "⭐"}
                      {esteTinta && "🏁"}
                      {esteObstacol && "🧱"}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Casete de rezolvare */}
            <div className="mt-10">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                Codul tău de pași (completează cu săgeți):
              </h3>
              <div className="mt-3 flex flex-wrap gap-3">
                {Array.from({ length: 8 }).map((_, i) => (
                  <div
                    key={i}
                    className="h-10 w-10 rounded-lg border-2 border-slate-300 flex items-center justify-center font-bold text-slate-400 text-sm bg-slate-50"
                  >
                    {i + 1}
                  </div>
                ))}
              </div>
            </div>

            {/* Semnătură și evaluare */}
            <div className="mt-12 flex justify-between border-t border-slate-100 pt-6 text-xs text-slate-500 font-medium">
              <span>Elev: _________________________</span>
              <span>Nota / Evaluarea: ____________</span>
            </div>
          </div>

          {/* FIȘA 2 - LOOP (Page Break) */}
          <div className="print-card print-break bg-white rounded-3xl border border-black/5 p-8 shadow-sm">
            <div className="border-b-2 border-dashed border-indigo-100 pb-4 text-center">
              <h1 className="text-2xl font-black text-indigo-900">
                Aventura lui Pippy — Fișă Didactică 2
              </h1>
              <p className="text-xs text-slate-500 font-bold mt-1 uppercase tracking-wider">
                Nivelul: Mediu (Clasele III–IV) · Tema: Structuri Repetitive (Bucle)
              </p>
            </div>

            <div className="mt-6">
              <h2 className="text-sm font-bold text-slate-800">
                Cerință: Folosește bucla 'Repetă'!
              </h2>
              <p className="text-xs text-slate-600 mt-1">
                Pippy 🤖 trebuie să meargă spre dreapta 5 pași pentru a ajunge la cheie 🔑, apoi să meargă în jos 5 pași pentru a ajunge la ușă 🏁. Scrie codul folosind instructiunea specială **Repetă**!
              </p>
            </div>

            {/* Exemplu de structură buclă pe hârtie */}
            <div className="mt-8 flex gap-8 justify-center items-center">
              <div className="grid grid-cols-6 gap-2 max-w-[240px] w-full aspect-square border-4 border-slate-300 p-2 rounded-2xl bg-slate-50">
                {Array.from({ length: 36 }).map((_, idx) => {
                  const y = Math.floor(idx / 6);
                  const x = idx % 6;

                  const esteStart = x === 0 && y === 0;
                  const esteCheie = x === 5 && y === 0;
                  const esteTinta = x === 5 && y === 5;
                  const esteZid = x < 5 && y > 0;

                  return (
                    <div
                      key={idx}
                      className={`relative flex items-center justify-center rounded-lg border text-sm font-bold aspect-square ${
                        esteZid ? "bg-slate-200 border-slate-300" : "bg-white border-slate-300"
                      }`}
                    >
                      {esteStart && "🤖"}
                      {esteCheie && "🔑"}
                      {esteTinta && "🏁"}
                    </div>
                  );
                })}
              </div>

              {/* Boxă de scriere cod format pseudo-code / blocuri */}
              <div className="border-2 border-dashed border-indigo-200 p-4 rounded-2xl bg-indigo-50/20 w-full max-w-[260px] min-h-[160px] font-sans">
                <span className="text-xs font-bold text-indigo-900 block mb-3">
                  Exemplu de cod bloc:
                </span>
                <div className="space-y-1.5 text-xs text-slate-600 font-mono">
                  <div className="bg-amber-100 border border-amber-200 rounded p-1">Repetă de 5 ori:</div>
                  <div className="bg-indigo-100 border border-indigo-200 rounded p-1 ml-4">🚶 Mergi Dreapta</div>
                  <div className="bg-amber-100 border border-amber-200 rounded p-1 mt-2">Repetă de 5 ori:</div>
                  <div className="bg-indigo-100 border border-indigo-200 rounded p-1 ml-4">🚶 Mergi Jos</div>
                </div>
              </div>
            </div>

            {/* Spațiu rezolvare */}
            <div className="mt-10">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                Scrie planul tău de cod cu bucle repetă:
              </h3>
              <div className="mt-4 border border-slate-300 rounded-2xl h-48 bg-slate-50 p-4">
                {/* Linii dictando pentru completare manuală */}
                <div className="space-y-6">
                  {Array.from({ length: 6 }).map((_, i) => (
                    <div key={i} className="border-b border-slate-300/50 h-1" />
                  ))}
                </div>
              </div>
            </div>

            {/* Semnătură și evaluare */}
            <div className="mt-12 flex justify-between border-t border-slate-100 pt-6 text-xs text-slate-500 font-medium">
              <span>Elev: _________________________</span>
              <span>Nota / Evaluarea: ____________</span>
            </div>
          </div>

          {/* FIȘA 3 - CONDIȚIONALE (Page Break) */}
          <div className="print-card print-break bg-white rounded-3xl border border-black/5 p-8 shadow-sm">
            <div className="border-b-2 border-dashed border-indigo-100 pb-4 text-center">
              <h1 className="text-2xl font-black text-indigo-900">
                Aventura lui Pippy — Fișă Didactică 3
              </h1>
              <p className="text-xs text-slate-500 font-bold mt-1 uppercase tracking-wider">
                Nivelul: Avansat (Clasele III–IV) · Tema: Decizii Logice („Dacă... Atunci”)
              </p>
            </div>

            <div className="mt-6">
              <h2 className="text-sm font-bold text-slate-800">
                Cerință: Verifică semnalul steluței!
              </h2>
              <p className="text-xs text-slate-600 mt-1">
                Pippy 🤖 avansează pas cu pas. Dacă pe pătratul curent se află o steluță ⭐, el trebuie să vireze spre dreapta ➡️. Altfel, continuă drept înainte. Scrie pașii pentru fiecare dintre cele 4 celule din drum!
              </p>
            </div>

            <div className="mt-8 flex justify-center">
              <div className="grid grid-cols-4 gap-3 max-w-[320px] w-full border-4 border-slate-300 p-3 rounded-2xl bg-slate-50">
                <div className="flex items-center justify-center h-16 bg-white border border-slate-300 rounded-xl font-bold">🤖 (Start)</div>
                <div className="flex items-center justify-center h-16 bg-white border border-slate-300 rounded-xl font-bold">⭐</div>
                <div className="flex items-center justify-center h-16 bg-white border border-slate-300 rounded-xl font-bold">🟩</div>
                <div className="flex items-center justify-center h-16 bg-white border border-slate-300 rounded-xl font-bold">🏁</div>
              </div>
            </div>

            <div className="mt-10">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                Completează regula de decizie (Dacă... Atunci):
              </h3>
              <div className="mt-3 space-y-3 font-mono text-xs">
                <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl">
                  Dacă văd steluță ⭐ : _____________________________________
                </div>
                <div className="p-3 bg-indigo-50 border border-indigo-200 rounded-xl">
                  Altfel (drum liber) : _____________________________________
                </div>
              </div>
            </div>

            <div className="mt-12 flex justify-between border-t border-slate-100 pt-6 text-xs text-slate-500 font-medium">
              <span>Elev: _________________________</span>
              <span>Nota / Evaluarea: ____________</span>
            </div>
          </div>

          {/* FIȘA 4 - VARIABILE (Page Break) */}
          <div className="print-card print-break bg-white rounded-3xl border border-black/5 p-8 shadow-sm">
            <div className="border-b-2 border-dashed border-indigo-100 pb-4 text-center">
              <h1 className="text-2xl font-black text-indigo-900">
                Aventura lui Pippy — Fișă Didactică 4
              </h1>
              <p className="text-xs text-slate-500 font-bold mt-1 uppercase tracking-wider">
                Nivelul: Avansat (Clasele III–IV) · Tema: Variabile și Numărare
              </p>
            </div>

            <div className="mt-6">
              <h2 className="text-sm font-bold text-slate-800">
                Cerință: Numără steluțele din rucsac!
              </h2>
              <p className="text-xs text-slate-600 mt-1">
                Pippy 🤖 parcurge traseul de mai jos și adună steluțe în rucsacul său (`stele`). Completează valoarea variabilei `stele` după fiecare pas!
              </p>
            </div>

            <div className="mt-8 flex justify-center">
              <div className="grid grid-cols-5 gap-2 max-w-[360px] w-full border-4 border-slate-300 p-3 rounded-2xl bg-slate-50 text-center font-bold text-sm">
                <div className="p-2 bg-white border rounded-xl">1. 🤖</div>
                <div className="p-2 bg-white border rounded-xl">2. ⭐</div>
                <div className="p-2 bg-white border rounded-xl">3. ⭐</div>
                <div className="p-2 bg-white border rounded-xl">4. 🟩</div>
                <div className="p-2 bg-white border rounded-xl">5. ⭐ 🏁</div>
              </div>
            </div>

            <div className="mt-10">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                Valoarea variabilei `stele` la fiecare pas:
              </h3>
              <div className="mt-3 grid grid-cols-5 gap-2 font-mono text-xs text-center">
                <div className="p-3 bg-slate-100 border rounded-xl">Pas 1: stele = 0</div>
                <div className="p-3 bg-amber-50 border border-amber-300 rounded-xl font-bold">Pas 2: stele = ___</div>
                <div className="p-3 bg-amber-50 border border-amber-300 rounded-xl font-bold">Pas 3: stele = ___</div>
                <div className="p-3 bg-slate-100 border rounded-xl font-bold">Pas 4: stele = ___</div>
                <div className="p-3 bg-emerald-50 border border-emerald-300 rounded-xl font-bold">Pas 5: stele = ___</div>
              </div>
            </div>

            <div className="mt-12 flex justify-between border-t border-slate-100 pt-6 text-xs text-slate-500 font-medium">
              <span>Elev: _________________________</span>
              <span>Nota / Evaluarea: ____________</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

