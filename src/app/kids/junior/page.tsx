"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { creeazaProfil, getProfilElev } from "@/lib/junior/progres";
import MascotaByte from "@/components/junior/MascotaByte";

const AVATARE = ["🧒", "👧", "👦", "🧑", "👩", "🧑‍💻"];
const CULORI_AVATAR = [
  "bg-amber-100 border-amber-300",
  "bg-rose-100 border-rose-300",
  "bg-sky-100 border-sky-300",
  "bg-emerald-100 border-emerald-300",
  "bg-violet-100 border-violet-300",
  "bg-orange-100 border-orange-300",
];

export default function JuniorAvatarPage() {
  const router = useRouter();
  const profilExistent = getProfilElev();

  const [avatarSelectat, setAvatarSelectat] = useState(0);
  const [nume, setNume] = useState("");
  const [eroare, setEroare] = useState("");

  // Dacă există deja un profil, redirect direct la hartă
  if (profilExistent) {
    router.replace("/kids/junior/harta");
    return null;
  }

  const handleStart = () => {
    if (!nume.trim()) {
      setEroare("Scrie numele tău ca să începem aventura! 😊");
      return;
    }
    creeazaProfil(avatarSelectat, nume.trim());
    router.push("/kids/junior/harta");
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-sky-100 via-indigo-50 to-amber-50 flex flex-col items-center justify-center px-4 py-12">
      {/* Titlu */}
      <h1
        className="text-4xl sm:text-5xl font-black text-indigo-900 text-center mb-2"
        style={{ fontFamily: "'Baloo 2', sans-serif" }}
      >
        Academia Python Junior 🤖
      </h1>
      <p className="text-slate-600 text-center text-base mb-8 max-w-md">
        Salut! Înainte să începem aventura, hai să alegem avatarul tău!
      </p>

      {/* Mascotă Byte */}
      <div className="mb-8">
        <MascotaByte
          stare="curios"
          mesaj="Bună! Eu sunt Byte! Cine ești tu? Alege un avatar și scrie-ți numele!"
        />
      </div>

      {/* Selector avatar */}
      <div className="grid grid-cols-3 sm:grid-cols-6 gap-3 mb-8">
        {AVATARE.map((av, i) => (
          <button
            key={i}
            onClick={() => setAvatarSelectat(i)}
            className={`
              flex h-20 w-20 items-center justify-center rounded-3xl border-4 text-4xl
              transition-all duration-150 cursor-pointer select-none
              ${avatarSelectat === i
                ? `${CULORI_AVATAR[i]} scale-110 shadow-xl ring-4 ring-indigo-400`
                : "bg-white border-slate-200 hover:scale-105 hover:shadow-md"
              }
            `}
          >
            {av}
          </button>
        ))}
      </div>

      {/* Input nume */}
      <div className="flex flex-col items-center gap-3 w-full max-w-xs">
        <label className="text-sm font-bold text-slate-600">
          Cum te cheamă?
        </label>
        <input
          type="text"
          value={nume}
          onChange={(e) => { setNume(e.target.value); setEroare(""); }}
          onKeyDown={(e) => e.key === "Enter" && handleStart()}
          placeholder="Scrie numele tău..."
          maxLength={20}
          className="w-full rounded-2xl border-2 border-indigo-300 bg-white px-5 py-3 text-center text-xl font-bold text-slate-800 placeholder:text-slate-300 focus:border-indigo-500 focus:outline-none shadow-sm"
        />
        {eroare && (
          <p className="text-sm text-orange-600 font-semibold">{eroare}</p>
        )}

        <button
          onClick={handleStart}
          className="w-full rounded-2xl bg-indigo-600 hover:bg-indigo-700 active:scale-95 text-white font-black text-xl py-4 px-8 shadow-lg transition-all"
        >
          Hai la aventură! 🚀
        </button>
      </div>
    </div>
  );
}
