import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getModul, getCapitol } from "@/lib/curriculum";
import { getSublectieContinut } from "@/lib/sublectii";
import BlocuriSublectie from "@/components/BlocuriSublectie";
import AutoPrint from "@/components/AutoPrint";

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

  // Încărcăm teoria (.2) și recapitularea (.1)
  const recap = await getSublectieContinut(`${modul.cod}.1`);
  const teorie = await getSublectieContinut(`${modul.cod}.2`);

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
        
        <div className="mt-6 flex flex-col gap-2">
          <button
            onClick={() => {
              if (typeof window !== "undefined") window.print();
            }}
            className="w-full rounded-xl bg-brand px-5 py-3 text-sm font-semibold text-white transition hover:bg-brand-dark cursor-pointer"
          >
            🖨️ Deschide manual caseta de salvare
          </button>
          
          <button
            onClick={() => {
              if (typeof window !== "undefined") window.close();
            }}
            className="w-full rounded-xl border border-black/10 px-5 py-3 text-sm font-semibold text-foreground/80 transition hover:bg-black/5 cursor-pointer"
          >
            Închide această filă
          </button>
        </div>
      </div>

      {/* Conținutul propriu-zis care este complet ascuns pe ecran, dar vizibil la tipărire/salvare PDF */}
      <div className="hidden print:block w-full text-black">
        <div className="border-b-2 border-black pb-4 mb-6">
          <p className="text-sm font-bold tracking-wider uppercase text-gray-600">Academia Python — Fișă de lucru pentru elevi</p>
          <h1 className="text-2xl font-black mt-1">Clasa a {clasa}-a · Modulul {modul.cod}: {modul.titlu}</h1>
        </div>

        <div className="space-y-8">
          {/* Secțiune 1: Recapitulare */}
          {recap && recap.blocuri && recap.blocuri.length > 0 && (
            <section className="space-y-3">
              <h2 className="text-base font-extrabold uppercase border-b border-gray-300 pb-1 mb-2">
                1. Recapitulare și Context
              </h2>
              <BlocuriSublectie blocuri={recap.blocuri} />
            </section>
          )}

          {/* Secțiune 2: Teorie și cod */}
          {teorie && teorie.blocuri && teorie.blocuri.length > 0 ? (
            <section className="space-y-3">
              <h2 className="text-base font-extrabold uppercase border-b border-gray-300 pb-1 mb-2">
                2. Concept teoretic și Exemple de Cod
              </h2>
              <BlocuriSublectie blocuri={teorie.blocuri} />
            </section>
          ) : (
            <p className="text-sm italic text-gray-500">Materialul teoretic pentru acest modul este în curs de redactare.</p>
          )}
        </div>
      </div>
    </div>
  );
}
