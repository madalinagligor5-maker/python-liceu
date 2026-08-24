"use client";

import { useState, useEffect } from "react";
import { salveazaProgresKids } from "@/app/actions/progres";

type Props = {
  nivelId: number;
  autentificat: boolean;
};

type Direction = "N" | "E" | "S" | "W";

type Position = {
  x: number;
  y: number;
};

// Configurații nivele
const LEVEL_CONFIGS: Record<
  number,
  {
    startX: number;
    startY: number;
    startDir: Direction;
    targetX: number;
    targetY: number;
    stars: Position[];
    walls: Position[];
    enunt: string;
    indicatie: string;
  }
> = {
  1: {
    startX: 0,
    startY: 0,
    startDir: "E",
    targetX: 4,
    targetY: 4,
    stars: [{ x: 2, y: 2 }],
    walls: [
      { x: 1, y: 0 },
      { x: 1, y: 1 },
      { x: 3, y: 3 },
      { x: 3, y: 4 },
    ],
    enunt: "Misiunea 1: Secvențialitate. Pippy trebuie să adune steluța de la (2, 2) și să ajungă la poarta de ieșire (4, 4). Ocolește zidurile din cărămidă!",
    indicatie: "Folosește butoanele de direcție pentru a plănui drumul lui Pippy.",
  },
  2: {
    startX: 0,
    startY: 0,
    startDir: "S",
    targetX: 4,
    targetY: 4,
    stars: [{ x: 0, y: 4 }],
    walls: [
      { x: 1, y: 0 },
      { x: 1, y: 1 },
      { x: 1, y: 2 },
      { x: 1, y: 3 },
      { x: 3, y: 1 },
      { x: 3, y: 2 },
      { x: 3, y: 3 },
      { x: 3, y: 4 },
    ],
    enunt: "Misiunea 2: Puterea Repetiției. Drumul este mai lung! Pippy trebuie să meargă în jos până la steluță, apoi la dreapta spre poartă. Folosește blocul special 'Repetă de 4 ori' pentru un cod mai scurt!",
    indicatie: "Poți folosi Repetă de 4 ori pentru a repeta acțiunea anterioară de 4 ori.",
  },
  3: {
    startX: 0,
    startY: 0,
    startDir: "E",
    targetX: 4,
    targetY: 0,
    stars: [{ x: 2, y: 0 }],
    walls: [],
    enunt: "Misiunea 3: Primul tău cod Python. De data aceasta, scrie instrucțiunile în Python direct în editorul text din dreapta! Folosește comenzile din instrucțiuni.",
    indicatie: "Scrie robot.move_forward(), robot.turn_right() sau bucle pentru a-l ghida pe Pippy.",
  },
};

