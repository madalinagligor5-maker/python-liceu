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

      <div className="mt-8 space-y-10 print:space-y-6">
        {/* Secțiune 1: Recapitulare / Introducere */}
        {recap && recap.blocuri && recap.blocuri.length > 0 && (
          <section className="rounded-2xl border border-black/5 bg-white p-6 shadow-sm print:border-0 print:shadow-none print:p-0">
            <h2 className="text-lg font-bold text-foreground border-b border-black/5 pb-2 mb-4 print:text-base">
              📌 Recapitulare și Context
            </h2>
            <BlocuriSublectie blocuri={recap.blocuri} />
          </section>
        )}

        {/* Secțiune 2: Teoria propriu-zisă */}
        {teorie && teorie.blocuri && teorie.blocuri.length > 0 ? (
          <section className="rounded-2xl border border-black/5 bg-white p-6 shadow-sm print:border-0 print:shadow-none print:p-0">
            <h2 className="text-lg font-bold text-foreground border-b border-black/5 pb-2 mb-4 print:text-base">
              📘 Concept teoretic și Exemple de Cod
            </h2>
            <BlocuriSublectie blocuri={teorie.blocuri} />
          </section>
        ) : (
          <div className="rounded-2xl border border-black/5 bg-black/[0.02] p-8 text-center print:hidden">
            <span className="text-4xl" aria-hidden="true">📖</span>
            <h3 className="mt-3 text-base font-bold text-foreground">Materialul este în curs de redactare</h3>
            <p className="mt-1 text-sm text-foreground/60 max-w-md mx-auto">
              Teoria detaliată pentru acest modul urmează să fie publicată. Poți verifica restul modulelor active!
            </p>
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
          Rezolvă exercițiile practice →
        </Link>
      </div>
    </div>
  );
}
