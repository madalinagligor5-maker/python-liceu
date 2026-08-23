import Link from "next/link";
import type { Metadata } from "next";
import { capitole, hrefModul } from "@/lib/curriculum";
import LectieBadge from "@/components/LectieBadge";

export const metadata: Metadata = {
  title: "Catalog de lecții — Academia Python",
  description: "Toate cele 88 de module de Python pentru liceu, organizate pe clase și unități de învățare.",
};

export default function LectiiPage() {
  return (
    <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6">
      <div className="border-b border-black/5 pb-6">
        <h1 className="text-3xl font-extrabold text-foreground sm:text-4xl">Catalog de lecții</h1>
        <p className="mt-2 text-foreground/70 text-sm">
          Aici găsești programa completă de Informatică (Python) structurată pe module de învățare. 
          Primele 3 module din clasa a IX-a sunt complet gratuite, iar următoarele 2 sunt deschise pentru explorare. 
          Restul necesită cont și abonament activ.
        </p>
      </div>

      <div className="mt-10 space-y-12">
        {capitole.map((capitol) => (
          <section key={capitol.clasa} className="border-b border-black/5 pb-10 last:border-0 last:pb-0">
            <h2 className="flex items-center gap-3 text-2xl font-bold text-foreground">
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand text-base font-extrabold text-white">
                {capitol.clasa}
              </span>
              Clasa a {capitol.clasa}-a
            </h2>
            <p className="text-xs text-foreground/50 mt-1 font-semibold uppercase tracking-wider">
              {capitol.titlu}
            </p>

            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              {capitol.module.map((modul) => {
                const esteGratuit = modul.gratuit || (capitol.clasa === "IX" && modul.numar <= 5);
                return (
                  <div key={modul.cod}>
                    <Link
                      href={hrefModul(modul)}
                      className="flex items-start justify-between gap-4 rounded-2xl border border-black/10 bg-white p-4 shadow-sm transition hover:-translate-y-0.5 hover:border-brand hover:shadow-md h-full group"
                    >
                      <div className="min-w-0">
                        <span className="text-[10px] font-bold text-brand uppercase tracking-wider">
                          Modulul {modul.cod}
                        </span>
                        <h3 className="mt-1 font-bold text-foreground text-sm leading-snug group-hover:text-brand transition">
                          {modul.titlu}
                        </h3>
                        <p className="mt-1 text-xs text-foreground/50">
                          Conține 6 sub-lecții de studiu practic
                        </p>
                      </div>
                      <div className="shrink-0">
                        <LectieBadge gratuit={esteGratuit} />
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
