import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";

export const metadata: Metadata = {
  title: "Despre",
  description:
    "De ce am făcut Academia Python: pentru elevii care cred că «nu sunt făcuți pentru programare» doar pentru că s-au blocat la primul mesaj de eroare.",
  alternates: { canonical: "/despre" },
};

export default function DesprePage() {
  return (
    <div className="page-shell max-w-6xl">
      <div className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-end">
        <div>
          <span className="eyebrow mb-4">De ce există academia</span>
          <h1 className="text-4xl font-black leading-[1.04] text-foreground sm:text-6xl [font-family:var(--font-fraunces)]">
            Programarea se învață cu explicații bune și cu răbdare.
          </h1>
        </div>
        <div className="relative min-h-[22rem] overflow-hidden rounded-[1.75rem] bg-[#172033] sm:min-h-[29rem]">
          <Image src="/images/people/profesoara-informatica.png" alt="Profesoară care explică o lecție de informatică" fill sizes="(min-width: 1024px) 55vw, 100vw" className="object-cover object-center" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#172033]/65 via-transparent to-transparent" />
          <p className="absolute bottom-0 max-w-md p-6 text-sm font-semibold leading-relaxed text-white sm:p-8 sm:text-base">O platformă construită pentru momentul în care elevul spune: „Acum am înțeles.”</p>
        </div>
      </div>

      <div className="mx-auto mt-16 max-w-3xl space-y-7 text-[16px] leading-[1.8] text-foreground/72">
        <p className="text-xl font-semibold leading-relaxed text-foreground [font-family:var(--font-fraunces)]">
          Nimeni nu se naște știind Python. Dar oricine poate învăța, dacă
          cineva îi explică pas cu pas — nu doar îi aruncă un manual în față.
          Asta facem aici.
        </p>

        <p>
          Am văzut prea mulți elevi care se blochează la primul mesaj de eroare
          și ajung să creadă că «nu sunt făcuți pentru programare». Nu e
          adevărat. De obicei e doar că nimeni nu le-a arătat pașii mici, în
          ordinea corectă, cu exemple clare și cu răbdare.
        </p>

        <p>
          Academia Python există ca să schimbe asta. Fiecare lecție urmează același
          drum simplu: recapitulezi ce știai deja, vezi conceptul nou explicat
          pas cu pas, anticipezi rezultatul unui fragment de cod, rezolvi
          exerciții ghidate, apoi independente — și abia la final verifici dacă
          ai înțeles. Codul se scrie și rulează direct în pagină, fără instalări
          și fără frică.
        </p>

        <p>
          Nu e o competiție. E un loc în care poți greși de zece ori la un
          exercițiu și a unsprezecea o să iasă — și o să simți că poți scrie cod
          care chiar funcționează. Asta e încrederea pe care vrem să o construim,
          nu o diplomă.
        </p>

        <p>
          Există patru trasee: Kids (clasele I–IV), gimnaziu (clasele VII–VIII),
          liceu (clasele IX–XII, structurat după noile programe de Informatică)
          și un curs practic pentru oricine. Kids și gimnaziul sunt gratuite,
          la fel primele 3 module din clasa a IX-a și primul modul din cursul
          practic. Detaliile exacte sunt pe pagina{" "}
          <Link href="/preturi" className="font-semibold text-brand-dark underline">Prețuri</Link>.
        </p>
        <h2 className="pt-2 text-xl font-bold text-foreground">Cine a creat platforma</h2>
        <p>
          Academia Python a fost creată de o profesoară, din dorința ca elevii să
          primească explicații clare și pași mici, în ordinea potrivită. Datele de
          identificare ale operatorului sunt în{" "}
          <Link href="/termeni-si-conditii" className="font-semibold text-brand-dark underline">Termeni și condiții</Link>
          . Pentru întrebări: {" "}
          <a href="mailto:academipython@gmail.com" className="font-semibold text-brand-dark underline">academipython@gmail.com</a>.
        </p>
      </div>

      <div className="mx-auto mt-14 max-w-3xl border-y border-black/10 py-9 text-center">
        <p className="text-xl font-bold text-foreground [font-family:var(--font-fraunces)]">
          Vrei să vezi dacă e pentru tine?
        </p>
        <p className="mt-1 text-sm text-foreground/70">
          Alege traseul și începe prima lecție gratuită. Fără cont, fără card.
        </p>
        <Link
          href="/start"
          className="primary-action mt-5"
        >
          Începe gratuit →
        </Link>
      </div>

      <p className="mx-auto mt-8 max-w-3xl text-xs text-muted">
        Ai o întrebare sau o sugestie? Scrie-ne la{" "}
        <a href="mailto:academipython@gmail.com" className="text-brand-dark underline">
          academipython@gmail.com
        </a>
        .
      </p>
    </div>
  );
}
