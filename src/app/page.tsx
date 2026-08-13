import Link from "next/link";
import CodeBlock from "@/components/CodeBlock";
import Logo from "@/components/Logo";
import Mascota from "@/components/Mascota";
import Dashboard from "@/components/Dashboard";
import { getUtilizatorCurent } from "@/lib/subscription";
import { getProgresUtilizator } from "@/lib/progres";
import { capitole } from "@/lib/curriculum";

const CLASE = [
  {
    clasa: "IX",
    titlu: "Bazele programării",
    descriere:
      "Gândire computațională, variabile, tipuri de date, operatori, structuri de control, liste.",
  },
  {
    clasa: "X",
    titlu: "Funcții și structuri de date",
    descriere:
      "Funcții, parametri, tupluri, seturi, dicționare, prelucrarea șirurilor de caractere.",
  },
  {
    clasa: "XI",
    titlu: "Programare orientată pe obiecte",
    descriere:
      "Clase, obiecte, moștenire, structuri de date avansate, algoritmi de sortare și căutare.",
  },
  {
    clasa: "XII",
    titlu: "Proiecte și pregătire examen",
    descriere:
      "Recapitulare integrată, proiecte practice, pregătire pentru evaluarea la Informatică.",
  },
];

const PAȘI = [
  {
    icon: "📘",
    titlu: "Învață",
    text: "Fiecare lecție e structurată în 6 pași scurți: recapitulare, concept nou, predicție, exerciții ghidate, exerciții independente și verificare.",
  },
  {
    icon: "💻",
    titlu: "Practică",
    text: "Exersezi direct în pagină, cu cod comentat linie cu linie și feedback imediat. Nu instalezi nimic — totul rulează în browser.",
  },
  {
    icon: "✅",
    titlu: "Verifică",
    text: "La finalul fiecărei lecții susții un mic test. Treci mai departe doar când demonstrezi că ai înțeles — așa se fixează cunoștința.",
  },
];

const FAQ = [
  {
    intrebare: "Chiar sunt gratuite primele lecții?",
    raspuns:
      "Da. Primele module din clasa a IX-a sunt complet gratuite — poți începe direct, fără cont.",
  },
  {
    intrebare: "Am nevoie să instalez Python pe calculator?",
    raspuns:
      "Nu pentru exercițiile din lecții — codul rulează direct în pagină, în browser. Poți instala Python separat dacă vrei să exersezi și acasă.",
  },
  {
    intrebare: "Conținutul respectă programa școlară?",
    raspuns:
      "Da, lecțiile sunt structurate pe clase (IX-XII) și unități, conform programei oficiale de Informatică pentru liceu.",
  },
  {
    intrebare: "Pot anula abonamentul oricând?",
    raspuns:
      "Da, abonamentul se poate anula oricând din pagina de cont, fără costuri suplimentare.",
  },
];

function prenumeDinEmail(email: string): string {
  const local = email.split("@")[0] ?? "";
  const prima = local.split(/[._-]/)[0] ?? local;
  return prima ? prima.charAt(0).toUpperCase() + prima.slice(1) : "prietene";
}

