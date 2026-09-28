/**
 * Cele patru trasee de învățare existente, prezentate identic pe pagina
 * principală, pe /start și în navigație. Fiecare traseu are o „primă
 * activitate" — pagina concretă unde vizitatorul începe, fără să treacă prin
 * curriculumul complet.
 *
 * Accesul gratuit descris aici reflectă structura reală (content/*.json și
 * src/lib/acces.ts); dacă se schimbă oferta, se actualizează doar aici.
 */
export type Traseu = {
  id: "kids" | "gimnaziu" | "liceu" | "curs-practic";
  nume: string;
  icon: string;
  /** O linie scurtă, pentru meniuri. */
  subtitlu: string;
  public: string;
  necesar: string;
  rezultat: string;
  gratuit: string;
  /** Prima activitate: unde ajunge vizitatorul după ce alege traseul. */
  primaActivitate: { href: string; eticheta: string };
  /** Pagina de ansamblu a traseului. */
  ansamblu: { href: string; eticheta: string };
  /** Opțional: o a doua intrare (ex. Python cu text pentru copii mai mari). */
  alternativa?: { href: string; eticheta: string };
};

export const TRASEE: Traseu[] = [
  {
    id: "kids",
    subtitlu: "Clasele I–IV · jocuri cu blocuri, gratuit",
    nume: "Kids",
    icon: "🎮",
    public: "Copii din clasele I–IV (aprox. 6–10 ani), împreună cu un părinte sau profesor.",
    necesar: "Nimic. Jocurile folosesc blocuri trase cu mouse-ul, fără tastare de cod.",
    rezultat: "Înțelege ideile de bază ale programării: pași în ordine, repetare, decizii.",
    gratuit: "Complet gratuit: toate cele 6 module Junior și lecțiile „Python pentru copii” (7–11 ani).",
    primaActivitate: { href: "/kids/junior", eticheta: "Începe primul joc" },
    ansamblu: { href: "/kids", eticheta: "Vezi toate activitățile Kids" },
    alternativa: {
      href: "/curriculum/P7/ce-este-python-primul-meu-program/P7.1.1",
      eticheta: "Python cu text, pentru 7–11 ani",
    },
  },
  {
    id: "gimnaziu",
    subtitlu: "Clasele VII–VIII · de la zero, gratuit",
    nume: "Gimnaziu",
    icon: "🌱",
    public: "Elevi din clasele a VII-a și a VIII-a sau oricine începe de la zero.",
    necesar: "Nimic. E util dacă ai folosit Scratch, dar nu e obligatoriu.",
    rezultat: "Scrie primele programe cu variabile, decizii, repetări și șiruri de valori.",
    gratuit: "Complet gratuit: toate cele 5 module, fără cont și fără card.",
    primaActivitate: {
      href: "/curriculum/VII/primii-pasi-in-python/VII.1.1",
      eticheta: "Începe prima lecție",
    },
    ansamblu: { href: "/curriculum/VII", eticheta: "Vezi modulele de gimnaziu" },
  },
  {
    id: "liceu",
    subtitlu: "Clasele IX–XII · pe programa de Informatică",
    nume: "Liceu",
    icon: "🎓",
    public: "Elevi din clasele IX–XII care studiază Informatica în Python.",
    necesar:
      "Pentru clasa a IX-a: nimic obligatoriu; dacă nu ai scris cod până acum, recomandăm întâi primul modul de gimnaziu.",
    rezultat: "Parcurge materia pe clase: algoritmi, funcții, structuri de date, programare orientată pe obiecte, proiecte.",
    gratuit:
      "Gratuit: primele 3 module din clasa a IX-a. Acces deschis, deocamdată: lecțiile modulelor 1–5 din fiecare clasă. Restul necesită abonament.",
    primaActivitate: {
      href: "/curriculum/IX/ce-este-un-algoritm-etapele-elaborarii-unui-program/1.1.1",
      eticheta: "Începe clasa a IX-a",
    },
    ansamblu: { href: "/curriculum", eticheta: "Vezi curriculumul de liceu" },
  },
  {
    id: "curs-practic",
    subtitlu: "Pentru oricine · Python aplicat, modulul 1 gratuit",
    nume: "Curs practic",
    icon: "🚀",
    public: "Adolescenți și adulți care vor Python practic, fără legătură cu programa școlară.",
    necesar: "Nimic. Cursul pornește de la zero.",
    rezultat: "Scrie programe utile: calcule, automatizări simple, primii pași în analiza de date.",
    gratuit: "Gratuit: modulul 1. Restul cursului necesită abonamentul separat al cursului practic.",
    primaActivitate: {
      href: "/curs-practic/ce-e-programarea-si-de-ce-python/CP1.1.1",
      eticheta: "Începe modulul 1",
    },
    ansamblu: { href: "/curs-practic", eticheta: "Vezi cursul practic" },
  },
];
