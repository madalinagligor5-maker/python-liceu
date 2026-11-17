import Link from "next/link";
import LabClient from "@/components/LabClient";
import FaqJsonLd from "@/components/seo/FaqJsonLd";
import { metadatePagina } from "@/lib/seo";

export const metadata = metadatePagina({
  titlu: "Compilator Python online gratuit — rulează cod în browser",
  descriere: "Compilator Python online gratuit, în română: scrii cod, îl rulezi în browser, citești date cu input() și vezi erorile explicate. Fără cont, fără instalare.",
  cale: "/lab",
});

// Afișate pe pagină și trimise ca FAQPage din același array.
const INTREBARI = [
  {
    intrebare: "Trebuie să instalez ceva ca să rulez cod Python aici?",
    raspuns:
      "Nu. Codul rulează direct în browser, cu Pyodide (Python 3.12 compilat pentru web). Prima rulare descarcă interpretorul (aproximativ 15 MB); după aceea programele pornesc imediat.",
  },
  {
    intrebare: "Pot folosi input() pentru date de la tastatură?",
    raspuns:
      "Da. Scrie datele în câmpul „Date de intrare”, câte una pe rând, înainte să rulezi. Fiecare apel input() primește următorul rând.",
  },
  {
    intrebare: "Ce biblioteci pot importa?",
    raspuns:
      "Toată biblioteca standard Python: math, random, datetime, collections, itertools, string și celelalte. Pachetele externe, precum numpy sau pandas, nu sunt disponibile în laborator.",
  },
  {
    intrebare: "Ce se întâmplă dacă programul meu intră într-o buclă infinită?",
    raspuns:
      "Programul se oprește automat după câteva secunde, iar butonul „Oprește” îl întrerupe oricând. Pagina rămâne utilizabilă.",
  },
  {
    intrebare: "Se salvează codul scris?",
    raspuns:
      "Da, în acest browser: când revii pe pagină, găsești ultimul cod scris. Codul nu este trimis către server.",
  },
];

export default function LabPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6">
      <FaqJsonLd intrebari={INTREBARI} />
      <div className="mb-6">
        <h1 className="text-3xl font-extrabold text-foreground sm:text-4xl">Compilator Python online</h1>
        <p className="mt-2 text-foreground/70 text-sm">
          Scrie orice cod Python și apasă butonul de rulare: se execută pe loc, în browser. Gratuit, fără cont și
          fără instalare.
        </p>
      </div>

      <LabClient />

      <section className="mt-12 space-y-4 text-sm leading-relaxed text-foreground/80">
        <h2 className="text-xl font-black text-foreground">Ce poți face în laborator</h2>
        <ul className="list-disc space-y-1.5 pl-5">
          <li>Rulezi programe Python 3 complete: variabile, if, for, while, liste, dicționare, funcții, clase.</li>
          <li>Citești date cu <code className="cod-inline">input()</code>, din câmpul „Date de intrare”.</li>
          <li>Când apare o eroare, primești și o explicație în română: ce înseamnă și unde să te uiți.</li>
          <li>Oprești oricând un program care rulează prea mult.</li>
        </ul>

        <h2 className="pt-4 text-xl font-black text-foreground">Ce să încerci primul</h2>
        <p>
          Dacă ești la început, ia exemplele din ghidurile de mai jos, lipește-le în editor și schimbă câte ceva ca să
          vezi ce se întâmplă:
        </p>
        <ul className="list-disc space-y-1.5 pl-5">
          <li>
            <Link href="/blog/variabile-in-python" className="font-semibold text-brand underline underline-offset-2">
              Variabile în Python
            </Link>{" "}
            — primul pas în orice program.
          </li>
          <li>
            <Link href="/blog/if-elif-else-in-python" className="font-semibold text-brand underline underline-offset-2">
              if, elif, else
            </Link>{" "}
            și{" "}
            <Link href="/blog/bucla-for-si-range-in-python" className="font-semibold text-brand underline underline-offset-2">
              bucla for cu range()
            </Link>
            .
          </li>
          <li>
            <Link href="/blog/exercitii-python-pentru-incepatori" className="font-semibold text-brand underline underline-offset-2">
              Exerciții Python pentru începători, cu rezolvări
            </Link>
            .
          </li>
          <li>
            <Link href="/blog/erori-frecvente-python" className="font-semibold text-brand underline underline-offset-2">
              Erori frecvente în Python
            </Link>{" "}
            — ce înseamnă mesajele roșii.
          </li>
        </ul>
        <p>
          Vrei lecții în ordine, cu exerciții verificate automat?{" "}
          <Link href="/start" className="font-semibold text-brand underline underline-offset-2">
            Alege un traseu și începe gratuit
          </Link>
          .
        </p>

        <h2 className="pt-4 text-xl font-black text-foreground">Întrebări frecvente</h2>
        <dl className="space-y-3">
          {INTREBARI.map((q) => (
            <div key={q.intrebare}>
              <dt className="font-bold text-foreground">{q.intrebare}</dt>
              <dd className="mt-0.5">{q.raspuns}</dd>
            </div>
          ))}
        </dl>
      </section>
    </div>
  );
}
