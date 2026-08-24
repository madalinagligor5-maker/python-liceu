import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getCapitol } from "@/lib/curriculum";

type Params = { clasa: string };

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { clasa } = await params;
  const capitol = getCapitol(clasa);
  if (!capitol) return {};

  return {
    title: `Fișe de lucru Clasa a ${clasa}-a — Academia Python`,
    description: `Descărcare fișe de lucru PDF pentru clasa a ${clasa}-a, conform programei școlare.`,
  };
}

export default async function ClasaResursePage({
  params,
}: {
  params: Promise<Params>;
}) {
  const { clasa } = await params;
  const capitol = getCapitol(clasa);

  if (!capitol) notFound();

  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
      <nav className="text-sm text-muted">
        <Link href="/resurse" className="hover:text-brand transition">
          Resurse
        </Link>
        <span className="mx-2">/</span>
        <span className="text-foreground font-semibold">Clasa a {clasa}-a</span>
      </nav>

      <div className="mt-4 border-b border-black/5 pb-5">
        <h1 className="text-2xl font-extrabold text-foreground sm:text-3xl">
          Fișe PDF: Clasa a {clasa}-a
        </h1>
        <p className="mt-2 text-sm text-foreground/70 leading-relaxed">
          Mai jos găsești lista completă a fișelor de sinteză teoretică și exerciții pentru clasa a {clasa}-a. 
          Apasă pe butonul de descărcare din dreptul fiecărei teme pentru a salva fișierul PDF.
        </p>
      </div>

      <div className="mt-8 space-y-4">
        {capitol.module.length > 0 ? (
          capitol.module.map((modul) => (
            <div
              key={modul.cod}
              className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 rounded-2xl border border-black/10 bg-white p-4 shadow-sm hover:border-brand hover:shadow-md transition group"
            >
              <div className="min-w-0">
                <h3 className="font-bold text-foreground text-sm leading-snug group-hover:text-brand transition flex flex-wrap items-center gap-2">
                  <span>Modulul {modul.cod} — {modul.titlu}</span>
                  <span className="inline-flex items-center rounded bg-slate-100 px-2 py-0.5 text-[10px] font-bold text-slate-500 shrink-0">
                    PDF · 1 pagină
                  </span>
                </h3>
              </div>
              
              <div className="shrink-0 w-full sm:w-auto">
                <Link
                  href={`/api/pdf/${clasa}/${modul.slug}`}
                  className="inline-flex w-full sm:w-auto justify-center items-center gap-1.5 rounded-xl bg-success px-4 py-2.5 text-xs font-bold text-white shadow-sm transition hover:bg-success-dark"
                >
                  📥 Descarcă PDF
                </Link>
              </div>
            </div>
          ))
        ) : (
          <div className="rounded-2xl border border-black/5 bg-black/[0.02] p-8 text-center">
            <span className="text-4xl" aria-hidden="true">🗂️</span>
            <p className="mt-2 text-sm text-foreground/60">Nu există resurse publicate pentru această clasă.</p>
          </div>
        )}
      </div>

      <div className="mt-10 border-t border-black/5 pt-6">
        <Link 
          href="/resurse" 
          className="text-sm font-semibold text-brand hover:text-brand-dark transition"
        >
          ← Înapoi la clase
        </Link>
      </div>
    </div>
  );
}
