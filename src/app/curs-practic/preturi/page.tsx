import Link from "next/link";
import AbonaButton from "@/components/AbonaButton";
import { toateModuleleCurs } from "@/lib/curs";
import { STRIPE_PRICE_IDS_CURS } from "@/lib/stripe";
import { formateazaPerioada, formateazaSuma, getPreturiCurs, PROBA } from "@/lib/oferta";
import { metadatePagina } from "@/lib/seo";

// Prețurile se citesc din Stripe la fiecare cerere: cheile Stripe sunt
// variabile de rulare (Cloudflare), nu există la build. Generată static,
// pagina ar rămâne fără prețuri și cu planurile „neconfigurate".
export const dynamic = "force-dynamic";

export const metadata = metadatePagina({
  titlu: "Prețuri — Curs practic de Python",
  descriere: "Planuri de abonament pentru Cursul practic de Python. Același abonament include și lecțiile de liceu. Modulul 1 e complet gratuit.",
  cale: "/curs-practic/preturi",
});

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
    !!STRIPE_PRICE_IDS_CURS.lunar?.startsWith("price_") &&
    !!STRIPE_PRICE_IDS_CURS.anual?.startsWith("price_");

  return (
    <div className="mx-auto max-w-4xl px-4 py-14 sm:px-6 bg-hero-glow rounded-3xl">
      <div className="text-center">
        <h1 className="text-3xl font-extrabold text-foreground sm:text-4xl [font-family:var(--font-fraunces)]">
          Curs practic de Python — planuri
        </h1>
        <p className="mt-3 text-foreground/70">
          Același abonament îți dă acces la tot: Cursul practic și lecțiile de
          liceu (clasele IX–XII). Modulul 1 e complet gratuit, fără cont, ca să poți încerca
          stilul cursului înainte de a te abona. Cursul are {nrModule} de module,
          iar modulele adăugate pe durata abonamentului sunt incluse.
        </p>

        {!stripeConfigurat && process.env.NODE_ENV !== "production" && (
          <div className="mx-auto mt-6 max-w-xl rounded-2xl border border-amber-300 bg-amber-50 p-4 text-left">
            <h3 className="text-sm font-semibold text-amber-800 flex items-center gap-1.5">
              <span>⚠️</span> Stripe nu este încă configurat pentru acest curs
            </h3>
            <p className="mt-1 text-xs text-amber-700">
              Lipsesc variabilele de mediu <code>STRIPE_PRICE_ID_LUNAR</code> /{" "}
              <code>STRIPE_PRICE_ID_ANUAL</code> (sau, pentru prețuri separate,{" "}
              <code>STRIPE_PRICE_ID_CURS_LUNAR</code> / <code>STRIPE_PRICE_ID_CURS_ANUAL</code>) — adaugă price ID-urile din Stripe
              Dashboard ca variabile de mediu.
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
            <p className="mt-1 text-sm text-foreground/65">{p.descriere}</p>
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
                <span className="text-success" aria-hidden="true">✓</span> Toate lecțiile de liceu, clasele IX–XII
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

      <p className="mt-8 text-center text-sm text-foreground/65">
        Cauți lecțiile de liceu (clasele IX–XII)?{" "}
        <Link href="/preturi" className="font-semibold text-brand hover:underline">
          Vezi planurile de acolo
        </Link>
        .
      </p>
    </div>
  );
}
