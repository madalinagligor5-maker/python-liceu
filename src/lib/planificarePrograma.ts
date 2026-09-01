import { getCapitol, type Modul } from "@/lib/curriculum";
import { getPlanificare } from "@/lib/planificari";

/**
 * Construiește planificarea calendaristică completă, în formatul programei
 * școlare oficiale — verificat direct din Monitorul Oficial nr. 591 bis din
 * 20 iulie 2026 (Ordinul ministrului educației și cercetării nr. 4.370/2026,
 * Anexele 8-11 — programele pentru clasele IX-XII, filiera teoretică, profil
 * real, specializarea matematică-informatică, regim intensiv — exact sursa
 * deja citată în structura_curriculum.json). Folosit atât de pagina web
 * (/profesor/planificari/[clasa]) cât și de generatoarele de PDF/Word, ca să
 * nu existe mai multe surse de adevăr pentru același conținut.
 *
 * Competențele generale (CG1-CG6) sunt IDENTICE în toate cele 4 anexe (8-11)
 * — definite o singură dată pentru tot ciclul liceal, nu pe ani de studiu —
 * verificat direct în document, nu presupus.
 *
 * "Valori și atitudini" nu mai există ca secțiune separată în structura
 * oficială curentă (pagina 144 a documentului enumeră explicit componentele
 * programei: Notă de prezentare, Competențe generale, Competențe specifice
 * și exemple de activități de învățare, Conținuturi, Sugestii metodologice —
 * fără „Valori și atitudini", spre deosebire de formatul mai vechi din
 * modelele Word primite inițial). Secțiunea rămâne în planificare (cerută
 * explicit), dar cu o notă corectă în loc de conținut inventat sau atribuit
 * greșit ordinului.
 */

const ORE_SAPTAMANA_OFICIAL: Record<string, { total: number; teorie: number; practica: number }> = {
  IX: { total: 4, teorie: 2, practica: 2 },
  X: { total: 4, teorie: 2, practica: 2 },
  XI: { total: 7, teorie: 4, practica: 3 },
  XII: { total: 7, teorie: 4, practica: 3 },
};

// CG1-CG6, identice în Anexele 8-11 la Ordinul 4.370/2026 (verificat pe toate
// cele 4 anexe, nu presupus din una singură).
const COMPETENTE_GENERALE_OFICIALE = [
  "CG1 — Identifică principalele caracteristici ale modelelor conceptuale și operaționale ale dezvoltării produselor software, pentru înțelegerea fundamentelor programării.",
  "CG2 — Explică principii care stau la baza modelelor conceptuale și operaționale ale dezvoltării produselor software, pentru a fundamenta în mod logic proiectarea și implementarea soluțiilor informatice.",
  "CG3 — Utilizează modele conceptuale și operaționale ale dezvoltării produselor software, în scopul obținerii de soluții informatice funcționale și eficiente.",
  "CG4 — Analizează caracteristicile și aplicabilitatea modelelor conceptuale și operaționale ale dezvoltării produselor software, pentru a selecta soluțiile cele mai potrivite în funcție de contextul informatic dat.",
  "CG5 — Evaluează corectitudinea și eficiența soluțiilor informatice, în vederea optimizării și asigurării funcționalității în diverse scenarii de utilizare.",
  "CG6 — Elaborează algoritmi și programe personalizate, pentru a crea soluții informatice coerente și adaptate cerințelor.",
];

const NOTA_VALORI_SI_ATITUDINI =
  "Structura oficială curentă a programei (Ordinul 4.370/2026) nu mai definește „Valori și atitudini” ca secțiune separată — componentele programei sunt Nota de prezentare, Competențele generale, Competențele specifice cu exemple de activități de învățare, Conținuturile și Sugestiile metodologice. Dimensiunea atitudinală e integrată în Nota de prezentare și în exemplele de activități de învățare.";

export type RandCompetenteConținuturi = {
  unitate: string;
  competenteSpecifice: string;
  continuturi: string[];
  oreAlocate: number;
  saptamana: number;
};

export type ProgramaCompleta = {
  paginaTitlu: {
    liceu: string;
    disciplina: string;
    clasa: string;
    durataOreSaptamana: number;
    durataOreTeoriePractica: string;
    durataOreTotal: number;
    profesor: string;
    anScolar: string;
  };
  notaDePrezentare: string[];
  competenteCheie: string[];
  competenteGenerale: string[];
  notaValoriSiAtitudini: string;
  tabel: RandCompetenteConținuturi[];
  sugestiiMetodologice: string[];
  modalitatiEvaluare: string[];
  bibliografie: string[];
};

/** An școlar implicit: septembrie-august, ca la orice calendar școlar românesc. */
export function anScolarImplicit(dataCurenta: Date): string {
  const an = dataCurenta.getFullYear();
  const luna = dataCurenta.getMonth() + 1; // 1-12
  return luna >= 9 ? `${an}-${an + 1}` : `${an - 1}-${an}`;
}

function competenteSpecificePentruModul(modul: Modul): string {
  return `Aplicarea conceptelor de bază ale modulului ${modul.titlu}`;
}