export default async function HomePage({ searchParams }: PageProps<"/">) {
  const { user } = await getUtilizatorCurent();

  // Utilizator autentificat: "Acasă" e dashboard-ul personal, nu marketingul.
  if (user) {
    const progres = await getProgresUtilizator(user.id);
    const params = await searchParams;
    const cerut = Array.isArray(params?.clasa) ? params.clasa[0] : params?.clasa;
    const valide = ["IX", "X", "XI", "XII"];
    const clasaSelectata =
      (cerut && valide.includes(cerut) ? cerut : null) ??
      (progres?.clasa && valide.includes(progres.clasa) ? progres.clasa : null) ??
      "IX";

    if (progres) {
      return (
        <Dashboard
          prenume={prenumeDinEmail(user.email)}
          progres={progres}
          clasaSelectata={clasaSelectata}
        />
      );
    }
  }

  // Module reale din curriculum (primele 3 din clasa IX, gratuite).
  const moduleGratuite = capitole
    .find((c) => c.clasa === "IX")
    ?.module.slice(0, 3)
    .map((m) => {
      return { cod: m.cod, titlu: m.titlu, slug: m.slug };
    }) ?? [];

  return (
    <div>
      {/* HERO */}
      <section className="relative overflow-hidden bg-gradient-to-br from-brand-light via-[#f6effc] to-[#f6efdc]">
        {/* decoruri */}
        <div className="pointer-events-none absolute -right-16 -top-16 h-64 w-64 rounded-full bg-brand/10 blur-2xl" />
        <div className="pointer-events-none absolute -left-20 bottom-0 h-56 w-56 rounded-full bg-[#fbbf24]/10 blur-2xl" />

        <div className="relative mx-auto grid max-w-6xl items-center gap-10 px-4 py-20 sm:px-6 lg:grid-cols-[1.1fr_0.9fr] lg:py-24">
          {/* stânga: logo mare + text */}
          <div>
            <div className="flex items-center gap-4">
              <Logo className="h-20 w-20 rounded-2xl sm:h-24 sm:w-24" />
              <span className="text-2xl font-extrabold tracking-tight text-foreground sm:text-3xl">
                Academia<span className="text-brand">Python</span>
              </span>
            </div>

            <h1 className="mt-6 text-4xl font-extrabold leading-tight text-foreground sm:text-5xl lg:text-6xl">
              Învață <span className="text-brand">Python</span>, pas cu pas,
              <br className="hidden sm:block" /> direct din browser.
            </h1>

            <p className="mt-5 max-w-xl text-lg text-foreground/70">
              Lecții clare, exemple de cod comentate și exerciții interactive, conform
              programei oficiale de Informatică. Primele module sunt{" "}
              <span className="font-semibold text-brand-dark">gratuite</span> — fără cont,
              fără card.
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                href="/curriculum"
                className="rounded-xl bg-brand px-7 py-3.5 text-base font-semibold text-white shadow-sm transition hover:bg-brand-dark"
              >
                Începe gratuit →
              </Link>
              <Link
                href="/preturi"
                className="rounded-xl border border-black/10 px-7 py-3.5 text-base font-semibold text-foreground transition hover:border-brand hover:text-brand"
              >
                Vezi prețurile
              </Link>
            </div>

            <div className="mt-8 flex items-center gap-2 text-sm text-foreground/55">
              <Mascota size={34} />
              <span>Peste 500 de lecții, de la zero la proiecte reale.</span>
            </div>
          </div>

          {/* dreapta: code block + mascota */}
          <div className="relative">
            <div className="absolute -right-4 -top-6 z-10">
              <Mascota size={72} eticheta="Mascota Py" />
            </div>
            <CodeBlock
              label="lectie_1.py"
              code={`def saluta(nume):
    print("Salut,", nume, "!")

saluta("Academia Python")
# Salut, Academia Python !`}
            />
          </div>
        </div>
      </section>

      {/* CUM FUNCȚIONEAZĂ */}
      <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
        <h2 className="text-2xl font-bold text-foreground sm:text-3xl">
          Cum funcționează învățarea
        </h2>
        <p className="mt-2 max-w-2xl text-foreground/70">
          Un drum de învățare, nu o listă de lecții. Fiecare lecție trece prin trei momente
          care fac ca cunoștința să se fixeze.
        </p>

        <div className="mt-8 grid gap-5 sm:grid-cols-3">
          {PAȘI.map((p) => (
            <div
              key={p.titlu}
              className="rounded-2xl border border-brand-border bg-white p-5 shadow-sm"
            >
              <div className="text-3xl" aria-hidden="true">
                {p.icon}
              </div>
              <h3 className="mt-3 font-semibold text-foreground">{p.titlu}</h3>
              <p className="mt-2 text-sm text-foreground/60">{p.text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CLASE */}
      <section className="bg-brand-light/40 py-16">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <h2 className="text-2xl font-bold text-foreground sm:text-3xl">
            Patru ani, un traseu clar
          </h2>
          <p className="mt-2 max-w-2xl text-foreground/70">
            Conținutul e organizat pe clase, de la primele noțiuni până la proiecte și
            pregătirea pentru examen.
          </p>

          <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {CLASE.map((c) => (
              <Link
                key={c.clasa}
                href={`/curriculum/${c.clasa}`}
                className="rounded-2xl border border-black/10 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:border-brand hover:shadow-md"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-light text-sm font-bold text-brand-dark">
                  {c.clasa}
                </div>
                <h3 className="mt-4 font-semibold text-foreground">{c.titlu}</h3>
                <p className="mt-2 text-sm text-foreground/60">{c.descriere}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* MODULE GRATUITE — preview real din curriculum */}
      {moduleGratuite.length > 0 && (
        <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
          <div className="flex items-end justify-between gap-4">
            <div>
              <h2 className="text-2xl font-bold text-foreground sm:text-3xl">
                Începe chiar acum — gratuit
              </h2>
              <p className="mt-2 max-w-2xl text-foreground/70">
                Primele trei module din clasa a IX-a sunt deschise complet. Fără cont, fără
                card.
              </p>
            </div>
            <Link
              href="/curriculum/IX"
              className="hidden shrink-0 rounded-xl border border-brand px-5 py-2.5 text-sm font-semibold text-brand transition hover:bg-brand-light sm:inline-block"
            >
              Vezi tot curriculumul →
            </Link>
          </div>

          <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {moduleGratuite.map((m) => (
              <Link
                key={m.cod}
                href={`/curriculum/IX/${m.slug}`}
                className="group rounded-2xl border border-black/10 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:border-brand hover:shadow-md"
              >
                <div className="flex items-center gap-2">
                  <span className="rounded-lg bg-brand-light px-2 py-1 text-xs font-bold text-brand-dark">
                    {m.cod}
                  </span>
                  <span className="rounded-lg bg-[#dcfce7] px-2 py-1 text-xs font-semibold text-[#15803d]">
                    Gratuit
                  </span>
                </div>
                <h3 className="mt-4 font-semibold text-foreground transition group-hover:text-brand">
                  {m.titlu}
                </h3>
                <p className="mt-2 text-sm text-foreground/55">
                  Acces la toate cele 6 lecții ale modulului.
                </p>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* PREȚURI SCURTE */}
      <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
        <h2 className="text-2xl font-bold text-foreground sm:text-3xl">Prețuri simple</h2>
        <p className="mt-2 max-w-2xl text-foreground/70">
          Acces complet la toate lecțiile, exercițiile și proiectele, pentru un abonament mic.
        </p>
        <Link
          href="/preturi"
          className="mt-6 inline-flex rounded-xl bg-brand px-6 py-3 text-base font-semibold text-white shadow-sm transition hover:bg-brand-dark"
        >
          Vezi planurile de abonament →
        </Link>
      </section>

      {/* FAQ */}
      <section className="mx-auto max-w-3xl px-4 py-16 sm:px-6">
        <h2 className="text-2xl font-bold text-foreground sm:text-3xl">
          Întrebări frecvente
        </h2>
        <div className="mt-8 space-y-4">
          {FAQ.map((f) => (
            <details
              key={f.intrebare}
              className="group rounded-xl border border-black/10 bg-white p-4 open:shadow-sm"
            >
              <summary className="cursor-pointer list-none font-medium text-foreground marker:content-none">
                <span className="flex items-center justify-between">
                  {f.intrebare}
                  <span className="ml-4 text-brand transition group-open:rotate-45">+</span>
                </span>
              </summary>
              <p className="mt-3 text-sm text-foreground/70">{f.raspuns}</p>
            </details>
          ))}
        </div>
      </section>
    </div>
  );
}
