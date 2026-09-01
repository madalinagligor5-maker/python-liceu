import { getCapitol, type Modul } from "@/lib/curriculum";
import { getPlanificare } from "@/lib/planificari";

/**
 * Construiește planificarea calendaristică completă, în formatul programei
 * școlare oficiale — verificat direct din Monitorul Oficial nr. 591 bis din
 * 20 iulie 2026 (Ordinul ministrului educației și cercetării nr. 4.370/2026,
 * Anexele 2-11). Folosit atât de pagina web (/profesor/planificari/[clasa])
 * cât și de generatoarele de PDF/Word, ca să nu existe mai multe surse de
 * adevăr pentru același conținut.
 *
 * Ordinul publică programe distincte pe 4 "profiluri" oficiale — fiecare cu
 * propriile anexe și alocare orară (verificat direct în document, pagina 3,
 * Anexa nr. 1 — centralizatorul):
 *  - regim-intensiv: filiera teoretică, real, mate-info, regim intensiv —
 *    singurul profil cu anexă proprie pentru clasa a IX-a (Anexele 8-11).
 *  - mate-info: filiera teoretică, real, mate-info, regim normal — doar
 *    clasele X-XII (Anexele 2, 3, 4).
 *  - militar: filiera vocațională, militar, mate-info militară — doar
 *    clasele X-XII (Anexele 5, 6, 4 — anexa 4 e comună cu mate-info la XII).
 *  - stiinte-naturii: filiera teoretică, real, științe ale naturii — doar
 *    clasa X (Anexa 7).
 *
 * IMPORTANT — gol confirmat în sursă, nu presupunere: în acest ordin NU
 * există anexă pentru clasa a IX-a la mate-info regular, militar sau științe
 * ale naturii — deși notele de prezentare menționează alocarea orară pentru
 * toți anii (context informativ despre planul-cadru), Ministerul nu a
 * publicat programă detaliată (CG/CS/EAI/Conținuturi) pentru IX la aceste
 * profiluri în acest ordin. De aceea, pentru clasa a IX-a e disponibil doar
 * profilul "regim intensiv".
 *
 * Competențele generale (CG1-CG6) sunt IDENTICE în toate cele 10 anexe (2-11)
 * — verificat direct în document pe fiecare anexă, nu presupus.
 *
 * "Valori și atitudini" nu mai există ca secțiune separată în structura
 * oficială curentă (pagina 144 a documentului enumeră explicit componentele
 * programei: Notă de prezentare, Competențe generale, Competențe specifice
 * și exemple de activități de învățare, Conținuturi, Sugestii metodologice —
 * fără „Valori și atitudini", spre deosebire de formatul mai vechi din
 * modelele Word primite inițial). Secțiunea rămâne în planificare (cerută
 * explicit), dar cu o notă corectă în loc de conținut inventat sau atribuit
 * greșit ordinului.
 *
 * Tabelul de "Competențe specifice și conținuturi" reflectă mereu structura
 * proprie de module a platformei Academia Python (identică pentru toate
 * profilurile) — programa oficială diferă între profiluri doar în metadate
 * (anexă, filieră/profil/specializare, alocare orară), nu în lecțiile
 * platformei.
 */

export type ProfilOficial = "regim-intensiv" | "mate-info" | "militar" | "stiinte-naturii";

type OreSaptamana = {
  total: number;
  teorie: number;
  practica: number;
  notaSplit?: string;
};

type DefinitieProfil = {
  id: ProfilOficial;
  eticheta: string;
  filieraProfilSpecializare: string;
  anexe: Partial<Record<string, number>>;
  ore: Partial<Record<string, OreSaptamana>>;
};

