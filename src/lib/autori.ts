/**
 * Autorul afișat pe articolele de blog (și declarat în datele structurate).
 *
 * TODO(owner): completează cu persoana (sau persoanele) care scriu articolele:
 *   { tip: "Person", nume: "…", rol: "…", descriere: "1–2 propoziții despre
 *     experiența relevantă", url: "/despre" }
 * Opțional, un autor per articol: câmpul `autor` din AUTOR_PE_ARTICOL.
 * Până atunci se afișează echipa — singura informație pe care o avem.
 */
export type Autor = {
  tip: "Person" | "Organization";
  nume: string;
  rol: string;
  descriere?: string;
  url?: string;
};

export const AUTOR_IMPLICIT: Autor = {
  tip: "Organization",
  nume: "Echipa Academia Python",
  rol: "Platformă de învățare Python în limba română",
  url: "/despre",
};

/** TODO(owner): autor diferit pe un anumit articol, cheia = slug-ul articolului. */
const AUTOR_PE_ARTICOL: Record<string, Autor> = {};

export function autorArticol(slug: string): Autor {
  return AUTOR_PE_ARTICOL[slug] ?? AUTOR_IMPLICIT;
}
