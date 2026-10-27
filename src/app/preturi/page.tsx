import Link from "next/link";
import AbonaButton from "@/components/AbonaButton";
import { ETICHETE_ACCES, MODULE_ACCES_DESCHIS } from "@/lib/acces";
import {
  formateazaPerioada,
  formateazaSuma,
  getPreturiLiceu,
  LIMITE_AI,
  PROBA,
  type Plan,
} from "@/lib/oferta";
import { metadatePagina } from "@/lib/seo";

// Prețurile se citesc din Stripe la fiecare cerere: cheile Stripe sunt
// variabile de rulare (Cloudflare), nu există la build. Generată static,
// pagina ar rămâne fără prețuri și cu planurile „neconfigurate".
export const dynamic = "force-dynamic";

export const metadata = metadatePagina({
  titlu: "Prețuri și abonament",
  descriere: "Ce e gratuit, ce include abonamentul de liceu și cum funcționează perioada de probă de 7 zile, facturarea și reînnoirea. Gimnaziul și Kids sunt gratuite.",
  cale: "/preturi",
});

const BENEFICII_COMUNE = [
  "Toate modulele de liceu, clasele IX–XII (lecții în 6 pași)",
  "Exercițiile practice suplimentare pentru fiecare modul",
  `Evaluare AI a codului: până la ${LIMITE_AI.evaluariPeZiAbonament} evaluări pe zi (față de ${LIMITE_AI.evaluariPeZiGratuit} cu un cont gratuit)`,
];

export default async function PreturiPage() {
  const preturi = await getPreturiLiceu();
  const stripeConfigurat = preturi.lunar.sursa === "stripe" && preturi.anual.sursa === "stripe";
  const esteLocal = process.env.NODE_ENV !== "production";

  const carduri: { plan: Plan; nume: string; descriere: string; evidentiat: boolean }[] = [
    { plan: "lunar", nume: "Abonament lunar", descriere: "Plătești lună de lună și poți anula oricând.", evidentiat: false },
    { plan: "anual", nume: "Abonament anual", descriere: "O singură plată pe an; cel mai mic cost lunar.", evidentiat: true },
  ];

  return (
    <div className="page-shell max-w-5xl">
      <header className="mx-auto max-w-3xl text-center">
        <span className="eyebrow mb-4">Acces simplu, fără surprize</span>
        <h1 className="text-4xl font-black leading-tight text-foreground sm:text-6xl [font-family:var(--font-fraunces)]">
          Alege planul potrivit pentru tine
        </h1>
        <p className="mt-5 text-base leading-relaxed text-foreground/70 sm:text-lg">
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
      <section aria-labelledby="gratuit" className="mt-16">
        <span className="eyebrow">01 · Ce primești fără abonament</span>
        <h2 id="gratuit" className="mt-3 text-2xl font-black text-foreground [font-family:var(--font-fraunces)]">Acces gratuit</h2>
        <div className="mt-5 grid gap-5 md:grid-cols-2">
          <div className="surface-card p-6">
            <p className="text-sm font-black text-success">Gratuit — fără cont, fără card</p>
            <ul className="mt-3 list-disc space-y-1.5 pl-5 text-sm text-foreground/80">
              <li>Kids: toate cele 6 module Junior și lecțiile „Python pentru copii” (7–11 ani)</li>
              <li>Gimnaziu: toate cele 5 module (clasele VII–VIII)</li>
              <li>Liceu: primele 3 module din clasa a IX-a</li>
              <li>Curs practic: modulul 1</li>
              <li>Laboratorul (editor Python liber) și fișele PDF ale modulelor</li>
            </ul>
          </div>
          <div className="surface-card p-6">
            <p className="text-sm font-black text-foreground">Ce înseamnă etichetele din lecții</p>
            <dl className="mt-3 space-y-2.5 text-sm text-foreground/80">
              <div>
                <dt className="inline font-bold text-success">„{ETICHETE_ACCES.gratuit.text}”</dt>{" "}
                <dd className="inline">— parte din oferta gratuită de mai sus; fără cont și fără card.</dd>
              </div>
              <div>
                <dt className="inline font-bold text-brand-dark">„{ETICHETE_ACCES.deschis.text}”</dt>{" "}
                <dd className="inline">— 
                  lecțiile modulelor 1–{MODULE_ACCES_DESCHIS} din fiecare clasă de liceu care nu sunt marcate gratuit. Deocamdată
                  le poți parcurge fără cont și fără abonament, dar nu fac parte din oferta gratuită garantată și pot trece sub
                  abonament. Exercițiile practice suplimentare ale acestor module sunt fără abonament doar la clasa a IX-a.
                </dd>
              </div>
              <div>
                <dt className="inline font-bold text-foreground">„{ETICHETE_ACCES.abonament.text}”</dt>{" "}
                <dd className="inline">— cer cont și abonament activ (inclusiv în perioada de probă).</dd>
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
      <section aria-labelledby="proba" className="mt-16 grid gap-6 lg:grid-cols-[0.65fr_1.35fr]">
        <div><span className="eyebrow">02 · Încearcă înainte</span><h2 id="proba" className="mt-3 text-2xl font-black text-foreground [font-family:var(--font-fraunces)]">Perioada de probă de {PROBA.zile} zile</h2></div>
        <div className="border-y border-black/10 py-6 text-sm leading-relaxed text-foreground/80">
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
      <section aria-labelledby="abonamente" className="mt-20">
        <span className="eyebrow">03 · Alege durata</span>
        <h2 id="abonamente" className="mt-3 text-3xl font-black text-foreground [font-family:var(--font-fraunces)]">Abonamentul lunar și abonamentul anual</h2>
        <p className="mt-2 text-sm text-foreground/80">
          Abonamentul de liceu. (Cursul practic are un{" "}
          <Link href="/curs-practic/preturi" className="font-semibold text-brand-dark underline underline-offset-2">
            abonament separat
          </Link>
          .)
        </p>

        <div className="mt-7 grid gap-6 md:grid-cols-2 md:items-start">
          {carduri.map((c) => {
            const pret = preturi[c.plan];
            const perLuna = c.plan === "anual" ? pret.suma / 12 : null;
            return (
              <div
                key={c.plan}
                className={`flex flex-col rounded-[1.6rem] border p-7 sm:p-8 ${
                  c.evidentiat ? "border-[#172033] bg-white shadow-[0_24px_70px_rgba(23,32,51,0.14)] md:-translate-y-3" : "border-black/10 bg-white/85 shadow-[0_18px_54px_rgba(42,37,29,0.07)]"
                }`}
              >
                <h3 className="text-2xl font-black text-foreground [font-family:var(--font-fraunces)]">{c.nume}</h3>
                <p className="mt-1 text-sm text-foreground/70">{c.descriere}</p>

                <p className="mt-4 flex flex-wrap items-baseline gap-2">
                  <span className="text-4xl font-black text-foreground">{formateazaSuma(pret)}</span>
                  <span className="text-sm text-foreground/70">/ {formateazaPerioada(pret)}</span>
                </p>

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
                    className="w-full rounded-xl bg-[#172033] hover:bg-[#2A3852] px-5 py-3 text-sm font-black text-white transition disabled:cursor-not-allowed disabled:opacity-50 cursor-pointer shadow-sm"
                  />
                </div>
              </div>
            );
          })}
        </div>

        <div className="mt-6 space-y-2 text-sm text-foreground/80">
          <p>
            Abonamentul anual durează un an, cel lunar o lună; amândouă se reînnoiesc automat la prețul din momentul
            abonării, până le anulezi.
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
