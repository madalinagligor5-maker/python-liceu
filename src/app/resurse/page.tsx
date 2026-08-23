import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Resurse PDF pe Clase — Academia Python",
  description: "Selectează clasa pentru a descărca fișe de lucru PDF gratuite.",
};

export default function ResurseCatalogPage() {
  const clase = [
    { clasa: "IX", titlu: "Clasa a IX-a", desc: "Bazele algoritmilor și programare în Python" },
    { clasa: "X", titlu: "Clasa a X-a", desc: "Căutare, sortare și structuri de date" },
    { clasa: "XI", titlu: "Clasa a XI-a", desc: "Programare Orientată pe Obiecte (OOP)" },
    { clasa: "XII", titlu: "Clasa a XII-a", desc: "Baze de date și Machine Learning" },
  ];

  return (
    <div className="mx-auto max-w-4xl px-4 py-16 sm:px-6">
      <div className="border-b border-black/5 pb-6 text-center">
        <h1 className="text-3xl font-extrabold text-foreground sm:text-4xl">Fișe de lucru PDF</h1>
        <p className="mt-2 text-foreground/70 text-sm max-w-md mx-auto">
          Alege clasa pentru a accesa și descărca fișele de studiu și exerciții gratuite în format PDF.
        </p>
      </div>

      <div className="mt-12 grid gap-6 sm:grid-cols-2">
        {clase.map((c) => (
          <Link
            key={c.clasa}
            href={`/resurse/${c.clasa}`}
            className="flex flex-col justify-between rounded-3xl border border-black/10 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:border-brand hover:shadow-md h-full group"
          >
            <div>
              <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-brand text-base font-extrabold text-white">
                {c.clasa}
              </span>
              <h2 className="mt-4 text-xl font-bold text-foreground group-hover:text-brand transition">
                {c.titlu}
              </h2>
              <p className="mt-2 text-sm text-foreground/60 leading-relaxed">
                {c.desc}
              </p>
            </div>
            <div className="mt-6 flex items-center justify-end text-sm font-semibold text-brand">
              Deschide clasa →
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
