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
      "De la zero: ce e un algoritm, cum scrii un program, variabile, operații cu numere, liste și cum citești ce a scris altul.",
  },
  {
    clasa: "X",
    titlu: "Funcții și structuri de date",
    descriere:
      "Înveți să împarți un program în bucăți mai mici (funcții), apoi lucrezi cu tupluri, seturi, dicționare și text.",
  },
  {
    clasa: "XI",
    titlu: "Programare orientată pe obiecte",
    descriere:
      "Clase și obiecte, cum refolosești codul prin moștenire, plus algoritmi de care ai nevoie la olimpiadă și la școală.",
  },
  {
    clasa: "XII",
    titlu: "Proiecte și pregătire examen",
    descriere:
      "Pui cap la cap tot ce ai învățat în proiecte mai mari și exersezi exact ce pică la evaluarea de la Informatică.",
  },
];

const PAȘI = [
  {
    icon: "📘",
    titlu: "Citești lecția",
    text: "Fiecare lecție e împărțită în 6 pași scurți: recapitrezi ce știai, vezi noțiunea nouă, încearcă să ghicești ce face o bucată de cod, apoi rezolvi exerciții.",
  },
  {
    icon: "💻",
    titlu: "Scrii codul",
    text: "Exersezi direct pe pagină. Codul e comentat linie cu linie și rulează în browser — nu instalezi nimic pe calculator, deschizi lecția și scrii.",
  },
  {
    icon: "✅",
    titlu: "Verifici ce ai priceput",
    text: "La sfârșit ai câteva întrebări. Le rezolvi și vezi imediat ce ai greșit și de ce. Treci mai departe numai când le-ai făcut pe toate.",
  },
];

const FAQ = [
  {
    intrebare: "Chiar pot începe fără să plătesc nimic?",
    raspuns:
      "Da. Primele cinci module din clasa a IX-a sunt deschise complet. Intri pe ele, citești, scrii cod și rezolvi exercițiile fără cont și fără card.",
  },
  {
    intrebare: "Trebuie să instalez Python pe laptop?",
    raspuns:
      "Nu. Codul se scrie și rulează direct în pagină, în browser. Dacă vrei să mai exersezi și acasă, poți instala Python separat, dar nu e nevoie ca să urmezi lecțiile.",
  },
  {
    intrebare: "Se potrivește cu ce facem la școală?",
    raspuns:
      "Se potrivește. Lecțiile sunt grupate pe clase (IX–XII) și urmează programa de Informatică de liceu, așa că ce înveți aici îți e util direct la ora de curs și la teme.",
  },
  {
    intrebare: "Pot renunța la abonament dacă nu mai vreau?",
    raspuns:
      "Poți anula oricând din pagina ta de cont. Nu e nicio obligație pe termen lung și nu plătești nimic în plus.",
  },
  {
    intrebare: "Ce fac dacă mă blochez la un exercițiu?",
    raspuns:
      "Fiecare exercițiu are un indiciu (și, la nevoie, un al doilea indiciu mai explicit) și un răspuns-model. La verificare primești feedback imediat, iar la exercițiile cu cod vezi rezultatul exact al rulării.",
  },
  {
    intrebare: "Mă ajută la bacalaureat la Informatică?",
    raspuns:
      "Da. Conținutul acoperă algoritmi, structuri de date, programare și baze de date — exact domeniile evaluabile la bacalaureatul de Informatică. Lecțiile urmează programa oficială, așa că practica de aici se traduce direct la examen.",
  },
  {
    intrebare: "Aveți un preț pentru o clasă sau pentru o școală?",
    raspuns:
      "Da, pregătim licențe de grup (o clasă întreagă sau un liceu). Scrie-ne de pe pagina de contact și îți trimitem o ofertă pentru numărul de elevi și durata dorită.",
  },
  {
    intrebare: "Ce se întâmplă cu progresul meu dacă îmi schimb planul?",
    raspuns:
      "Progresul tău (module făcute, XP, insignele) rămâne salvat în cont, indiferent dacă treci de la gratuit la abonament sau schimbi între planul lunar și cel anual. Nu pierzi nimic din ce ai parcurs.",
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

  // Module reale din curriculum (primele 5 din clasa IX, gratuite).
  const moduleGratuite = capitole
    .find((c) => c.clasa === "IX")
    ?.module.slice(0, 5)
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
              <img
                src="/logo.png"
                alt="Academia Python"
                width={160}
                height={160}
                style={{ width: 160, height: 160 }}
                className="rounded-2xl"
              />
              <span className="text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl">
                Academia<span className="text-brand">Python</span>
              </span>
            </div>

            <h1 className="mt-6 text-4xl font-extrabold leading-tight text-foreground sm:text-5xl lg:text-6xl">
              Înveți <span className="text-brand">Python</span> direct
              în browser,
              <br className="hidden sm:block" /> fără instalări.
            </h1>

            <p className="mt-5 max-w-xl text-lg text-foreground/70">
              Lecții făcute pe programa de Informatică de liceu, cu explicații
              clare și exerciții la care scrii tu însuți codul. Primele module din
              clasa a IX-a sunt{" "}
              <span className="font-semibold text-brand-dark">deschise gratuit</span> —
              intri și începi, fără cont și fără card.
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                href="/curriculum"
                className="rounded-xl bg-brand px-7 py-3.5 text-base font-semibold text-white shadow-sm transition hover:bg-brand-dark"
              >
                Intră la lecții →
              </Link>
              <Link
                href="/preturi"
                className="rounded-xl border border-black/10 px-7 py-3.5 text-base font-semibold text-foreground transition hover:border-brand hover:text-brand"
              >
                Cât costă restul?
              </Link>
            </div>

            <div className="mt-8 flex items-center gap-2 text-sm text-foreground/55">
              <Mascota size={34} />
              <span>
                De la primele linii de cod până la proiecte mai mari, pas cu pas.
              </span>
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
          Cum merg lecțiile
        </h2>
        <p className="mt-2 max-w-2xl text-foreground/70">
          Nu e o listă de lecturi de citit și gata. La fiecare lecție treci prin
          trei lucruri simple, care te ajută să ții minte ce ai învățat.
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
            Ce înveți pe clase
          </h2>
          <p className="mt-2 max-w-2xl text-foreground/70">
            Totul e împărțit pe anii de liceu, așa cum e la școală. Intri pe clasa ta
            și vezi ce ai de învățat, de la primele noțiuni până la proiectele de la
            sfârșit.
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
                Începe acum, fără bani
              </h2>
              <p className="mt-2 max-w-2xl text-foreground/70">
                Primele cinci module din clasa a IX-a le poți parcurge de la cap la coadă
                chiar acum. Deschizi o lecție, scrii codul în pagină, rezolvi exercițiile
                — și gata, fără cont.
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
        <h2 className="text-2xl font-bold text-foreground sm:text-3xl">
          Cât costă restul lecțiilor
        </h2>
        <p className="mt-2 max-w-2xl text-foreground/70">
          Cele cinci module din clasa a IX-a sunt gratuite. Pentru tot ce e după ele —
          toate celelalte clase, exercițiile și proiectele — e un abonament mic, pe
          lună. Vezi prețul exact mai jos.
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
