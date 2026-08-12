import Link from "next/link";
import type { UnitateDrum } from "@/lib/progres";

/**
 * Drumul de învățare ca pași orizontali (unități), fiecare cu titlu, descriere,
 * bară de progres și stare — layout-ul din specificația de UI.
 */
export default function PasiDrum({ unitati }: { unitati: UnitateDrum[] }) {
  if (!unitati.length) {
    return (
      <p className="rounded-2xl border border-border bg-white p-6 text-sm text-muted">
        Nu există încă lecții publicate pentru această clasă.
      </p>
    );
  }

  return (
    <ol className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
      {unitati.map((u, idx) => {
        const finalizat = u.procentFinalizat === 100;
        const inCurs = u.procentFinalizat > 0 && !finalizat;
        const blocat = u.procentFinalizat === 0 && idx > 0 && unitati[idx - 1].procentFinalizat < 100;

        const stare = finalizat
          ? { text: "✅ Finalizat", culoare: "text-success", bara: "bg-success" }
          : inCurs
            ? { text: "🟡 În curs", culoare: "text-warning", bara: "bg-warning" }
            : blocat
              ? { text: "🔒 Blocat", culoare: "text-locked", bara: "bg-locked" }
              : { text: "▶️ Disponibil", culoare: "text-brand", bara: "bg-brand" };

        // Titlul scurt al unității: taie prefixul de tip „IX-U1 ”.
        const titluScurt = u.unitate.replace(/^[IVX]+-U\d+\s*/, "");
        const primaLectie = u.noduri[0];

        return (
          <li
            key={u.unitate_slug}
            className="rounded-2xl border border-border bg-white p-4 shadow-sm transition hover:shadow-md"
          >
            <p className="text-sm font-bold text-foreground">
              {idx + 1}. {titluScurt}
            </p>
            <p className="mt-1 line-clamp-2 text-xs text-muted">
              {u.noduri.length} {u.noduri.length === 1 ? "lecție" : "lecții"}
            </p>

            <div
              className="mt-3 h-2 w-full overflow-hidden rounded-full bg-surface"
              role="progressbar"
              aria-valuenow={u.procentFinalizat}
              aria-valuemin={0}
              aria-valuemax={100}
              aria-label={`Progres ${titluScurt}`}
            >
              <div
                className={`h-full rounded-full transition-all ${stare.bara}`}
                style={{ width: `${u.procentFinalizat}%` }}
              />
            </div>

            <p className={`mt-2 text-xs font-semibold ${stare.culoare}`}>
              {stare.text} · {u.procentFinalizat}%
            </p>

            {!blocat && primaLectie && (
              <Link
                href={primaLectie.href}
                className="mt-2 inline-flex text-xs font-semibold text-brand hover:text-brand-dark"
              >
                Deschide →
              </Link>
            )}
          </li>
        );
      })}
    </ol>
  );
}
