import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Pentru profesori — Academia Python",
  description:
    "Planificări calendaristice, materiale, fișe de lucru printabile și o bancă de teste generată din quiz-urile Academia Python — descărcabile ca PDF, gratuit pentru profesorii aprobați.",
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
        direct din materia deja predată pe platformă. Intri, iei planificarea, materialele sau
        fișele de care ai nevoie pentru ora ta, descarci PDF-ul și pleci — nu ai nevoie de niciun
        cont de elev și nu-ți legi elevii de platformă.
      </p>

      <div className="mt-10 grid gap-4 sm:grid-cols-2">
        {[
          {
            icon: "🗓️",
            titlu: "Planificări calendaristice",
            text: "Planificare completă per clasă (IX–XII), în formatul oficial de programă școlară, descărcabilă ca PDF.",
          },
          {
            icon: "📚",
            titlu: "Materiale",
            text: "Resurse suplimentare — exemple gata generate, ghiduri de folosire la clasă. Lista crește constant.",
          },
          {
            icon: "📄",
            titlu: "Fișe de lucru printabile",
            text: "Exercițiile deja existente pe platformă, ca PDF curat pentru hârtie, cu sau fără barem — două descărcări separate.",
          },
          {
            icon: "📝",
            titlu: "Bancă de teste",
            text: "Generează un test din quiz-urile existente, cu barem separat ca PDF, fără riscul unei inconsecvențe între ele.",
          },
          {
            icon: "🔓",
            titlu: "Acces integral la curriculum",
            text: "Un cont aprobat vede toate modulele, exercițiile și quiz-urile platformei, fără abonament — ca să poți pregăti orice lecție.",
          },
        ].map((f) => (
          <div key={f.titlu} className="rounded-2xl border border-black/10 bg-white p-5">
            <div className="text-2xl">{f.icon}</div>
            <h3 className="mt-2 font-bold text-foreground">{f.titlu}</h3>
            <p className="mt-1 text-sm text-foreground/60">{f.text}</p>
          </div>
        ))}
      </div>

      <p className="mt-6 text-center text-xs text-foreground/40">
        Lista de materiale crește constant — urmează în curând planificări și resurse pentru mai
        multe module.
      </p>

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
