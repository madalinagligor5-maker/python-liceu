import Link from "next/link";
import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import { getModul, getCapitol } from "@/lib/curriculum";
import { obtineSetExercitii } from "@/lib/exercitiiSuplimentare";
import ExercitiuEvaluator from "@/components/ExercitiuEvaluator";
import { getUtilizatorCurent, areAbonamentActiv, esteProfesorAprobat } from "@/lib/subscription";

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
    title: `Exercițiu de Evaluare: ${modul.titlu} — Academia Python`,
    description: `Rezolvă exercițiul practic de cod de sine stătător și primește evaluare/îndrumare inteligentă de la profesorul AI pentru modulul ${modul.titlu}.`,
    alternates: { canonical: `/exercitii/${clasa}/${modulSlug}` },
  };
}

export default async function ModulExercitiiPage({
  params,
}: {
  params: Promise<Params>;
}) {
  const { clasa, modulSlug } = await params;
  const modul = getModul(clasa, modulSlug);
  const capitol = getCapitol(clasa);

  if (!modul || !capitol) notFound();

  // Verificare acces premium pentru exerciții
  const { user, meta } = await getUtilizatorCurent();
  const esteGratuit = modul.gratuit || (clasa === "IX" && modul.numar <= 5);
  const areAcces = esteGratuit || areAbonamentActiv(meta) || esteProfesorAprobat(meta);

  if (!areAcces) {
    if (!user) {
      redirect(`/login?redirect=${encodeURIComponent(`/exercitii/${clasa}/${modulSlug}`)}`);
    } else {
      redirect("/preturi");
    }
  }

  // Preluăm setul de 6 exerciții practice progresive pentru acest modul
  const exercitii = obtineSetExercitii(modul.cod, modul.titlu);

  return (
    <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6">
      <nav className="text-sm text-muted">
        <Link href="/exercitii" className="hover:text-brand">
          Exerciții
        </Link>
        <span className="mx-2">/</span>
        <span className="text-foreground">Clasa a {clasa}-a</span>
        <span className="mx-2">/</span>
        <span className="font-semibold text-foreground">{modul.cod}</span>
      </nav>

      <div className="mt-4 border-b border-black/5 pb-5">
        <div className="flex flex-row flex-wrap gap-2 items-center mb-2">
          <span className="inline-flex items-center rounded-full bg-success/10 px-2.5 py-1 text-xs font-bold text-success">
            Zonă de antrenament gratuită
          </span>
          <span className="inline-flex items-center rounded-full bg-blue-50 px-2.5 py-1 text-xs font-bold text-blue-600 border border-blue-100">
            🤖 Evaluare & Îndrumare AI
          </span>
        </div>
        <h1 className="text-2xl font-extrabold text-foreground sm:text-3xl">
          Set de Lucru: {modul.titlu}
        </h1>
      </div>

      <div className="mt-6 space-y-8">
        <ExercitiuEvaluator exercitii={exercitii} />
      </div>

      <div className="mt-10 flex justify-between border-t border-black/5 pt-6">
        <Link 
          href="/exercitii" 
          className="text-sm font-semibold text-brand hover:text-brand-dark transition"
        >
          ← Înapoi la catalogul de exerciții
        </Link>
        <Link 
          href={`/curriculum/${clasa}/${modulSlug}`} 
          className="text-sm font-semibold text-brand hover:text-brand-dark transition"
        >
          Mergi la lecția completă →
        </Link>
      </div>
    </div>
  );
}
