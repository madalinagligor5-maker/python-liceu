"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Afișează un număr care "urcă" vizual spre valoarea nouă în ~700ms, în loc
 * să sară instant — pentru XP, streak, orice valoare care crește și ar
 * trebui să se simtă câștigată, nu doar afișată. Prima randare arată direct
 * valoarea finală (nu numără de la 0 la încărcarea paginii); doar
 * SCHIMBĂRILE ulterioare ale valorii sunt animate.
 *
 * Respectă prefers-reduced-motion: dacă utilizatorul a cerut mișcare
 * redusă, valoarea se actualizează direct, fără numărătoare.
 */
export default function AnimatedNumber({
  valoare,
  durataMs = 700,
  className,
  deLaZero = false,
}: {
  valoare: number;
  durataMs?: number;
  className?: string;
  /** Numără de la 0 chiar la prima randare — potrivit pentru un toast de
   *  celebrare nou-apărut, unde valoarea n-a fost niciodată văzută înainte
   *  (spre deosebire de statisticile din dashboard, unde prima randare
   *  trebuie să arate direct valoarea, ca să nu "numere" la fiecare refresh). */
  deLaZero?: boolean;
}) {
  const [afisat, setAfisat] = useState(deLaZero ? 0 : valoare);
  const anterior = useRef(deLaZero ? 0 : valoare);
  const primaRandare = useRef(true);

  useEffect(() => {
    if (primaRandare.current) {
      primaRandare.current = false;
      if (!deLaZero) {
        anterior.current = valoare;
        return;
      }
    }
    if (valoare === anterior.current) return;

    const reduceMotion =
      typeof window !== "undefined" &&
      window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;

    // Cu mișcare redusă, durata 0 face ca prima (și singura) execuție a lui
    // `pas` să sară direct la valoarea finală — setState rămâne mereu în
    // interiorul callback-ului de requestAnimationFrame, niciodată direct
    // în corpul efectului.
    const start = anterior.current;
    const capat = valoare;
    const startTime = performance.now();
    const durata = reduceMotion ? 0 : durataMs;
    let frame: number;

    const pas = (acum: number) => {
      const progres = durata === 0 ? 1 : Math.min((acum - startTime) / durata, 1);
      // ease-out cubic — pornește repede, încetinește spre final.
      const usor = 1 - Math.pow(1 - progres, 3);
      setAfisat(Math.round(start + (capat - start) * usor));
      if (progres < 1) {
        frame = requestAnimationFrame(pas);
      } else {
        anterior.current = capat;
      }
    };

    frame = requestAnimationFrame(pas);
    return () => cancelAnimationFrame(frame);
  }, [valoare, durataMs, deLaZero]);

  return <span className={className}>{afisat}</span>;
}