const PROFILE: DefinitieProfil[] = [
  {
    id: "regim-intensiv",
    eticheta: "Regim intensiv (Anexele 8-11)",
    filieraProfilSpecializare:
      "filiera teoretică, profilul real, specializarea matematică-informatică, clase cu predarea disciplinei informatică în regim intensiv",
    anexe: { IX: 8, X: 9, XI: 10, XII: 11 },
    ore: {
      IX: { total: 4, teorie: 2, practica: 2 },
      X: { total: 4, teorie: 2, practica: 2 },
      XI: { total: 7, teorie: 4, practica: 3 },
      XII: { total: 7, teorie: 4, practica: 3 },
    },
  },
  {
    id: "mate-info",
    eticheta: "Mate-info (regim normal) — Anexele 2-4",
    filieraProfilSpecializare: "filiera teoretică, profilul real, specializarea matematică-informatică",
    anexe: { X: 2, XI: 3, XII: 4 },
    ore: {
      X: { total: 2, teorie: 1, practica: 1 },
      XI: { total: 4, teorie: 2, practica: 2 },
      XII: { total: 3, teorie: 1, practica: 2 },
    },
  },
  {
    id: "militar",
    eticheta: "Profil militar — Anexele 4-6",
    filieraProfilSpecializare: "filiera vocațională, profilul militar, specializarea matematică-informatică militară",
    anexe: { X: 5, XI: 6, XII: 4 },
    ore: {
      X: { total: 3, teorie: 1, practica: 2 },
      XI: { total: 3, teorie: 1, practica: 2 },
      XII: { total: 3, teorie: 1, practica: 2 },
    },
  },
  {
    id: "stiinte-naturii",
    eticheta: "Științe ale naturii — Anexa 7",
    filieraProfilSpecializare: "filiera teoretică, profilul real, specializarea științe ale naturii",
    anexe: { X: 7 },
    ore: {
      X: {
        total: 1,
        teorie: 1,
        practica: 0,
        notaSplit: "1 oră/săptămână comună, fără separare explicită teorie/practică (conform notei de prezentare a Anexei 7)",
      },
    },
  },
];

const PROFIL_IMPLICIT: ProfilOficial = "regim-intensiv";

// CG1-CG6, identice în cele 10 anexe (2-11) la Ordinul 4.370/2026 (verificat
// pe fiecare anexă în parte, nu presupus dintr-una singură).
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
    profil: ProfilOficial;
    profilEticheta: string;
    durataOreSaptamana: number;
    durataOreTeoriePractica: string;
    durataOreTotal: number;
    profesor: string;
    anScolar: string;
  };
  notaDePrezentare: string[];
  competenteCheie: string[];
  competenteGenerale: string[];
  notaCompetenteGenerale: string;
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

/** Profilurile oficiale disponibile pentru o clasă dată — nu toate profilurile au anexă pentru fiecare an. */
export function profileDisponibile(clasa: string): { id: ProfilOficial; eticheta: string }[] {
  const clasaKey = clasa.toUpperCase();
  return PROFILE.filter((p) => p.anexe[clasaKey] != null).map((p) => ({ id: p.id, eticheta: p.eticheta }));
}

function rezolvaProfil(clasa: string, profilCerut: string | undefined): DefinitieProfil {
  const clasaKey = clasa.toUpperCase();
  const disponibile = PROFILE.filter((p) => p.anexe[clasaKey] != null);
  const gasit = disponibile.find((p) => p.id === profilCerut);
  if (gasit) return gasit;
  return disponibile.find((p) => p.id === PROFIL_IMPLICIT) ?? disponibile[0];
}

