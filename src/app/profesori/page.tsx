import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Pentru profesori — Academia Python",
  description:
    "Planificări calendaristice, fișe de lucru printabile, progres pe clasă și o bancă de teste generată din quiz-urile Academia Python — gratuit pentru profesorii aprobați.",
};

export default function ProfesoriPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6">
      <p className="text-xs font-bold uppercase tracking-wide text-brand">Pentru profesori</p>
      <h1 className="mt-2 text-3xl font-extrabold text-foreground sm:text-4xl [font-family:var(--font-fraunces)]">
        Instrumente gratuite pentru orele de Informatică
      </h1>
      <p className="mt-4 text-base leading-relaxed text-foreground/70">
        Academia Python oferă profesorilor o zonă separată, gratuită, cu instrumente construite
        direct din materia deja predată pe platformă — nimic de rescris de la zero.
      </p>

      <div className="mt-10 grid gap-4 sm:grid-cols-2">
        {[
          {
            icon: "🗓️",
            titlu: "Planificări calendaristice",
            text: "Planificare per clasă (IX–XII), gata de print, cu unități de învățare și număr de ore alocat.",
          },
          {
            icon: "📄",
            titlu: "Fișe de lucru printabile",
            text: "Exercițiile deja existente pe platformă, într-un format curat pentru hârtie, cu sau fără barem.",
          },
          {
            icon: "📊",
            titlu: "Progres pe clasă",
            text: "O privire de ansamblu asupra elevilor care s-au asociat cu clasa ta, cu un cod pe care îl generezi tu.",
          },
          {
            icon: "📝",
            titlu: "Bancă de teste",
            text: "Generează un test din quiz-urile existente, cu barem separat, fără riscul unei inconsecvențe între ele.",
          },
        ].map((f) => (
          <div key={f.titlu} className="rounded-2xl border border-black/10 bg-white p-5">
            <div className="text-2xl">{f.icon}</div>
            <h3 className="mt-2 font-bold text-foreground">{f.titlu}</h3>
            <p className="mt-1 text-sm text-foreground/60">{f.text}</p>
          </div>
        ))}
      </div>

      <div className="mt-10 rounded-2xl border border-brand-border bg-brand-light/40 p-6 text-center">
        <p className="font-semibold text-foreground">
          Accesul e gratuit, dar aprobat manual — nu automat.
        </p>
        <p className="mt-1 text-sm text-foreground/60">
          Îți creezi cont, bifezi „Sunt profesor” și primești acces după o verificare simplă.
        </p>
        <Link
          href="/inregistrare?profesor=1"
          className="mt-4 inline-block rounded-xl bg-brand px-6 py-3 text-sm font-bold text-white transition hover:bg-brand-dark"
        >
          Cere acces
        </Link>
      </div>
    </div>
  );
}
