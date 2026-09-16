import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import {
  getModulCurs,
  getUnitatePentruModul,
  hrefModulCurs,
  toateModuleleCurs,
} from "@/lib/curs";
import { ICOANE_SUBLECTIE } from "@/lib/curriculum";
import {
  getSublectieContinutCurs,
  sublectieCursAnterioara,
  sublectieCursUrmatoare,
} from "@/lib/cursSublectii";
import BlocuriSublectie from "@/components/BlocuriSublectie";
import LectieContainer from "@/components/LectieContainer";
import SublectieGate from "@/components/SublectieGate";
import PythonEditor from "@/components/PythonEditor";
import { getUtilizatorCurent, areAbonamentCursActiv } from "@/lib/subscription";
import { getQuizSublectie } from "@/lib/quizSublectii";
import { getExercitiiSublectie } from "@/lib/exercitii";
import { NIVELE } from "@/lib/exercitii-tipuri";
import ScrollReveal from "@/components/ScrollReveal";
import BreadcrumbJsonLd from "@/components/seo/BreadcrumbJsonLd";

type Params = { modulSlug: string; sublectieCod: string };

// Fără generateStaticParams: rută pur dinamică, generată la fiecare request
// (același motiv ca la /curriculum/[clasa]/[modulSlug]/[sublectieCod]).
export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { modulSlug, sublectieCod } = await params;
  const modul = getModulCurs(modulSlug);
  if (!modul) return {};

  if (!modul.gratuit) {
    const sublectieInfo = modul.sublectii.find((s) => s.cod === sublectieCod);
    if (!sublectieInfo) return {};
    return {
      title: `${sublectieCod} ${sublectieInfo.titlu}`,
      description: `${sublectieInfo.descriere} — necesită abonamentul Cursului practic de Python.`,
      alternates: { canonical: `/curs-practic/${modulSlug}/${sublectieCod}` },
      robots: { index: false, follow: true },
    };
  }

  const continut = await getSublectieContinutCurs(sublectieCod);
  if (!continut) return {};

  return {
    title: `${sublectieCod} ${continut.titlu}`,
    description: `Sublecția ${sublectieCod} din modulul ${modul.titlu}, Curs practic de Python.`,
    alternates: { canonical: `/curs-practic/${modulSlug}/${sublectieCod}` },
  };
}

