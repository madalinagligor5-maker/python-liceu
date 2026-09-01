import Link from "next/link";
import { getToateMaterialele } from "@/lib/materialeProfesori";

export const metadata = { title: "Materiale — Academia Python" };

export default async function MaterialeProfesorPage() {
  const materiale = await getToateMaterialele();

  return (
    <div>
      <h1 className="text-xl font-bold text-foreground">Materiale</h1>
      <p className="mt-1 text-sm text-foreground/60">
        Resurse suplimentare pentru profesori. Lista crește constant — urmează în curând materiale
        pentru mai multe module.
      </p>

      {materiale.length === 0 ? (
        <p className="mt-6 text-sm text-foreground/50">Niciun material disponibil momentan.</p>
      ) : (
        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          {materiale.map((m) => (
            <div key={m.slug} className="rounded-2xl border border-black/10 bg-white p-5">
              {m.ciorna && (
                <span className="mb-2 inline-block rounded-full bg-amber-50 px-2.5 py-0.5 text-[11px] font-bold text-amber-700">
                  Ciornă
                </span>
              )}
              <h2 className="font-bold text-foreground">{m.titlu}</h2>
              <p className="mt-1 text-sm text-foreground/60">{m.descriere}</p>
              {m.tip === "link" ? (
                <a
                  href={m.href}
                  className="mt-3 inline-block rounded-full bg-amber-400 hover:bg-amber-500 text-slate-950 font-black px-4 py-2 text-xs transition shadow-sm"
                >
                  📄 Descarcă
                </a>
              ) : (
                <Link
                  href={`/profesor/materiale/${m.slug}`}
                  className="mt-3 inline-block rounded-full border border-brand-border bg-white px-4 py-2 text-xs font-bold text-brand transition hover:bg-brand-light/40"
                >
                  Citește →
                </Link>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
