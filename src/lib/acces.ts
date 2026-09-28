import type { Modul } from "@/lib/curriculum";

/**
 * Sursa unică pentru regulile de acces la lecții. Înainte, aceeași condiție
 * (`modul.gratuit || modul.numar <= 5`) era copiată în 5 fișiere, iar paginile
 * de exerciții foloseau o variantă diferită (doar clasa a IX-a) — de aici
 * etichete contradictorii între pagini. Regulile de mai jos reproduc exact
 * comportamentul existent; nu extind și nu restrâng accesul.
 *
 * Termeni (afișați identic pe toate paginile):
 *  - „gratuit"            modulul e marcat gratuit în structura curriculumului
 *                         (gimnaziu VII–VIII, Python pentru copii, IX.1–IX.3);
 *                         fără cont, fără card.
 *  - „acces deschis"      lecțiile modulelor 1–5 ale fiecărei clase, care nu
 *                         sunt marcate gratuit; se pot parcurge fără cont și
 *                         fără abonament, dar nu fac parte din oferta gratuită
 *                         garantată și pot trece sub abonament.
 *  - „necesită abonament" restul modulelor de liceu; cer cont și abonament
 *                         activ (inclusiv în perioada de probă de 7 zile).
 */
export type NivelAcces = "gratuit" | "deschis" | "abonament";

/** Numărul de module, per clasă, ale căror lecții sunt „acces deschis". */
export const MODULE_ACCES_DESCHIS = 5;

export function nivelAccesLectii(modul: Pick<Modul, "gratuit" | "numar">): NivelAcces {
  if (modul.gratuit) return "gratuit";
  if (modul.numar <= MODULE_ACCES_DESCHIS) return "deschis";
  return "abonament";
}

export function lectiiLiberAccesibile(modul: Pick<Modul, "gratuit" | "numar">): boolean {
  return nivelAccesLectii(modul) !== "abonament";
}

/**
 * Pagina separată de exerciții practice (/exercitii/...) are o regulă mai
 * strictă decât lecțiile: acces deschis doar pentru modulele 1–5 din clasa a
 * IX-a. Păstrată ca atare; doar centralizată.
 */
export function exercitiiPracticeLiberAccesibile(
  modul: Pick<Modul, "gratuit" | "numar">,
  clasa: string
): boolean {
  return modul.gratuit || (clasa === "IX" && modul.numar <= MODULE_ACCES_DESCHIS);
}

export const ETICHETE_ACCES: Record<NivelAcces, { text: string; explicatie: string; clasa: string }> = {
  gratuit: {
    text: "gratuit",
    explicatie: "Gratuit: fără cont și fără card.",
    clasa: "bg-success/15 text-success",
  },
  deschis: {
    text: "acces deschis",
    explicatie:
      "Acces deschis: lecțiile se pot parcurge acum fără cont și fără abonament; nu fac parte din oferta gratuită garantată.",
    clasa: "bg-brand-light text-brand-dark",
  },
  abonament: {
    text: "necesită abonament",
    explicatie: "Necesită cont și abonament activ (sau perioada de probă de 7 zile).",
    clasa: "bg-surface text-locked",
  },
};
