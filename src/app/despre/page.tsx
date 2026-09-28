import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Despre",
  description:
    "De ce am făcut Academia Python: pentru elevii care cred că «nu sunt făcuți pentru programare» doar pentru că s-au blocat la primul mesaj de eroare.",
  alternates: { canonical: "/despre" },
};

export default function DesprePage() {
  return (
    <div className="mx-auto max-w-2xl px-4 py-14 sm:px-6">
      <h1 className="text-3xl font-extrabold text-foreground sm:text-4xl [font-family:var(--font-fraunces)]">
        Despre Academia Python
      </h1>

      <div className="mt-8 space-y-6 text-[15px] leading-relaxed text-foreground/80">
        <p className="text-lg font-medium text-foreground">
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
        <h2 className="pt-2 text-xl font-bold text-foreground">Cine administrează platforma</h2>
        <p>
          Academia Python este operată de GLIGOR MĂDĂLINA-GEORGIANA P.F.A. (datele
          complete de identificare sunt în{" "}
          <Link href="/termeni-si-conditii" className="font-semibold text-brand-dark underline">Termeni și condiții</Link>
          ). Pentru întrebări: {" "}
          <a href="mailto:academipython@gmail.com" className="font-semibold text-brand-dark underline">academipython@gmail.com</a>.
        </p>
      </div>

      <div className="mt-10 rounded-2xl border border-brand-border bg-brand-light/40 p-6 text-center">
        <p className="text-base font-semibold text-brand-dark">
          Vrei să vezi dacă e pentru tine?
        </p>
        <p className="mt-1 text-sm text-foreground/70">
          Alege traseul și începe prima lecție gratuită. Fără cont, fără card.
        </p>
        <Link
          href="/start"
          className="mt-4 inline-block rounded-lg bg-amber-400 px-5 py-2.5 text-sm font-black text-slate-950 transition hover:bg-amber-500"
        >
          Începe gratuit →
        </Link>
      </div>

      <p className="mt-8 text-xs text-muted">
        Ai o întrebare sau o sugestie? Scrie-ne la{" "}
        <a href="mailto:academipython@gmail.com" className="text-brand-dark underline">
          academipython@gmail.com
        </a>
        .
      </p>
    </div>
  );
}
