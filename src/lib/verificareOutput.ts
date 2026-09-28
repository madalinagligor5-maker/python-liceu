/**
 * Compară rezultatul obținut de elev cu rezultatul așteptat.
 *
 * Dacă ambele conțin numere, se compară doar numerele (în ordine, cu toleranță
 * 0,01) — astfel „Media este: 7.5" și „7.5" sunt echivalente, iar 8.666… se
 * potrivește cu 8.67. Altfel se compară textul, ignorând spațiile în plus.
 */
export function extrageNumere(s: string): number[] {
  // Virgula zecimală („7,5") devine punct; separatorul „, " din liste rămâne.
  const normalizat = s.replace(/(\d),(\d)/g, "$1.$2");
  const m = normalizat.match(/-?\d+(\.\d+)?/g);
  return m ? m.map(Number) : [];
}

export function comparaOutput(obtinut: string, asteptat: string): boolean {
  const curat = (s: string) => s.replace(/\s+/g, " ").trim();
  const nrOut = extrageNumere(obtinut);
  const nrExp = extrageNumere(String(asteptat));
  if (nrOut.length > 0 && nrExp.length > 0) {
    return nrOut.length === nrExp.length && nrOut.every((v, i) => Math.abs(v - nrExp[i]) < 0.01);
  }
  return curat(obtinut) === curat(asteptat);
}
