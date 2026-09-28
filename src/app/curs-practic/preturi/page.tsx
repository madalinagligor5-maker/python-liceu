import type { Metadata } from "next";
import Link from "next/link";
import AbonaButton from "@/components/AbonaButton";
import { toateModuleleCurs } from "@/lib/curs";
import { formateazaPerioada, formateazaSuma, getPreturiCurs, PROBA } from "@/lib/oferta";

export const metadata: Metadata = {
  title: "Prețuri — Curs practic de Python",
  description:
    "Planuri de abonament pentru Cursul practic de Python — produs separat de abonamentul de liceu. Modulul 1 e complet gratuit.",
  alternates: { canonical: "/curs-practic/preturi" },
};

const PLANURI = [
  {
    plan: "lunar" as const,
    nume: "Lunar",
    descriere: "Plătești lună de lună și poți anula oricând.",
    evidentiat: false,
  },
  {
    plan: "anual" as const,
    nume: "Anual",
    descriere: "O singură plată pe an.",
    evidentiat: true,
  },
];

export default async function PreturiCursPage() {
  const preturi = await getPreturiCurs();
  const nrModule = toateModuleleCurs().length;
  const stripeConfigurat =
    !!process.env.STRIPE_SECRET_KEY &&
    !!process.env.STRIPE_PRICE_ID_CURS_LUNAR &&
    process.env.STRIPE_PRICE_ID_CURS_LUNAR.startsWith("price_") &&
    !!process.env.STRIPE_PRICE_ID_CURS_ANUAL &&
    process.env.STRIPE_PRICE_ID_CURS_ANUAL.startsWith("price_");

  return (
    <div className="mx-auto max-w-4xl px-4 py-14 sm:px-6 bg-hero-glow rounded-3xl">
      <div className="text-center">
        <h1 className="text-3xl font-extrabold text-foreground sm:text-4xl [font-family:var(--font-fraunces)]">
          Curs practic de Python — planuri
        </h1>
        <p className="mt-3 text-foreground/70">
          Produs separat de abonamentul de liceu — prețuri proprii, fără legătură
          cu clasa sau traseul școlar. Modulul 1 e complet gratuit, fără cont,
          ca să poți încerca stilul cursului înainte de a te abona. Cursul e în
          dezvoltare: în prezent are {nrModule} module publicate.
        </p>

        {!stripeConfigurat && process.env.NODE_ENV !== "production" && (
          <div className="mx-auto mt-6 max-w-xl rounded-2xl border border-amber-300 bg-amber-50 p-4 text-left">
            <h3 className="text-sm font-semibold text-amber-800 flex items-center gap-1.5">
              <span>⚠️</span> Stripe nu este încă configurat pentru acest curs
            </h3>
            <p className="mt-1 text-xs text-amber-700">
              Lipsesc variabilele de mediu <code>STRIPE_PRICE_ID_CURS_LUNAR</code> /{" "}
              <code>STRIPE_PRICE_ID_CURS_ANUAL</code> — creează prețurile în Stripe
              Dashboard (produs separat de cel de liceu) și adaugă-le ca variabile
              de mediu.
            </p>
          </div>
        )}
      </div>

      <div className="mt-10 grid gap-6 sm:grid-cols-2">
        {PLANURI.map((p) => (
          <div
            key={p.plan}
            className={`rounded-3xl border p-6 shadow-sm ${
              p.evidentiat
                ? "border-brand bg-brand-light/30 ring-2 ring-brand"
                : "border-black/10 bg-white"
            }`}
          >
            <h2 className="text-lg font-bold text-foreground">{p.nume}</h2>
            <p className="mt-1 text-sm text-foreground/60">{p.descriere}</p>
            {preturi[p.plan] ? (
              <p className="mt-4 text-3xl font-black text-foreground">
                {formateazaSuma(preturi[p.plan]!)}{" "}
                <span className="text-sm font-medium text-foreground/70">/ {formateazaPerioada(preturi[p.plan]!)}</span>
              </p>
            ) : (
              <p className="mt-4 text-sm font-semibold text-foreground/70">
                Prețul va fi afișat aici când abonamentul cursului devine disponibil.
              </p>
            )}
            <ul className="mt-4 space-y-2 text-sm text-foreground/80">
              <li className="flex items-start gap-2">
                <span className="text-success" aria-hidden="true">✓</span> Toate modulele publicate ale cursului (acum {nrModule}) și cele adăugate pe durata abonamentului
              </li>
              <li className="flex items-start gap-2">
                <span className="text-success" aria-hidden="true">✓</span> Exerciții rulate direct în browser
              </li>
              <li className="flex items-start gap-2">
                <span className="text-success" aria-hidden="true">✓</span> Începe cu {PROBA.zile} zile de probă; cardul se introduce la înscriere; reînnoire automată până anulezi
              </li>
            </ul>
            <AbonaButton
              plan={p.plan}
              produs="curs"
              redirectLogin="/curs-practic/preturi"
              className={`mt-6 w-full rounded-xl px-5 py-2.5 text-sm font-semibold transition ${
                p.evidentiat
                  ? "bg-brand text-white hover:bg-brand-dark"
                  : "border border-black/10 text-foreground hover:border-brand hover:text-brand"
              }`}
            />
          </div>
        ))}
      </div>

      <p className="mt-8 text-center text-sm text-foreground/60">
        Cauți lecțiile de liceu (clasele IX–XII)?{" "}
        <Link href="/preturi" className="font-semibold text-brand hover:underline">
          Vezi planurile de acolo
        </Link>
        .
      </p>
    </div>
  );
}
