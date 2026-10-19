import Link from "next/link";
import Image from "next/image";
import { metadatePagina } from "@/lib/seo";

export const metadata = metadatePagina({
  titlu: "Pentru profesori",
  descriere: "Planificări calendaristice, materiale, fișe de lucru printabile și o bancă de teste generată din quiz-urile Academia Python — descărcabile ca PDF, gratuit pentru profesorii aprobați.",
  cale: "/profesori",
});

export default function ProfesoriPage() {
  return (
    <div className="page-shell max-w-6xl">
      <div className="grid gap-10 lg:grid-cols-2 lg:items-center">
        <div>
      <span className="eyebrow">Pentru profesori</span>
      <h1 className="mt-5 text-4xl font-black leading-[1.04] text-foreground sm:text-6xl [font-family:var(--font-fraunces)]">
        Mai puțin timp cu pregătirea. Mai mult timp pentru explicații.
      </h1>
      <p className="mt-5 text-base leading-relaxed text-foreground/70 sm:text-lg">
        Academia Python oferă profesorilor o zonă separată, gratuită, cu instrumente construite
        direct din materia deja predată pe platformă. Intri, iei planificarea, materialele sau
        fișele de care ai nevoie pentru ora ta, descarci PDF-ul și pleci — nu ai nevoie de niciun
        cont de elev și nu-ți legi elevii de platformă.
      </p></div>
        <div className="relative min-h-[24rem] overflow-hidden rounded-[1.75rem] bg-[#172033] sm:min-h-[31rem]">
          <Image src="/images/people/profesoara-informatica.png" alt="Profesoară de informatică pregătind o lecție" fill sizes="(min-width: 1024px) 50vw, 100vw" className="object-cover" />
        </div>
      </div>

      <div className="mt-20 grid border-t border-black/10 sm:grid-cols-2">
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
        ].map((f, index) => (
          <div key={f.titlu} className="border-b border-black/10 p-6 sm:border-r sm:p-8 sm:even:border-r-0">
            <div className="font-mono text-xs text-[#C6780B]">0{index + 1}</div>
            <h3 className="mt-4 text-xl font-bold text-foreground [font-family:var(--font-fraunces)]">{f.titlu}</h3>
            <p className="mt-2 text-sm leading-relaxed text-foreground/60">{f.text}</p>
          </div>
        ))}
      </div>

      <p className="mt-6 text-center text-xs text-foreground/40">
        Lista de materiale crește constant — urmează în curând planificări și resurse pentru mai
        multe module.
      </p>

      <div className="mx-auto mt-14 max-w-2xl border-y border-black/10 py-8 text-center">
        <p className="font-semibold text-foreground">
          Accesul e gratuit, dar aprobat manual — nu automat.
        </p>
        <p className="mt-1 text-sm text-foreground/60">
          Îți creezi cont, bifezi „Sunt profesor” și primești acces după o verificare simplă.
        </p>
        <Link
          href="/inregistrare?profesor=1"
          className="primary-action mt-5"
        >
          Cere acces
        </Link>
      </div>
    </div>
  );
}
