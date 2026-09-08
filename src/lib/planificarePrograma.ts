import { getCapitol, type Modul } from "@/lib/curriculum";
import { getPlanificare } from "@/lib/planificari";

/**
 * Construiește planificarea calendaristică completă, în formatul programei
 * școlare oficiale. Folosit atât de pagina web (/profesor/planificari/[clasa])
 * cât și de generatoarele de PDF/Word, ca să nu existe mai multe surse de
 * adevăr pentru același conținut.
 *
 * Pentru clasele X-XII, sursa e Ordinul ministrului educației și cercetării
 * nr. 4.370/2026 (Monitorul Oficial nr. 591 bis/20.VII.2026), Anexele 2-11.
 *
 * Pentru clasa a IX-a, cele 3 profiluri "regulate" (mate-info, militar,
 * științe ale naturii) NU sunt în Ordinul 4.370/2026 — sunt aprobate separat
 * prin Anexele nr. 42, 43 și 66 la OMEC nr. 6930/19.12.2025 (verificat direct
 * în pachetul de Repere metodologice 2026-2027 primit de la utilizatoare,
 * secțiunea de bibliografie: "Anexa nr. 42 la OMEC nr. 6930/19.12.2025" pentru
 * mate-info, "Anexa nr. 43" pentru științe ale naturii, "Anexa nr. 66" pentru
 * militar). Regimul intensiv la clasa a IX-a rămâne pe Anexa 8 la Ordinul
 * 4.370/2026, ca înainte — deci toate cele 4 profiluri au acum anexă proprie
 * pentru clasa a IX-a (nu mai există gol de acoperire, cum am semnalat
 * anterior din citirea Ordinului 4.370/2026 — golul era real în ACEL ordin,
 * dar acoperirea vine din alt ordin, publicat cu 7 luni înainte).
 *
 * Competențele generale (CG1-CG6) sunt identice în toate profilurile și
 * clasele — verificat atât în Ordinul 4.370/2026 cât și în pachetul pentru
 * clasa a IX-a (foaia "CG integral" din Orientare_si_sprijin_planificare).
 *
 * Tabelul "Competențe specifice și conținuturi":
 *  - Pentru clasa a IX-a, la profilurile mate-info / militar / științe ale
 *    naturii, folosește direct unitățile și orele orientative din pachetul
 *    oficial primit (foile "Planificare MI/SN/MIL" din
 *    Orientare_si_sprijin_planificare_Informatica_IX_TC_2026-2027.xlsx,
 *    document al MEC-CNCE) — sursa explică ea însăși că rubricația e "model
 *    agregat, orientativ", nu o machetă oficială obligatorie, notă păstrată
 *    și aici, în paragraful de prezentare.
 *  - Pentru regim intensiv (toate clasele) și pentru mate-info/militar la
 *    X-XII, folosește structura proprie de module a platformei Academia
 *    Python (identică între aceste profiluri — programa oficială diferă doar
 *    în metadate, nu în lecțiile platformei).
 *
 * "Valori și atitudini" nu mai există ca secțiune separată în structura
 * oficială curentă — componentele programei sunt Nota de prezentare,
 * Competențe generale, Competențe specifice cu exemple de activități de
 * învățare, Conținuturi și Sugestii metodologice. Secțiunea rămâne în
 * planificare (cerută explicit de utilizatoare), cu o notă corectă în loc
 * de conținut inventat.
 *
 * Coloana "Măsuri de reglare" a fost adăugată după modelul de planificare
 * calendaristică primit de la utilizatoare (machetă standard folosită în
 * inspecție) — rămâne goală, de completat de profesor pe parcursul anului,
 * pe măsură ce evaluează progresul elevilor.
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
  /** Citarea completă a sursei (anexă + ordin), per clasă — diferă între IX și X-XII pentru unele profiluri. */
  citatii: Partial<Record<string, string>>;
  ore: Partial<Record<string, OreSaptamana>>;
};

