import Link from "next/link";
import type { Metadata } from "next";
import { capitole } from "@/lib/curriculum";

export const metadata: Metadata = {
  title: "Resurse & Fișe de Lucru Teoretice — Academia Python",
  description: "Fișe de lucru gratuite, sinteze teoretice și exemple rezolvate pe module școlare pentru elevii de liceu.",
};

export default function ResurseCatalogPage() {
  return (
    <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6">
      <div className="border-b border-black/5 pb-6">
        <h1 className="text-3xl font-extrabold text-foreground sm:text-4xl">Fișe de lucru & Teorie</h1>
        <p className="mt-2 text-foreground/70 text-sm">
          Aici găsești rezumate teoretice, explicații pas cu pas și sinteze gata de printat pentru orele de informatică. 
          Toate resursele sunt **gratuite** și acoperă programa oficială de liceu. Selectează un modul pentru a deschide fișa de studiu!
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
              Fișe de lucru pentru {capitol.titlu}
            </p>

            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              {capitol.module.map((modul) => (
                <div key={modul.cod}>
                  <Link
                    href={`/resurse/${capitol.clasa}/${modul.slug}`}
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
                        Fișă teoretică de studiu completă
                      </p>
                    </div>
                    <div className="shrink-0">
                      <span className="inline-flex items-center rounded-full bg-success/10 px-2.5 py-1 text-xs font-semibold text-success">
                        Gratuit
                      </span>
                    </div>
                  </Link>
                </div>
              ))}
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}
