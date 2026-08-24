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
  clasa: string;
  gratuit: boolean;
  sublectii: Sublectie[];
};

export type Capitol = {
  numar: number;
  clasa: string;
  titlu: string;
  slug: string;
  module: Modul[];
};

export type Structura = {
  sursa: string;
  sablon_sublectii: { titlu: string; descriere: string }[];
  capitole: Capitol[];
  statistici: { capitole: number; module: number; sublectii: number };
};

export const structura = structuraRaw as Structura;

export const capitole = structura.capitole;

/** Iconițe per tip de sublecție, folosite consecvent în UI. */
export const ICOANE_SUBLECTIE: Record<TipSublectie, string> = {
  recapitulare: "🔄",
  concept: "💡",
  prezice: "🔮",
  ghidat: "🤝",
  independent: "🎯",
  verificare: "✅",
};

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

/** Modulul următor, inclusiv trecerea la clasa următoare. */
export function modulUrmator(clasa: string, modulSlug: string): Modul | undefined {
  const toate = toateModulele();
  const i = toate.findIndex((m) => m.clasa === clasa && m.slug === modulSlug);
  return i === -1 ? undefined : toate[i + 1];
}

export function modulAnterior(clasa: string, modulSlug: string): Modul | undefined {
  const toate = toateModulele();
  const i = toate.findIndex((m) => m.clasa === clasa && m.slug === modulSlug);
  return i <= 0 ? undefined : toate[i - 1];
}

export function hrefModul(m: Modul): string {
  return `/curriculum/${m.clasa}/${m.slug}`;
}

export function hrefCapitol(c: Capitol): string {
  return `/curriculum/${c.clasa}`;
}
