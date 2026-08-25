import Link from "next/link";
import type { UnitateDrum } from "@/lib/progres";
import IconLectieFinalizata from "@/components/icons/IconLectieFinalizata";
import IconLectieBlocata from "@/components/icons/IconLectieBlocata";
import IconTrofeu from "@/components/icons/IconTrofeu";

const STIL_NOD = {
  finalizat: {
    cerc: "bg-emerald-500 text-white border-emerald-600 shadow-emerald-200",
    text: "text-slate-900 font-bold",
  },
  curent: {
    cerc: "bg-white text-amber-500 border-amber-400 ring-4 ring-amber-400/20 shadow-lg scale-110",
    text: "text-amber-600 font-black",
  },
  blocat: {
    cerc: "bg-slate-100 text-slate-400 border-slate-300",
    text: "text-slate-400 font-medium",
  },
} as const;

export default function DrumInvatare({
  unitati,
  clasa,
}: {
  unitati: UnitateDrum[];
  clasa: string;
}) {
  if (!unitati.length) {
    return (
      <p className="rounded-2xl border border-black/5 bg-white p-6 text-sm text-slate-500">
        Nu există încă lecții publicate pentru clasa {clasa}.
      </p>
    );
  }

  return (
    <div className="space-y-12">
      {unitati.map((u, idxUnitate) => (
        <section key={u.unitate_slug} className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
            <h3 className="text-sm font-black uppercase tracking-wider text-slate-700">
              Unitatea {idxUnitate + 1} · {u.unitate}
            </h3>
            <span className="text-xs font-bold text-emerald-600 bg-emerald-50 border border-emerald-200 px-3 py-1 rounded-full">
              {u.procentFinalizat}% finalizat
            </span>
          </div>

          <div
            className="h-2 w-full overflow-hidden rounded-full bg-slate-100 mb-8"
            role="progressbar"
            aria-valuenow={u.procentFinalizat}
            aria-valuemin={0}
            aria-valuemax={100}
            aria-label={`Progres unitatea ${u.unitate}`}
          >
            <div
              className="h-full rounded-full bg-emerald-500 transition-all duration-500"
              style={{ width: `${u.procentFinalizat}%` }}
            />
          </div>

          {/* Harta Șerpuită (Winding Path) */}
          <div className="relative py-4">
            <ol className="relative z-10 flex flex-col gap-8 md:grid md:grid-cols-2 md:gap-y-12">
              {u.noduri.map((nod, idx) => {
                const esteCheckpoint = (idx + 1) % 5 === 0;
                const esteDreapta = idx % 2 === 1;
                const stil = STIL_NOD[nod.stare];
                const eticheta =
                  nod.stare === "finalizat"
                    ? "finalizată"
                    : nod.stare === "curent"
                      ? "lecția curentă"
                      : "nu a fost deblocată încă";

                const cerc = (
                  <div className="relative">
                    <span
                      className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl border-2 text-base font-black shadow-md transition-all duration-300 ${stil.cerc}`}
                      aria-hidden="true"
                    >
                      {nod.stare === "finalizat" ? (
                        <IconLectieFinalizata className="w-6 h-6 text-white" />
                      ) : nod.stare === "blocat" ? (
                        <IconLectieBlocata className="w-5 h-5 text-slate-400" />
                      ) : (
                        idx + 1
                      )}
                    </span>
                    {esteCheckpoint && (
                      <span
                        aria-label="Checkpoint Reper"
                        className="absolute -top-2 -right-2 flex h-6 w-6 items-center justify-center rounded-full bg-amber-400 text-slate-950 text-xs font-black shadow-sm border border-amber-500"
                      >
                        <IconTrofeu className="w-3.5 h-3.5" />
                      </span>
                    )}
                  </div>
                );

                return (
                  <li
                    key={nod.lectie.lectie_slug}
                    className={`flex items-center gap-4 ${
                      esteDreapta ? "md:flex-row-reverse md:text-right" : "md:flex-row"
                    }`}
                  >
                    {nod.stare === "blocat" ? (
                      cerc
                    ) : (
                      <Link
                        href={nod.href}
                        className="rounded-2xl focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-500 active:scale-95 transition"
                        aria-label={`${nod.lectie.lectie} — ${eticheta}`}
                      >
                        {cerc}
                      </Link>
                    )}

                    <div className="flex-1">
                      {esteCheckpoint && (
                        <span className="text-[10px] font-black uppercase tracking-wider text-amber-600 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded-md inline-block mb-1">
                          ★ Reper de Progres
                        </span>
                      )}
                      <span className={`block text-xs sm:text-sm leading-snug ${stil.text}`}>
                        {nod.lectie.lectie}
                        <span className="sr-only"> — {eticheta}</span>
                      </span>
                    </div>
                  </li>
                );
              })}
            </ol>
          </div>
        </section>
      ))}
    </div>
  );
}
