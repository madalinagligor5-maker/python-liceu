import Link from "next/link";
import type { Metadata } from "next";
import { esteCapitolCopii, numeClasa, capitole } from "@/lib/curriculum";
import LectieBadge from "@/components/LectieBadge";
import { exercitiiPracticeLiberAccesibile } from "@/lib/acces";

export const metadata: Metadata = {
  title: "Exerciții Practice",
  description: "Exerciții interactive de programare Python pe module școlare, pentru gimnaziu și liceu.",
  alternates: { canonical: "/exercitii" },
};

export default function ExercitiiCatalogPage() {
  return (
    <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6">
      <div className="border-b border-black/5 pb-6">
        <h1 className="text-3xl font-extrabold text-foreground sm:text-4xl">Exerciții practice</h1>
        <p className="mt-2 text-foreground/70 text-sm">
          Aici poți exersa programarea Python direct în browser. Rezolvă probleme structurate pe module școlare. 
          Sunt fără abonament exercițiile modulelor gratuite și ale primelor 5 module din clasa a IX-a; restul necesită abonament.
        </p>
      </div>

      <div className="mt-10 space-y-12">
        {capitole.map((capitol) => (
          <section key={capitol.clasa} className="border-b border-black/5 pb-10 last:border-0 last:pb-0">
            <h2 className="flex items-center gap-3 text-2xl font-bold text-foreground">
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand text-base font-extrabold text-white">
                {esteCapitolCopii(capitol.clasa) ? capitol.clasa.slice(1) : capitol.clasa}
              </span>
              {numeClasa(capitol.clasa)}
            </h2>
            <p className="text-xs text-foreground/70 mt-1 font-semibold uppercase tracking-wider">
              Exerciții pentru {capitol.titlu}
            </p>

            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              {capitol.module.map((modul) => {
                return (
                  <div key={modul.cod}>
                    <Link
                      href={`/exercitii/${capitol.clasa}/${modul.slug}`}
                      className="flex items-start justify-between gap-4 rounded-2xl border border-black/10 bg-white p-4 shadow-sm transition hover:-translate-y-0.5 hover:border-brand hover:shadow-md h-full group"
                    >
                      <div className="min-w-0">
                        <span className="text-[11px] font-bold text-brand-dark uppercase tracking-wider">
                          Modulul {modul.cod}
                        </span>
                        <h3 className="mt-1 font-bold text-foreground text-sm leading-snug group-hover:text-brand transition">
                          {modul.titlu}
                        </h3>
                        <p className="mt-1 text-xs text-foreground/50">
                          Doar exerciții ghidate și independente
                        </p>
                      </div>
                      <div className="shrink-0">
                        <LectieBadge nivel={exercitiiPracticeLiberAccesibile(modul, capitol.clasa) ? (modul.gratuit ? "gratuit" : "deschis") : "abonament"} />
                      </div>
                    </Link>
                  </div>
                );
              })}
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}