export default function KidsAdventureClient({ nivelId, autentificat }: Props) {
  const config = LEVEL_CONFIGS[nivelId];
  
  // Game states
  const [pippyPos, setPippyPos] = useState<Position>({ x: config.startX, y: config.startY });
  const [pippyDir, setPippyDir] = useState<Direction>(config.startDir);
  const [collectedStars, setCollectedStars] = useState<Position[]>([]);
  const [commands, setCommands] = useState<string[]>([]);
  const [inExecution, setInExecution] = useState(false);
  const [currentStepIndex, setCurrentStepIndex] = useState(-1);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [showVictory, setShowVictory] = useState(false);
  const [starsRating, setStarsRating] = useState(0);

  // Level 3 Python text state
  const [pythonCode, setPythonCode] = useState(
    `# Ajută-l pe Pippy!\n# Scrie codul Python mai jos:\n\nrobot.move_forward()\nrobot.move_forward()\nrobot.collect_star()\nrobot.move_forward()\nrobot.move_forward()\n`
  );

  // Reset level state
  const handleReset = () => {
    setPippyPos({ x: config.startX, y: config.startY });
    setPippyDir(config.startDir);
    setCollectedStars([]);
    setInExecution(false);
    setCurrentStepIndex(-1);
    setErrorMsg(null);
    setShowVictory(false);
  };

  // Run simulation
  const handleRun = async () => {
    handleReset();
    
    let activeCommands = [...commands];
    
    // Pentru nivelul 3, citim și parsăm codul text Python scris de copil
    if (nivelId === 3) {
      activeCommands = parsePythonCode(pythonCode);
    }

    if (activeCommands.length === 0) {
      setErrorMsg("Adaugă cel puțin o comandă înainte de a apăsa pornește!");
      return;
    }

    setInExecution(true);
    setCurrentStepIndex(0);
  };

  // Parsare simplificată a codului Python pentru Nivelul 3
  const parsePythonCode = (code: string): string[] => {
    const lines = code.split("\n");
    const cmds: string[] = [];
    let inLoop = false;
    let loopCount = 0;

    for (let line of lines) {
      line = line.trim();
      if (!line || line.startsWith("#")) continue;

      // Detectare loop simplu (ex: for i in range(4): sau for _ in range(4):)
      const loopMatch = line.match(/for\s+\w+\s+in\s+range\((\d+)\)\s*:/);
      if (loopMatch) {
        inLoop = true;
        loopCount = parseInt(loopMatch[1]);
        continue;
      }

      // Detectare comenzi simple
      const isMethod = line.includes("robot.");
      if (isMethod) {
        let action = "";
        if (line.includes("move_forward")) action = "move_forward";
        else if (line.includes("turn_right")) action = "turn_right";
        else if (line.includes("turn_left")) action = "turn_left";
        else if (line.includes("collect_star")) action = "collect_star";

        if (action) {
          if (inLoop) {
            for (let i = 0; i < loopCount; i++) {
              cmds.push(action);
            }
          } else {
            cmds.push(action);
          }
        }
      }

      // Resetăm loop după prima comandă indentată
      if (inLoop && !line.startsWith("for")) {
        inLoop = false;
      }
    }
    return cmds;
  };

  // Simulare pas cu pas
  useEffect(() => {
    if (!inExecution || currentStepIndex === -1) return;

    let activeCommands = [...commands];
    if (nivelId === 3) {
      activeCommands = parsePythonCode(pythonCode);
    }

    if (currentStepIndex >= activeCommands.length) {
      // Verificăm condiția de victorie la sfârșitul comenzilor
      setInExecution(false);
      const peFinis = pippyPos.x === config.targetX && pippyPos.y === config.targetY;
      const culesToate = collectedStars.length === config.stars.length;

      if (peFinis && culesToate) {
        // Calculăm steluțe în funcție de eficiență (număr de pași)
        let rating = 3;
        if (nivelId === 1 && activeCommands.length > 10) rating = 2;
        if (nivelId === 2 && !activeCommands.includes("loop_4") && activeCommands.length > 7) rating = 2;
        
        setStarsRating(rating);
        setShowVictory(true);

        // Salvare progres în baza de date
        if (autentificat) {
          salveazaProgresKids(nivelId, rating).catch(console.error);
        }
      } else if (peFinis && !culesToate) {
        setErrorMsg("Ai ajuns la poartă, dar ai uitat steluțele! Pippy are nevoie de toate steluțele. 🌟");
      } else {
        setErrorMsg("Pippy nu a ajuns la poarta de ieșire. Mai încearcă o dată! 🏁");
      }
      return;
    }

    const timer = setTimeout(() => {
      const currentCmd = activeCommands[currentStepIndex];
      executaComanda(currentCmd);
      setCurrentStepIndex((prev) => prev + 1);
    }, 700);

    return () => clearTimeout(timer);
  }, [inExecution, currentStepIndex]);

  // Modificare stare Pippy pe baza comenzii
  const executaComanda = (cmd: string) => {
    setPippyPos((currentPos) => {
      let nextPos = { ...currentPos };

      if (cmd === "move_forward" || cmd === "loop_4") {
        const steps = cmd === "loop_4" ? 4 : 1;
        
        for (let i = 0; i < steps; i++) {
          let tempPos = { ...nextPos };
          if (pippyDir === "E") tempPos.x += 1;
          if (pippyDir === "W") tempPos.x -= 1;
          if (pippyDir === "S") tempPos.y += 1;
          if (pippyDir === "N") tempPos.y -= 1;

          // Verificări coliziune / margini grilă (5x5)
          if (tempPos.x < 0 || tempPos.x > 4 || tempPos.y < 0 || tempPos.y > 4) {
            setErrorMsg("Ups! Pippy a ieșit din labirint. Ai grijă la margini! 🗺️");
            setInExecution(false);
            return currentPos;
          }

          const lovitZid = config.walls.some((w) => w.x === tempPos.x && w.y === tempPos.y);
          if (lovitZid) {
            setErrorMsg("Bum! Pippy s-a lovit de un zid de cărămizi. Ocolește-le! 🧱");
            setInExecution(false);
            return currentPos;
          }

          nextPos = tempPos;
        }
      }

      return nextPos;
    });

    if (cmd === "turn_right") {
      setPippyDir((currentDir) => {
        if (currentDir === "N") return "E";
        if (currentDir === "E") return "S";
        if (currentDir === "S") return "W";
        return "N";
      });
    }

    if (cmd === "turn_left") {
      setPippyDir((currentDir) => {
        if (currentDir === "N") return "W";
        if (currentDir === "W") return "S";
        if (currentDir === "S") return "E";
        return "N";
      });
    }

    if (cmd === "collect_star") {
      setPippyPos((currentPos) => {
        const areStea = config.stars.some(
          (s) => s.x === currentPos.x && s.y === currentPos.y
        );
        if (areStea) {
          setCollectedStars((prev) => {
            const dejaCuleasa = prev.some((s) => s.x === currentPos.x && s.y === currentPos.y);
            if (dejaCuleasa) return prev;
            return [...prev, currentPos];
          });
        } else {
          setErrorMsg("Nu există nicio steluță aici! Pippy poate culege steluțe doar când stă exact pe ele. ⭐");
          setInExecution(false);
        }
        return currentPos;
      });
    }
  };

  // Convertim comenzile vizuale în cod text Python
  const genereazaCodPython = () => {
    let code = "# Codul tău Python:\n";
    commands.forEach((cmd) => {
      if (cmd === "move_forward") code += "robot.move_forward()\n";
      else if (cmd === "turn_right") code += "robot.turn_right()\n";
      else if (cmd === "turn_left") code += "robot.turn_left()\n";
      else if (cmd === "collect_star") code += "robot.collect_star()\n";
      else if (cmd === "loop_4") {
        code += "for _ in range(4):\n    robot.move_forward()\n";
      }
    });
    return code;
  };

  return (
    <div className="grid gap-6 md:grid-cols-[1.1fr_1.3fr_0.9fr] items-stretch">
      {/* PANOU STÂNGA: COMENZI */}
      <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm flex flex-col justify-between">
        <div>
          <h3 className="text-md font-extrabold text-slate-800 flex items-center gap-1.5">
            <span>⚙️</span> Panou de Comenzi
          </h3>
          <p className="mt-1 text-xs text-slate-500">
            Apasă pe butoane pentru a plănui pașii lui Pippy în labirint.
          </p>

          {nivelId < 3 ? (
            <div className="mt-4 flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => setCommands((prev) => [...prev, "move_forward"])}
                disabled={inExecution}
                className="rounded-xl border border-slate-200 hover:border-indigo-300 hover:bg-indigo-50 px-3 py-2 text-xs font-bold text-slate-700 flex items-center gap-1 cursor-pointer transition"
              >
                🚶 Mergi Înainte
              </button>
              <button
                type="button"
                onClick={() => setCommands((prev) => [...prev, "turn_right"])}
                disabled={inExecution}
                className="rounded-xl border border-slate-200 hover:border-indigo-300 hover:bg-indigo-50 px-3 py-2 text-xs font-bold text-slate-700 flex items-center gap-1 cursor-pointer transition"
              >
                ↪️ Rotește Dreapta
              </button>
              <button
                type="button"
                onClick={() => setCommands((prev) => [...prev, "turn_left"])}
                disabled={inExecution}
                className="rounded-xl border border-slate-200 hover:border-indigo-300 hover:bg-indigo-50 px-3 py-2 text-xs font-bold text-slate-700 flex items-center gap-1 cursor-pointer transition"
              >
                ↩️ Rotește Stânga
              </button>
              <button
                type="button"
                onClick={() => setCommands((prev) => [...prev, "collect_star"])}
                disabled={inExecution}
                className="rounded-xl border border-slate-200 hover:border-indigo-300 hover:bg-indigo-50 px-3 py-2 text-xs font-bold text-slate-700 flex items-center gap-1 cursor-pointer transition"
              >
                ⭐ Adună Steluța
              </button>
              
              {nivelId === 2 && (
                <button
                  type="button"
                  onClick={() => setCommands((prev) => [...prev, "loop_4"])}
                  disabled={inExecution}
                  className="rounded-xl border border-indigo-200 bg-indigo-50/50 hover:bg-indigo-50 px-3 py-2 text-xs font-bold text-indigo-700 flex items-center gap-1 cursor-pointer transition"
                >
                  🔁 Repetă de 4 ori
                </button>
              )}
            </div>
          ) : (
            <div className="mt-4 border border-slate-200 rounded-2xl overflow-hidden font-mono bg-slate-900 text-white">
              <div className="bg-slate-800 py-1.5 px-3 text-[10px] text-white/50 border-b border-white/5 flex justify-between">
                <span>cod_editor.py</span>
                <span>Scrie cod real!</span>
              </div>
              <textarea
                value={pythonCode}
                onChange={(e) => setPythonCode(e.target.value)}
                disabled={inExecution}
                spellCheck={false}
                className="w-full h-48 bg-transparent p-3 outline-none text-xs leading-relaxed resize-none"
              />
            </div>
          )}

          {/* LISTA COMENZILOR ADAUGATE */}
          {nivelId < 3 && (
            <div className="mt-6">
              <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                Planul tău de pași:
              </h4>
              {commands.length === 0 ? (
                <p className="mt-2 text-xs text-slate-400 italic">
                  Nicio comandă adăugată. Adaugă pași de mai sus!
                </p>
              ) : (
                <div className="mt-2 flex flex-wrap gap-1.5 max-h-40 overflow-y-auto p-1 bg-slate-50 border border-slate-100 rounded-xl">
                  {commands.map((cmd, idx) => (
                    <div
                      key={idx}
                      className="flex items-center gap-1 rounded bg-white border border-slate-200 px-2 py-1 text-[11px] font-bold text-slate-700"
                    >
                      <span>
                        {cmd === "move_forward" && "🚶"}
                        {cmd === "turn_right" && "↪️"}
                        {cmd === "turn_left" && "↩️"}
                        {cmd === "collect_star" && "⭐"}
                        {cmd === "loop_4" && "🔁 [x4]"}
                      </span>
                      <button
                        type="button"
                        onClick={() => setCommands((prev) => prev.filter((_, i) => i !== idx))}
                        className="text-red-500 hover:text-red-700 ml-1 font-bold font-sans text-[10px] cursor-pointer"
                        disabled={inExecution}
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        <div className="mt-6 flex flex-col gap-2 border-t border-slate-100 pt-4">
          <div className="flex gap-2">
            <button
              type="button"
              onClick={handleRun}
              disabled={inExecution}
              className="flex-1 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold py-3 text-sm cursor-pointer shadow-sm text-center disabled:opacity-50"
            >
              🚀 Pornește!
            </button>
            <button
              type="button"
              onClick={handleReset}
              className="rounded-2xl border border-slate-200 hover:bg-slate-50 font-bold px-4 text-xs text-slate-600 cursor-pointer"
            >
              Resetează
            </button>
          </div>
          {commands.length > 0 && nivelId < 3 && (
            <button
              type="button"
              onClick={() => setCommands([])}
              disabled={inExecution}
              className="text-center text-xs text-red-500 hover:text-red-600 font-medium underline cursor-pointer"
            >
              Șterge tot planul
            </button>
          )}
        </div>
      </div>

      {/* PANOU CENTRAL: GRID-UL LABIRINTULUI */}
      <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm flex flex-col">
        <h3 className="text-md font-extrabold text-indigo-950">
          🎮 Labirintul lui Pippy
        </h3>
        <p className="mt-1 text-xs text-slate-500">
          {config.enunt}
        </p>

        {/* GRILA CANVAS/DIVS */}
        <div className="mt-6 flex-1 flex items-center justify-center">
          <div className="grid grid-cols-5 gap-1 border-4 border-indigo-900/10 p-2 rounded-2xl bg-slate-50 max-w-[280px] sm:max-w-[340px] w-full aspect-square">
            {Array.from({ length: 25 }).map((_, idx) => {
              const y = Math.floor(idx / 5);
              const x = idx % 5;

              const estePippy = pippyPos.x === x && pippyPos.y === y;
              const esteTinta = config.targetX === x && config.targetY === y;
              const areStar = config.stars.some((s) => s.x === x && s.y === y);
              const starCuleasa = collectedStars.some((s) => s.x === x && s.y === y);
              const esteZid = config.walls.some((w) => w.x === x && w.y === y);

              return (
                <div
                  key={idx}
                  className={`relative flex items-center justify-center rounded-xl border text-xl font-bold transition aspect-square select-none ${
                    esteZid
                      ? "bg-amber-100 border-amber-200 shadow-inner"
                      : "bg-white border-slate-100"
                  }`}
                >
                  {esteZid && "🧱"}
                  {esteTinta && !estePippy && "🏁"}
                  {areStar && !starCuleasa && !estePippy && (
                    <span className="text-amber-400 drop-shadow animate-pulse">★</span>
                  )}
                  {estePippy && (
                    <div
                      className={`text-3xl transition-transform duration-300 ${
                        pippyDir === "N" ? "-rotate-90" : ""
                      } ${pippyDir === "E" ? "rotate-0" : ""} ${
                        pippyDir === "S" ? "rotate-90" : ""
                      } ${pippyDir === "W" ? "rotate-180" : ""}`}
                    >
                      🤖
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* FEEDBACK IN TIMP REAL */}
        {errorMsg && (
          <div className="mt-4 rounded-2xl bg-rose-50 border border-rose-100 p-3 text-xs text-rose-700 font-bold text-center">
            {errorMsg}
          </div>
        )}

        {showVictory && (
          <div className="mt-4 rounded-2xl bg-emerald-50 border border-emerald-100 p-4 text-center">
            <h4 className="text-md font-black text-emerald-800">🎉 Bravo! Misiune Îndeplinită!</h4>
            <p className="text-xs text-emerald-600 mt-1">
              Ai adunat toate steluțele și ai adus robotul la destinație!
            </p>
            <div className="mt-2 flex justify-center gap-1 text-2xl">
              {[1, 2, 3].map((s) => (
                <span key={s} className={s <= starsRating ? "text-amber-400" : "text-slate-300"}>
                  ★
                </span>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* PANOU DREAPTA: DUAL-VIEW PYTHON */}
      <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm flex flex-col justify-between">
        <div>
          <h3 className="text-md font-extrabold text-slate-800 flex items-center gap-1.5">
            <span>🚀</span> Dual-View Python
          </h3>
          <p className="mt-1 text-xs text-slate-500">
            Aici vezi codul Python real generat de acțiunile tale!
          </p>

          <div className="mt-4 border border-slate-200 rounded-2xl overflow-hidden font-mono bg-slate-900 text-white min-h-[220px] p-3 text-xs leading-relaxed whitespace-pre select-all">
            {nivelId < 3 ? genereazaCodPython() : (
              `# Codul tău Python:\n` + pythonCode.split("\n").filter(l => !l.startsWith("#")).join("\n")
            )}
          </div>
        </div>

        <div className="mt-6 border-t border-slate-100 pt-4 text-center">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
            Indicație didactică:
          </span>
          <p className="text-xs text-slate-600 mt-1 italic leading-normal">
            {config.indicatie}
          </p>
        </div>
      </div>
    </div>
  );
}
