import Link from "next/link";
import { capitole } from "@/lib/curriculum";

export const metadata = { title: "Fișe de lucru — Academia Python" };

const CLASE_LICEU = ["IX", "X", "XI", "XII"];

export default function FisePage() {
  const capitoleLiceu = capitole.filter((c) => CLASE_LICEU.includes(c.clasa));

  return (
    <div>
      <h1 className="text-xl font-bold text-foreground">Fișe de lucru printabile</h1>
      <p className="mt-1 text-sm text-foreground/60">
        Alege un modul — fișa folosește exercițiile deja existente pe platformă, cu opțiunea de
        a arăta sau ascunde baremul.
      </p>

      <div className="mt-6 space-y-8">
        {capitoleLiceu.map((c) => (
          <div key={c.clasa}>
            <h2 className="text-sm font-bold uppercase tracking-wide text-foreground/50">
              Clasa a {c.clasa}-a
            </h2>
            <div className="mt-2 grid gap-2 sm:grid-cols-2 md:grid-cols-3">
              {c.module.map((m) => (
                <Link
                  key={m.slug}
                  href={`/profesor/fise/${c.clasa}/${m.slug}`}
                  className="rounded-xl border border-black/10 bg-white px-4 py-3 text-sm font-semibold text-foreground transition hover:border-brand hover:text-brand"
                >
                  {m.cod} {m.titlu}
                </Link>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
