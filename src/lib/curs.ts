import structuraRaw from "../../content/structura_curs.json";
import type { TipSublectie } from "@/lib/curriculum";

/**
 * Modelul de date pentru „Curs practic de Python" — curs de sine stătător,
 * separat de traseul școlar (gimnaziu/liceu). Structură calchiată pe
 * curriculum.ts (Unitate → Modul → Sublecție, în loc de Capitol → Modul →
 * Sublecție), dar complet independentă — fără câmp `clasa`, ca să nu
 * colizioneze cu rutele/dropdown-urile/constrângerea DB legate de clasă.
 */

export type SublectieCurs = {
  cod: string;
  titlu: string;
  descriere: string;
  slug: string;
  tip: TipSublectie;
};

export type ModulCurs = {
  cod: string;
  numar: number;
  titlu: string;
  slug: string;
  gratuit: boolean;
  sublectii: SublectieCurs[];
};

export type Unitate = {
  numar: number;
  titlu: string;
  slug: string;
  module: ModulCurs[];
};

export type StructuraCurs = {
  sursa: string;
  sablon_sublectii: { titlu: string; descriere: string }[];
  unitati: Unitate[];
  statistici?: { unitati: number; module: number; sublectii: number };
};

export const structuraCurs = structuraRaw as StructuraCurs;

export const unitati = structuraCurs.unitati;

export function toateModuleleCurs(): ModulCurs[] {
  return unitati.flatMap((u) => u.module);
}

export function getModulCurs(modulSlug: string): ModulCurs | undefined {
  const normalizedSlug = (modulSlug || "").replace(/_/g, "-").toLowerCase();
  return toateModuleleCurs().find(
    (m) => m.slug.replace(/_/g, "-").toLowerCase() === normalizedSlug
  );
}

export function getUnitatePentruModul(modulCod: string): Unitate | undefined {
  return unitati.find((u) => u.module.some((m) => m.cod === modulCod));
}

export function modulCursUrmator(modulSlug: string): ModulCurs | undefined {
  const toate = toateModuleleCurs();
  const i = toate.findIndex((m) => m.slug === modulSlug);
  return i === -1 ? undefined : toate[i + 1];
}

export function modulCursAnterior(modulSlug: string): ModulCurs | undefined {
  const toate = toateModuleleCurs();
  const i = toate.findIndex((m) => m.slug === modulSlug);
  return i <= 0 ? undefined : toate[i - 1];
}

export function hrefModulCurs(m: ModulCurs): string {
  return `/curs-practic/${m.slug}`;
}
