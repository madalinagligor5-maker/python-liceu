import { getModul, hrefModul, numeClasa } from "@/lib/curriculum";

/**
 * Legături interne ale fiecărui articol: lecția de pe platformă care tratează
 * același subiect și articolele înrudite (afișate în „Citește și", înaintea
 * celor mai recente). Opțional, sursele oficiale citate în articol.
 */
type Sursa = { titlu: string; url?: string };
type Legaturi = { modul: [clasa: string, slug: string]; articole: string[]; surse?: Sursa[] };

const LEGATURI: Record<string, Legaturi> = {
  "bucla-for-si-range-in-python": {
    modul: ["VII", "structura-repetitiva-si-combinarea-structurilor"],
    articole: ["liste-in-python", "if-elif-else-in-python"],
  },
  "cum-inveti-python-de-la-zero": {
    modul: ["VII", "primii-pasi-in-python"],
    articole: ["variabile-in-python", "erori-frecvente-python"],
  },
  "erori-frecvente-python": {
    modul: ["VII", "primii-pasi-in-python"],
    articole: ["variabile-in-python", "functii-in-python"],
  },
  "functii-in-python": {
    modul: ["IX", "subprograme-functii-definire-si-apel"],
    articole: ["probleme-rezolvate-python-clasa-a-ix-a", "erori-frecvente-python"],
  },
  "if-elif-else-in-python": {
    modul: ["VII", "de-la-scratch-la-python-secvential-si-alternativ"],
    articole: ["bucla-for-si-range-in-python", "variabile-in-python"],
  },
  "liste-in-python": {
    modul: ["VIII", "siruri-de-valori-identificare-si-generare"],
    articole: ["bucla-for-si-range-in-python", "functii-in-python"],
  },
  "probleme-rezolvate-python-clasa-a-ix-a": {
    modul: ["IX", "prelucrarea-cifrelor-unui-numar"],
    articole: ["functii-in-python", "erori-frecvente-python"],
  },
  "programare-pentru-copii-ghid-parinti": {
    modul: ["P7", "ce-este-python-primul-meu-program"],
    articole: ["cum-inveti-python-de-la-zero", "variabile-in-python"],
  },
  "python-de-la-comedie-la-baza-viitorului-in-it": {
    modul: ["IX", "ce-este-un-algoritm-etapele-elaborarii-unui-program"],
    articole: ["schimbari-bacalaureat-informatica-python-2030", "cum-inveti-python-de-la-zero"],
  },
  "schimbari-bacalaureat-informatica-python-2030": {
    modul: ["IX", "ce-este-un-algoritm-etapele-elaborarii-unui-program"],
    articole: ["probleme-rezolvate-python-clasa-a-ix-a", "python-de-la-comedie-la-baza-viitorului-in-it"],
    // Documentele exact cum sunt citate în articol.
    // TODO(owner): adaugă `url` pentru fiecare ordin (pagina oficială de pe
    // edu.ro sau legislatie.just.ro). N-am putut verifica adresele exacte,
    // deocamdată trimitem doar spre site-ul oficial al ministerului.
    surse: [
      { titlu: "OMEC nr. 6930/19.12.2025" },
      { titlu: "Ordinul ministrului educației și cercetării nr. 4.370/2026" },
      { titlu: "Monitorul Oficial nr. 591 bis/20.VII.2026" },
      { titlu: "Ministerul Educației — edu.ro", url: "https://www.edu.ro" },
    ],
  },
  "variabile-in-python": {
    modul: ["VII", "primii-pasi-in-python"],
    articole: ["if-elif-else-in-python", "erori-frecvente-python"],
  },
};

export function modulRecomandat(slug: string): { href: string; titlu: string; clasa: string } | undefined {
  const l = LEGATURI[slug];
  const modul = l && getModul(l.modul[0], l.modul[1]);
  return modul ? { href: hrefModul(modul), titlu: modul.titlu, clasa: numeClasa(l.modul[0]) } : undefined;
}

export function articoleInrudite(slug: string): string[] {
  return LEGATURI[slug]?.articole ?? [];
}

export function surseOficiale(slug: string): Sursa[] {
  return LEGATURI[slug]?.surse ?? [];
}