export async function construiestePrograma(
  clasa: string,
  opts: { liceu: string | null; profesor: string; anScolar: string; profil?: string }
): Promise<ProgramaCompleta | null> {
  const capitol = getCapitol(clasa);
  const planificare = await getPlanificare(clasa);
  if (!capitol || !planificare) return null;

  const clasaKey = clasa.toUpperCase();
  const profilDef = rezolvaProfil(clasa, opts.profil);
  if (!profilDef) return null;

  const anexa = profilDef.anexe[clasaKey];
  const ore = profilDef.ore[clasaKey] ?? { total: 0, teorie: 0, practica: 0 };

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

  const oreDescriere = ore.notaSplit
    ? ore.notaSplit
    : `${ore.teorie} ore studiu teoretic și ${ore.practica} ore activități practice`;

  const notaDePrezentare = [
    `Prezentul document este o planificare calendaristică pentru disciplina Informatică (curriculum de specialitate, ${profilDef.filieraProfilSpecializare}), structurată pe unități de învățare, cu competențele specifice și conținuturile aferente fiecărui modul, numărul de ore alocat și săptămâna estimată de parcurgere.`,
    `Conform Ordinului ministrului educației și cercetării nr. 4.370/2026 (Anexa nr. ${anexa}), pentru ${profilDef.filieraProfilSpecializare}, alocarea orară pentru clasa a ${clasa}-a este de ${ore.total} ore/săptămână (${oreDescriere}, desfășurate obligatoriu în laboratorul de informatică).`,
    "Programa e construită pe limbajul Python ca instrument principal de formare a gândirii algoritmice, cu C++ pentru înțelegerea mecanismelor interne ale programării și module de baze de date (SQL) și noțiuni introductive de învățare automată — aplicarea se face progresiv, începând cu clasa a IX-a din anul școlar 2026-2027.",
    "Platforma Academia Python (academiapython.ro) e construită direct pe această programă, cu exerciții interactive rulate în browser și verificare automată a codului — planificarea de mai jos reflectă exact structura de module și sublecții deja disponibilă pe platformă (identică pentru toate profilurile oficiale — programa oficială diferă între profiluri doar în alocarea orară și în textul din Notă de prezentare).",
  ];

  if (clasaKey === "IX" && profilDef.id === "regim-intensiv") {
    notaDePrezentare.push(
      "Notă privind acoperirea oficială: în Ordinul 4.370/2026, singurul profil cu anexă proprie pentru clasa a IX-a este regimul intensiv (Anexa 8). Pentru mate-info regim normal, profilul militar și științe ale naturii, ordinul nu publică o programă detaliată (competențe specifice, exemple de activități, conținuturi) pentru clasa a IX-a — de aceea aceste profiluri sunt disponibile pe platformă începând cu clasa a X-a."
    );
  }

  return {
    paginaTitlu: {
      liceu: opts.liceu || "[Completează numele liceului]",
      disciplina: "Informatică",
      clasa,
      profil: profilDef.id,
      profilEticheta: profilDef.eticheta,
      durataOreSaptamana: ore.total,
      durataOreTeoriePractica: oreDescriere,
      durataOreTotal: totalOre,
      profesor: opts.profesor,
      anScolar: opts.anScolar,
    },
    notaDePrezentare,
    competenteCheie: [
      "Competențe digitale",
      "Competențe în matematică, științe, tehnologie și inginerie",
    ],
    competenteGenerale: COMPETENTE_GENERALE_OFICIALE,
    notaCompetenteGenerale: `Text oficial, identic pentru toate profilurile și clasele (Ordinul 4.370/2026, Anexa nr. ${anexa}).`,
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
      `Ordinul ministrului educației și cercetării nr. 4.370/2026 (Anexa nr. ${anexa}) — programa școlară pentru disciplina Informatică, curriculum de specialitate, ${profilDef.filieraProfilSpecializare}, publicat în Monitorul Oficial al României, Partea I, nr. 591 bis din 20 iulie 2026.`,
      "Ordinul ministrului educației și cercetării nr. 4.350/2025 — planurile-cadru pentru învățământul liceal cu frecvență zi.",
      "Documentația oficială Python — docs.python.org",
      "W3Schools Python Tutorial — w3schools.com/python",
      "Real Python — realpython.com",
      "Resurse Academia Python — academiapython.ro",
    ],
  };
}
