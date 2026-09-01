import { getCapitol, type Modul } from "@/lib/curriculum";
import { getPlanificare } from "@/lib/planificari";

/**
 * Construiește planificarea calendaristică completă, în formatul oficial de
 * programă școlară (model trimis de fondatoare: planificări reale TIC,
 * clasele IX-XII, 2026-2027 — structura de secțiuni și tabelul de mai jos
 * urmează exact acel format). Folosit atât de pagina web
 * (/profesor/planificari/[clasa]) cât și de generatorul de PDF, ca să nu
 * existe două surse de adevăr pentru același conținut.
 *
 * "Competențe generale" și "Valori și atitudini" rămân null (placeholder) —
 * niciunul dintre documentele disponibile nu conține textul oficial pentru
 * Informatică/Ordinul 4.370/2026 (modelele primite sunt fie pentru alt
 * ordin/disciplină — TIC, O.M. 5099/2009 — fie programa unui opțional al
 * unui alt profesor). Decizie confirmată de fondatoare: placeholder explicit,
 * nu text inventat atribuit unui ordin ministerial real.
 */

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
    durataOreSaptamana: number | null;
    durataOreTotal: number;
    profesor: string;
    anScolar: string;
  };
  notaDePrezentare: string[];
  competenteCheie: string[];
  competenteGenerale: string[] | null;
  valoriSiAtitudini: string[] | null;
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
  const totalSaptamani = tabel.reduce((max, r) => Math.max(max, r.saptamana), 0);
  const oreSaptamana = totalSaptamani > 0 ? Math.round((totalOre / totalSaptamani) * 10) / 10 : null;

  return {
    paginaTitlu: {
      liceu: opts.liceu || "[Completează numele liceului]",
      disciplina: "Informatică",
      clasa,
      durataOreSaptamana: oreSaptamana,
      durataOreTotal: totalOre,
      profesor: opts.profesor,
      anScolar: opts.anScolar,
    },
    notaDePrezentare: [
      "Prezentul document este o planificare calendaristică pentru disciplina Informatică, structurată pe unități de învățare, cu competențele specifice și conținuturile aferente fiecărui modul, numărul de ore alocat și săptămâna estimată de parcurgere.",
      "Sistemul educațional românesc trece printr-o tranziție curriculară: Python devine limbajul de programare de bază în noua programă de liceu, oficializată prin OMEC nr. 6873/2025, cu aplicare graduală începând cu clasa a IX-a din anul școlar 2026-2027 și extindere anuală până la clasa a XII-a. Primul examen de Bacalaureat pe noua programă este planificat pentru 2030.",
      "Schimbarea nu este doar o înlocuire de sintaxă, ci o mutare a accentului spre gândirea algoritmică și rezolvarea de probleme: Python elimină o parte din bariera sintactică a limbajelor folosite anterior, lăsând loc pentru module noi — baze de date și SQL, precum și noțiuni introductive de învățare automată — alături de fundamentele deja consacrate ale programării structurate și orientate pe obiecte.",
      "Platforma Academia Python (academiapython.ro) e construită direct pe această programă, cu exerciții interactive rulate în browser și verificare automată a codului — planificarea de mai jos reflectă exact structura de module și sublecții deja disponibilă pe platformă.",
    ],
    competenteCheie: [
      "Competențe digitale",
      "Competențe în matematică, științe, tehnologie și inginerie",
    ],
    competenteGenerale: null,
    valoriSiAtitudini: null,
    tabel,
    sugestiiMetodologice: [
      "Se recomandă desfășurarea orelor într-un laborator de informatică, cu acces la calculatoare și la internet pentru fiecare elev sau pereche de elevi.",
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
      "Ordinul 4.370/2026 (Anexele 8-11) — programa școlară de Informatică pentru liceu.",
      "OMEC nr. 6873/2025 — actul normativ de oficializare a tranziției curriculare.",
      "Documentația oficială Python — docs.python.org",
      "W3Schools Python Tutorial — w3schools.com/python",
      "Real Python — realpython.com",
      "Resurse Academia Python — academiapython.ro",
    ],
  };
}
