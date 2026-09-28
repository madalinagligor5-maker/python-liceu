import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getModulContinut } from "@/lib/sublectii";
import {
  capitole,
  esteCapitolCopii,
  getCapitol,
  getModul,
  hrefModul,
  ICOANE_SUBLECTIE,
  modulAnterior,
  modulUrmator,
  numeClasa,
  radacinaClasa,
  TOATE_CLASELE,
} from "@/lib/curriculum";
import { ETICHETE_ACCES, exercitiiPracticeLiberAccesibile, lectiiLiberAccesibile, nivelAccesLectii } from "@/lib/acces";
import { getExercitiiSublectie } from "@/lib/exercitii";
import { NIVELE } from "@/lib/exercitii-tipuri";
import { getProgresUtilizator } from "@/lib/progres";
import PasiModul, { type PasModul } from "@/components/PasiModul";
import type { Bloc } from "@/lib/markdownMini";
import { getPredicțiiClasa } from "@/lib/predicții";
import { getUtilizatorCurent, areAbonamentActiv } from "@/lib/subscription";
import BreadcrumbJsonLd from "@/components/seo/BreadcrumbJsonLd";

type Params = { clasa: string; modulSlug: string };

/** Alege aleatoriu `n` elemente dintr-o listă (Fisher-Yates). */
function alegeAleatoriu<T>(lista: T[], n: number): T[] {
  const copie = [...lista];
  for (let i = copie.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copie[i], copie[j]] = [copie[j], copie[i]];
  }
  return copie.slice(0, n);
}

export function generateStaticParams() {
  return capitole.flatMap((c) =>
    c.module.map((m) => ({ clasa: c.clasa, modulSlug: m.slug }))
  );
}

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { clasa, modulSlug } = await params;
  const modul = getModul(clasa, modulSlug);
  if (!modul) return {};

  return {
    title: `${modul.cod} ${modul.titlu}`,
    description: `Modul pentru ${numeClasa(clasa).toLowerCase()}, în 6 pași: recapitulare, concept nou, citește și prezice, exerciții ghidate, exerciții independente, verificare.`,
    alternates: { canonical: `/curriculum/${clasa}/${modulSlug}` },
  };
}

/** Titlurile cardurilor din pasul „Concept nou" — ce se învață concret. */
function subiecteDinConcept(blocuri: Bloc[]): string[] {
  const titluri: string[] = [];
  for (const b of blocuri) {
    if (b.tip !== "card" && b.tip !== "text") continue;
    const m = b.html.match(/<div class="bloc-card--titlu">(.*?)<\/div>|<h3[^>]*>(.*?)<\/h3>/);
    const brut = m?.[1] ?? m?.[2];
    if (!brut) continue;
    const text = brut.replace(/<[^>]+>/g, "").replace(/&amp;/g, "&").replace(/&lt;/g, "<").replace(/&gt;/g, ">").trim();
    const curat = text.replace(/^\d+\.\s*/, "");
    if (curat && !/^atenție|^atentie|^sfaturi/i.test(curat)) titluri.push(curat);
  }
  return titluri.slice(0, 5);
}

/** Cunoștințele necesare înainte de modul, deduse din ordinea curriculumului. */
function prerechizite(clasa: string, numar: number, anterior?: { cod: string; titlu: string; href: string }) {
  if (numar > 1 && anterior) {
    return { text: "Modulul anterior:", link: { href: anterior.href, eticheta: `${anterior.cod} ${anterior.titlu}` } };
  }
  if (esteCapitolCopii(clasa)) {
    const varsta = Number(clasa.slice(1));
    return varsta <= 7
      ? { text: "Nu e nevoie de cunoștințe anterioare. E bine ca un adult să fie alături la început." }
      : { text: "Recomandat:", link: { href: `/curriculum/P${varsta - 1}`, eticheta: `lecțiile pentru ${varsta - 1} ani` } };
  }
  const i = (TOATE_CLASELE as readonly string[]).indexOf(clasa);
  if (i <= 0) return { text: "Nu e nevoie de cunoștințe anterioare de programare." };
  if (clasa === "IX") {
    return {
      text: "Nu e obligatoriu nimic. Dacă n-ai mai scris cod, începe cu",
      link: { href: "/curriculum/VII/primii-pasi-in-python", eticheta: "primul modul de gimnaziu (gratuit)" },
    };
  }
  const precedenta = TOATE_CLASELE[i - 1];
  return { text: "Materia din", link: { href: `/curriculum/${precedenta}`, eticheta: numeClasa(precedenta).toLowerCase() } };
}

