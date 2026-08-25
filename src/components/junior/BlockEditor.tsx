"use client";
import type { TipBloc, BlocComanda } from "@/lib/junior/tipuri";
import { useCallback, useState } from "react";

// ─── Definiție vizuală bloc ───────────────────────────────
type DefBloc = {
  tip: TipBloc;
  eticheta: string;
  icon: string;
  culoare: string;
  descriere: string;
};

const BLOCURI_DISPONIBILE: DefBloc[] = [
  {
    tip: "merge_inainte",
    eticheta: "Mergi înainte",
    icon: "⬆️",
    culoare: "bg-emerald-500 hover:bg-emerald-600 border-emerald-700",
    descriere: "Byte merge un pas înainte",
  },
  {
    tip: "intoarce_stanga",
    eticheta: "Întoarce stânga",
    icon: "⬅️",
    culoare: "bg-sky-500 hover:bg-sky-600 border-sky-700",
    descriere: "Byte se întoarce spre stânga",
  },
  {
    tip: "intoarce_dreapta",
    eticheta: "Întoarce dreapta",
    icon: "➡️",
    culoare: "bg-violet-500 hover:bg-violet-600 border-violet-700",
    descriere: "Byte se întoarce spre dreapta",
  },
  {
    tip: "repeta",
    eticheta: "Repetă de ___ ori",
    icon: "🔁",
    culoare: "bg-amber-500 hover:bg-amber-600 border-amber-700",
    descriere: "Repetă comenzile din interior",
  },
  {
    tip: "daca_stea",
    eticheta: "Dacă văd steluță",
    icon: "⭐",
    culoare: "bg-rose-500 hover:bg-rose-600 border-rose-700",
    descriere: "Execută dacă Byte vede o steluță",
  },
];

type BlocUI = {
  id: string;
  tip: TipBloc;
  deOri?: number;
  subBlocuri?: BlocUI[];
  subBlocuriAltfel?: BlocUI[];
};

function uiBlocToComanda(b: BlocUI): BlocComanda {
  if (b.tip === "repeta") {
    return {
      tip: "repeta",
      deOri: b.deOri ?? 2,
      comenzi: (b.subBlocuri ?? []).map(uiBlocToComanda),
    };
  }
  if (b.tip === "daca_stea") {
    return {
      tip: "daca_stea",
      atunci: (b.subBlocuri ?? []).map(uiBlocToComanda),
      altfel: (b.subBlocuriAltfel ?? []).map(uiBlocToComanda),
    };
  }
  return { tip: b.tip } as BlocComanda;
}

type Props = {
  blocuriPermise: TipBloc[];
  onChange: (comenzi: BlocComanda[]) => void;
  disabled?: boolean;
  pasActivIndex?: number | null; // Pasul curent activat în timpul rulării (0-indexed)
};

let nextId = 1;
function genId() {
  return `b${nextId++}`;
}

