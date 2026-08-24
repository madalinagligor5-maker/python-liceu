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
  const router = useRouter();

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
    <div className="min-h-screen bg-slate-200 py-10 px-4 flex flex-col items-center justify-center">
      {/* Stiluri CSS pentru Imprimare / Salvare ca PDF */}
      <style dangerouslySetInnerHTML={{ __html: `
        @media print {
          body {
            background-color: white !important;
            padding: 0 !important;
            margin: 0 !important;
          }
          .no-print {
            display: none !important;
          }
          .diploma-card {
            border: 8px solid #4f46e5 !important;
            box-shadow: none !important;
            width: 100% !important;
            max-width: 100% !important;
            height: 90vh !important;
            page-break-after: always;
          }
        }
      `}} />

      {/* Bară acțiuni (Ascunsă la Print/PDF) */}
      <div className="no-print mb-6 flex items-center gap-4 bg-white p-4 rounded-3xl shadow-md border border-slate-300 w-full max-w-3xl justify-between">
        <Link
          href="/kids/junior/harta"
          className="text-sm font-bold text-slate-600 hover:text-indigo-600 transition"
        >
          ← Înapoi la Hartă
        </Link>
        <button
          onClick={() => window.print()}
          className="rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-black px-6 py-2.5 text-sm shadow-md transition active:scale-95 flex items-center gap-2"
        >
          🖨️ Printează / Salvează PDF
        </button>
      </div>

      {/* CADRUL DIPLOMEI (A4 Landscape aspect) */}
      <div className="diploma-card relative w-full max-w-3xl bg-white border-[12px] border-indigo-900 rounded-3xl p-8 sm:p-12 shadow-2xl overflow-hidden text-center text-slate-800">
        {/* Fundal decorativ filigran */}
        <div className="absolute inset-0 opacity-5 pointer-events-none flex items-center justify-center text-9xl select-none">
          🤖
        </div>

        {/* Colturi aurii decorative */}
        <div className="absolute top-3 left-3 text-2xl text-amber-500">✨</div>
        <div className="absolute top-3 right-3 text-2xl text-amber-500">✨</div>
        <div className="absolute bottom-3 left-3 text-2xl text-amber-500">✨</div>
        <div className="absolute bottom-3 right-3 text-2xl text-amber-500">✨</div>

        {/* Antet Diplomă */}
        <div className="border-b-4 border-amber-400 pb-4 mb-6">
          <p className="text-xs font-black tracking-widest text-indigo-700 uppercase mb-1">
            ACADEMIA PYTHON JUNIOR · DIPLOMĂ DE MERIT
          </p>
          <h1
            className="text-3xl sm:text-5xl font-black text-indigo-950 uppercase tracking-wide"
            style={{ fontFamily: "'Baloo 2', sans-serif" }}
          >
            🏆 CERTIFICAT DE EXCELENȚĂ 🏆
          </h1>
        </div>

        {/* Corp text diplomă */}
        <div className="space-y-4 my-6">
          <p className="text-sm sm:text-base font-semibold text-slate-600">
            Se acordă cu mândrie elevului / elevei
          </p>
          <h2 className="text-3xl sm:text-4xl font-black text-amber-600 underline decoration-indigo-400 decoration-wavy decoration-2">
            {nume}
          </h2>
          <p className="text-sm sm:text-base font-medium text-slate-700 max-w-lg mx-auto leading-relaxed">
            pentru absolvirea cu succes a modulului <br />
            <strong className="text-indigo-900 text-lg font-black">«{titluModul}»</strong>
            <br />
            demonstrând gândire algoritmică, perspicacitate și pasiune pentru programare!
          </p>
        </div>

        {/* Scor stele & insignă */}
        <div className="my-6 inline-flex items-center gap-3 bg-amber-50 border-2 border-amber-300 rounded-2xl px-6 py-2 shadow-sm">
          <span className="text-2xl">🏅</span>
          <span className="text-sm font-black text-amber-900">
            Scor Total: ⭐ {stele} Stele Adunate
          </span>
        </div>

        {/* Subsol diplomă: Data & Semnătură Mascotă */}
        <div className="mt-8 pt-6 border-t-2 border-slate-200 flex justify-between items-end text-xs font-bold text-slate-600">
          <div className="text-left">
            <p className="text-slate-400 uppercase tracking-wider text-[10px]">Data acordării:</p>
            <p className="text-slate-800 text-sm mt-0.5">{dataCurenta}</p>
          </div>

          <div className="flex flex-col items-center">
            <div className="w-10 h-10 mb-1">
              <MascotaByte stare="sarbatoare" />
            </div>
            <p className="text-indigo-900 text-xs font-black">Robotul Byte 🤖</p>
            <p className="text-[10px] text-slate-400">Mentor Tehnic Junior</p>
          </div>
        </div>
      </div>
    </div>
  );
}
