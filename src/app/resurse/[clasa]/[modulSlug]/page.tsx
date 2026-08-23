import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getModul, getCapitol } from "@/lib/curriculum";
import { obtineFisaPdfContent } from "@/lib/resursePdfContent";
import AutoPrint from "@/components/AutoPrint";
import PrintFallbackActions from "@/components/PrintFallbackActions";
import Logo from "@/components/Logo";
import CodeBlock from "@/components/CodeBlock";

type Params = { clasa: string; modulSlug: string };

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { clasa, modulSlug } = await params;
  const modul = getModul(clasa, modulSlug);
  if (!modul) return {};

  return {
    title: `Fișă PDF: ${modul.titlu} — Academia Python`,
    robots: "noindex, nofollow",
  };
}

export default async function ModulResursePage({
  params,
}: {
  params: Promise<Params>;
}) {
  const { clasa, modulSlug } = await params;
  const modul = getModul(clasa, modulSlug);
  const capitol = getCapitol(clasa);

  if (!modul || !capitol) notFound();

  // Preluăm conținutul dedicat fișei PDF
  const fisa = obtineFisaPdfContent(modul.cod, modul.titlu);

  return (
    <div className="min-h-screen bg-surface px-4 py-16 sm:px-6 print:py-0 print:px-0 print:bg-transparent">
      {/* Scriptul care declanșează automat dialogul de printare/salvare PDF */}
      <AutoPrint />

      {/* Mesaj pe ecran în timp ce se deschide dialogul de printare */}
      <div className="mx-auto max-w-md rounded-3xl border border-brand/20 bg-white p-8 text-center shadow-md print:hidden">
        <span className="text-5xl animate-pulse block" aria-hidden="true">📄</span>
        <h1 className="mt-4 text-xl font-extrabold text-foreground">Generare fișă PDF</h1>
        <p className="mt-1 text-xs text-brand font-bold uppercase tracking-wider">
          Modulul {modul.cod} — {modul.titlu}
        </p>
        <p className="mt-3 text-sm text-foreground/75 leading-relaxed">
          Caseta de salvare PDF s-a deschis automat. Dacă nu a apărut, folosește butonul de mai jos.
        </p>
        
        <PrintFallbackActions />
      </div>

      {/* Conținutul propriu-zis care este complet ascuns pe ecran, dar vizibil la tipărire/salvare PDF */}
      <div className="hidden print:block w-full text-black">
        {/* Doar sigla Academia Python și denumirea */}
        <div className="flex items-center gap-3 border-b-2 border-black pb-4 mb-8">
          <Logo className="h-14 w-14 rounded-xl" />
          <div className="leading-none">
            <span className="text-2xl font-black text-black">
              Academia<span className="text-brand">Python</span>
            </span>
            <span className="block mt-1 text-[11px] font-bold uppercase tracking-wider text-black/55">
              Fișă de studiu & lucru · Clasa a {clasa}-a
            </span>
          </div>
        </div>

        <div className="space-y-8">
          {/* Titlul modulului */}
          <div>
            <span className="text-xs font-bold text-gray-500 uppercase tracking-wide">
              Modulul {modul.cod}
            </span>
            <h1 className="text-xl font-black text-black mt-0.5">
              {modul.titlu}
            </h1>
          </div>

          {/* Secțiunea 1: Teoria sinteză */}
          <section className="space-y-3">
            <h2 className="text-sm font-extrabold uppercase border-b border-gray-300 pb-1 mb-2 text-black/80">
              📌 Sinteză Teoretică
            </h2>
            <p className="text-sm text-black/90 leading-relaxed text-justify">
              {fisa.teorie}
            </p>
          </section>

          {/* Secțiunea 2: Sintaxă / Exemplu model */}
          <section className="space-y-3">
            <h2 className="text-sm font-extrabold uppercase border-b border-gray-300 pb-1 mb-2 text-black/80">
              💻 Sintaxă & Cod Model (Python)
            </h2>
            <div className="rounded-xl border border-gray-300 overflow-hidden text-xs bg-gray-50">
              <CodeBlock code={fisa.sintaxa} label="exemplu.py" />
            </div>
          </section>

          {/* Secțiunea 3: Exerciții propuse */}
          <section className="space-y-3 pt-4">
            <h2 className="text-sm font-extrabold uppercase border-b border-gray-300 pb-1 mb-2 text-black/80">
              ✍️ Exerciții de antrenament
            </h2>
            <p className="text-xs text-gray-500 italic mb-2">
              Rezolvă următoarele exerciții pe foaie sau în editorul online al platformei:
            </p>
            <ol className="list-decimal pl-5 space-y-3 text-sm text-black/90">
              {fisa.exercitii.map((ex, idx) => (
                <li key={idx} className="leading-relaxed">
                  {ex}
                </li>
              ))}
            </ol>
          </section>
        </div>

        {/* Footer-ul fișei PDF */}
        <div className="mt-20 border-t border-gray-300 pt-3 text-center">
          <p className="text-[10px] text-gray-400 font-medium">
            Document generat automat de AcademiaPython.ro. Toate drepturile rezervate.
          </p>
        </div>
      </div>
    </div>
  );
}
