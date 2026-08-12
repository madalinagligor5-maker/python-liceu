import Link from "next/link";
import type { Metadata } from "next";
import { getLectiiGrupate } from "@/lib/content";
import LectieBadge from "@/components/LectieBadge";

export const metadata: Metadata = {
  title: "Catalog de lecții — Academia Python",
  description: "Toate lecțiile de Python pentru liceu, organizate pe clase și unități de învățare.",
};

export default function LectiiPage() {
  const grupate = getLectiiGrupate();

  return (
    <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6">
      <h1 className="text-3xl font-extrabold text-foreground">Catalog de lecții</h1>
      <p className="mt-2 text-foreground/70">
        Lecțiile marcate <span className="font-semibold text-success">Gratuit</span> pot fi
        parcurse fără cont. Restul necesită cont și abonament activ.
      </p>

      <div className="mt-10 space-y-12">
        {grupate.map((grup) => (
          <section key={grup.clasa}>
            <h2 className="flex items-center gap-3 text-xl font-bold text-foreground">
              <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-brand text-sm font-bold text-white">
                {grup.clasa}
              </span>
              Clasa {grup.clasa}
            </h2>

            <div className="mt-4 space-y-6">
              {grup.unitati.map((unitate) => (
                <div key={unitate.unitate_slug}>
                  <h3 className="text-sm font-semibold uppercase tracking-wide text-foreground/50">
                    {unitate.unitate}
                  </h3>
                  <ul className="mt-3 grid gap-3 sm:grid-cols-2">
                    {unitate.lectii.map((lectie) => (
                      <li key={lectie.lectie_slug}>
                        <Link
                          href={`/lectii/${grup.clasa}/${unitate.unitate_slug}/${lectie.lectie_slug}`}
                          className="flex items-start justify-between gap-3 rounded-xl border border-black/10 bg-white p-4 shadow-sm transition hover:-translate-y-0.5 hover:border-brand hover:shadow-md"
                        >
                          <span className="font-medium text-foreground">{lectie.lectie}</span>
                          <LectieBadge gratuit={lectie.gratuit} />
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}
