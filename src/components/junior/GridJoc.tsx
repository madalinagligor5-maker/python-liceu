"use client";
import type { CelulaGrila, DirectieByte, StareJoc } from "@/lib/junior/tipuri";

const EMOJI_BYTE: Record<DirectieByte, string> = {
  N: "🤖⬆️",
  S: "🤖⬇️",
  E: "🤖➡️",
  V: "🤖⬅️",
};

const CELULA_STIL: Record<CelulaGrila, string> = {
  liber: "bg-sky-50 border-sky-100",
  perete: "bg-slate-700 border-slate-800",
  start: "bg-emerald-100 border-emerald-200",
  tinta: "bg-amber-100 border-amber-200",
  stea_bonus: "bg-yellow-50 border-yellow-200",
};

type Props = {
  grila: CelulaGrila[][];
  stare: StareJoc;
  animand: boolean;
};

export default function GridJoc({ grila, stare, animand }: Props) {
  const randuri = grila.length;
  const coloane = grila[0]?.length ?? 1;
  // Dimensiune celulă: adaptivă la grilă
  const dimCelula = Math.min(64, Math.floor(400 / Math.max(randuri, coloane)));

  return (
    <div
      className="inline-grid gap-0.5 rounded-2xl border-2 border-slate-300 bg-slate-200 p-2 shadow-lg"
      style={{
        gridTemplateColumns: `repeat(${coloane}, ${dimCelula}px)`,
        gridTemplateRows: `repeat(${randuri}, ${dimCelula}px)`,
      }}
    >
      {grila.map((rand, y) =>
        rand.map((celula, x) => {
          const esteAici = stare.x === x && stare.y === y;
          const esteStart = celula === "start";
          const esteTinta = celula === "tinta";
          const esteSteaBonus = celula === "stea_bonus";

          return (
            <div
              key={`${y}-${x}`}
              style={{ width: dimCelula, height: dimCelula }}
              className={`
                relative flex items-center justify-center rounded border text-base select-none
                ${CELULA_STIL[celula]}
                ${esteAici && animand ? "scale-110 z-10" : ""}
                transition-all duration-150
              `}
            >
              {/* Marcaj start */}
              {esteStart && !esteAici && (
                <span className="text-xs font-bold text-emerald-600 opacity-70">S</span>
              )}

              {/* Steluță bonus */}
              {esteSteaBonus && !esteAici && (
                <span
                  className="text-xl"
                  style={{ animation: "pulse 1.5s infinite" }}
                >
                  ⭐
                </span>
              )}

              {/* Țintă */}
              {esteTinta && !esteAici && (
                <span
                  className="text-2xl"
                  style={{ animation: "bounce 1s infinite" }}
                >
                  🏁
                </span>
              )}

              {/* Byte (robotul) + Indicator de direcție clar pentru copii */}
              {esteAici && (
                <div
                  className={`relative flex items-center justify-center z-20 ${
                    animand ? "animate-bounce scale-110" : ""
                  }`}
                >
                  <span className="text-2xl" role="img" aria-label="Byte robotul">
                    {stare.esuat ? "😵" : stare.completat ? "🎉" : "🤖"}
                  </span>
                  {/* Săgeată indicator de direcție stilizat */}
                  {!stare.esuat && !stare.completat && (
                    <span
                      className={`
                        absolute -top-2 -right-2 flex h-6 w-6 items-center justify-center
                        rounded-full bg-amber-400 text-slate-900 text-xs font-black shadow-md
                        border-2 border-white ring-2 ring-indigo-500 animate-pulse
                      `}
                      title={`Orientat spre ${stare.directie === "N" ? "Nord (Sus)" : stare.directie === "E" ? "Est (Dreapta)" : stare.directie === "S" ? "Sud (Jos)" : "Vest (Stânga)"}`}
                    >
                      {stare.directie === "N" ? "⬆️" : stare.directie === "E" ? "➡️" : stare.directie === "S" ? "⬇️" : "⬅️"}
                    </span>
                  )}
                </div>
              )}
            </div>
          );
        })
      )}
    </div>
  );
}
