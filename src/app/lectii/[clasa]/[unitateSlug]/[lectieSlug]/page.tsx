import Link from "next/link";
import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import { getLectie, getLectiaUrmatoare, getToateSloturile } from "@/lib/content";
import { getUtilizatorCurent, areAbonamentActiv } from "@/lib/subscription";
import LectieBadge from "@/components/LectieBadge";
import CodeBlock from "@/components/CodeBlock";
import ExercitiuInteractiv from "@/components/ExercitiuInteractiv";
import QuizWidget from "@/components/QuizWidget";

type Params = { clasa: string; unitateSlug: string; lectieSlug: string };

export function generateStaticParams() {
  return getToateSloturile().map(({ clasa, unitateSlug, lectieSlug }) => ({
    clasa,
    unitateSlug,
    lectieSlug,
  }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { clasa, unitateSlug, lectieSlug } = await params;
  const lectie = getLectie(clasa, unitateSlug, lectieSlug);
  if (!lectie) return {};

  return {
    title: `${lectie.lectie} — Academia Python`,
    description: lectie.explicatie_scurta.slice(0, 155),
    alternates: { canonical: `/lectii/${clasa}/${unitateSlug}/${lectieSlug}` },
  };
}

export default async function LectiePage({ params }: { params: Promise<Params> }) {
  const { clasa, unitateSlug, lectieSlug } = await params;
  const lectie = getLectie(clasa, unitateSlug, lectieSlug);

  if (!lectie) notFound();

  const urmatoarea = getLectiaUrmatoare(lectie);

  // Regula de acces (verificată aici, server-side, nu doar în UI):
  // gratuit -> acces liber; fără cont -> redirect la login; cu cont dar fără
  // abonament activ -> paywall; cu abonament activ -> acces integral.
  // Sesiunea se citește și pentru lecțiile gratuite, ca quiz-ul să poată
  // acorda XP unui elev logat (nu schimbă regula de acces).
  const { user, meta } = await getUtilizatorCurent();
  let areAcces = lectie.gratuit;
  if (!lectie.gratuit) {
    if (!user) {
      redirect(`/login?redirect=${encodeURIComponent(`/lectii/${clasa}/${unitateSlug}/${lectieSlug}`)}`);
    }
    areAcces = areAbonamentActiv(meta);
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6">
      <nav className="text-sm text-foreground/50">
        <Link href="/lectii" className="hover:text-brand">
          Lecții
        </Link>
        <span className="mx-2">/</span>
        <span>{clasa}</span>
        <span className="mx-2">/</span>
        <span>{lectie.unitate}</span>
      </nav>

      <div className="mt-3 flex items-start justify-between gap-4">
        <h1 className="text-3xl font-extrabold text-foreground">{lectie.lectie}</h1>
        <LectieBadge gratuit={lectie.gratuit} />
      </div>

      <ul className="mt-4 flex flex-wrap gap-2">
        {lectie.concepte_cheie.map((c) => (
          <li
            key={c}
            className="rounded-full bg-brand-light px-3 py-1 text-xs font-medium text-brand-dark"
          >
            {c}
          </li>
        ))}
      </ul>

      <section className="mt-6">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-foreground/50">
          Obiective
        </h2>
        <ul className="mt-2 list-inside list-disc space-y-1 text-sm text-foreground/70">
          {lectie.obiective.map((o) => (
            <li key={o}>{o}</li>
          ))}
        </ul>
      </section>

      {areAcces ? (
        <>
          <p className="mt-6 text-base leading-relaxed text-foreground/80">
            {lectie.explicatie_scurta}
          </p>

          <div className="mt-6">
            <CodeBlock code={lectie.exemplu_cod} label="exemplu.py" />
          </div>

          <div className="mt-8">
            <ExercitiuInteractiv exercitiu={lectie.exercitiu_interactiv} />
          </div>

          <div className="mt-8">
            <QuizWidget
              intrebari={lectie.quiz}
              clasa={clasa}
              unitateSlug={unitateSlug}
              lectieSlug={lectieSlug}
              autentificat={Boolean(user)}
            />
          </div>

          {urmatoarea && (
            <div className="mt-10 flex justify-end">
              <Link
                href={`/lectii/${urmatoarea.clasa}/${urmatoarea.unitate_slug}/${urmatoarea.lectie_slug}`}
                className="rounded-xl bg-brand px-5 py-3 text-sm font-semibold text-white transition hover:bg-brand-dark"
              >
                Lecția următoare: {urmatoarea.lectie} →
              </Link>
            </div>
          )}
        </>
      ) : (
        <div className="relative mt-6">
          <p className="text-base leading-relaxed text-foreground/80">
            {lectie.explicatie_scurta.split(". ").slice(0, 2).join(". ")}.
          </p>

          <div aria-hidden className="pointer-events-none mt-6 select-none blur-sm">
            {/* Placeholder, nu conținutul real — lecțiile blocate nu trimit cod către client */}
            <CodeBlock code={"# conținut disponibil cu abonament activ\n# ...\n# ...\n# ..."} label="exemplu.py" />
          </div>

          <div className="pointer-events-none absolute inset-x-0 bottom-0 top-16 bg-gradient-to-b from-transparent via-white/80 to-white" />

          <div className="relative mt-4 rounded-2xl border border-brand/20 bg-brand-light/60 p-6 text-center">
            <p className="font-semibold text-foreground">
              Această lecție necesită cont și abonament activ.
            </p>
            <p className="mt-1 text-sm text-foreground/60">
              Deblochează toate lecțiile, exercițiile și proiectele cu un abonament Academia Python.
            </p>
            <div className="mt-4 flex flex-wrap justify-center gap-3">
              <Link
                href="/preturi"
                className="rounded-xl bg-brand px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-brand-dark"
              >
                Vezi planurile de abonament
              </Link>
              <Link
                href="/cont"
                className="rounded-xl border border-black/10 px-5 py-2.5 text-sm font-semibold text-foreground transition hover:border-brand hover:text-brand"
              >
                Contul meu
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
