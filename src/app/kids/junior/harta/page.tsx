"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  getProfilElev,
  esteModulDeblocat,
  totalStele,
} from "@/lib/junior/progres";
import MascotaByte from "@/components/junior/MascotaByte";
import type { ProfilElev } from "@/lib/junior/tipuri";

const AVATARE = ["🧒", "👧", "👦", "🧑", "👩", "🧑‍💻"];

type DefModul = {
  id: string; // ex. "M1"
  numar: number;
  titlu: string;
  subtitlu: string;
  icon: string;
  culoareActiv: string;
  culoareBlocat: string;
  niveluri: number;
  alignClass: string; // pentru traseul șerpuit
};

const DEFINIRE_MODULE: DefModul[] = [
  {
    id: "M1", numar: 1,
    titlu: "Comenzi și Secvențe",
    subtitlu: "Ghidează-l pe Byte prin labirint!",
    icon: "🧭", niveluri: 5,
    culoareActiv: "from-emerald-400 to-emerald-600 border-emerald-700",
    culoareBlocat: "from-slate-300 to-slate-400 border-slate-500",
    alignClass: "sm:mr-auto sm:max-w-md",
  },
  {
    id: "M2", numar: 2,
    titlu: "Repetă cu Bucla",
    subtitlu: "Cântecul care se repetă",
    icon: "🔁", niveluri: 5,
    culoareActiv: "from-sky-400 to-sky-600 border-sky-700",
    culoareBlocat: "from-slate-300 to-slate-400 border-slate-500",
    alignClass: "sm:ml-auto sm:max-w-md",
  },
  {
    id: "M3", numar: 3,
    titlu: "Dacă... Atunci...",
    subtitlu: "Byte alege drumul potrivit",
    icon: "🔀", niveluri: 5,
    culoareActiv: "from-violet-400 to-violet-600 border-violet-700",
    culoareBlocat: "from-slate-300 to-slate-400 border-slate-500",
    alignClass: "sm:mx-auto sm:max-w-md",
  },
  {
    id: "M4", numar: 4,
    titlu: "Rucsacul lui Byte",
    subtitlu: "Variabile = cutii cu etichete",
    icon: "🎒", niveluri: 4,
    culoareActiv: "from-amber-400 to-amber-600 border-amber-700",
    culoareBlocat: "from-slate-300 to-slate-400 border-slate-500",
    alignClass: "sm:mr-auto sm:max-w-md",
  },
  {
    id: "M5", numar: 5,
    titlu: "Rețete pentru Byte",
    subtitlu: "Funcții = comenzi cu nume",
    icon: "📋", niveluri: 4,
    culoareActiv: "from-rose-400 to-rose-600 border-rose-700",
    culoareBlocat: "from-slate-300 to-slate-400 border-slate-500",
    alignClass: "sm:ml-auto sm:max-w-md",
  },
  {
    id: "M6", numar: 6,
    titlu: "Proiectul Meu",
    subtitlu: "Creează liber cu Byte!",
    icon: "🎨", niveluri: 1,
    culoareActiv: "from-orange-400 to-orange-600 border-orange-700",
    culoareBlocat: "from-slate-300 to-slate-400 border-slate-500",
    alignClass: "sm:mx-auto sm:max-w-md",
  },
];

