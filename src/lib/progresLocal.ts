/**
 * Progres păstrat în browser (localStorage), pentru vizitatori și, în plus,
 * pentru conturi (pe lângă ce se salvează în cont).
 *
 * Ce înregistrăm — doar dovezi reale, nu simpla deschidere a paginii:
 *  - EXERCITII: id-urile exercițiilor rezolvate corect (cheie existentă);
 *  - PASI_REUSITI: sublecțiile de „Citește și prezice" cu predicție corectă și
 *    cele de „Verifică-ți înțelegerea" trecute cu pragul de promovare;
 *  - PASI_DESCHISI: pașii deschiși — folosit DOAR pentru „Continuă de unde ai
 *    rămas" și afișat ca „deschis", niciodată ca „înțeles".
 */
export const CHEIE_EXERCITII = "exercitii_rezolvate_v1";
const CHEIE_PASI_REUSITI = "pasi_reusiti_v1";
const CHEIE_PASI_DESCHISI = "pasi_deschisi_v1";

export const EVENIMENT_PROGRES = "academia-progres-local";

function citesteSet(cheie: string): Set<string> {
  if (typeof window === "undefined") return new Set();
  try {
    const raw = window.localStorage.getItem(cheie);
    return new Set(raw ? (JSON.parse(raw) as string[]) : []);
  } catch {
    return new Set();
  }
}

function adaugaInSet(cheie: string, valoare: string) {
  if (typeof window === "undefined") return;
  try {
    const s = citesteSet(cheie);
    if (s.has(valoare)) return;
    s.add(valoare);
    window.localStorage.setItem(cheie, JSON.stringify([...s]));
    window.dispatchEvent(new Event(EVENIMENT_PROGRES));
  } catch {
    // localStorage indisponibil (mod privat, stocare plină) — ignorăm.
  }
}

export const citesteExercitiiRezolvate = () => citesteSet(CHEIE_EXERCITII);
export const citestePasiReusiti = () => citesteSet(CHEIE_PASI_REUSITI);
export const citestePasiDeschisi = () => citesteSet(CHEIE_PASI_DESCHISI);

export const marcheazaPasReusit = (sublectieCod: string) => adaugaInSet(CHEIE_PASI_REUSITI, sublectieCod);
export const marcheazaPasDeschis = (sublectieCod: string) => adaugaInSet(CHEIE_PASI_DESCHISI, sublectieCod);

/** Pragul de promovare al testului de final: 60% din întrebări, rotunjit în sus. */
export function pragPromovare(totalIntrebari: number): number {
  return Math.max(1, Math.ceil(totalIntrebari * 0.6));
}
