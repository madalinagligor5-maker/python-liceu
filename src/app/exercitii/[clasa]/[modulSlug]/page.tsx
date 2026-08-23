import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getModul, getCapitol } from "@/lib/curriculum";
import { getExercitiiSublectie } from "@/lib/exercitii";
import ExercitiiInteractive from "@/components/ExercitiiInteractive";

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
    title: `Exerciții practice: ${modul.titlu} — Academia Python`,
    description: `Rezolvă exerciții practice de cod și quiz-uri pentru modulul ${modul.titlu}.`,
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

  // Exercițiile sunt pe pașii 4 (.4 - Ghidat) și 5 (.5 - Independent)
  const exercitiiGhidate = await getExercitiiSublectie(`${modul.cod}.4`);
  const exercitiiIndependente = await getExercitiiSublectie(`${modul.cod}.5`);
  const toateExercitiile = [...exercitiiGhidate, ...exercitiiIndependente];

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
        <span className="inline-flex items-center rounded-full bg-success/10 px-2.5 py-1 text-xs font-bold text-success mb-2">
          Zonă de antrenament gratuită
        </span>
        <h1 className="text-2xl font-extrabold text-foreground sm:text-3xl">
          Exerciții practice: {modul.titlu}
        </h1>
        <p className="mt-2 text-sm text-foreground/75 leading-relaxed">
          Rezolvă problemele de mai jos pentru a-ți consolida cunoștințele din modulul **{modul.cod}**. 
          Scrie codul în editor, verifică execuția și corectează erorile direct în pagină!
        </p>
      </div>

      <div className="mt-8 space-y-8">
        {toateExercitiile.length > 0 ? (
          <div>
            {/* Utilizăm direct componenta interactivă a platformei, forțând starea de deblocare */}
            <ExercitiiInteractive 
              exercitii={toateExercitiile} 
              deblocat={true} 
            />
          </div>
        ) : (
          <div className="rounded-2xl border border-black/5 bg-black/[0.02] p-8 text-center">
            <span className="text-4xl" aria-hidden="true">📝</span>
            <h3 className="mt-3 text-base font-bold text-foreground">Nu există exerciții separate</h3>
            <p className="mt-1 text-sm text-foreground/60 max-w-md mx-auto">
              Pentru acest modul, exercițiile practice sunt integrate direct în corpul teoriei sau în quiz-uri. 
              Poți explora lecția completă din curriculum.
            </p>
            <Link 
              href={`/curriculum/${clasa}/${modulSlug}`} 
              className="mt-4 inline-block rounded-xl bg-brand px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-brand-dark"
            >
              Vezi în curriculum
            </Link>
          </div>
        )}
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
