import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import {
  getCapitol,
  getModul,
  hrefModul,
  ICOANE_SUBLECTIE,
  modulUrmator,
  numeClasa,
  radacinaClasa,
} from "@/lib/curriculum";
import { getSublectieContinut } from "@/lib/sublectii";
import { lectiiLiberAccesibile } from "@/lib/acces";
import MarcheazaPasDeschis from "@/components/MarcheazaPasDeschis";
import BlocuriSublectie from "@/components/BlocuriSublectie";
import LectieContainer from "@/components/LectieContainer";
import SublectieGate from "@/components/SublectieGate";
import PythonEditor from "@/components/PythonEditor";
import { getUtilizatorCurent, areAbonamentActiv } from "@/lib/subscription";
import { getQuizSublectie } from "@/lib/quizSublectii";
import { getExercitiiSublectie } from "@/lib/exercitii";
import { NIVELE } from "@/lib/exercitii-tipuri";
import { getPredicție } from "@/lib/predicții";
import PredicțieWidget from "@/components/PredicțieWidget";
import ScrollReveal from "@/components/ScrollReveal";
import BreadcrumbJsonLd from "@/components/seo/BreadcrumbJsonLd";

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
  if (!modul) return {};

  // Modulele premium arată, pentru cine nu are acces, un "teaser" aproape
  // identic pe sute de sublecții (doar titlul/descrierea scurtă diferă) —
  // conținut subțire și cvasi-duplicat. Nu le trimitem la indexare: fără
  // acest noindex explicit, Google le descoperă prin navigarea internă
  // (anterior/următor, lista din pagina de modul) și rămân în limb ca
  // "Discovered/Crawled - currently not indexed", risipind buget de crawl.
  // Sublecțiile chiar publice (module gratuite) rămân indexabile normal.
  const esteGratuit = lectiiLiberAccesibile(modul);
  if (!esteGratuit) {
    const sublectieInfo = modul.sublectii.find((s) => s.cod === sublectieCod);
    if (!sublectieInfo) return {};
    return {
      title: `${sublectieCod} ${sublectieInfo.titlu}`,
      description: `${sublectieInfo.descriere} — necesită abonament activ.`,
      alternates: { canonical: `/curriculum/${clasa}/${modulSlug}/${sublectieCod}` },
      robots: { index: false, follow: true },
    };
  }

  const continut = await getSublectieContinut(sublectieCod);
  if (!continut) return {};

  return {
    title: `${sublectieCod} ${continut.titlu}`,
    description: `Sublecția ${sublectieCod} din modulul ${modul.titlu}.`,
    alternates: { canonical: `/curriculum/${clasa}/${modulSlug}/${sublectieCod}` },
  };
}

