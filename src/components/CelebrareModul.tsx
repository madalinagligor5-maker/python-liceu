"use client";

import { useEffect, useState } from "react";
import Mascota from "@/components/Mascota";
import IconXp from "@/components/icons/IconXp";

export default function CelebrareModul({
  xp = 20,
  titlu = "Modul finalizat cu succes!",
  peInchidere,
}: {
  xp?: number;
  titlu?: string;
  peInchidere?: () => void;
}) {
  const [vizibil, setVizibil] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setVizibil(false);
      if (peInchidere) peInchidere();
    }, 2800);
    return () => clearTimeout(timer);
  }, [peInchidere]);

  if (!vizibil) return null;

  return (
    <div
      onClick={() => {
        setVizibil(false);
        if (peInchidere) peInchidere();
      }}
      className="fixed bottom-6 right-6 z-[99999] cursor-pointer animate-popIn"
    >
      <div className="flex items-center gap-4 rounded-2xl border border-amber-400 bg-white p-4 shadow-2xl animate-celebrateBurst text-slate-900">
        <Mascota size={56} eticheta="Mascotă fericită" />
        <div>
          <div className="flex items-center gap-1.5 font-black text-xs text-blue-600 uppercase tracking-wider">
            <IconXp className="w-4 h-4 text-blue-500" />
            <span>+{xp} XP Câștigați!</span>
          </div>
          <p className="text-sm font-extrabold text-slate-950 mt-0.5">{titlu}</p>
          <p className="text-[11px] text-slate-500 font-medium">Click pentru a închide</p>
        </div>
      </div>
    </div>
  );
}