function BlocVizual({
  bloc,
  onRemove,
  onUpdate,
  disabled,
  indent = 0,
  esteActiv = false,
}: {
  bloc: BlocUI;
  onRemove: () => void;
  onUpdate: (updated: BlocUI) => void;
  disabled?: boolean;
  indent?: number;
  esteActiv?: boolean;
}) {
  const def = BLOCURI_DISPONIBILE.find((d) => d.tip === bloc.tip)!;

  const addSub = () => {
    onUpdate({
      ...bloc,
      subBlocuri: [
        ...(bloc.subBlocuri ?? []),
        { id: genId(), tip: "merge_inainte" },
      ],
    });
  };

  const handleDeOriChange = (valStr: string) => {
    const num = parseInt(valStr, 10);
    onUpdate({ ...bloc, deOri: isNaN(num) ? 2 : Math.max(1, num) });
  };

  return (
    <div className="relative group">
      {/* Puzzle connector notch top (zimț conectare puzzle) */}
      {indent === 0 && (
        <div className="flex justify-start pl-8 -mb-1 relative z-10">
          <div className="h-2 w-7 rounded-t-md bg-white/30 border-t-2 border-x-2 border-white/50" />
        </div>
      )}

      <div
        role="button"
        tabIndex={disabled ? -1 : 0}
        onClick={() => !disabled && onRemove()}
        onKeyDown={(e) => {
          if (disabled) return;
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            onRemove();
          }
        }}
        title={disabled ? "" : "Apasă ca să ștergi blocul"}
        className={`
          relative rounded-2xl border-2 border-b-4 text-white font-bold text-sm select-none shadow-md transition-all cursor-pointer
          ${esteActiv ? "ring-4 ring-amber-400 scale-105 z-30 bg-amber-500 animate-pulse border-amber-600" : def.culoare}
        `}
        style={{ marginLeft: indent * 16 }}
      >
        <div className="flex items-center gap-2 px-3.5 py-2.5">
          <span className="text-xl drop-shadow">{def.icon}</span>
          <span className="flex-1 font-black text-base">{def.eticheta}</span>

          {bloc.tip === "repeta" && (
            // eslint-disable-next-line jsx-a11y/click-events-have-key-events -- oprește doar propagarea click-ului spre blocul părinte (ștergere), nu are acțiune proprie de tastatură
            <div
              className="flex items-center gap-1 bg-black/20 rounded-xl px-2 py-1"
              onClick={(e) => e.stopPropagation()}
            >
              <span className="text-xs">de</span>
              <input
                type="number"
                min={1}
                max={10}
                value={bloc.deOri ?? 2}
                disabled={disabled}
                onChange={(e) => handleDeOriChange(e.target.value)}
                className="w-10 rounded-lg bg-white text-center text-slate-900 font-black text-base focus:outline-none"
              />
              <span className="text-xs">ori</span>
            </div>
          )}

          {!disabled && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onRemove();
              }}
              className="ml-1 rounded-full bg-white/20 hover:bg-white/40 h-6 w-6 flex items-center justify-center text-xs font-bold"
              title="Șterge blocul"
            >
              ✕
            </button>
          )}
        </div>

        {/* Sub-blocuri (pentru repeta / daca) */}
        {(bloc.tip === "repeta" || bloc.tip === "daca_stea") && (
          // eslint-disable-next-line jsx-a11y/click-events-have-key-events -- oprește doar propagarea click-ului spre blocul părinte (ștergere), nu are acțiune proprie de tastatură
          <div
            className="mx-2 mb-2 rounded-lg bg-white/10 p-2 space-y-1 min-h-[40px]"
            onClick={(e) => e.stopPropagation()}
          >
            {(bloc.subBlocuri ?? []).map((sub, i) => (
              <BlocVizual
                key={sub.id}
                bloc={sub}
                disabled={disabled}
                indent={0}
                onRemove={() => {
                  const newSubs = [...(bloc.subBlocuri ?? [])];
                  newSubs.splice(i, 1);
                  onUpdate({ ...bloc, subBlocuri: newSubs });
                }}
                onUpdate={(updated) => {
                  const newSubs = [...(bloc.subBlocuri ?? [])];
                  newSubs[i] = updated;
                  onUpdate({ ...bloc, subBlocuri: newSubs });
                }}
              />
            ))}
            {!disabled && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  addSub();
                }}
                className="w-full rounded-lg border-2 border-dashed border-white/40 py-1 text-xs text-white/70 hover:border-white/70 hover:text-white font-bold"
              >
                + adaugă comandă
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default function BlockEditor({ blocuriPermise, onChange, disabled, pasActivIndex }: Props) {
  const [program, setProgram] = useState<BlocUI[]>([]);

  const permise = BLOCURI_DISPONIBILE.filter((b) =>
    blocuriPermise.includes(b.tip)
  );

  const adaugaBloc = useCallback(
    (tip: TipBloc) => {
      if (disabled) return;
      const nou: BlocUI = { id: genId(), tip, deOri: 2, subBlocuri: [] };
      const updated = [...program, nou];
      setProgram(updated);
      onChange(updated.map(uiBlocToComanda));
    },
    [program, onChange, disabled]
  );

  const updateProgram = useCallback(
    (updated: BlocUI[]) => {
      setProgram(updated);
      onChange(updated.map(uiBlocToComanda));
    },
    [onChange]
  );

  const stergeBloc = (index: number) => {
    const updated = program.filter((_, i) => i !== index);
    updateProgram(updated);
  };

  const stergeUltimulBloc = () => {
    if (program.length === 0) return;
    const updated = program.slice(0, -1);
    updateProgram(updated);
  };

  const updateBloc = (index: number, updated: BlocUI) => {
    const newProg = [...program];
    newProg[index] = updated;
    updateProgram(newProg);
  };

  const golesteProgramul = () => updateProgram([]);

  return (
    <div className="flex flex-col gap-3 h-full">
      {/* Toolbox — blocuri disponibile */}
      <div className="rounded-2xl bg-slate-100 border border-slate-200 p-3">
        <p className="text-xs font-bold text-slate-500 mb-2 uppercase tracking-wide">
          📦 Blocuri disponibile — apasă ca să adaugi
        </p>
        <div className="flex flex-wrap gap-2">
          {permise.map((b) => (
            <button
              key={b.tip}
              onClick={() => adaugaBloc(b.tip)}
              disabled={disabled}
              title={b.descriere}
              className={`
                flex items-center gap-1.5 rounded-xl border-2 border-b-4 px-3 py-2
                text-white text-sm font-bold cursor-pointer active:scale-95
                transition-transform disabled:opacity-50 ${b.culoare}
              `}
            >
              <span className="text-lg">{b.icon}</span>
              <span className="hidden sm:inline">{b.eticheta}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Program area */}
      <div className="flex-1 rounded-2xl bg-indigo-50 border-2 border-indigo-200 p-3 overflow-y-auto min-h-[200px]">
        <div className="flex items-center justify-between mb-2 flex-wrap gap-2">
          <p className="text-xs font-bold text-indigo-600 uppercase tracking-wide">
            🧩 Programul tău ({program.length} pas{program.length !== 1 ? "i" : ""})
          </p>
          {program.length > 0 && !disabled && (
            <div className="flex items-center gap-3">
              <button
                onClick={stergeUltimulBloc}
                className="text-xs text-indigo-700 hover:text-indigo-900 font-bold flex items-center gap-1 bg-indigo-100 px-2 py-0.5 rounded-lg border border-indigo-200"
                title="Șterge ultimul pas adăugat"
              >
                ↩️ Undo
              </button>
              <button
                onClick={golesteProgramul}
                className="text-xs text-red-500 hover:text-red-700 font-semibold"
              >
                🗑️ Șterge tot
              </button>
            </div>
          )}
        </div>

        {program.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-32 text-slate-400">
            <span className="text-4xl">👆</span>
            <p className="text-sm mt-2">Apasă un bloc de sus ca să-l adaugi!</p>
          </div>
        ) : (
          <div className="space-y-2">
            {program.map((bloc, i) => (
              <BlocVizual
                key={bloc.id}
                bloc={bloc}
                disabled={disabled}
                esteActiv={pasActivIndex === i}
                onRemove={() => stergeBloc(i)}
                onUpdate={(updated) => updateBloc(i, updated)}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
