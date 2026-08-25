import Link from "next/link";
import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
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
import LectieBadge from "@/components/LectieBadge";
import LectieTemaToggle from "@/components/LectieTemaToggle";
import SublectieGate from "@/components/SublectieGate";
import PythonEditor from "@/components/PythonEditor";
import { getUtilizatorCurent, areAbonamentActiv } from "@/lib/subscription";
import { getQuizSublectie } from "@/lib/quizSublectii";
import { getExercitiiSublectie } from "@/lib/exercitii";
import { getPredicție } from "@/lib/predicții";
import PredicțieWidget from "@/components/PredicțieWidget";

import LaboratorConsolidare from "@/components/LaboratorConsolidare";
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

  if (!modul || !capitol) notFound();

  // Verificare acces premium:
  const { user, meta } = await getUtilizatorCurent();
  const esteGratuit = modul.gratuit || modul.numar <= 5;
  const areAcces = esteGratuit || areAbonamentActiv(meta);

  if (!areAcces) {
    if (!user) {
      redirect(`/login?redirect=${encodeURIComponent(`/curriculum/${clasa}/${modulSlug}/${sublectieCod}`)}`);
    } else {
      redirect("/preturi");
    }
  }

  const continut = await getSublectieContinut(sublectieCod);
  const intrebari = await getQuizSublectie(sublectieCod);
  const exercitii = await getExercitiiSublectie(sublectieCod);
  const predic = await getPredicție(sublectieCod);
  const itemsCod = (continut?.blocuri ?? []).filter(
    (b) => b.tip === "verifica-cod"
  );

  // Pentru o pagină de quiz (1.X.6), exercițiile necesare înainte de deblocare
  // sunt cele de pe 1.X.4 și 1.X.5 (care stau pe alte pagini). Le deducem din cod.
  const exercitiiNecesare: string[] =
    intrebari.length > 0 && exercitii.length === 0
      ? [`${sublectieCod.replace(/\.\d+$/, "")}.4`, `${sublectieCod.replace(/\.\d+$/, "")}.5`]
      : [];

  if (!continut) notFound();

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

      <div className="mt-4 flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
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
        <LectieTemaToggle />
      </div>

      <article
        id="lectie-articol"
        className="mt-6 rounded-2xl border border-border bg-white p-6 shadow-sm sm:p-8"
      >
        <BlocuriSublectie blocuri={continut.blocuri} esteVerificare={continut.esteVerificare} esteExercitii={continut.esteExercitii} />
      </article>

      {predic && <PredicțieWidget predic={predic} sublectieCod={sublectieCod} />}

      {itemsCod.length > 0 && (
        <div className="mt-6 space-y-6">
          <h3 className="flex items-center gap-2 text-lg font-bold text-foreground">
            <span className="text-2xl" aria-hidden="true">
              ✍️
            </span>
            Scrie tu codul — verificare prin execuție
          </h3>
          {itemsCod.map((b, idx) => {
            const item = b as Extract<
              import("@/lib/markdownMini").Bloc,
              { tip: "verifica-cod" }
            >;
            return (
              <div
                key={idx}
                className="rounded-2xl border border-brand-border bg-white p-5 shadow-sm"
              >
                <p className="text-sm font-medium text-foreground">{item.enunt}</p>
                <div className="mt-3">
                  <PythonEditor
                    initialCode={item.template || "# Scrie aici codul tău Python\n"}
                    expectedOutput={item.expectedOutput}
                    titlu="Editor Python (rulează în browser)"
                    height={item.template ? 180 : 140}
                  />
                </div>
                <p className="mt-2 text-xs text-foreground/55">
                  Rulește codul — dacă output-ul corespunde, ai demonstrat că
                  stăpânești conceptul, nu doar l-ai recunoscut în grilă.
                </p>
              </div>
            );
          })}
        </div>
      )}

      {/* Laborator de Consolidare & Practică pe sublecțiile de exerciții (.4, .5, .6) */}
      {(continut.esteExercitii || continut.esteVerificare || sublectieCod.endsWith(".4") || sublectieCod.endsWith(".5") || sublectieCod.endsWith(".6")) && (
        <div className="mt-8">
          <LaboratorConsolidare codModul={modul.cod} titluModul={modul.titlu} />
        </div>
      )}

      <SublectieGate
        exercitii={exercitii}
        intrebari={intrebari}
        clasa={clasa}
        sublectieCod={sublectieCod}
        autentificat={Boolean(user)}
        exercitiiNecesare={exercitiiNecesare}
      />

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
