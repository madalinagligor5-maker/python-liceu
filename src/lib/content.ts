import continutRaw from "../../content/continut_pagina_web.json";

export type QuizIntrebare = {
  intrebare: string;
  variante: string[];
  corect: number;
};

export type ExercitiuInteractiv = {
  enunt: string;
  cod_schelet: string;
  solutie: string;
};

export type Lectie = {
  clasa: string;
  unitate: string;
  unitate_slug: string;
  lectie: string;
  lectie_slug: string;
  gratuit: boolean;
  obiective: string[];
  concepte_cheie: string[];
  explicatie_scurta: string;
  exemplu_cod: string;
  exercitiu_interactiv: ExercitiuInteractiv;
  quiz: QuizIntrebare[];
};

export const toateLectiile: Lectie[] = continutRaw as Lectie[];

const ORDINE_CLASE = ["IX", "X", "XI", "XII"];

export function getLectiiGrupate() {
  const clase = Array.from(new Set(toateLectiile.map((l) => l.clasa))).sort(
    (a, b) => ORDINE_CLASE.indexOf(a) - ORDINE_CLASE.indexOf(b)
  );

  return clase.map((clasa) => {
    const lectiiClasa = toateLectiile.filter((l) => l.clasa === clasa);
    const unitati = Array.from(
      new Map(
        lectiiClasa.map((l) => [l.unitate_slug, { unitate: l.unitate, unitate_slug: l.unitate_slug }])
      ).values()
    );

    return {
      clasa,
      unitati: unitati.map((u) => ({
        ...u,
        lectii: lectiiClasa.filter((l) => l.unitate_slug === u.unitate_slug),
      })),
    };
  });
}

export function getLectie(clasa: string, unitateSlug: string, lectieSlug: string): Lectie | undefined {
  return toateLectiile.find(
    (l) => l.clasa === clasa && l.unitate_slug === unitateSlug && l.lectie_slug === lectieSlug
  );
}

export function getToateSloturile() {
  return toateLectiile.map((l) => ({
    clasa: l.clasa,
    unitateSlug: l.unitate_slug,
    lectieSlug: l.lectie_slug,
  }));
}

export function getLectiaUrmatoare(lectieCurenta: Lectie): Lectie | undefined {
  const index = toateLectiile.findIndex(
    (l) => l.clasa === lectieCurenta.clasa && l.lectie_slug === lectieCurenta.lectie_slug
  );
  return toateLectiile[index + 1];
}

export function poateAccesaLectia(lectie: Lectie, areAbonamentActiv: boolean): boolean {
  if (lectie.gratuit) return true;
  return areAbonamentActiv;
}
