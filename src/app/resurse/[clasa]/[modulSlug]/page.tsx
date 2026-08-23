import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getModul, getCapitol } from "@/lib/curriculum";
import { getSublectieContinut } from "@/lib/sublectii";
import BlocuriSublectie from "@/components/BlocuriSublectie";
import PrintButton from "@/components/PrintButton";

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
    title: `Fișă de lucru: ${modul.titlu} — Academia Python`,
    description: `Teorie, rezumate de sintaxă și exemple explicative pentru modulul ${modul.titlu}.`,
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

  // Încărcăm teoria (.2 - Concept nou) și opțional recapitularea (.1)
  const recap = await getSublectieContinut(`${modul.cod}.1`);
  const teorie = await getSublectieContinut(`${modul.cod}.2`);

  return (
    <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6 print:py-0 print:px-0">
      <nav className="text-sm text-muted print:hidden">
        <Link href="/resurse" className="hover:text-brand">
          Resurse
        </Link>
        <span className="mx-2">/</span>
        <span className="text-foreground">Clasa a {clasa}-a</span>
        <span className="mx-2">/</span>
        <span className="font-semibold text-foreground">{modul.cod}</span>
      </nav>

      <div className="mt-4 border-b border-black/5 pb-5 flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
        <div>
          <span className="inline-flex items-center rounded-full bg-success/10 px-2.5 py-1 text-xs font-bold text-success mb-2 print:hidden">
            Fișă teoretică gratuită
          </span>
          <h1 className="text-2xl font-extrabold text-foreground sm:text-3xl print:text-xl">
            Fișă de lucru: {modul.titlu}
          </h1>
          <p className="mt-2 text-sm text-foreground/75 leading-relaxed print:hidden">
            Această fișă conține sinteza teoretică și exemplele practice de cod pentru modulul **{modul.cod}**. 
            O poți folosi pentru studiu individual sau o poți descărca/printa ca suport pentru ore.
          </p>
        </div>
        <div className="shrink-0 print:hidden">
          <PrintButton />
        </div>
      </div>

      {/* Box de descărcare PDF (Apare doar pe ecran) */}
      <div className="mt-8 rounded-3xl border border-brand/20 bg-brand-light/35 p-8 text-center print:hidden shadow-sm">
        <span className="text-5xl" aria-hidden="true">📄</span>
        <h3 className="mt-4 text-lg font-extrabold text-foreground">Fișa de lucru în format PDF</h3>
        <p className="mt-2 text-sm text-foreground/75 max-w-sm mx-auto leading-relaxed">
          Conținutul teoretic complet și suportul de curs pentru modulul <strong>{modul.cod}</strong> sunt oferite gratuit sub formă de document PDF sau printabil.
        </p>
        <div className="mt-6 flex justify-center">
          <PrintButton />
        </div>
      </div>

      <div className="mt-8 space-y-10 print:space-y-6 hidden print:block">
        {/* Secțiune 1: Recapitulare / Introducere */}
        {recap && recap.blocuri && recap.blocuri.length > 0 && (
          <section className="print:border-0 print:shadow-none print:p-0">
            <h2 className="text-lg font-bold text-foreground border-b border-black/5 pb-2 mb-4 print:text-base">
              📌 Recapitulare și Context
            </h2>
            <BlocuriSublectie blocuri={recap.blocuri} />
          </section>
        )}

        {/* Secțiune 2: Teoria propriu-zisă */}
        {teorie && teorie.blocuri && teorie.blocuri.length > 0 ? (
          <section className="print:border-0 print:shadow-none print:p-0">
            <h2 className="text-lg font-bold text-foreground border-b border-black/5 pb-2 mb-4 print:text-base">
              📘 Concept teoretic și Exemple de Cod
            </h2>
            <BlocuriSublectie blocuri={teorie.blocuri} />
          </section>
        ) : (
          <div className="text-center py-8">
            <p className="text-sm text-muted">Materialul teoretic pentru acest modul urmează să fie publicat.</p>
          </div>
        )}
      </div>

      <div className="mt-10 flex justify-between border-t border-black/5 pt-6 print:hidden">
        <Link 
          href="/resurse" 
          className="text-sm font-semibold text-brand hover:text-brand-dark transition"
        >
          ← Înapoi la catalogul de resurse
        </Link>
        <Link 
          href={`/exercitii/${clasa}/${modulSlug}`} 
          className="text-sm font-semibold text-brand hover:text-brand-dark transition"
        >
          Mergi la exerciții practice →
        </Link>
      </div>
    </div>
  );
}
