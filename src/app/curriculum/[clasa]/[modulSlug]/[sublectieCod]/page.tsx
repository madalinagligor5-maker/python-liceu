import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import {
  getCapitol,
  getModul,
  hrefModul,
  ICOANE_SUBLECTIE,
} from "@/lib/curriculum";
import {
  getSublectieContinut,
  sublectieAnterioara,
  sublectieUrmatoare,
} from "@/lib/sublectii";
import BlocuriSublectie from "@/components/BlocuriSublectie";
import QuizSublectie from "@/components/QuizSublectie";
import ExercitiiInteractive from "@/components/ExercitiiInteractive";
import { getUtilizatorCurent } from "@/lib/subscription";
import { getQuizSublectie } from "@/lib/quizSublectii";
import { getExercitiiSublectie } from "@/lib/exercitii";
import { getPredicție } from "@/lib/predicții";
import PredicțieWidget from "@/components/PredicțieWidget";

type Params = { clasa: string; modulSlug: string; sublectieCod: string };

// Fără generateStaticParams: rută pur dinamică, generată la fiecare request.
// (generateStaticParams cu listă parțială dădea 404 în Next 16 pentru
// rutele care nu erau în listă, chiar cu dynamicParams=true.)
export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { clasa, modulSlug, sublectieCod } = await params;
  const modul = getModul(clasa, modulSlug);
  const continut = await getSublectieContinut(sublectieCod);
  if (!modul || !continut) return {};

  return {
    title: `${sublectieCod} ${continut.titlu} — Academia Python`,
    description: `Sublecția ${sublectieCod} din modulul ${modul.titlu}.`,
  };
}

export default async function SublectiePage({ params }: { params: Promise<Params> }) {
  const { clasa, modulSlug, sublectieCod } = await params;
  const modul = getModul(clasa, modulSlug);
  const capitol = getCapitol(clasa);
  const continut = await getSublectieContinut(sublectieCod);
  const { user } = await getUtilizatorCurent();
  const intrebari = await getQuizSublectie(sublectieCod);
  const exercitii = await getExercitiiSublectie(sublectieCod);
  const predic = await getPredicție(sublectieCod);

  if (!modul || !capitol || !continut) notFound();

  const anterior = await sublectieAnterioara(sublectieCod);
  const urmatoarea = await sublectieUrmatoare(sublectieCod);

  // Tipul sublecției (pentru iconiță/culoare) îl luăm din structura JSON.
  const tip = modul.sublectii.find((s) => s.cod === sublectieCod)?.tip ?? "concept";
  const icon = ICOANE_SUBLECTIE[tip];

  return (
    <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6">
      <nav className="text-sm text-muted">
        <Link href="/curriculum" className="hover:text-brand">
          Curriculum
        </Link>
        <span className="mx-2">/</span>
        <Link href={`/curriculum/${clasa}`} className="hover:text-brand">
          Clasa a {clasa}-a
        </Link>
        <span className="mx-2">/</span>
        <Link href={hrefModul(modul)} className="hover:text-brand">
          {modul.cod}
        </Link>
        <span className="mx-2">/</span>
        <span>{sublectieCod}</span>
      </nav>

      <div className="mt-4 flex items-center gap-3">
        <span aria-hidden="true" className="text-3xl">
          {icon}
        </span>
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-brand">
            {modul.cod} {modul.titlu}
          </p>
          <h1 className="text-2xl font-extrabold leading-tight text-foreground sm:text-3xl">
            {continut.titlu}
          </h1>
        </div>
      </div>

      <article className="mt-6 rounded-2xl border border-border bg-white p-6 shadow-sm sm:p-8">
        <BlocuriSublectie blocuri={continut.blocuri} />
      </article>

      {predic && <PredicțieWidget predic={predic} sublectieCod={sublectieCod} />}

      <ExercitiiInteractive exercitii={exercitii} />

      {intrebari.length > 0 && (
        <div className="mt-6">
          <QuizSublectie
            intrebari={intrebari}
            clasa={clasa}
            sublectieCod={sublectieCod}
            autentificat={Boolean(user)}
          />
        </div>
      )}

      <nav className="mt-8 flex flex-wrap justify-between gap-3 border-t border-border pt-6">
        {anterior ? (
          <Link
            href={`/curriculum/${clasa}/${modulSlug}/${anterior.cod}`}
            className="max-w-[45%] text-sm font-semibold text-brand hover:text-brand-dark"
          >
            ← {anterior.cod} {anterior.titlu}
          </Link>
        ) : (
          <span />
        )}
        {urmatoarea ? (
          <Link
            href={`/curriculum/${clasa}/${modulSlug}/${urmatoarea.cod}`}
            className="max-w-[45%] text-right text-sm font-semibold text-brand hover:text-brand-dark"
          >
            {urmatoarea.cod} {urmatoarea.titlu} →
          </Link>
        ) : (
          <Link
            href={hrefModul(modul)}
            className="text-sm font-semibold text-brand hover:text-brand-dark"
          >
            Înapoi la modul →
          </Link>
        )}
      </nav>
    </div>
  );
}
