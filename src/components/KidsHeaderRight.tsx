"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { getProfilElev, totalStele } from "@/lib/junior/progres";

export default function KidsHeaderRight() {
  const [nume, setNume] = useState<string | null>(null);
  const [stele, setStele] = useState(0);

  useEffect(() => {
    const p = getProfilElev();
    if (p) {
      setNume(p.nume);
    }
    setStele(totalStele());
  }, []);

  return (
    <div className="flex items-center gap-2">
      {/* Contor Stele Kids */}
      <span
        className="flex items-center gap-1 rounded-full bg-amber-100 border border-amber-300 px-3 py-1 text-xs font-black text-amber-950 shadow-sm"
        title={`${stele} stele adunate`}
      >
        <span>⭐</span>
        <span>{stele}</span>
      </span>

      {/* Nume copil / Profil */}
      {nume ? (
        <Link
          href="/kids/junior/harta"
          className="flex items-center gap-1.5 rounded-full bg-indigo-50 border border-indigo-200 px-3 py-1 text-xs font-black text-indigo-900 hover:bg-indigo-100 transition shadow-sm"
        >
          <span className="animate-bounce">🤖</span>
          <span>{nume}</span>
        </Link>
      ) : (
        <Link
          href="/kids/junior"
          className="rounded-full bg-indigo-600 hover:bg-indigo-700 px-3.5 py-1.5 text-xs font-black text-white transition shadow-sm"
        >
          Intră în joc 🚀
        </Link>
      )}
    </div>
  );
}
