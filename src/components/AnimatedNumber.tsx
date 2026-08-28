"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Afișează un număr care "urcă" vizual spre valoarea nouă în ~700ms, în loc
 * să sară instant — pentru XP, streak, orice valoare care crește și ar
 * trebui să se simtă câștigată, nu doar afișată. Prima randare arată direct
 * valoarea finală (nu numără de la 0 la încărcarea paginii); doar
 * SCHIMBĂRILE ulterioare ale valorii sunt animate.
 *
 * O nouă animație pornește mereu de la valoarea curent AFIȘATĂ pe ecran
 * (`afisatRef`), nu de la ultima valoare confirmată la finalul unei
 * animații anterioare — altfel, dacă `valoare` se schimbă de două ori
 * rapid (ex. XP la două răspunsuri corecte succesive), a doua animație
 * repornea de la un punct vechi, iar numărul sărea vizibil înapoi înainte
 * să reanime spre noua țintă.
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
  // Oglindește `afisat`, dar e citibil sincron dintr-un efect nou, fără
  // să declanșeze acel efect la fiecare cadru de animație (spre deosebire
  // de `afisat` însuși, care nu poate fi dependință a efectului de mai jos).
  const afisatRef = useRef(afisat);
  const primaRandare = useRef(true);

  const actualizeazaAfisat = (nou: number) => {
    afisatRef.current = nou;
    setAfisat(nou);
  };

  useEffect(() => {
    if (primaRandare.current) {
      primaRandare.current = false;
      if (!deLaZero) {
        return;
      }
    }
    if (valoare === afisatRef.current) return;

    const reduceMotion =
      typeof window !== "undefined" &&
      window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;

    // Cu mișcare redusă, durata 0 face ca prima (și singura) execuție a lui
    // `pas` să sară direct la valoarea finală — setState rămâne mereu în
    // interiorul callback-ului de requestAnimationFrame, niciodată direct
    // în corpul efectului.
    const start = afisatRef.current;
    const capat = valoare;
    const startTime = performance.now();
    const durata = reduceMotion ? 0 : durataMs;
    let frame: number;

    const pas = (acum: number) => {
      const progres = durata === 0 ? 1 : Math.min((acum - startTime) / durata, 1);
      // ease-out cubic — pornește repede, încetinește spre final.
      const usor = 1 - Math.pow(1 - progres, 3);
      actualizeazaAfisat(Math.round(start + (capat - start) * usor));
      if (progres < 1) {
        frame = requestAnimationFrame(pas);
      }
    };

    frame = requestAnimationFrame(pas);
    return () => cancelAnimationFrame(frame);
  }, [valoare, durataMs, deLaZero]);

  return <span className={className}>{afisat}</span>;
}