export default function HartaJunior() {
  const router = useRouter();
  const [profil, setProfil] = useState<ProfilElev | null>(null);

  useEffect(() => {
    const p = getProfilElev();
    if (!p) { router.replace("/kids/junior"); return; }
    setProfil(p);
  }, [router]);

  if (!profil) return null;

  const stele = totalStele();
  const avatar = AVATARE[profil.avatar] ?? "🧒";

  // Calculează câte module au fost completate
  const moduleCompletateCount = DEFINIRE_MODULE.filter((modul) => {
    const progresModul = profil.module[modul.id];
    const nFacute = Object.values(progresModul?.niveluri ?? {}).filter((n) => n.completat).length;
    return nFacute >= modul.niveluri;
  }).length;

  return (
    <div className="min-h-screen bg-gradient-to-b from-sky-200 via-indigo-100 to-amber-100 px-4 py-8">
      {/* Header profil & Diplomă */}
      <div className="mx-auto max-w-3xl mb-8 flex flex-col sm:flex-row items-center justify-between gap-4 bg-white/80 backdrop-blur rounded-3xl p-4 shadow-md border border-white">
        <div className="flex items-center gap-3">
          <span className="text-4xl">{avatar}</span>
          <div>
            <p className="font-black text-indigo-900 text-xl">Salut, {profil.nume}!</p>
            <p className="text-xs font-bold text-slate-600">⭐ {stele} stele adunate · 🏆 {moduleCompletateCount}/6 Insule Absolvite</p>
          </div>
        </div>

        <div className="flex items-center gap-2 flex-wrap justify-center sm:justify-end">
          <div className="flex flex-col items-center sm:items-end">
            <Link
              href="/kids/junior/diploma"
              className={`
                rounded-2xl font-black text-xs px-4 py-2.5 shadow-md transition active:scale-95 flex items-center gap-1.5
                ${moduleCompletateCount >= 6
                  ? "bg-amber-400 hover:bg-amber-300 text-amber-950 ring-4 ring-amber-300 animate-bounce"
                  : "bg-slate-100 hover:bg-amber-100 text-slate-700 border border-slate-300"
                }
              `}
            >
              🏆 Generează Diplomă ({moduleCompletateCount}/6)
            </Link>
            {moduleCompletateCount < 6 && (
              <span className="text-[10px] text-slate-500 font-semibold mt-1">
                Completați toate cele 6 insule pentru diplomă!
              </span>
            )}
          </div>

          <button
            onClick={() => {
              if (confirm("Vrei să schimbi profilul?")) {
                localStorage.removeItem("junior_profil");
                router.push("/kids/junior");
              }
            }}
            className="text-xs text-slate-400 hover:text-slate-600 underline ml-2"
          >
            Ieșire
          </button>
        </div>
      </div>

      {/* Mascotă Byte */}
      <div className="mx-auto max-w-3xl mb-8">
        <MascotaByte
          stare="fericit"
          mesaj={`Urmează drumul șerpuit al aventurii! Alege insula curentă și hai să programăm! 🗺️✨`}
        />
      </div>

      {/* Titlu hartă */}
      <h1 className="text-center text-3xl font-black text-indigo-900 mb-1">
        🗺️ Traseul Aventurii
      </h1>
      <p className="text-center text-slate-600 mb-8 text-xs font-bold uppercase tracking-wider">
        Avansează insulă cu insulă pe drumul șerpuit!
      </p>

      {/* TRASEU ȘERPUIT STIL MARIO / DUOLINGO */}
      <div className="mx-auto max-w-3xl relative space-y-8 before:absolute before:inset-0 before:left-1/2 before:-translate-x-1/2 before:w-2 before:bg-indigo-300/60 before:border-r-4 before:border-dashed before:border-indigo-400 before:-z-0">
        {DEFINIRE_MODULE.map((modul, index) => {
          const deblocat = esteModulDeblocat(modul.numar);
          const progresModul = profil.module[modul.id];
          const niveluriFacute = Object.values(progresModul?.niveluri ?? {}).filter(
            (n) => n.completat
          ).length;
          const steleModul = Object.values(progresModul?.niveluri ?? {}).reduce(
            (s, n) => s + (n.stele ?? 0), 0
          );
          const areInsigna = progresModul?.insignaDeblocata ?? false;

          return (
            <div key={modul.id} className={`relative z-10 ${modul.alignClass}`}>
              <div
                className={`
                  relative rounded-3xl border-4 p-5 shadow-xl overflow-hidden
                  bg-gradient-to-br text-white transition-all
                  ${deblocat
                    ? `${modul.culoareActiv} hover:scale-105 hover:shadow-2xl transition-all duration-300 cursor-pointer`
                    : "from-slate-200 to-slate-300 border-slate-400 cursor-not-allowed opacity-80"
                  }
                `}
              >
                {/* Lacăt dacă e blocat */}
                {!deblocat && (
                  <div className="absolute top-4 right-4 text-3xl opacity-60">🔒</div>
                )}

                {/* Insignă dacă câștigată */}
                {areInsigna && (
                  <div className="absolute top-3 right-3 text-3xl animate-bounce" title="Insignă câștigată!">🏅</div>
                )}

                <div className="flex items-center gap-3 mb-3">
                  <span className="text-5xl drop-shadow">{modul.icon}</span>
                  <div>
                    <p className="text-xs font-extrabold opacity-90 uppercase tracking-widest">
                      Insula {modul.numar}
                    </p>
                    <h2 className="font-black text-xl leading-tight">{modul.titlu}</h2>
                    <p className="text-xs opacity-90">{modul.subtitlu}</p>
                  </div>
                </div>

                {/* Bară progres insulă */}
                <div className="mb-3">
                  <div className="flex justify-between text-xs mb-1 font-bold opacity-90">
                    <span>{niveluriFacute}/{modul.niveluri} niveluri rezolvate</span>
                    <span>⭐ {steleModul}</span>
                  </div>
                  <div className="h-3 rounded-full bg-black/20 p-0.5">
                    <div
                      className="h-2 rounded-full bg-white transition-all duration-300"
                      style={{ width: `${(niveluriFacute / modul.niveluri) * 100}%` }}
                    />
                  </div>
                </div>

                {deblocat && (
                  <Link
                    href={`/kids/junior/nivel/${modul.id}/${modul.id}N${Math.min(niveluriFacute + 1, modul.niveluri)}`}
                    className="inline-block rounded-2xl bg-white text-slate-900 hover:bg-amber-100 font-black px-6 py-2.5 text-sm shadow-md transition-all active:scale-95"
                  >
                    {niveluriFacute === 0 ? "Începe aventura ▶" : niveluriFacute >= modul.niveluri ? "Rejoacă insula 🔁" : "Continuă →"}
                  </Link>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Link înapoi la /kids */}
      <div className="mt-12 text-center">
        <Link href="/kids" className="text-xs font-bold text-slate-500 hover:text-slate-700 underline">
          ← Înapoi la Academia Python Kids
        </Link>
      </div>
    </div>
  );
}