export default async function ModulPage({ params }: { params: Promise<Params> }) {
  const { clasa, modulSlug } = await params;
  const modul = getModul(clasa, modulSlug);
  const capitol = getCapitol(clasa);

  if (!modul || !capitol) notFound();

  const { user, meta } = await getUtilizatorCurent();
  const nivelAcces = nivelAccesLectii(modul);
  const areAcces = lectiiLiberAccesibile(modul) || areAbonamentActiv(meta);
  const exercitiiGratuite = exercitiiPracticeLiberAccesibile(modul, clasa);

  const anterior = modulAnterior(clasa, modulSlug);
  const urmator = modulUrmator(clasa, modulSlug);

  const modulC = await getModulContinut(modul.cod);
  const areContinut = Boolean(modulC && modulC.sublectii.length > 0);

  // Ce vei învăța: titlurile din pasul „Concept nou" (doar dacă ai acces la
  // conținut — altfel nu citim deloc conținutul plătit).
  const conceptC = areAcces ? modulC?.sublectii.find((s) => s.cod.endsWith(".2")) : undefined;
  const subiecte = conceptC ? subiecteDinConcept(conceptC.blocuri) : [];

  // Progresul salvat în cont (predicții corecte, teste trecute).
  const progres = user ? await getProgresUtilizator(user.id) : null;
  const reusiteCont = (progres?.lectiiFinalizate ?? [])
    .filter((slug) => slug.startsWith("sub-"))
    .map((slug) => slug.slice(4))
    .filter((cod) => cod.startsWith(`${modul.cod}.`));

  const pasi: PasModul[] = await Promise.all(
    modul.sublectii.map(async (s) => {
      let exercitiiNecesare: string[] = [];
      if (areAcces && (s.tip === "ghidat" || s.tip === "independent")) {
        const ex = await getExercitiiSublectie(s.cod);
        const nivelImplicit = NIVELE.find((n) => ex.some((e) => e.nivel === n.id))?.id;
        exercitiiNecesare = ex.filter((e) => e.nivel === nivelImplicit).map((e) => e.id);
      }
      return {
        cod: s.cod,
        titlu: s.titlu,
        descriere: s.descriere,
        tip: s.tip,
        icon: ICOANE_SUBLECTIE[s.tip],
        href: `/curriculum/${clasa}/${modul.slug}/${s.cod}`,
        exercitii: exercitiiNecesare,
      };
    })
  );

  const cerinte = prerechizite(
    clasa,
    modul.numar,
    anterior ? { cod: anterior.cod, titlu: anterior.titlu, href: hrefModul(anterior) } : undefined
  );
  const radacina = radacinaClasa(clasa);

  // Recapitulare cumulativă (interleaving): la fiecare modul al cărui număr
  // e multiplu de 5, arătăm 2 predicții din module mai vechi ale clasei.
  const nrModul = modul.numar; // number
  const faceRecapitulare = nrModul % 5 === 0 && nrModul > 0;
  let recapitulare: { cod: string; enunt: string; variante: string[]; corect: number }[] = [];
  if (faceRecapitulare) {
    const toate = await getPredicțiiClasa(clasa);
    const candidati = toate.filter((p) => {
      const m = p.cod.split(".");
      return parseInt(m[1], 10) < nrModul;
    });
    recapitulare = alegeAleatoriu(candidati, 2);
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6">
      <BreadcrumbJsonLd
        firimituri={[
          radacina,
          { nume: numeClasa(clasa), cale: `/curriculum/${clasa}` },
          { nume: `Modulul ${modul.numar}` },
        ]}
      />
      <nav aria-label="Breadcrumb" className="text-sm text-foreground/70">
        <Link href={radacina.cale} className="hover:text-brand">
          {radacina.nume}
        </Link>
        <span className="mx-2" aria-hidden="true">/</span>
        <Link href={`/curriculum/${clasa}`} className="hover:text-brand">
          {numeClasa(clasa)}
        </Link>
        <span className="mx-2" aria-hidden="true">/</span>
        <span>Modulul {modul.numar}</span>
      </nav>

      <div className="mt-4 flex flex-wrap items-center gap-2">
        <p className="text-xs font-semibold uppercase tracking-wide text-brand-dark">
          Modulul {modul.cod}
        </p>
        <span
          className={`rounded-full px-2 py-0.5 text-[11px] font-bold ${ETICHETE_ACCES[nivelAcces].clasa}`}
          title={ETICHETE_ACCES[nivelAcces].explicatie}
        >
          {ETICHETE_ACCES[nivelAcces].text}
        </span>
      </div>

      <h1 className="mt-1 text-3xl font-extrabold leading-tight text-foreground">
        {modul.titlu}
      </h1>
      <p className="mt-2 text-sm text-foreground/70">
        {capitol.titlu} · 6 pași
      </p>

      <section className="mt-6 grid gap-4 sm:grid-cols-2">
        <div className="rounded-2xl border border-border bg-white p-4">
          <h2 className="text-sm font-black text-foreground">Ce vei putea face la final</h2>
          {subiecte.length > 0 ? (
            <>
            <p className="mt-2 text-sm text-foreground/80">
              Să explici și să folosești în cod ideile din „{modul.titlu}”, verificând singur rezultatul. Temele lecției:
            </p>
            <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-foreground/80">
              {subiecte.map((t) => (
                <li key={t}>{t}</li>
              ))}
            </ul>
            </>
          ) : (
            <p className="mt-2 text-sm text-foreground/80">
              Să explici și să folosești în cod tema „{modul.titlu}”, verificând singur rezultatul programelor.
            </p>
          )}
        </div>
        <div className="rounded-2xl border border-border bg-white p-4">
          <h2 className="text-sm font-black text-foreground">Ce trebuie să știi înainte</h2>
          <p className="mt-2 text-sm text-foreground/80">
            {cerinte.text}{" "}
            {cerinte.link && (
              <Link href={cerinte.link.href} className="font-semibold text-brand-dark underline underline-offset-2 hover:text-brand">
                {cerinte.link.eticheta}
              </Link>
            )}
          </p>
          <p className="mt-2 text-xs text-foreground/60">
            Nu afișăm o durată estimată: ritmul diferă mult de la elev la elev.
          </p>
        </div>
      </section>

      {!areAcces && (
        <div id="acces" className="mt-6 rounded-2xl border border-amber-200 bg-amber-50/60 p-5 text-center">
          <p className="font-semibold text-amber-900">
            🔒 Acest modul necesită cont și abonament activ.
          </p>
          <p className="mt-1 text-sm text-amber-800">
            Abonamentul deblochează toate modulele de liceu. Vezi pe pagina Prețuri ce e gratuit și ce include abonamentul.
          </p>
          <div className="mt-4 flex flex-wrap justify-center gap-3">
            <Link
              href="/preturi"
              className="rounded-xl bg-amber-400 px-5 py-2.5 text-sm font-black text-slate-950 transition hover:bg-amber-500"
            >
              Vezi prețurile
            </Link>
            <Link
              href={user ? "/cont" : `/login?redirect=${encodeURIComponent(hrefModul(modul))}`}
              className="rounded-xl border border-black/10 px-5 py-2.5 text-sm font-semibold text-foreground transition hover:border-brand hover:text-brand"
            >
              {user ? "Contul meu" : "Ai deja cont? Autentifică-te"}
            </Link>
          </div>
        </div>
      )}

      {!areContinut && (
        <p className="mt-6 rounded-2xl border border-brand-border bg-brand-light/50 p-4 text-sm text-brand-dark">
          Structura modulului este pregătită. Conținutul pașilor (explicații,
          exemple de cod, exerciții) va fi adăugat în curând.
        </p>
      )}

      <section className="mt-8" aria-labelledby="pasi-titlu">
        <h2 id="pasi-titlu" className="sr-only">Pașii lecției</h2>
        <PasiModul
          pasi={pasi}
          reusiteCont={reusiteCont}
          areAcces={areAcces}
          areContinut={areContinut}
          autentificat={Boolean(user)}
          hrefBlocat="#acces"
        />
      </section>

      {faceRecapitulare && recapitulare.length > 0 && areAcces && (
        <section className="mt-8 rounded-2xl border border-dashed border-brand-border bg-brand-light/30 p-5">
          <h2 className="flex items-center gap-2 text-base font-bold text-brand-dark">
            <span className="text-xl" aria-hidden="true">
              🔁
            </span>
            Recapitulare din modulele anterioare
          </h2>
          <p className="mt-1 text-sm text-foreground/70">
            Înainte de modulul nou, revino rapid la concepte de mai devreme — așa se
            fixează mai bine. Citește enunțul și gândește-te la răspuns; varianta corectă e marcată.
          </p>
          <ul className="mt-3 space-y-3">
            {recapitulare.map((r) => (
              <li
                key={r.cod}
                className="rounded-xl border border-black/5 bg-white p-3"
              >
                <p className="text-xs font-semibold text-foreground/60">
                  Din modulul {r.cod.split(".").slice(0, 2).join(".")}
                </p>
                <p className="mt-1 text-sm font-medium text-foreground">
                  {r.enunt}
                </p>
                <details className="mt-2">
                  <summary className="cursor-pointer text-xs font-bold text-brand-dark">Arată variantele și răspunsul</summary>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {r.variante.map((v, vi) => (
                      <span
                        key={vi}
                        className={`rounded-full border px-3 py-1 text-xs ${
                          vi === r.corect
                            ? "border-success bg-success/10 text-success"
                            : "border-black/10 text-foreground/70"
                        }`}
                      >
                        {v}
                        {vi === r.corect && " ✓"}
                      </span>
                    ))}
                  </div>
                </details>
              </li>
            ))}
          </ul>
        </section>
      )}

      {/* Resurse auxiliare — după acțiunea principală */}
      <section className="mt-10 border-t border-border pt-6">
        <h2 className="text-base font-black text-foreground">Resurse suplimentare</h2>
        <div className="mt-3 grid gap-3 sm:grid-cols-2">
          <Link
            href={`/resurse/${clasa}/${modulSlug}`}
            className="rounded-2xl border border-border bg-white p-4 text-sm transition hover:border-brand/40"
          >
            <span className="font-bold text-foreground">📄 Fișa PDF a modulului</span>
            <span className="mt-1 block text-xs text-foreground/70">Rezumat de printat. Gratuit.</span>
          </Link>
          <Link
            href={`/exercitii/${clasa}/${modulSlug}`}
            className="rounded-2xl border border-border bg-white p-4 text-sm transition hover:border-brand/40"
          >
            <span className="font-bold text-foreground">
              {exercitiiGratuite ? "📝" : "🔒"} Exerciții practice suplimentare
            </span>
            <span className="mt-1 block text-xs text-foreground/70">
              Reordonare de cod, completare, mini-proiect pe 3 niveluri.{" "}
              {exercitiiGratuite ? "Fără abonament." : "Necesită abonament."}
            </span>
          </Link>
        </div>
      </section>

      <nav className="mt-10 flex flex-wrap justify-between gap-3 border-t border-border pt-6">
        {anterior ? (
          <Link
            href={hrefModul(anterior)}
            className="max-w-[45%] text-sm font-semibold text-brand hover:text-brand-dark"
          >
            ← {anterior.cod} {anterior.titlu}
          </Link>
        ) : (
          <span />
        )}
        {urmator && (
          <Link
            href={hrefModul(urmator)}
            className="max-w-[45%] text-right text-sm font-semibold text-brand hover:text-brand-dark"
          >
            {urmator.cod} {urmator.titlu} →
          </Link>
        )}
      </nav>
    </div>
  );
}
