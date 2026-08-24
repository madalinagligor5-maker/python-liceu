import type { Metadata } from "next";
import Link from "next/link";
import AbonaButton from "@/components/AbonaButton";
import NewsletterForm from "@/components/NewsletterForm";

export const metadata: Metadata = {
  title: "Prețuri — Academia Python",
  description: "Planuri de abonament Academia Python — acces complet la toate lecțiile, clasele IX-XII.",
};

const PLANURI = [
  {
    plan: "lunar" as const,
    nume: "Lunar",
    pretVechi: "29 lei",
    pret: "15 lei",
    perioada: "/ lună",
    descriere: "Ideal dacă vrei să încerci platforma pe termen scurt.",
    badge: "⚡ Reducere 50%",
    beneficii: [
      "Acces la toate lecțiile, clasele IX-XII",
      "Exerciții interactive și quiz-uri",
      "Asistent AI pentru evaluarea codului",
      "Anulare oricând, fără costuri",
    ],
    evidentiat: false,
  },
  {
    plan: "anual" as const,
    nume: "Anual",
    pretVechi: "199 lei",
    pret: "89 lei",
    perioada: "/ an",
    descriere: "Promo de lansare — echivalentul a ~7,4 lei/lună. Valabil 3 luni!",
    badge: "🎉 Preț promoțional lansare",
    beneficii: [
      "Tot ce include planul lunar",
      "Economisești 55% față de prețul obișnuit",
      "Acces pe tot parcursul anului școlar",
      "Asistent AI nelimitat pentru cod",
    ],
    evidentiat: true,
  },
];

export default function PreturiPage() {
  const stripeConfigurat = 
    !!process.env.STRIPE_SECRET_KEY &&
    !!process.env.STRIPE_PRICE_ID_LUNAR &&
    process.env.STRIPE_PRICE_ID_LUNAR.startsWith("price_") &&
    !!process.env.STRIPE_PRICE_ID_ANUAL &&
    process.env.STRIPE_PRICE_ID_ANUAL.startsWith("price_");

  return (
    <div className="mx-auto max-w-4xl px-4 py-14 sm:px-6">
      <div className="text-center">
        <h1 className="text-3xl font-extrabold text-foreground sm:text-4xl">
          Alege planul potrivit pentru tine
        </h1>
        <p className="mt-3 text-foreground/70">
          Primele 3 module din clasa a IX-a sunt complet gratuite, iar următoarele 2
          sunt deschise pentru explorare — totul fără cont. Abonamentul deblochează
          tot restul conținutului.
        </p>

        {!stripeConfigurat && (
          <div className="mx-auto mt-6 max-w-xl rounded-2xl border border-amber-300 bg-amber-50 p-4 text-left">
            <h3 className="text-sm font-semibold text-amber-800 flex items-center gap-1.5">
              <span>⚠️</span> Stripe nu este complet configurat local
            </h3>
            <p className="mt-1 text-xs text-amber-700">
              Pentru a testa fluxul de plată, adaugă cheile în fișierul <code className="bg-amber-100 px-1 rounded">.env.local</code> (copiază din <code className="bg-amber-100 px-1 rounded">.env.example</code>):
            </p>
            <ul className="mt-2 list-disc pl-4 text-xs text-amber-700 space-y-1">
              {!process.env.STRIPE_SECRET_KEY && <li>Lipsește <code className="bg-amber-100 px-1">STRIPE_SECRET_KEY</code></li>}
              {(!process.env.STRIPE_PRICE_ID_LUNAR || !process.env.STRIPE_PRICE_ID_LUNAR.startsWith("price_")) && <li>Lipsește sau este invalid <code className="bg-amber-100 px-1">STRIPE_PRICE_ID_LUNAR</code> (ex. price_...)</li>}
              {(!process.env.STRIPE_PRICE_ID_ANUAL || !process.env.STRIPE_PRICE_ID_ANUAL.startsWith("price_")) && <li>Lipsește sau este invalid <code className="bg-amber-100 px-1">STRIPE_PRICE_ID_ANUAL</code> (ex. price_...)</li>}
            </ul>
          </div>
        )}

        <div className="mx-auto mt-6 max-w-xl rounded-2xl border border-brand bg-brand-light/50 p-4">
          <p className="text-sm font-semibold text-brand-dark">
            🎁 Încearcă 7 zile gratuit — fără card, fără obligații
          </p>
          <p className="mt-1 text-sm text-foreground/70">
            Vezi dacă ți se potrivește. Lași un review după 7 zile și intri la
            tombola pentru{" "}
            <strong>6 luni de abonament gratuit</strong>.
          </p>
          <a
            href="/tombola"
            className="mt-3 inline-block rounded-lg bg-brand px-4 py-2 text-sm font-semibold text-white transition hover:bg-brand-dark"
          >
            Vezi detaliile tombolă →
          </a>
        </div>
      </div>

      <div className="mt-10 grid gap-6 sm:grid-cols-2">
        {PLANURI.map((plan) => (
        <div
            key={plan.nume}
            className={[
              "rounded-2xl border p-6 shadow-sm",
              plan.evidentiat
                ? "border-brand bg-brand-light/40 ring-1 ring-brand"
                : "border-black/10 bg-white",
            ].join(" ")}
          >
            {plan.badge && (
              <span className="inline-flex rounded-full bg-amber-400 px-3 py-1 text-xs font-bold text-amber-900">
                {plan.badge}
              </span>
            )}
            {!plan.badge && plan.evidentiat && (
              <span className="inline-flex rounded-full bg-brand px-3 py-1 text-xs font-semibold text-white">
                Recomandat
              </span>
            )}
            <h2 className="mt-3 text-xl font-bold text-foreground">{plan.nume}</h2>
            <p className="mt-1 text-sm text-foreground/60">{plan.descriere}</p>
            <p className="mt-4 flex items-baseline gap-2">
              {plan.pretVechi && (
                <span className="text-base font-medium text-foreground/35 line-through">
                  {plan.pretVechi}
                </span>
              )}
              <span className="text-3xl font-extrabold text-foreground">{plan.pret}</span>
              <span className="text-sm text-foreground/50">{plan.perioada}</span>
            </p>

            <ul className="mt-5 space-y-2 text-sm text-foreground/70">
              {plan.beneficii.map((b) => (
                <li key={b} className="flex items-start gap-2">
                  <span className="mt-0.5 text-success">✓</span>
                  {b}
                </li>
              ))}
            </ul>

            <AbonaButton
              plan={plan.plan}
              className="mt-6 w-full rounded-xl bg-brand px-5 py-3 text-sm font-semibold text-white transition hover:bg-brand-dark disabled:cursor-not-allowed disabled:opacity-50"
            />

            <p className="mt-3 flex items-center justify-center gap-1.5 text-center text-xs text-foreground/50">
              <span aria-hidden="true">↩️</span>
              Ai 14 zile de răzgândire — rambursează-te integral dacă nu ți se potrivește.
            </p>
          </div>
        ))}
      </div>

      <p className="mt-6 text-center text-xs text-foreground/40">
        Plățile se vor procesa integral prin Stripe. Nu stocăm date de card.
      </p>

      <div className="mt-12 border-t border-black/5 pt-10">
        <NewsletterForm />
      </div>

      <div className="mt-10 text-center">
        <Link href="/lectii" className="text-sm font-medium text-brand hover:text-brand-dark">
          ← Vezi lecțiile gratuite disponibile acum
        </Link>
      </div>
    </div>
  );
}