const CITARE_ORDIN_4370 = "Ordinul ministrului educației și cercetării nr. 4.370/2026 (Monitorul Oficial nr. 591 bis/20.VII.2026)";
const CITARE_OMEC_6930 = "OMEC nr. 6930/19.12.2025";

const PROFILE: DefinitieProfil[] = [
  {
    id: "regim-intensiv",
    eticheta: "Regim intensiv (Anexele 8-11)",
    filieraProfilSpecializare:
      "filiera teoretică, profilul real, specializarea matematică-informatică, clase cu predarea disciplinei informatică în regim intensiv",
    citatii: {
      IX: `Anexa nr. 8 la ${CITARE_ORDIN_4370}`,
      X: `Anexa nr. 9 la ${CITARE_ORDIN_4370}`,
      XI: `Anexa nr. 10 la ${CITARE_ORDIN_4370}`,
      XII: `Anexa nr. 11 la ${CITARE_ORDIN_4370}`,
    },
    ore: {
      IX: { total: 4, teorie: 2, practica: 2 },
      X: { total: 4, teorie: 2, practica: 2 },
      XI: { total: 7, teorie: 4, practica: 3 },
      XII: { total: 7, teorie: 4, practica: 3 },
    },
  },
  {
    id: "mate-info",
    eticheta: "Mate-info (regim normal)",
    filieraProfilSpecializare: "filiera teoretică, profilul real, specializarea matematică-informatică",
    citatii: {
      IX: `Anexa nr. 42 la ${CITARE_OMEC_6930}`,
      X: `Anexa nr. 2 la ${CITARE_ORDIN_4370}`,
      XI: `Anexa nr. 3 la ${CITARE_ORDIN_4370}`,
      XII: `Anexa nr. 4 la ${CITARE_ORDIN_4370}`,
    },
    ore: {
      IX: { total: 2, teorie: 1, practica: 1 },
      X: { total: 2, teorie: 1, practica: 1 },
      XI: { total: 4, teorie: 2, practica: 2 },
      XII: { total: 3, teorie: 1, practica: 2 },
    },
  },
  {
    id: "militar",
    eticheta: "Profil militar",
    filieraProfilSpecializare: "filiera vocațională, profilul militar, specializarea matematică-informatică militară",
    citatii: {
      IX: `Anexa nr. 66 la ${CITARE_OMEC_6930}`,
      X: `Anexa nr. 5 la ${CITARE_ORDIN_4370}`,
      XI: `Anexa nr. 6 la ${CITARE_ORDIN_4370}`,
      XII: `Anexa nr. 4 la ${CITARE_ORDIN_4370}`,
    },
    ore: {
      IX: { total: 3, teorie: 1, practica: 2 },
      X: { total: 3, teorie: 1, practica: 2 },
      XI: { total: 3, teorie: 1, practica: 2 },
      XII: { total: 3, teorie: 1, practica: 2 },
    },
  },
  {
    id: "stiinte-naturii",
    eticheta: "Științe ale naturii",
    filieraProfilSpecializare: "filiera teoretică, profilul real, specializarea științe ale naturii",
    citatii: {
      IX: `Anexa nr. 43 la ${CITARE_OMEC_6930}`,
      X: `Anexa nr. 7 la ${CITARE_ORDIN_4370}`,
    },
    ore: {
      IX: {
        total: 1,
        teorie: 1,
        practica: 0,
        notaSplit: "1 oră/săptămână — studiu teoretic și activități practice, fără separare orară explicită",
      },
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

// CG1-CG6, identice în toate profilurile și clasele — verificat atât în
// Ordinul 4.370/2026 (Anexele 2-11) cât și în pachetul oficial pentru clasa
// a IX-a (foaia "CG integral").
const COMPETENTE_GENERALE_OFICIALE = [
  "CG1 — Identifică principalele caracteristici ale modelelor conceptuale și operaționale ale dezvoltării produselor software, pentru înțelegerea fundamentelor programării.",
  "CG2 — Explică principii care stau la baza modelelor conceptuale și operaționale ale dezvoltării produselor software, pentru a fundamenta în mod logic proiectarea și implementarea soluțiilor informatice.",
  "CG3 — Utilizează modele conceptuale și operaționale ale dezvoltării produselor software, în scopul obținerii de soluții informatice funcționale și eficiente.",
  "CG4 — Analizează caracteristicile și aplicabilitatea modelelor conceptuale și operaționale ale dezvoltării produselor software, pentru a selecta soluțiile cele mai potrivite în funcție de contextul informatic dat.",
  "CG5 — Evaluează corectitudinea și eficiența soluțiilor informatice, în vederea optimizării și asigurării funcționalității în diverse scenarii de utilizare.",
  "CG6 — Elaborează algoritmi și programe personalizate, pentru a crea soluții informatice coerente și adaptate cerințelor.",
];

const NOTA_VALORI_SI_ATITUDINI =
  "Structura oficială curentă a programei nu mai definește „Valori și atitudini” ca secțiune separată — componentele programei sunt Nota de prezentare, Competențele generale, Competențele specifice cu exemple de activități de învățare, Conținuturile și Sugestiile metodologice. Dimensiunea atitudinală e integrată în Nota de prezentare și în exemplele de activități de învățare.";

export type RandCompetenteConținuturi = {
  unitate: string;
  competenteSpecifice: string;
  continuturi: string[];
  oreAlocate: number;
  saptamana: number;
  /** Completată de profesor pe parcursul anului — rămâne goală în planificarea generată. */
  masuriDeReglare: string;
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

/**
 * Unitățile orientative pentru clasa a IX-a, la profilurile mate-info,
 * militar și științe ale naturii — reproduse din foile "Planificare
 * MI/SN/MIL" ale documentului oficial MEC-CNCE
 * "Orientare și sprijin în elaborarea planificării calendaristice —
 * Informatică, clasa a IX-a" (pachetul 15_2_INFO_07_09_2026). Sursa insistă
 * explicit: e un "model agregat, orientativ", nu o machetă oficială
 * obligatorie — rămâne responsabilitatea profesorului să adapteze orele și
 * ordinea la ritmul propriu al clasei.
 *
 * Codurile de competențe (ex. "CS 1.2–6.2") grupează aceeași competență
 * specifică (după al doilea număr) pe cele 6 competențe generale — sursa
 * folosește "CSx.N" ca prescurtare pentru "CS 1.N, 2.N, 3.N, 4.N, 5.N, 6.N".
 */
type UnitateOrientativaIX = {
  /** Coduri ale modulelor Academia Python care acoperă acest domeniu — verificate prin comparație directă cu content/structura_curriculum.json. */
  moduleCod: string[];
  unitate: string;
  continuturi: string[];
  competenteCod: string;
  oreOrientative: { mateInfo: number; militar: number; stiinteNaturii: number | null };
};

const UNITATI_ORIENTATIVE_IX: UnitateOrientativaIX[] = [
  {
    moduleCod: ["1.1", "1.2", "1.3"],
    unitate: "Strategii de rezolvare a problemelor — Principii de elaborare a unui program",
    continuturi: [
      "gândire computațională și etapele elaborării unui program (analiză, proiectare, implementare, testare, depanare)",
      "moduri de reprezentare a algoritmilor: blocuri grafice, pseudocod, limbaj de programare",
      "criterii de elaborare a testelor; eficiența algoritmilor (spațiu, timp, notația O)",
      "moduri de comunicare cu programul: consolă, interfață grafică, fișiere",
    ],
    competenteCod: "CS 1.3–6.3",
    oreOrientative: { mateInfo: 2, militar: 2, stiinteNaturii: 2 },
  },
  {
    moduleCod: ["1.15"],
    unitate: "Organizarea conceptuală a datelor — Modelul conceptual liniar (listă)",
    continuturi: [
      "caracteristicile unei liste și ale cazurilor particulare (stivă, coadă, acces direct/secvențial), listă de frecvențe",
      "repere pentru parcurgerea elementelor și aplicarea algoritmilor de bază, cu sau fără memorare",
    ],
    competenteCod: "CS 1.1–6.1",
    oreOrientative: { mateInfo: 3, militar: 6, stiinteNaturii: 1 },
  },
  {
    moduleCod: ["1.7", "1.8", "1.9"],
    unitate: "Strategii de rezolvare a problemelor — Prelucrări ale datelor numerice",
    continuturi: [
      "operații cu cifrele unui număr, determinarea unui divizor/multiplu",
      "algoritmul lui Euclid pentru cel mai mare divizor comun (scăderi/împărțiri repetate)",
      "transformarea unui număr dintr-o bază de numerație în alta",
    ],
    competenteCod: "CS 1.2–6.2",
    oreOrientative: { mateInfo: 10, militar: 14, stiinteNaturii: 6 },
  },
  {
    moduleCod: ["1.18"],
    unitate: "Strategii de rezolvare a problemelor — Metode de generare sistematică a elementelor unei liste",
    continuturi: [
      "generarea unor secvențe de valori: secvențe cu proprietăți date, termeni ai unor expresii matematice, termeni ai unor șiruri recurente",
    ],
    competenteCod: "CS 1.2–6.2",
    oreOrientative: { mateInfo: 6, militar: 9, stiinteNaturii: 3 },
  },
  {
    moduleCod: ["1.19", "1.20"],
    unitate: "Strategii de rezolvare a problemelor — Metode de sortare a elementelor unei liste",
    continuturi: [
      "metoda de sortare prin selecția minimului",
      "metoda de sortare cu listă de frecvențe",
      "metoda bulelor",
    ],
    competenteCod: "CS 1.2–6.2",
    oreOrientative: { mateInfo: 6, militar: 6, stiinteNaturii: 3 },
  },
  {
    moduleCod: ["1.4", "1.5", "1.6"],
    unitate: "Memorarea datelor și organizarea codului — Subprograme",
    continuturi: [
      "antet, corp, variabile locale/globale, parametri, valoare returnată, apel, mecanism de executare",
      "sintaxă pentru definiția și apelul unui subprogram în Python",
      "subprograme predefinite pentru operații matematice uzuale, conversii și colecții (len, min, max, sum)",
    ],
    competenteCod: "CS 1.5–6.5",
    oreOrientative: { mateInfo: 8, militar: 10, stiinteNaturii: 5 },
  },
  {
    moduleCod: ["1.11"],
    unitate: "Memorarea datelor și organizarea codului — Introducere în programarea orientată pe obiecte",
    continuturi: [
      "noțiuni de bază: clasă, membri (date și metode), obiecte, biblioteci",
      "instanțierea unei clase predefinite, acces la membrii unui obiect",
    ],
    competenteCod: "CS 1.5–6.5",
    oreOrientative: { mateInfo: 1, militar: 3, stiinteNaturii: 1 },
  },
  {
    moduleCod: ["1.16", "1.17"],
    unitate: "Memorarea datelor și organizarea codului — Clasa list din Python",
    continuturi: [
      "operatori: acces, apartenență, non-apartenență, concatenare, multiplicare, relaționare",
      "metode: index(), count(), pop(), remove(), insert(), append(), copy(), sort()",
    ],
    competenteCod: "CS 1.4–6.4",
    oreOrientative: { mateInfo: 5, militar: 10, stiinteNaturii: 3 },
  },
  {
    moduleCod: ["1.14"],
    unitate: "Memorarea datelor și organizarea codului — Fișiere text",
    continuturi: [
      "caracteristici, principii de lucru: deschidere, închidere, transfer de date",
      "clasa TextIOWrapper din Python, metode de bază pentru citire, scriere, închidere",
    ],
    competenteCod: "CS 1.4–6.4",
    oreOrientative: { mateInfo: 4, militar: 6, stiinteNaturii: 2 },
  },
  {
    moduleCod: ["1.12", "1.13"],
    unitate: "Memorarea datelor și organizarea codului — Biblioteca Tkinter pentru interfețe grafice",
    continuturi: [
      "clase, funcții și metode de bază: Tk, Label, Button, Entry, Text, Frame, Canvas",
      "afișarea mesajelor și organizarea ferestrei: pack, grid, place, get",
    ],
    competenteCod: "CS 1.4–6.4",
    // Științe ale naturii nu are Tkinter ca domeniu distinct (verificat în foaia "Diferențe între programe").
    oreOrientative: { mateInfo: 6, militar: 10, stiinteNaturii: null },
  },
];

/** Ultimul rând din fiecare foaie oficială: "Integrare și rezervă" — rezerva curriculară de 25%, comună tuturor. */
const ORE_INTEGRARE_REZERVA_IX = { mateInfo: 16, militar: 26, stiinteNaturii: 8 };

function tabelOrientativIX(profil: "mate-info" | "militar" | "stiinte-naturii"): RandCompetenteConținuturi[] {
  const cheie = profil === "mate-info" ? "mateInfo" : profil === "militar" ? "militar" : "stiinteNaturii";
  let saptamanaCurenta = 1;
  const randuri: RandCompetenteConținuturi[] = [];

  for (const u of UNITATI_ORIENTATIVE_IX) {
    const ore = u.oreOrientative[cheie];
    if (ore == null) continue; // domeniu care nu există la acest profil (ex. Tkinter la științe ale naturii)
    const saptamani = Math.max(1, Math.round(ore / (cheie === "militar" ? 3 : cheie === "stiinteNaturii" ? 1 : 2)));
    // La profilul militar, "Prelucrări ale datelor numerice" include suplimentar ciurul lui
    // Eratostene și exponențierea rapidă (modulul 1.10) — verificat în foaia "Diferențe între programe".
    const moduleCod =
      cheie === "militar" && u.unitate.includes("Prelucrări ale datelor numerice")
        ? [...u.moduleCod, "1.10"]
        : u.moduleCod;
    randuri.push({
      unitate: `${moduleCod.join(", ")} — ${u.unitate}`,
      competenteSpecifice: u.competenteCod,
      continuturi: u.continuturi,
      oreAlocate: ore,
      saptamana: saptamanaCurenta,
      masuriDeReglare: "",
    });
    saptamanaCurenta += saptamani;
  }

  const oreRezerva = ORE_INTEGRARE_REZERVA_IX[cheie];
  randuri.push({
    unitate: "Integrare, recapitulare și rezerva curriculară (25%)",
    competenteSpecifice: "toate competențele specifice",
    continuturi: [
      "remediere, consolidare, aprofundare sau extindere, la decizia profesorului, în funcție de progresul clasei",
    ],
    oreAlocate: oreRezerva,
    saptamana: saptamanaCurenta,
    masuriDeReglare: "",
  });

  return randuri;
}

/** Profilurile oficiale disponibile pentru o clasă dată — nu toate profilurile au anexă pentru fiecare an. */
export function profileDisponibile(clasa: string): { id: ProfilOficial; eticheta: string }[] {
  const clasaKey = clasa.toUpperCase();
  return PROFILE.filter((p) => p.citatii[clasaKey] != null).map((p) => ({ id: p.id, eticheta: p.eticheta }));
}

function rezolvaProfil(clasa: string, profilCerut: string | undefined): DefinitieProfil {
  const clasaKey = clasa.toUpperCase();
  const disponibile = PROFILE.filter((p) => p.citatii[clasaKey] != null);
  const gasit = disponibile.find((p) => p.id === profilCerut);
  if (gasit) return gasit;
  return disponibile.find((p) => p.id === PROFIL_IMPLICIT) ?? disponibile[0];
}

export async function construiestePrograma(
  clasa: string,
  opts: { liceu: string | null; profesor: string; anScolar: string; profil?: string }
): Promise<ProgramaCompleta | null> {
  const clasaKey = clasa.toUpperCase();
  const profilDef = rezolvaProfil(clasa, opts.profil);
  if (!profilDef) return null;

  const citare = profilDef.citatii[clasaKey];
  const ore = profilDef.ore[clasaKey] ?? { total: 0, teorie: 0, practica: 0 };

  const foloseșteTabelOrientativIX =
    clasaKey === "IX" && (profilDef.id === "mate-info" || profilDef.id === "militar" || profilDef.id === "stiinte-naturii");

  let tabel: RandCompetenteConținuturi[];
  if (foloseșteTabelOrientativIX) {
    tabel = tabelOrientativIX(profilDef.id as "mate-info" | "militar" | "stiinte-naturii");
  } else {
    const capitol = getCapitol(clasa);
    const planificare = await getPlanificare(clasa);
    if (!capitol || !planificare) return null;
    tabel = planificare.unitati.map((u) => {
      const modul = capitol.module.find((m) => m.cod === u.modulCod);
      return {
        unitate: `${u.modulCod} — ${u.modulTitlu}`,
        competenteSpecifice: modul ? competenteSpecificePentruModul(modul) : u.competente,
        continuturi: modul ? modul.sublectii.map((s) => s.titlu) : [],
        oreAlocate: u.oreAlocate,
        saptamana: u.saptamanaEstimata,
        masuriDeReglare: "",
      };
    });
  }

  const totalOre = tabel.reduce((acc, r) => acc + r.oreAlocate, 0);

  const oreDescriere = ore.notaSplit
    ? ore.notaSplit
    : `${ore.teorie} ore studiu teoretic și ${ore.practica} ore activități practice`;

  const notaDePrezentare = [
    `Prezentul document este o planificare calendaristică pentru disciplina Informatică (curriculum de specialitate, ${profilDef.filieraProfilSpecializare}), structurată pe unități de învățare, cu competențele specifice și conținuturile aferente, numărul de ore orientativ și săptămâna estimată de parcurgere.`,
    `Conform ${citare}, pentru ${profilDef.filieraProfilSpecializare}, alocarea orară pentru clasa a ${clasa}-a este de ${ore.total} ore/săptămână (${oreDescriere}, desfășurate obligatoriu în laboratorul de informatică). Rezerva curriculară e de 25% din timpul alocat disciplinei, la dispoziția cadrului didactic pentru remediere, consolidare, aprofundare sau extindere.`,
    "Programa e construită pe limbajul Python ca instrument principal de formare a gândirii algoritmice — pentru elevii care vin din gimnaziu cu C++ sau alt limbaj, miza tranziției e transferul cunoștințelor algoritmice, nu reînvățarea lor de la zero.",
  ];

  if (foloseșteTabelOrientativIX) {
    notaDePrezentare.push(
      "Unitățile de mai jos și numărul de ore orientativ reproduc modelul agregat din documentul oficial de orientare pentru clasa a IX-a, elaborat de Centrul Național pentru Curriculum și Evaluare — sursa precizează explicit că rubricația e orientativă și reflexivă, nu o machetă obligatorie: ordinea și numărul de ore rămân la decizia profesorului, cu rezerva de 25% inclusă separat, la final."
    );
  } else {
    notaDePrezentare.push(
      "Platforma Academia Python (academiapython.ro) e construită direct pe această programă, cu exerciții interactive rulate în browser și verificare automată a codului — planificarea de mai jos reflectă exact structura de module și sublecții deja disponibilă pe platformă."
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
    notaCompetenteGenerale: `Text oficial, identic pentru toate profilurile și clasele (${citare}).`,
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
      `${citare} — programa școlară pentru disciplina Informatică, curriculum de specialitate, ${profilDef.filieraProfilSpecializare}.`,
      "Ordinul ministrului educației și cercetării nr. 4.350/2025 — planurile-cadru pentru învățământul liceal cu frecvență zi.",
      "Documentația oficială Python — docs.python.org",
      "W3Schools Python Tutorial — w3schools.com/python",
      "Real Python — realpython.com",
      "Resurse Academia Python — academiapython.ro",
    ],
  };
}
