"use client";
import { useSearchParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Link from "next/link";
import { getProfilElev, totalStele } from "@/lib/junior/progres";
import MascotaByte from "@/components/junior/MascotaByte";

const TITLURI_MODULE: Record<string, string> = {
  M1: "Comenzi și Secvențe",
  M2: "Repetă cu Bucla",
  M3: "Dacă... Atunci...",
  M4: "Rucsacul lui Byte",
  M5: "Rețete pentru Byte",
  M6: "Proiectul Meu (Sandbox)",
  ALL: "Absolvirea Cursului Academia Python Junior",
};

export default function DiplomaPage() {
  const searchParams = useSearchParams();
  const modulId = searchParams.get("modul") || "ALL";
  const [nume, setNume] = useState("Elev Junior");
  const [stele, setStele] = useState(0);
  const [dataCurenta, setDataCurenta] = useState("");

  useEffect(() => {
    const profil = getProfilElev();
    if (profil) {
      setNume(profil.nume);
    }
    setStele(totalStele());
    const azi = new Date().toLocaleDateString("ro-RO", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
    setDataCurenta(azi);
  }, []);

  const titluModul = TITLURI_MODULE[modulId] || "Programare Python";

  return (
    <div className="min-h-screen bg-slate-100 py-6 px-2 sm:py-10 sm:px-4 flex flex-col items-center justify-center">
      {/* Stiluri CSS Optimizate 100% pentru Imprimare / Salvare PDF pe Mobil și Desktop */}
      <style dangerouslySetInnerHTML={{ __html: `
        @media print {
          @page {
            size: A4 landscape;
            margin: 0;
          }
          body {
            background-color: white !important;
            padding: 0 !important;
            margin: 0 !important;
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }
          .no-print {
            display: none !important;
          }
          .diploma-wrapper {
            padding: 0 !important;
            margin: 0 !important;
            width: 100vw !important;
            height: 100vh !important;
          }
          .diploma-card {
            border: 6px solid #1e1b4b !important;
            box-shadow: none !important;
            width: 100% !important;
            height: 100% !important;
            border-radius: 0 !important;
            page-break-after: always;
          }
        }
      `}} />

      {/* Bară acțiuni (Ascunsă la Print/PDF) */}
      <div className="no-print mb-4 sm:mb-6 flex flex-wrap items-center gap-3 bg-white p-3.5 sm:p-4 rounded-3xl shadow-md border border-slate-300 w-full max-w-3xl justify-between">
        <Link
          href="/kids/junior/harta"
          className="text-xs sm:text-sm font-bold text-slate-600 hover:text-indigo-600 transition"
        >
          ← Înapoi la Hartă
        </Link>
        <button
          onClick={() => window.print()}
          className="rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-black px-5 py-2.5 text-xs sm:text-sm shadow-md transition active:scale-95 flex items-center gap-2"
        >
          🖨️ Printează / Salvează PDF
        </button>
      </div>

      {/* WRAPPER RESPONSIV MOBIL (Previene trunchierea pe telefon) */}
      <div className="diploma-wrapper w-full max-w-3xl overflow-x-auto flex justify-center pb-4">
        {/* CADRUL DIPLOMEI */}
        <div className="diploma-card relative w-full min-w-[320px] max-w-3xl bg-white border-4 sm:border-[10px] border-indigo-950 rounded-2xl sm:rounded-3xl p-5 sm:p-10 shadow-xl text-center text-slate-800">
          {/* Fundal decorativ filigran */}
          <div className="absolute inset-0 opacity-5 pointer-events-none flex items-center justify-center text-8xl sm:text-9xl select-none">
            🤖
          </div>

          {/* Colturi aurii decorative */}
          <div className="absolute top-2 left-2 text-xl sm:text-2xl text-amber-500">✨</div>
          <div className="absolute top-2 right-2 text-xl sm:text-2xl text-amber-500">✨</div>
          <div className="absolute bottom-2 left-2 text-xl sm:text-2xl text-amber-500">✨</div>
          <div className="absolute bottom-2 right-2 text-xl sm:text-2xl text-amber-500">✨</div>

          {/* Antet Diplomă */}
          <div className="border-b-2 sm:border-b-4 border-amber-400 pb-3 mb-4 sm:mb-6">
            <p className="text-[10px] sm:text-xs font-black tracking-widest text-indigo-700 uppercase mb-1">
              ACADEMIA PYTHON JUNIOR · DIPLOMĂ DE MERIT
            </p>
            <h1 className="text-2xl sm:text-4xl font-black text-indigo-950 uppercase tracking-wide">
              🏆 CERTIFICAT DE EXCELENȚĂ 🏆
            </h1>
          </div>

          {/* Corp text diplomă */}
          <div className="space-y-3 sm:space-y-4 my-4 sm:my-6">
            <p className="text-xs sm:text-sm font-semibold text-slate-600">
              Se acordă cu mândrie elevului / elevei
            </p>
            <h2 className="text-2xl sm:text-4xl font-black text-amber-600 underline decoration-indigo-400 decoration-wavy decoration-2 break-words">
              {nume}
            </h2>
            <p className="text-xs sm:text-base font-medium text-slate-700 max-w-lg mx-auto leading-relaxed">
              pentru absolvirea cu succes a modulului <br />
              <strong className="text-indigo-900 text-sm sm:text-lg font-black block mt-1">«{titluModul}»</strong>
              <span className="block mt-1">demonstrând gândire algoritmică, perspicacitate și pasiune pentru programare!</span>
            </p>
          </div>

          {/* Scor stele & insignă */}
          <div className="my-4 sm:my-6 inline-flex items-center gap-2 sm:gap-3 bg-amber-50 border-2 border-amber-300 rounded-xl sm:rounded-2xl px-4 sm:px-6 py-2 shadow-xs">
            <span className="text-xl sm:text-2xl">🏅</span>
            <span className="text-xs sm:text-sm font-black text-amber-900">
              Scor Total: ⭐ {stele} Stele Adunate
            </span>
          </div>

          {/* Subsol diplomă: Data & Semnătură Mascotă */}
          <div className="mt-6 pt-4 border-t-2 border-slate-200 flex justify-between items-end text-xs font-bold text-slate-600">
            <div className="text-left">
              <p className="text-slate-400 uppercase tracking-wider text-[9px] sm:text-[10px]">Data acordării:</p>
              <p className="text-slate-800 text-xs sm:text-sm font-black mt-0.5">{dataCurenta}</p>
            </div>

            <div className="flex flex-col items-center">
              <div className="w-8 h-8 sm:w-10 sm:h-10 mb-1">
                <MascotaByte stare="sarbatoare" />
              </div>
              <p className="text-indigo-900 text-[11px] sm:text-xs font-black">Robotul Byte 🤖</p>
              <p className="text-[9px] sm:text-[10px] text-slate-400">Mentor Tehnic Junior</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