export default async function SublectieCursPage({ params }: { params: Promise<Params> }) {
  const { modulSlug, sublectieCod } = await params;
  const modul = getModulCurs(modulSlug);
  const unitate = modul ? getUnitatePentruModul(modul.cod) : undefined;

  if (!modul || !unitate) notFound();

  const sublectieInfo = modul.sublectii.find((s) => s.cod === sublectieCod);
  if (!sublectieInfo) notFound();

  const icon = ICOANE_SUBLECTIE[sublectieInfo.tip];

  const anterior = await sublectieCursAnterioara(sublectieCod);
  const urmatoarea = await sublectieCursUrmatoare(sublectieCod);

  const hrefSublectieAdiacenta = (s: { cod: string; module: string }) => {
    const modulTinta = toateModuleleCurs().find((m) => m.cod === s.module);
    return modulTinta
      ? `${hrefModulCurs(modulTinta)}/${s.cod}`
      : `/curs-practic/${modulSlug}/${s.cod}`;
  };

  const breadcrumbJsonLd = (
    <BreadcrumbJsonLd
      firimituri={[
        { nume: "Curs practic", cale: "/curs-practic" },
        { nume: modul.cod, cale: hrefModulCurs(modul) },
        { nume: sublectieCod },
      ]}
    />
  );

  const breadcrumb = (
    <nav className="text-sm text-muted">
      <Link href="/curs-practic" className="hover:text-brand">
        Curs practic
      </Link>
      <span className="mx-2">/</span>
      <Link href={hrefModulCurs(modul)} className="hover:text-brand">
        {modul.cod}
      </Link>
      <span className="mx-2">/</span>
      <span>{sublectieCod}</span>
    </nav>
  );

  const navigarePrevUrm = (
    <nav className="mt-8 flex flex-wrap justify-between gap-3 border-t border-border pt-6">
      {anterior ? (
        <Link
          href={hrefSublectieAdiacenta(anterior)}
          className="max-w-[45%] text-sm font-semibold text-brand hover:text-brand-dark"
        >
          ← {anterior.cod} {anterior.titlu}
        </Link>
      ) : (
        <span />
      )}
      {urmatoarea ? (
        <Link
          href={hrefSublectieAdiacenta(urmatoarea)}
          className="max-w-[45%] text-right text-sm font-semibold text-brand hover:text-brand-dark"
        >
          {urmatoarea.cod} {urmatoarea.titlu} →
        </Link>
      ) : (
        <Link
          href={hrefModulCurs(modul)}
          className="text-sm font-semibold text-brand hover:text-brand-dark"
        >
          Înapoi la modul →
        </Link>
      )}
    </nav>
  );

  const { user, meta } = await getUtilizatorCurent();
  const areAcces = modul.gratuit || areAbonamentCursActiv(meta);

  if (!areAcces) {
    // Variantă „teaser", randată server-side — la fel ca la liceu, conținutul
    // plătit nu e citit deloc pe această ramură.
    return (
      <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6">
        {breadcrumbJsonLd}
        {breadcrumb}

        <div className="mt-4 flex items-center gap-3 mb-6">
          <span aria-hidden="true" className="text-3xl">
            {icon}
          </span>
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-brand">
              {modul.cod} {modul.titlu}
            </p>
            <h1 className="text-2xl font-extrabold leading-tight text-foreground sm:text-3xl [font-family:var(--font-fraunces)]">
              {sublectieInfo.titlu}
            </h1>
          </div>
        </div>

        <p className="text-sm leading-relaxed text-foreground/70">{sublectieInfo.descriere}</p>

        <div className="mt-6 rounded-2xl border border-amber-200 bg-amber-50/60 p-5 text-center">
          <p className="font-semibold text-amber-900">
            🔒 Acest modul necesită abonamentul Cursului practic de Python.
          </p>
          <p className="mt-1 text-sm text-amber-700">
            Modulul 1 e complet gratuit, ca să poți încerca stilul cursului
            înainte de a te abona.
          </p>
          <div className="mt-4 flex flex-wrap justify-center gap-3">
            <Link
              href="/curs-practic/preturi"
              className="rounded-xl bg-brand px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-brand-dark"
            >
              Vezi planurile cursului
            </Link>
            {!user ? (
              <Link
                href={`/login?redirect=${encodeURIComponent(`/curs-practic/${modulSlug}/${sublectieCod}`)}`}
                className="rounded-xl border border-black/10 px-5 py-2.5 text-sm font-semibold text-foreground transition hover:border-brand hover:text-brand"
              >
                Ai deja cont? Autentifică-te
              </Link>
            ) : (
              <Link
                href="/cont"
                className="rounded-xl border border-black/10 px-5 py-2.5 text-sm font-semibold text-foreground transition hover:border-brand hover:text-brand"
              >
                Contul meu
              </Link>
            )}
          </div>
        </div>

        {navigarePrevUrm}
      </div>
    );
  }

  const continut = await getSublectieContinutCurs(sublectieCod);
  const intrebari = await getQuizSublectie(sublectieCod);
  const exercitii = await getExercitiiSublectie(sublectieCod);
  const itemsCod = (continut?.blocuri ?? []).filter((b) => b.tip === "verifica-cod");

  const prefixModul = sublectieCod.replace(/\.\d+$/, "");

  function idURiNivelImplicit(listaExercitii: typeof exercitii): string[] {
    const nivelImplicit = NIVELE.find((n) => listaExercitii.some((e) => e.nivel === n.id))?.id;
    return listaExercitii.filter((e) => e.nivel === nivelImplicit).map((e) => e.id);
  }

  const exercitiiNecesare: string[] =
    intrebari.length > 0 && exercitii.length === 0
      ? (
          await Promise.all([
            getExercitiiSublectie(`${prefixModul}.4`),
            getExercitiiSublectie(`${prefixModul}.5`),
          ])
        ).flatMap(idURiNivelImplicit)
      : [];

  if (!continut) notFound();

  return (
    <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6">
      {breadcrumbJsonLd}
      {breadcrumb}

      <div className="mt-4 flex items-center gap-3 mb-6">
        <span aria-hidden="true" className="text-3xl">
          {icon}
        </span>
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-brand">
            {modul.cod} {modul.titlu}
          </p>
          <h1 className="text-2xl font-extrabold leading-tight text-foreground sm:text-3xl [font-family:var(--font-fraunces)]">
            {continut.titlu}
          </h1>
        </div>
      </div>

      <LectieContainer>
        <BlocuriSublectie
          blocuri={continut.blocuri}
          esteVerificare={continut.esteVerificare}
          esteExercitii={continut.esteExercitii}
        />
      </LectieContainer>

      {itemsCod.length > 0 && (
        <div className="mt-10 space-y-6">
          <h3 className="flex items-center gap-2 text-lg font-bold text-foreground [font-family:var(--font-fraunces)]">
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
              <ScrollReveal key={idx} index={idx} delayMs={100}>
                <div className="rounded-2xl border border-brand-border bg-white p-5 shadow-depth-sm">
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
              </ScrollReveal>
            );
          })}
        </div>
      )}

      <ScrollReveal className="mt-10">
        <SublectieGate
          exercitii={exercitii}
          intrebari={intrebari}
          clasa="CP"
          sublectieCod={sublectieCod}
          autentificat={Boolean(user)}
          exercitiiNecesare={exercitiiNecesare}
        />
      </ScrollReveal>

      {navigarePrevUrm}
    </div>
  );
}