export async function construiestePrograma(
  clasa: string,
  opts: { liceu: string | null; profesor: string; anScolar: string }
): Promise<ProgramaCompleta | null> {
  const capitol = getCapitol(clasa);
  const planificare = await getPlanificare(clasa);
  if (!capitol || !planificare) return null;

  const tabel: RandCompetenteConținuturi[] = planificare.unitati.map((u) => {
    const modul = capitol.module.find((m) => m.cod === u.modulCod);
    return {
      unitate: `${u.modulCod} — ${u.modulTitlu}`,
      competenteSpecifice: modul ? competenteSpecificePentruModul(modul) : u.competente,
      continuturi: modul ? modul.sublectii.map((s) => s.titlu) : [],
      oreAlocate: u.oreAlocate,
      saptamana: u.saptamanaEstimata,
    };
  });

  const totalOre = tabel.reduce((acc, r) => acc + r.oreAlocate, 0);
  const ore = ORE_SAPTAMANA_OFICIAL[clasa.toUpperCase()] ?? { total: 0, teorie: 0, practica: 0 };

  return {
    paginaTitlu: {
      liceu: opts.liceu || "[Completează numele liceului]",
      disciplina: "Informatică",
      clasa,
      durataOreSaptamana: ore.total,
      durataOreTeoriePractica: `${ore.teorie} ore teorie + ${ore.practica} ore activități practice`,
      durataOreTotal: totalOre,
      profesor: opts.profesor,
      anScolar: opts.anScolar,
    },
    notaDePrezentare: [
      "Prezentul document este o planificare calendaristică pentru disciplina Informatică (curriculum de specialitate, regim intensiv), structurată pe unități de învățare, cu competențele specifice și conținuturile aferente fiecărui modul, numărul de ore alocat și săptămâna estimată de parcurgere.",
      `Conform Ordinului ministrului educației și cercetării nr. 4.370/2026 (Anexele 8-11), pentru filiera teoretică, profilul real, specializarea matematică-informatică, clase cu predarea disciplinei informatică în regim intensiv, alocarea orară pentru clasa a ${clasa}-a este de ${ore.total} ore/săptămână (${ore.teorie} ore studiu teoretic și ${ore.practica} ore activități practice, desfășurate obligatoriu în laboratorul de informatică).`,
      "Programa e construită pe limbajul Python ca instrument principal de formare a gândirii algoritmice, cu C++ pentru înțelegerea mecanismelor interne ale programării și module de baze de date (SQL) și noțiuni introductive de învățare automată — aplicarea se face progresiv, începând cu clasa a IX-a din anul școlar 2026-2027.",
      "Platforma Academia Python (academiapython.ro) e construită direct pe această programă, cu exerciții interactive rulate în browser și verificare automată a codului — planificarea de mai jos reflectă exact structura de module și sublecții deja disponibilă pe platformă.",
    ],
    competenteCheie: [
      "Competențe digitale",
      "Competențe în matematică, științe, tehnologie și inginerie",
    ],
    competenteGenerale: COMPETENTE_GENERALE_OFICIALE,
    notaValoriSiAtitudini: NOTA_VALORI_SI_ATITUDINI,
    tabel,
    sugestiiMetodologice: [
      "Se recomandă desfășurarea orelor într-un laborator de informatică, cu acces la calculatoare și la internet pentru fiecare elev sau pereche de elevi — activitățile practice sunt obligatorii în laborator, conform programei oficiale.",
      "Predarea se bazează pe exerciții practice de cod, nu doar pe teorie — elevul scrie și rulează Python de la prima oră, cu feedback imediat asupra rezultatului.",
      "Editorul Python integrat al platformei Academia Python (rulare directă în browser, fără instalare) poate fi folosit atât pentru exercițiile din timpul orei, cât și pentru temele pentru acasă.",
      "Activități recomandate: rezolvarea exercițiilor ghidate și independente de pe fiecare sublecție, proiecte mici de sfârșit de modul, recapitulare prin quiz-urile de verificare deja disponibile pe platformă.",
    ],
    modalitatiEvaluare: [
      "Lucrări practice — exerciții de cod evaluate prin corectitudinea rezultatului obținut la rulare.",
      "Proiecte — aplicații mai ample, la finalul unor module sau al semestrului.",
      "Teste — pe bază de întrebări grilă, generate direct din banca de quiz-uri a platformei; vezi secțiunea „Generator de teste” din zona de profesor, care produce automat testul și baremul din exact aceleași întrebări.",
    ],
    bibliografie: [
      "Ordinul ministrului educației și cercetării nr. 4.370/2026 (Anexele 8-11) — programele școlare pentru disciplina Informatică, curriculum de specialitate, regim intensiv, publicat în Monitorul Oficial al României, Partea I, nr. 591 bis din 20 iulie 2026.",
      "Ordinul ministrului educației și cercetării nr. 6.873/2025 — planurile-cadru pentru clasele cu predarea disciplinei informatică în regim intensiv.",
      "Documentația oficială Python — docs.python.org",
      "W3Schools Python Tutorial — w3schools.com/python",
      "Real Python — realpython.com",
      "Resurse Academia Python — academiapython.ro",
    ],
  };
}