export default async function SublectiePage({ params }: { params: Promise<Params> }) {
  const { clasa, modulSlug, sublectieCod } = await params;
  const modul = getModul(clasa, modulSlug);
  const capitol = getCapitol(clasa);

  if (!modul || !capitol) notFound();

  // Metadatele structurale ale sublecției (titlu, descriere scurtă, tip) vin
  // din structura curriculară (curriculum.ts), NU din conținutul plătit al
  // lecției — sunt aceleași date deja afișate public pe pagina de modul,
  // pentru toată lumea, indiferent de abonament. Le folosim ca sursă pentru
  // varianta „teaser", ca să nu fie nevoie să citim deloc conținutul plătit
  // când vizitatorul nu are acces.
  const sublectieInfo = modul.sublectii.find((s) => s.cod === sublectieCod);
  if (!sublectieInfo) notFound();

  const icon = ICOANE_SUBLECTIE[sublectieInfo.tip];

  // Navigarea se face pas cu pas, în interiorul modulului (doar cod și titlu,
  // aceleași date publice ca pe pagina de modul). După pasul 6 urmează
  // modulul următor din același traseu.
  const indexPas = modul.sublectii.findIndex((s) => s.cod === sublectieCod);
  const pasAnterior = indexPas > 0 ? modul.sublectii[indexPas - 1] : undefined;
  const pasUrmator = modul.sublectii[indexPas + 1];
  const urmModul = pasUrmator ? undefined : modulUrmator(clasa, modul.slug);
  const hrefPas = (cod: string) => `${hrefModul(modul)}/${cod}`;
  const radacina = radacinaClasa(clasa);

  const breadcrumbJsonLd = (
    <BreadcrumbJsonLd
      firimituri={[
        radacina,
        { nume: numeClasa(clasa), cale: `/curriculum/${clasa}` },
        { nume: modul.cod, cale: hrefModul(modul) },
        { nume: sublectieCod },
      ]}
    />
  );

  const breadcrumb = (
    <nav aria-label="Breadcrumb" className="text-sm text-foreground/70">
      <Link href={radacina.cale} className="hover:text-brand">
        {radacina.nume}
      </Link>
      <span className="mx-2" aria-hidden="true">/</span>
      <Link href={`/curriculum/${clasa}`} className="hover:text-brand">
        {numeClasa(clasa)}
      </Link>
      <span className="mx-2" aria-hidden="true">/</span>
      <Link href={hrefModul(modul)} className="hover:text-brand">
        Modulul {modul.cod}
      </Link>
    </nav>
  );

  /** Bara cu cei 6 pași: poziția curentă și acces rapid la ceilalți. */
  const indicatorPasi = (
    <nav aria-label="Pașii lecției" className="mt-4">
      <p className="text-sm font-bold text-foreground">
        Pasul {indexPas + 1} din {modul.sublectii.length}
      </p>
      <ol className="mt-2 grid grid-cols-6 gap-1.5">
        {modul.sublectii.map((s, i) => (
          <li key={s.cod}>
            <Link
              href={hrefPas(s.cod)}
              aria-current={i === indexPas ? "step" : undefined}
              title={`Pasul ${i + 1}: ${s.titlu}`}
              className={`flex h-9 items-center justify-center rounded-lg border text-sm font-bold transition ${
                i === indexPas
                  ? "border-amber-500 bg-amber-400 text-slate-950"
                  : i < indexPas
                    ? "border-amber-200 bg-amber-50 text-amber-900 hover:border-amber-400"
                    : "border-border bg-white text-foreground/70 hover:border-amber-400"
              }`}
            >
              <span className="sr-only">Pasul </span>
              {i + 1}
              <span className="sr-only">: {s.titlu}</span>
            </Link>
          </li>
        ))}
      </ol>
    </nav>
  );

  const navigarePrevUrm = (
    <nav aria-label="Navigare între pași" className="mt-10 flex flex-wrap items-center justify-between gap-3 border-t border-border pt-6">
      {pasAnterior ? (
        <Link
          href={hrefPas(pasAnterior.cod)}
          className="text-sm font-semibold text-brand-dark hover:text-brand"
        >
          ← Pasul {indexPas}: {pasAnterior.titlu}
        </Link>
      ) : (
        <Link href={hrefModul(modul)} className="text-sm font-semibold text-brand-dark hover:text-brand">
          ← Pagina modulului
        </Link>
      )}
      {pasUrmator ? (
        <Link
          href={hrefPas(pasUrmator.cod)}
          className="rounded-xl bg-amber-400 px-5 py-3 text-sm font-black text-slate-950 shadow-xs transition hover:bg-amber-500"
        >
          Pasul următor: {pasUrmator.titlu} →
        </Link>
      ) : urmModul ? (
        <Link
          href={`${hrefModul(urmModul)}/${urmModul.sublectii[0]?.cod ?? ""}`}
          className="rounded-xl bg-amber-400 px-5 py-3 text-sm font-black text-slate-950 shadow-xs transition hover:bg-amber-500"
        >
          Modulul următor: {urmModul.titlu} →
        </Link>
      ) : (
        <Link href={hrefModul(modul)} className="text-sm font-semibold text-brand-dark hover:text-brand">
          Înapoi la modul →
        </Link>
      )}
    </nav>
  );

  // Verificare acces premium:
  const { user, meta } = await getUtilizatorCurent();
  const areAcces = lectiiLiberAccesibile(modul) || areAbonamentActiv(meta);

  if (!areAcces) {
    // Variantă „teaser", randată server-side pentru oricine (inclusiv
    // Googlebot) — fără niciun redirect. Deliberat NU citim aici
    // getSublectieContinut / getQuizSublectie / getExercitiiSublectie /
    // getPredicție: conținutul plătit nu trebuie să existe deloc în arborele
    // de randare al acestei ramuri, nu doar să fie ascuns vizual.
    return (
      <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6">
        {breadcrumbJsonLd}
        {breadcrumb}
        {indicatorPasi}

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
            🔒 Acest pas face parte dintr-un modul care necesită cont și abonament activ.
          </p>
          <p className="mt-1 text-sm text-amber-700">
            Deblochează toate modulele, testele și exercițiile practice de programare cu un abonament activ.
          </p>
          <div className="mt-4 flex flex-wrap justify-center gap-3">
            <Link
              href="/preturi"
              className="rounded-xl bg-amber-400 px-5 py-2.5 text-sm font-black text-slate-950 transition hover:bg-amber-500"
            >
              Vezi prețurile
            </Link>
            {!user ? (
              <Link
                href={`/login?redirect=${encodeURIComponent(`/curriculum/${clasa}/${modulSlug}/${sublectieCod}`)}`}
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

  // De aici încolo, doar pentru cine chiar are acces: aici (și nu mai
  // devreme) citim conținutul plătit al lecției.
  const continut = await getSublectieContinut(sublectieCod);
  const intrebari = await getQuizSublectie(sublectieCod);
  const exercitii = await getExercitiiSublectie(sublectieCod);
  const predic = await getPredicție(sublectieCod);
  const itemsCod = (continut?.blocuri ?? []).filter(
    (b) => b.tip === "verifica-cod"
  );

  // Pentru o pagină de quiz (1.X.6), exercițiile necesare înainte de deblocare
  // sunt cele de pe 1.X.4 și 1.X.5 (care stau pe alte pagini). SublectieGate
  // compară cu id-ul complet al fiecărui exercițiu (ex. "1.1.4.ex1"), nu cu
  // codul sublecției ("1.1.4").
  //
  // ExercitiiInteractive arată exercițiile pe taburi de nivel (de-bază /
  // consolidat / avansat), UN SINGUR tab vizibil o dată - implicit "de-bază",
  // sau primul nivel disponibil dacă sublecția n-are deloc exerciții "de-bază"
  // (același fallback ca în componentă: niveleDisponibile[0]). Cerem doar
  // exercițiile din ACEL tab implicit - nu toate nivelurile de pe ambele
  // pagini - altfel elevul ar trebui să dea click pe taburi ascunse și să
  // rezolve și exercițiile avansate doar ca să ajungă la quiz.
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
      {indicatorPasi}
      <MarcheazaPasDeschis cod={sublectieCod} />

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
          permiteRulare={sublectieInfo.tip !== "prezice"}
        />
      </LectieContainer>

      {predic && (
        <ScrollReveal className="mt-8">
          <PredicțieWidget predic={predic} sublectieCod={sublectieCod} clasa={clasa} />
        </ScrollReveal>
      )}

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
                    Rulează codul — dacă rezultatul corespunde, ai demonstrat că
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
          clasa={clasa}
          sublectieCod={sublectieCod}
          autentificat={Boolean(user)}
          exercitiiNecesare={exercitiiNecesare}
        />
      </ScrollReveal>

      {navigarePrevUrm}
    </div>
  );
}
