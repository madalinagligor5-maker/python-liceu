"use client";
import { useEffect, useRef, useState, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import nivelurileModul1 from "@/lib/junior/niveluri/modul1";
import nivelurileModul2 from "@/lib/junior/niveluri/modul2";
import nivelurileModul3 from "@/lib/junior/niveluri/modul3";
import nivelurileModul4 from "@/lib/junior/niveluri/modul4";
import nivelurileModul5 from "@/lib/junior/niveluri/modul5";
import nivelurileModul6 from "@/lib/junior/niveluri/modul6";
import {
  playMoveSound,
  playStarSound,
  playSuccessSound,
  playFailSound,
  toggleAudio,
  isAudioEnabled,
} from "@/lib/junior/audio";
import {
  executaProgramJoc,
  genereazaPython,
  calculeazaStele,
  numaraBlocuriSimple,
} from "@/lib/junior/gameEngine";
import {
  salveazaProgresNivel,
  deblocheazaInsigna,
  getProgresNivel,
  getProfilElev,
} from "@/lib/junior/progres";
import type { BlocComanda, DateNivel, StareJoc } from "@/lib/junior/tipuri";
import GridJoc from "@/components/junior/GridJoc";
import BlockEditor from "@/components/junior/BlockEditor";
import PythonPanel from "@/components/junior/PythonPanel";
import MascotaByte from "@/components/junior/MascotaByte";

// Map de niveluri suportat pentru toate cele 6 module
const TOATE_NIVELURILE: Record<string, DateNivel> = {};
[
  ...nivelurileModul1,
  ...nivelurileModul2,
  ...nivelurileModul3,
  ...nivelurileModul4,
  ...nivelurileModul5,
  ...nivelurileModul6,
].forEach((n) => {
  TOATE_NIVELURILE[n.id] = n;
});

const VITEZA_ANIMATIE = 400; // ms per pas

type FazaJoc = "intro" | "joc" | "ruleaza" | "succes" | "esec";

export default function NivelPage() {
  const params = useParams<{ modulId: string; nivelId: string }>();
  const router = useRouter();
  const nivelId = params?.nivelId;
  const nivel = nivelId ? TOATE_NIVELURILE[nivelId] : null;

  const [faza, setFaza] = useState<FazaJoc>("intro");
  const [comenzi, setComenzi] = useState<BlocComanda[]>([]);
  const [codPython, setCodPython] = useState("");
  const [stareJoc, setStareJoc] = useState<StareJoc>(() =>
    nivel
      ? { x: nivel.startPos.x, y: nivel.startPos.y, directie: nivel.startDir, steleColectate: 0, completat: false, esuat: false }
      : { x: 0, y: 0, directie: "E", steleColectate: 0, completat: false, esuat: false }
  );
  const [mesajMascota, setMesajMascota] = useState("");
  const [stareMascota, setStareMascota] = useState<"fericit" | "curios" | "nedumerit" | "sarbatoare" | "trist">("curios");
  const [incercari, setIncercari] = useState(0);
  const [animand, setAnimand] = useState(false);
  const [steleObtinute, setSteleObtinute] = useState(0);

  const profilExista = !!getProfilElev();
  const stopRef = useRef(false);

  // Inițializare
  useEffect(() => {
    if (!profilExista) { router.replace("/kids/junior"); return; }
    if (!nivel) return;

    setMesajMascota(nivel.mesajMascota);
    setStareMascota("curios");
    // Afișează intro 2s, apoi trece la joc
    const t = setTimeout(() => setFaza("joc"), 2500);
    return () => clearTimeout(t);
  }, [nivel, profilExista, router]);

  // Actualizează codul Python când se schimbă comenzile
  useEffect(() => {
    setCodPython(genereazaPython(comenzi));
  }, [comenzi]);

  const resetJoc = useCallback(() => {
    if (!nivel) return;
    stopRef.current = true;
    setStareJoc({
      x: nivel.startPos.x,
      y: nivel.startPos.y,
      directie: nivel.startDir,
      steleColectate: 0,
      completat: false,
      esuat: false,
    });
    setFaza("joc");
    setAnimand(false);
    setMesajMascota("Încearcă din nou! Poți face asta! 💪");
    setStareMascota("curios");
  }, [nivel]);

  const ruleaza = useCallback(async () => {
    if (!nivel || comenzi.length === 0) {
      setMesajMascota("Adaugă cel puțin un bloc înainte să apeși Rulează! 😊");
      return;
    }

    stopRef.current = false;
    setFaza("ruleaza");
    setAnimand(true);
    setIncercari((i) => i + 1);

    const stareStart: StareJoc = {
      x: nivel.startPos.x,
      y: nivel.startPos.y,
      directie: nivel.startDir,
      steleColectate: 0,
      completat: false,
      esuat: false,
    };

    const istoricStari = executaProgramJoc(
      comenzi,
      nivel.startPos.x,
      nivel.startPos.y,
      nivel.startDir,
      nivel.grila
    );

    // Animăm fiecare pas și redăm efectele sonore 8-bit
    let steleAnterioare = 0;
    for (let i = 0; i < istoricStari.length; i++) {
      if (stopRef.current) break;
      const pasCurent = istoricStari[i];
      setStareJoc(pasCurent);

      if (pasCurent.steleColectate > steleAnterioare) {
        playStarSound();
        steleAnterioare = pasCurent.steleColectate;
      } else if (i > 0) {
        playMoveSound();
      }

      await new Promise((r) => setTimeout(r, VITEZA_ANIMATIE));
    }

    setAnimand(false);
    const stareFinala = istoricStari[istoricStari.length - 1];

    if (stareFinala.completat) {
      playSuccessSound();
      // Calculare stele
      const nrOptim = numaraBlocuriSimple(nivel.solutieOptima);
      const nrUtilizat = numaraBlocuriSimple(comenzi);
      const stele = calculeazaStele(incercari + 1, nrUtilizat, nrOptim);
      setSteleObtinute(stele);
      setFaza("succes");
      setStareMascota("sarbatoare");
      setMesajMascota(`Bravo! ${stele === 3 ? "Soluție perfectă! 🌟🌟🌟" : stele === 2 ? "Foarte bine! ⭐⭐" : "Ai reușit! ⭐"}`);

      // Salvare progres
      salveazaProgresNivel(`M${nivel.modul}`, nivel.id, {
        completat: true,
        stele,
        incercari: incercari + 1,
      });

      // Dacă e ultimul nivel din modul → deblochează insigna
      if (nivel.numar === 5 || nivel.numar === nivel.modul) {
        deblocheazaInsigna(`M${nivel.modul}`);
      }
    } else {
      playFailSound();
      setFaza("esec");
      setStareMascota("trist");
      setMesajMascota(stareFinala.mesajEroare ?? "Nu a mers! Hai să încercăm altfel! 💪");
    }
  }, [nivel, comenzi, incercari]);

  if (!nivel) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-sky-50">
        <div className="text-center">
          <p className="text-2xl font-bold text-slate-700">Nivelul nu a fost găsit 😕</p>
          <Link href="/kids/junior/harta" className="mt-4 inline-block text-indigo-600 underline">
            ← Înapoi la hartă
          </Link>
        </div>
      </div>
    );
  }

  const progresExistent = getProgresNivel(`M${nivel.modul}`, nivel.id);

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-100 to-indigo-100 flex flex-col">
      {/* Header */}
      <header className="bg-indigo-700 text-white px-4 py-3 flex items-center gap-3 shadow-md">
        <Link href="/kids/junior/harta" className="rounded-xl bg-white/20 hover:bg-white/30 px-3 py-1.5 text-sm font-bold">
          ← Hartă
        </Link>
        <div className="flex-1">
          <p className="text-xs opacity-70">Modul {nivel.modul} · Nivelul {nivel.numar}/5</p>
          <h1 className="font-black text-lg leading-tight">{nivel.titlu}</h1>
        </div>
        {/* Stele progres existent */}
        <div className="flex gap-0.5">
          {[1, 2, 3].map((s) => (
            <span key={s} className={s <= progresExistent.stele ? "text-amber-300 text-xl" : "text-white/30 text-xl"}>★</span>
          ))}
        </div>
      </header>

      {/* Criteriu de succes */}
      {faza === "intro" || faza === "joc" ? (
        <div className="bg-amber-50 border-b border-amber-200 px-4 py-2 text-center">
          <p className="text-sm font-bold text-amber-800">🎯 {nivel.criteriu}</p>
        </div>
      ) : null}

      {/* Mascotă */}
      <div className="px-4 pt-3">
        <MascotaByte stare={stareMascota} mesaj={mesajMascota} />
      </div>

      {/* Layout principal: Grid | Editor | Python */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-3 gap-4 p-4">
        {/* Coloana 1: Jocul */}
        <div className="flex flex-col items-center justify-start gap-4">
          <div className="rounded-2xl bg-white border-2 border-slate-200 p-3 shadow-md w-full flex justify-center">
            <GridJoc grila={nivel.grila} stare={stareJoc} animand={animand} />
          </div>

          {/* Legendă */}
          <div className="flex gap-3 text-xs text-slate-600 flex-wrap justify-center">
            <span>🤖 = Byte</span>
            <span>🏁 = Scop</span>
            <span>⭐ = Bonus</span>
            <span className="inline-block w-4 h-4 bg-slate-700 rounded align-middle"></span> = perete
          </div>
        </div>

        {/* Coloana 2: Editor de blocuri */}
        <div className="flex flex-col gap-3">
          <BlockEditor
            blocuriPermise={nivel.blocuriPermise}
            onChange={setComenzi}
            disabled={faza === "ruleaza"}
          />

          {/* Butoane acțiune */}
          <div className="flex gap-3">
            {faza !== "succes" && (
              <button
                onClick={ruleaza}
                disabled={faza === "ruleaza" || comenzi.length === 0}
                className="flex-1 rounded-2xl bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white font-black text-lg py-4 shadow-lg transition-all active:scale-95"
              >
                {faza === "ruleaza" ? "⏳ Rulează..." : "▶ Rulează!"}
              </button>
            )}
            {(faza === "esec" || faza === "succes") && (
              <button
                onClick={resetJoc}
                className="flex-1 rounded-2xl bg-amber-500 hover:bg-amber-600 text-white font-black text-lg py-4 shadow-lg transition-all active:scale-95"
              >
                🔄 Încearcă din nou
              </button>
            )}
          </div>

          {/* Overlay succes */}
          {faza === "succes" && (
            <div className="rounded-2xl bg-emerald-50 border-2 border-emerald-300 p-4 text-center">
              <p className="text-3xl mb-1">🎉</p>
              <p className="font-black text-emerald-800 text-lg">Felicitări!</p>
              <div className="flex justify-center gap-1 my-2">
                {[1, 2, 3].map((s) => (
                  <span key={s} className={`text-3xl ${s <= steleObtinute ? "text-amber-400" : "text-slate-200"}`}>★</span>
                ))}
              </div>
              <div className="flex gap-2 justify-center mt-3">
                {nivel.numar < 5 && (
                  <Link
                    href={`/kids/junior/nivel/M${nivel.modul}/M${nivel.modul}N${nivel.numar + 1}`}
                    className="rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-5 py-2.5 text-sm"
                  >
                    Nivelul următor →
                  </Link>
                )}
                {nivel.numar === 5 && (
                  <Link
                    href="/kids/junior/harta"
                    className="rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-bold px-5 py-2.5 text-sm"
                  >
                    🏅 Înapoi la hartă!
                  </Link>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Coloana 3: Python panel */}
        <div>
          <PythonPanel cod={codPython} vizibil={nivel.codPythonVizibil} />
          {!nivel.codPythonVizibil && (
            <div className="mt-4 rounded-2xl bg-indigo-50 border-2 border-indigo-100 p-4 text-center">
              <span className="text-3xl">🔐</span>
              <p className="mt-2 text-sm font-semibold text-indigo-700">
                Codul Python apare de la Nivelul 2!
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
