import type { Metadata } from "next";
import Link from "next/link";
import AbonaButton from "@/components/AbonaButton";
import { ETICHETE_ACCES, MODULE_ACCES_DESCHIS } from "@/lib/acces";
import {
  formateazaData,
  formateazaPerioada,
  formateazaSuma,
  getPreturiLiceu,
  LIMITE_AI,
  PRET_STANDARD_LICEU,
  PROBA,
  PROMO_LANSARE,
  type Plan,
} from "@/lib/oferta";

export const metadata: Metadata = {
  title: "Prețuri",
  description:
    "Ce e gratuit, ce include abonamentul de liceu și cum funcționează perioada de probă de 7 zile, facturarea și reînnoirea. Gimnaziul și Kids sunt gratuite.",
  alternates: { canonical: "/preturi" },
};

const BENEFICII_COMUNE = [
  "Toate modulele de liceu, clasele IX–XII (lecții în 6 pași)",
  "Exercițiile practice suplimentare pentru fiecare modul",
  `Evaluare AI a codului: până la ${LIMITE_AI.evaluariPeZiAbonament} evaluări pe zi (față de ${LIMITE_AI.evaluariPeZiGratuit} cu un cont gratuit)`,
];

export default async function PreturiPage() {
  const preturi = await getPreturiLiceu();
  const stripeConfigurat = preturi.lunar.sursa === "stripe" && preturi.anual.sursa === "stripe";
  const esteLocal = process.env.NODE_ENV !== "production";

  const promo = PROMO_LANSARE.valabilPanaLa;

  const carduri: { plan: Plan; nume: string; descriere: string; evidentiat: boolean }[] = [
    { plan: "lunar", nume: "Abonament lunar", descriere: "Plătești lună de lună și poți anula oricând.", evidentiat: false },
    { plan: "anual", nume: "Abonament anual", descriere: "O singură plată pe an; cel mai mic cost lunar.", evidentiat: true },
  ];

  return (
    <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6">
      <header className="max-w-3xl">
        <h1 className="text-3xl font-extrabold text-foreground sm:text-4xl [font-family:var(--font-fraunces)]">
          Prețuri
        </h1>
        <p className="mt-3 text-foreground/80">
          Poți învăța gratuit fără cont și fără card. Abonamentul deblochează restul modulelor de liceu. Mai jos găsești
          exact ce e gratuit, cum funcționează proba de {PROBA.zile} zile și ce plătești.
        </p>
      </header>

      {esteLocal && !stripeConfigurat && (
        <div className="mt-6 max-w-xl rounded-2xl border border-amber-300 bg-amber-50 p-4 text-left">
          <h2 className="text-sm font-semibold text-amber-900">Mediu local: Stripe nu este configurat</h2>
          <p className="mt-1 text-xs text-amber-800">
            Sumele de mai jos sunt valorile de rezervă din cod, nu cele citite din Stripe. Adaugă{" "}
            <code>STRIPE_SECRET_KEY</code>, <code>STRIPE_PRICE_ID_LUNAR</code> și <code>STRIPE_PRICE_ID_ANUAL</code> (chei
            de test) în <code>.env.local</code>.
          </p>
        </div>
      )}

      {/* 1. GRATUIT */}
      <section aria-labelledby="gratuit" className="mt-10">
        <h2 id="gratuit" className="text-xl font-black text-foreground">1. Acces gratuit</h2>
        <div className="mt-4 grid gap-4 md:grid-cols-2">
          <div className="rounded-2xl border border-success/30 bg-white p-5">
            <p className="text-sm font-black text-success">Gratuit — fără cont, fără card</p>
            <ul className="mt-3 list-disc space-y-1.5 pl-5 text-sm text-foreground/80">
              <li>Kids: toate cele 6 module Junior și lecțiile „Python pentru copii” (7–11 ani)</li>
              <li>Gimnaziu: toate cele 5 module (clasele VII–VIII)</li>
              <li>Liceu: primele 3 module din clasa a IX-a</li>
              <li>Curs practic: modulul 1</li>
              <li>Laboratorul (editor Python liber) și fișele PDF ale modulelor</li>
            </ul>
          </div>
          <div className="rounded-2xl border border-border bg-white p-5">
            <p className="text-sm font-black text-foreground">Ce înseamnă etichetele din lecții</p>
            <dl className="mt-3 space-y-2.5 text-sm text-foreground/80">
              <div>
                <dt className="inline font-bold text-success">„{ETICHETE_ACCES.gratuit.text}”</dt> —{" "}
                <dd className="inline">parte din oferta gratuită de mai sus; fără cont și fără card.</dd>
              </div>
              <div>
                <dt className="inline font-bold text-brand-dark">„{ETICHETE_ACCES.deschis.text}”</dt> —{" "}
                <dd className="inline">
                  lecțiile modulelor 1–{MODULE_ACCES_DESCHIS} din fiecare clasă de liceu care nu sunt marcate gratuit. Deocamdată
                  le poți parcurge fără cont și fără abonament, dar nu fac parte din oferta gratuită garantată și pot trece sub
                  abonament. Exercițiile practice suplimentare ale acestor module sunt fără abonament doar la clasa a IX-a.
                </dd>
              </div>
              <div>
                <dt className="inline font-bold text-foreground">„{ETICHETE_ACCES.abonament.text}”</dt> —{" "}
                <dd className="inline">cer cont și abonament activ (inclusiv în perioada de probă).</dd>
              </div>
            </dl>
            <p className="mt-3 text-xs text-foreground/70">
              Cu un cont gratuit primești în plus: progres salvat în cont, XP și insigne, {LIMITE_AI.evaluariPeZiGratuit} evaluări AI ale
              codului pe zi.
            </p>
          </div>
        </div>
      </section>

      {/* 2. PROBĂ */}
      <section aria-labelledby="proba" className="mt-10">
        <h2 id="proba" className="text-xl font-black text-foreground">2. Perioada de probă de {PROBA.zile} zile</h2>
        <div className="mt-4 rounded-2xl border border-border bg-white p-5 text-sm text-foreground/80">
          <ul className="list-disc space-y-1.5 pl-5">
            <li>Orice abonament (lunar sau anual) începe cu {PROBA.zile} zile de acces complet, fără plată în acest interval.</li>
            <li>
              <strong>Cardul se introduce la înscriere</strong>, în pagina de plată securizată Stripe. Nu se debitează nimic în
              primele {PROBA.zile} zile.
            </li>
            <li>
              Dacă nu anulezi înainte de finalul probei, în ziua a {PROBA.zile + 1}-a se facturează automat prima perioadă a
              planului ales (o lună sau un an).
            </li>
            <li>Poți anula oricând din „Contul meu”; accesul rămâne până la finalul perioadei începute.</li>
          </ul>
        </div>
      </section>

      {/* 3–4. ABONAMENTE */}
      <section aria-labelledby="abonamente" className="mt-10">
        <h2 id="abonamente" className="text-xl font-black text-foreground">3. Abonamentul lunar și 4. abonamentul anual</h2>
        <p className="mt-2 text-sm text-foreground/80">
          Abonamentul de liceu. (Cursul practic are un{" "}
          <Link href="/curs-practic/preturi" className="font-semibold text-brand-dark underline underline-offset-2">
            abonament separat
          </Link>
          .)
        </p>

        <div className="mt-4 grid gap-6 md:grid-cols-2">
          {carduri.map((c) => {
            const pret = preturi[c.plan];
            const standard = PRET_STANDARD_LICEU[c.plan];
            const esteRedus = pret.suma < standard;
            const perLuna = c.plan === "anual" ? pret.suma / 12 : null;
            return (
              <div
                key={c.plan}
                className={`flex flex-col rounded-2xl border p-6 shadow-sm ${
                  c.evidentiat ? "border-amber-400 bg-brand-light/40 ring-1 ring-amber-400" : "border-black/10 bg-white"
                }`}
              >
                {esteRedus && (
                  <span className="self-start rounded-full bg-amber-400 px-3 py-1 text-xs font-black text-slate-950">
                    Preț de lansare
                  </span>
                )}
                <h3 className="mt-3 text-xl font-bold text-foreground">{c.nume}</h3>
                <p className="mt-1 text-sm text-foreground/70">{c.descriere}</p>

                <p className="mt-4 flex flex-wrap items-baseline gap-2">
                  <span className="text-3xl font-extrabold text-foreground">{formateazaSuma(pret)}</span>
                  <span className="text-sm text-foreground/70">/ {formateazaPerioada(pret)}</span>
                </p>
                {esteRedus && (
                  <p className="mt-1 text-xs text-foreground/70">
                    Preț standard: <span className="line-through">{standard} lei</span> / {c.plan === "anual" ? "an" : "lună"}
                  </p>
                )}

                <dl className="mt-4 space-y-1.5 rounded-xl bg-surface/80 p-3 text-xs text-foreground/80">
                  <div>
                    <dt className="inline font-bold">Suma facturată:</dt>{" "}
                    <dd className="inline">
                      {formateazaSuma(pret)} {c.plan === "anual" ? "o dată pe an" : "în fiecare lună"}
                      {perLuna ? ` (echivalentul a ~${perLuna.toFixed(2).replace(".", ",")} lei/lună)` : ""}
                    </dd>
                  </div>
                  <div>
                    <dt className="inline font-bold">Prima plată:</dt>{" "}
                    <dd className="inline">după cele {PROBA.zile} zile de probă, dacă nu anulezi</dd>
                  </div>
                  <div>
                    <dt className="inline font-bold">Reînnoire:</dt>{" "}
                    <dd className="inline">
                      automată la finalul fiecărei {c.plan === "anual" ? "perioade de un an" : "luni"}, la prețul abonamentului tău,
                      până anulezi
                    </dd>
                  </div>
                </dl>

                <ul className="mt-4 space-y-2 text-sm text-foreground/80">
                  {BENEFICII_COMUNE.map((b) => (
                    <li key={b} className="flex items-start gap-2">
                      <span className="mt-0.5 text-success" aria-hidden="true">✓</span>
                      {b}
                    </li>
                  ))}
                </ul>

                <div className="mt-auto pt-6">
                  <AbonaButton
                    plan={c.plan}
                    className="w-full rounded-xl bg-amber-400 hover:bg-amber-500 px-5 py-3 text-sm font-black text-slate-950 transition disabled:cursor-not-allowed disabled:opacity-50 cursor-pointer shadow-xs"
                  />
                </div>
              </div>
            );
          })}
        </div>

        <div className="mt-6 space-y-2 text-sm text-foreground/80">
          <p>
            <strong>Promoția de lansare</strong> se referă la prețul la care te abonezi, nu la durata abonamentului: abonamentul
            anual durează un an, cel lunar o lună, și se reînnoiesc la prețul din momentul abonării.{" "}
            {promo
              ? `Prețul de lansare e disponibil pentru abonările făcute până la ${formateazaData(promo)} inclusiv.`
              : "Data de încheiere a promoției va fi anunțată pe această pagină."}
          </p>
          <p>
            Prețurile includ toate taxele. Suma finală e afișată în pagina de plată Stripe înainte de confirmare.
            Plățile sunt procesate de Stripe; nu stocăm datele cardului.
          </p>
          <p>
            ↩️ Ai 14 zile în care poți cere rambursarea integrală.{" "}
            <Link href="/politica-de-rambursare" className="font-bold text-brand-dark underline underline-offset-2">
              Politica de rambursare
            </Link>
          </p>
        </div>
      </section>

      {/* SECUNDAR: TOMBOLĂ + NEWSLETTER */}
      <section aria-labelledby="altele" className="mt-12 border-t border-black/10 pt-6">
        <h2 id="altele" className="text-base font-bold text-foreground">Altele</h2>
        <ul className="mt-2 space-y-1.5 text-sm text-foreground/80">
          <li>
            Tombolă pentru recenzii: după perioada de probă poți lăsa o recenzie și intri la o tragere la sorți lunară.{" "}
            <Link href="/tombola" className="font-semibold text-brand-dark underline underline-offset-2">
              Regulile tombolei
            </Link>
          </li>
          <li>
            Vrei doar noutăți?{" "}
            <Link href="/#newsletter" className="font-semibold text-brand-dark underline underline-offset-2">
              Abonează-te la newsletter
            </Link>
          </li>
          <li>
            <Link href="/start" className="font-semibold text-brand-dark underline underline-offset-2">
              Începe cu lecțiile gratuite
            </Link>
          </li>
        </ul>
      </section>
    </div>
  );
}
