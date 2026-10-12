import Link from "next/link";
import type { Metadata } from "next";
import { unitati, hrefModulCurs } from "@/lib/curs";
import { ICOANE_SUBLECTIE } from "@/lib/curriculum";

export const metadata: Metadata = {
  title: "Curs practic de Python",
  description:
    "Curs de sine stătător, pentru orice vârstă — de la zero, direct în browser, spre automatizare și o primă incursiune în analiza de date. Primul modul e complet gratuit.",
  alternates: { canonical: "/curs-practic" },
};

// Harta completă a cursului (6 unități, 20 module). Modulele publicate vin din
// content/structura_curs.json și sunt navigabile; harta arată și ce urmează.
const HARTA_COMPLETA: { unitate: string; module: string[] }[] = [
  { unitate: "1. Primii pași", module: ["Ce e programarea și de ce Python", "Variabile și tipuri de date", "Operatori și expresii"] },
  { unitate: "2. Structuri de control", module: ["Decizii: if / elif / else", "Bucla for", "Bucla while, break și continue"] },
  { unitate: "3. Colecții de date", module: ["Liste", "Șiruri de caractere (stringuri)", "Dicționare", "Tupluri și mulțimi (seturi)"] },
  { unitate: "4. Organizarea codului", module: ["Funcții", "Module și biblioteca standard", "Gestionarea erorilor (try/except)"] },
  { unitate: "5. Date reale", module: ["Fișiere text", "Fișiere CSV", "Formatul JSON și date structurate"] },
  { unitate: "6. Python aplicat", module: ["Automatizarea sarcinilor repetitive", "Extragerea de date de pe web (etic)", "Introducere în analiza de date cu pandas", "Proiect final: de la date brute la un mic raport"] },
];

export default function CursPracticPage() {
  const primulModul = unitati[0]?.module[0];
  const titluriPublicate = new Set(unitati.flatMap((u) => u.module.map((m) => m.titlu)));
  const nrModule = unitati.reduce((s, u) => s + u.module.length, 0);

  return (
    <div className="bg-[#FDFBF7] text-[#1E2430] min-h-screen">
      <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 bg-hero-glow rounded-3xl">
        <span className="inline-flex rounded-full bg-violet-50 border border-violet-200 px-3.5 py-1 text-xs font-bold text-violet-900 uppercase tracking-widest mb-3">
          Curs de sine stătător — pentru orice vârstă
        </span>
        <h1 className="text-3xl font-black text-[#1E2430] sm:text-4xl [font-family:var(--font-fraunces)]">
          Curs practic de Python
        </h1>
        <p className="mt-3 max-w-2xl text-[#525B6C] font-medium text-sm sm:text-base">
          Pentru orice persoană care vrea să învețe Python de la zero și să ajungă
          rapid la lucruri utile — automatizare de sarcini repetitive și o primă
          incursiune în analiza de date. Nu presupune cunoștințe anterioare de
          programare, și e complet separat de traseul școlar.
        </p>

        <div className="mt-6 flex flex-wrap gap-3">
          <Link
            href={primulModul ? hrefModulCurs(primulModul) : "#"}
            className="rounded-xl bg-brand px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-brand-dark"
          >
            Începe modulul 1 — gratuit →
          </Link>
          <Link
            href="/curs-practic/preturi"
            className="rounded-xl border border-black/10 px-5 py-2.5 text-sm font-semibold text-foreground transition hover:border-brand hover:text-brand"
          >
            Vezi planurile cursului
          </Link>
        </div>

        {/* Module deja publicate, navigabile */}
        <p className="mt-10 text-sm text-[#525B6C]">
          {nrModule} module publicate din 20. Modulul 1 e complet gratuit — încearcă stilul cursului înainte de a te abona.
        </p>
        {unitati.map((unitate) => (
          <section key={unitate.slug} className="mt-8">
            <h2 className="text-xl font-black text-[#1E2430]">
              Unitatea {unitate.numar}: {unitate.titlu}
            </h2>
            <ol className="mt-4 space-y-3">
              {unitate.module.map((m) => (
                <li key={m.cod}>
                  <Link
                    href={hrefModulCurs(m)}
                    className="flex items-center justify-between gap-4 rounded-2xl border border-[#EBE7DF] bg-white p-4 shadow-xs transition hover:border-brand hover:shadow-sm"
                  >
                    <div className="flex min-w-0 items-center gap-3">
                      <span className="text-xl" aria-hidden="true">
                        {m.sublectii[0] ? ICOANE_SUBLECTIE[m.sublectii[0].tip] : "📘"}
                      </span>
                      <div className="min-w-0">
                        <p className="text-[11px] font-black uppercase tracking-wider text-brand-dark">
                          Modulul {m.numar}
                        </p>
                        <p className="font-bold text-[#1E2430] text-sm">{m.titlu}</p>
                      </div>
                    </div>
                    <span
                      className={`shrink-0 rounded-full px-2.5 py-1 text-[11px] font-bold ${
                        m.gratuit ? "bg-success/15 text-success" : "bg-brand-light text-brand-dark"
                      }`}
                    >
                      {m.gratuit ? "gratuit" : "abonament"}
                    </span>
                  </Link>
                </li>
              ))}
            </ol>
          </section>
        ))}

        {/* Harta completă a cursului, informativ */}
        <section className="mt-12">
          <h2 className="text-xl font-black text-[#1E2430]">Harta completă a cursului</h2>
          <p className="mt-1 text-sm text-[#525B6C]">
            6 unități, 20 de module. Modulele marcate cu ✓ sunt deja disponibile; restul se adaugă treptat, în același format.
          </p>
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            {HARTA_COMPLETA.map((u) => (
              <div key={u.unitate} className="rounded-2xl border border-[#EBE7DF] bg-white p-4 shadow-xs">
                <p className="font-black text-sm text-[#1E2430]">{u.unitate}</p>
                <ul className="mt-2 space-y-1">
                  {u.module.map((m) => (
                    <li key={m} className="text-xs text-[#525B6C]">
                      {titluriPublicate.has(m) ? (
                        <span className="font-semibold text-success">✓ {m}</span>
                      ) : (
                        <>· {m}</>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
