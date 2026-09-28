import structuraRaw from "../../content/structura_curriculum.json";

export type TipSublectie =
  | "recapitulare"
  | "concept"
  | "prezice"
  | "ghidat"
  | "independent"
  | "verificare";

export type Sublectie = {
  cod: string;
  titlu: string;
  descriere: string;
  slug: string;
  tip: TipSublectie;
};

export type Modul = {
  cod: string;
  numar: number;
  titlu: string;
  slug: string;
  virsta?: string;
  clasa?: string;
  gratuit: boolean;
  sublectii: Sublectie[];
};

export type Capitol = {
  numar: number;
  clasa: string;
  titlu: string;
  slug: string;
  module: Modul[];
  descriere?: string;
  virsta?: string;
};

export type Structura = {
  sursa: string;
  sablon_sublectii: { titlu: string; descriere: string }[];
  capitole: Capitol[];
  statistici?: { capitole: number; module: number; sublectii: number };
};

export const structura = structuraRaw as Structura;

/** Capitolele, cu `clasa` completată pe fiecare modul. În JSON, modulele
 *  „Python pentru copii" (P7–P11) nu au câmpul `clasa` — fără completare,
 *  linkurile către modulul anterior/următor ieșeau „/curriculum/undefined/…". */
export const capitole: Capitol[] = structura.capitole.map((c) => ({
  ...c,
  module: c.module.map((m) => (m.clasa ? m : { ...m, clasa: c.clasa })),
}));

/** Toate clasele cu traseu real pe platformă, în ordinea firului pedagogic
 *  (gimnaziu -> liceu). Sursă unică pentru orice selector/listă de clase. */
export const TOATE_CLASELE = ["VII", "VIII", "IX", "X", "XI", "XII"] as const;

/** Iconițe per tip de sublecție, folosite consecvent în UI. */
export const ICOANE_SUBLECTIE: Record<TipSublectie, string> = {
  recapitulare: "🔄",
  concept: "💡",
  prezice: "🔮",
  ghidat: "🤝",
  independent: "🎯",
  verificare: "✅",
};

/**
 * Denumirea publică a unei „clase" din structura curriculumului.
 * Codurile P7–P11 NU sunt clase școlare: sunt capitolele „Python pentru
 * copii", pe vârste (P7 = 7 ani, …, P11 = 11 ani). Identificatorii rămân
 * neschimbați (URL-uri, fișiere de conținut, progres salvat); doar eticheta
 * afișată se traduce aici. Exemple: "IX" -> "Clasa a IX-a",
 * "P7" -> "Python pentru copii · 7 ani".
 */
export function numeClasa(clasa: string): string {
  const copii = clasa.match(/^P(\d+)$/i);
  if (copii) return `Python pentru copii · ${copii[1]} ani`;
  return `Clasa a ${clasa}-a`;
}

/** Variantă scurtă, pentru butoane/pastile: "IX" -> "Clasa IX", "P7" -> "7 ani". */
export function numeClasaScurt(clasa: string): string {
  const copii = clasa.match(/^P(\d+)$/i);
  if (copii) return `${copii[1]} ani`;
  return `Clasa ${clasa}`;
}

export function esteCapitolCopii(clasa: string): boolean {
  return /^P\d+$/i.test(clasa);
}

export function getCapitol(clasa: string): Capitol | undefined {
  return capitole.find((c) => c.clasa.toUpperCase() === clasa.toUpperCase());
}

export function getModul(clasa: string, modulSlug: string): Modul | undefined {
  const normalizedSlug = (modulSlug || "").replace(/_/g, "-").toLowerCase();
  return getCapitol(clasa)?.module.find(
    (m) => m.slug.replace(/_/g, "-").toLowerCase() === normalizedSlug
  );
}

export function toateModulele(): Modul[] {
  return capitole.flatMap((c) => c.module);
}

/** Modulele din aceeași „familie" (școală VII–XII sau Python pentru copii),
 *  ca navigarea să nu sară din clasa a XII-a la lecțiile pentru 7 ani. */
function moduleFamilie(clasa: string): Modul[] {
  const copii = /^P\d+$/i.test(clasa);
  return toateModulele().filter((m) => /^P\d+$/i.test(m.clasa ?? "") === copii);
}

/** Modulul următor, inclusiv trecerea la clasa următoare. */
export function modulUrmator(clasa: string, modulSlug: string): Modul | undefined {
  const toate = moduleFamilie(clasa);
  const i = toate.findIndex((m) => m.clasa === clasa && m.slug === modulSlug);
  return i === -1 ? undefined : toate[i + 1];
}

export function modulAnterior(clasa: string, modulSlug: string): Modul | undefined {
  const toate = moduleFamilie(clasa);
  const i = toate.findIndex((m) => m.clasa === clasa && m.slug === modulSlug);
  return i <= 0 ? undefined : toate[i - 1];
}

export function hrefModul(m: Modul): string {
  return `/curriculum/${m.clasa}/${m.slug}`;
}

export function hrefCapitol(c: Capitol): string {
  return `/curriculum/${c.clasa}`;
}

/** Primul nivel din breadcrumb: capitolele pentru copii aparțin zonei Kids. */
export function radacinaClasa(clasa: string): { nume: string; cale: string } {
  return esteCapitolCopii(clasa)
    ? { nume: "Kids", cale: "/kids" }
    : { nume: "Curriculum", cale: "/curriculum" };
}
