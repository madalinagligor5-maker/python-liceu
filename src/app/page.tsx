import Link from "next/link";
import CodeBlock from "@/components/CodeBlock";
import Mascota from "@/components/Mascota";
import Dashboard from "@/components/Dashboard";
import { getUtilizatorCurent } from "@/lib/subscription";
import { getProgresUtilizator } from "@/lib/progres";

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

const FAQ = [
  {
    intrebare: "Chiar sunt gratuite primele lecții?",
    raspuns:
      "Da. Primele 5 lecții sunt complet gratuite și nu necesită cont — poți începe direct din pagina de lecții.",
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

  return (
    <div>
      <section className="mx-auto grid max-w-6xl items-center gap-10 px-4 py-16 sm:px-6 lg:grid-cols-2 lg:py-24">
        <div>
          <span className="inline-flex items-center rounded-full bg-brand-light px-3 py-1 text-xs font-semibold text-brand-dark">
            Pentru elevii de liceu, clasele IX-XII
          </span>
          <h1 className="mt-4 text-4xl font-extrabold leading-tight text-foreground sm:text-5xl">
            Învață <span className="text-brand">Python</span>, pas cu pas, direct din browser.
          </h1>
          <p className="mt-4 text-lg text-foreground/70">
            Lecții clare, exemple de cod comentate și exerciții interactive, conform programei
            oficiale de Informatică. Primele 5 lecții sunt gratuite — fără cont, fără card.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              href="/lectii"
              className="rounded-xl bg-brand px-6 py-3 text-base font-semibold text-white shadow-sm transition hover:bg-brand-dark"
            >
              Începe gratuit →
            </Link>
            <Link
              href="/preturi"
              className="rounded-xl border border-black/10 px-6 py-3 text-base font-semibold text-foreground transition hover:border-brand hover:text-brand"
            >
              Vezi prețurile
            </Link>
          </div>
        </div>

        <div className="relative">
          <Mascota
            size={110}
            className="absolute -top-14 right-2 hidden lg:block"
            eticheta="Py, mascota Academiei Python"
          />
          <CodeBlock
            label="lectie_1.py"
            code={`def saluta(nume):\n    print("Salut,", nume, "!")\n\nsaluta("Academia Python")\n# Salut, Academia Python !`}
          />
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
        <h2 className="text-2xl font-bold text-foreground sm:text-3xl">
          Un drum de învățare, nu o listă de lecții
        </h2>
        <p className="mt-2 max-w-2xl text-foreground/70">
          După ce îți faci cont, vezi un traseu vizual pentru clasa ta: ce ai terminat, care e
          pasul următor și ce urmează. Plus XP, niveluri și serii de zile — ca să-ți fie ușor să
          revii.
        </p>

        <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {CLASE.map((c) => (
            <div
              key={c.clasa}
              className="rounded-2xl border border-black/10 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-light text-sm font-bold text-brand-dark">
                {c.clasa}
              </div>
              <h3 className="mt-4 font-semibold text-foreground">{c.titlu}</h3>
              <p className="mt-2 text-sm text-foreground/60">{c.descriere}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-brand-light/40 py-16">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
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
        </div>
      </section>

      <section className="mx-auto max-w-3xl px-4 py-16 sm:px-6">
        <h2 className="text-2xl font-bold text-foreground sm:text-3xl">Întrebări frecvente</h2>
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
