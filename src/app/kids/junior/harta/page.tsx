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
};

const DEFINIRE_MODULE: DefModul[] = [
  {
    id: "M1", numar: 1,
    titlu: "Comenzi și Secvențe",
    subtitlu: "Ghidează-l pe Byte prin labirint!",
    icon: "🧭", niveluri: 5,
    culoareActiv: "from-emerald-400 to-emerald-600 border-emerald-700",
    culoareBlocat: "from-slate-300 to-slate-400 border-slate-500",
  },
  {
    id: "M2", numar: 2,
    titlu: "Repetă cu Bucla",
    subtitlu: "Cântecul care se repetă",
    icon: "🔁", niveluri: 5,
    culoareActiv: "from-sky-400 to-sky-600 border-sky-700",
    culoareBlocat: "from-slate-300 to-slate-400 border-slate-500",
  },
  {
    id: "M3", numar: 3,
    titlu: "Dacă... Atunci...",
    subtitlu: "Byte alege drumul potrivit",
    icon: "🔀", niveluri: 5,
    culoareActiv: "from-violet-400 to-violet-600 border-violet-700",
    culoareBlocat: "from-slate-300 to-slate-400 border-slate-500",
  },
  {
    id: "M4", numar: 4,
    titlu: "Rucsacul lui Byte",
    subtitlu: "Variabile = cutii cu etichete",
    icon: "🎒", niveluri: 4,
    culoareActiv: "from-amber-400 to-amber-600 border-amber-700",
    culoareBlocat: "from-slate-300 to-slate-400 border-slate-500",
  },
  {
    id: "M5", numar: 5,
    titlu: "Rețete pentru Byte",
    subtitlu: "Funcții = comenzi cu nume",
    icon: "📋", niveluri: 4,
    culoareActiv: "from-rose-400 to-rose-600 border-rose-700",
    culoareBlocat: "from-slate-300 to-slate-400 border-slate-500",
  },
  {
    id: "M6", numar: 6,
    titlu: "Proiectul Meu",
    subtitlu: "Creează liber cu Byte!",
    icon: "🎨", niveluri: 1,
    culoareActiv: "from-orange-400 to-orange-600 border-orange-700",
    culoareBlocat: "from-slate-300 to-slate-400 border-slate-500",
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

  return (
    <div className="min-h-screen bg-gradient-to-b from-sky-200 via-indigo-100 to-amber-100 px-4 py-10">
      {/* Header cu profil */}
      <div className="mx-auto max-w-3xl mb-8 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="text-4xl">{avatar}</span>
          <div>
            <p className="font-black text-indigo-900 text-xl">Salut, {profil.nume}!</p>
            <p className="text-sm text-slate-600">⭐ {stele} stele adunate</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Link
            href="/kids/junior/diploma"
            className="rounded-2xl bg-amber-400 hover:bg-amber-500 text-amber-950 px-4 py-2 text-xs font-black shadow-md transition active:scale-95 flex items-center gap-1.5"
          >
            🏆 Generează Diplomă
          </Link>
          <button
            onClick={() => {
              if (confirm("Vrei să schimbi profilul?")) {
                localStorage.removeItem("junior_profil");
                router.push("/kids/junior");
              }
            }}
            className="text-xs text-slate-400 hover:text-slate-600"
          >
            Schimbă profil
          </button>
        </div>
      </div>

      {/* Mascotă */}
      <div className="mx-auto max-w-3xl mb-8">
        <MascotaByte
          stare="fericit"
          mesaj={`Bun venit pe harta aventurii! Alege o insulă și hai să programăm împreună! 🗺️`}
        />
      </div>

      {/* Titlu hartă */}
      <h1 className="text-center text-3xl font-black text-indigo-900 mb-2">
        🗺️ Harta Aventurii
      </h1>
      <p className="text-center text-slate-600 mb-8 text-sm">
        Completează modulele în ordine și câștigă insigne!
      </p>

      {/* Insule/module */}
      <div className="mx-auto max-w-3xl grid sm:grid-cols-2 gap-4">
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
            <div
              key={modul.id}
              className={`
                relative rounded-3xl border-4 p-5 shadow-lg overflow-hidden
                bg-gradient-to-br text-white transition-all
                ${deblocat
                  ? `${modul.culoareActiv} hover:scale-[1.02] cursor-pointer`
                  : "from-slate-200 to-slate-300 border-slate-400 cursor-not-allowed opacity-75"
                }
              `}
            >
              {/* Lacăt dacă blocat */}
              {!deblocat && (
                <div className="absolute top-4 right-4 text-3xl opacity-60">🔒</div>
              )}

              {/* Insignă dacă câștigată */}
              {areInsigna && (
                <div className="absolute top-3 right-3 text-2xl" title="Insignă câștigată!">🏅</div>
              )}

              <div className="flex items-center gap-3 mb-3">
                <span className="text-5xl drop-shadow">{modul.icon}</span>
                <div>
                  <p className="text-xs font-bold opacity-80 uppercase tracking-wide">
                    Modulul {modul.numar}
                  </p>
                  <h2 className="font-black text-lg leading-tight">{modul.titlu}</h2>
                  <p className="text-xs opacity-80">{modul.subtitlu}</p>
                </div>
              </div>

              {/* Progres */}
              <div className="mb-3">
                <div className="flex justify-between text-xs mb-1 opacity-80">
                  <span>{niveluriFacute}/{modul.niveluri} niveluri</span>
                  <span>⭐ {steleModul}</span>
                </div>
                <div className="h-2.5 rounded-full bg-white/30">
                  <div
                    className="h-2.5 rounded-full bg-white/80 transition-all"
                    style={{ width: `${(niveluriFacute / modul.niveluri) * 100}%` }}
                  />
                </div>
              </div>

              {deblocat && (
                <Link
                  href={`/kids/junior/nivel/${modul.id}/${modul.id}N${Math.min(niveluriFacute + 1, modul.niveluri)}`}
                  className="inline-block rounded-2xl bg-white/20 hover:bg-white/30 border border-white/40 px-5 py-2.5 text-sm font-black shadow-sm transition-all active:scale-95"
                >
                  {niveluriFacute === 0 ? "Începe! ▶" : niveluriFacute >= modul.niveluri ? "Rejoacă 🔁" : "Continuă →"}
                </Link>
              )}
            </div>
          );
        })}
      </div>

      {/* Link înapoi la /kids */}
      <div className="mt-10 text-center">
        <Link href="/kids" className="text-sm text-slate-500 hover:text-slate-700 underline">
          ← Înapoi la Academia Python Kids
        </Link>
      </div>
    </div>
  );
}
