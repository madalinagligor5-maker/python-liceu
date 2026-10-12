/**
 * Evenimente de măsurare trimise în Google Analytics 4 (gtag e încărcat
 * doar în producție, din layout). Fără gtag — în dev sau dacă scriptul e
 * blocat — apelurile nu fac nimic. Nu se trimit niciodată date personale:
 * doar coduri de lecții, nume de trasee și planuri.
 */

type Parametri = Record<string, string | number | boolean>;

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
  }
}

export function trimiteEveniment(nume: string, parametri: Parametri = {}) {
  if (typeof window === "undefined" || typeof window.gtag !== "function") return;
  try {
    window.gtag("event", nume, parametri);
  } catch {
    // măsurarea nu are voie să strice pagina
  }
}

/** Trimite evenimentul o singură dată pe browser (sau pe sesiune). */
export function trimiteOData(
  cheie: string,
  nume: string,
  parametri: Parametri = {},
  stocare: "local" | "sesiune" = "local"
) {
  try {
    const s = stocare === "local" ? window.localStorage : window.sessionStorage;
    const k = `ev_${cheie}`;
    if (s.getItem(k)) return;
    s.setItem(k, "1");
  } catch {
    // fără stocare: trimitem oricum, cel mult se dublează
  }
  trimiteEveniment(nume, parametri);
}
