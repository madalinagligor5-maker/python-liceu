import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Despre — Academia Python",
  description:
    "De ce am făcut Academia Python: pentru elevii care cred că «nu sunt făcuți pentru programare» doar pentru că s-au blocat la primul mesaj de eroare.",
};

export default function DesprePage() {
  return (
    <div className="mx-auto max-w-2xl px-4 py-14 sm:px-6">
      <h1 className="text-3xl font-extrabold text-foreground sm:text-4xl">
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
          Lecțiile sunt grupate pe clase (IX–XII) și urmează programa de
          Informatică de liceu. Primele 3 module din clasa a IX-a sunt{" "}
          <strong>gratuite</strong> (fără cont, fără card), iar următoarele 2
          sunt deschise pentru explorare. Restul se deblochează cu abonament.
        </p>
      </div>

      <div className="mt-10 rounded-2xl border border-brand-border bg-brand-light/40 p-6 text-center">
        <p className="text-base font-semibold text-brand-dark">
          Vrei să vezi dacă e pentru tine?
        </p>
        <p className="mt-1 text-sm text-foreground/70">
          Primele 5 module din clasa a IX-a sunt gratuite. Fără card, fără
          obligații.
        </p>
        <Link
          href="/curriculum"
          className="mt-4 inline-block rounded-lg bg-brand px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-brand-dark"
        >
          Începe acum →
        </Link>
      </div>

      <p className="mt-8 text-xs text-muted">
        Ai o întrebare sau o sugestie? Scrie-ne de pe pagina de{" "}
        <Link href="/contact" className="text-brand hover:underline">
          contact
        </Link>
        .
      </p>
    </div>
  );
}
