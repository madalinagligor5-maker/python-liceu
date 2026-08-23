import Link from "next/link";
import type { Metadata } from "next";
import { capitole } from "@/lib/curriculum";

export const metadata: Metadata = {
  title: "Fise de lucru PDF Gratuite — Academia Python",
  description: "Descarcă fișe de lucru PDF gratuite și sinteze de teorie pentru orele de informatică de liceu.",
};

export default function ResurseCatalogPage() {
  return (
    <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6">
      <div className="border-b border-black/5 pb-6">
        <h1 className="text-3xl font-extrabold text-foreground sm:text-4xl">Fișe de lucru PDF</h1>
        <p className="mt-2 text-foreground/70 text-sm">
          Aici găsești rezumate teoretice și exemple de cod gata de salvat ca PDF sau de printat. 
          Toate resursele sunt **gratuite**. Apasă pe butonul de descărcare din dreptul fiecărui modul!
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
              Fișe PDF gratuite pentru {capitol.titlu}
            </p>

            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              {capitol.module.map((modul) => (
                <div key={modul.cod}>
                  <Link
                    href={`/resurse/${capitol.clasa}/${modul.slug}`}
                    target="_blank"
                    className="flex items-center justify-between gap-4 rounded-2xl border border-black/10 bg-white p-4 shadow-sm transition hover:-translate-y-0.5 hover:border-brand hover:shadow-md h-full group"
                  >
                    <div className="min-w-0">
                      <span className="text-[10px] font-bold text-brand uppercase tracking-wider">
                        Modulul {modul.cod}
                      </span>
                      <h3 className="mt-1 font-bold text-foreground text-sm leading-snug group-hover:text-brand transition">
                        {modul.titlu}
                      </h3>
                      <p className="mt-1 text-xs text-foreground/50">
                        Fișă PDF completă
                      </p>
                    </div>
                    <div className="shrink-0">
                      <span className="inline-flex items-center gap-1.5 rounded-xl bg-success px-3 py-2 text-xs font-bold text-white shadow-sm transition hover:bg-success-dark">
                        📥 Descarcă PDF
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
