// ============================================================
// Academia Python Junior — Engine de execuție joc
// ============================================================
import type {
  BlocComanda,
  CelulaGrila,
  DirectieByte,
  StareJoc,
} from "./tipuri";

/** Adaugă offset de direcție la coordonate */
function deplasare(dir: DirectieByte): { dx: number; dy: number } {
  return (
    { N: { dx: 0, dy: -1 }, S: { dx: 0, dy: 1 }, E: { dx: 1, dy: 0 }, V: { dx: -1, dy: 0 } }[dir]
  );
}

function rotireStanga(dir: DirectieByte): DirectieByte {
  return ({ N: "V", V: "S", S: "E", E: "N" } as Record<DirectieByte, DirectieByte>)[dir];
}

function rotireDreapta(dir: DirectieByte): DirectieByte {
  return ({ N: "E", E: "S", S: "V", V: "N" } as Record<DirectieByte, DirectieByte>)[dir];
}

function esteValidaCelula(
  grila: CelulaGrila[][],
  x: number,
  y: number
): boolean {
  if (y < 0 || y >= grila.length) return false;
  if (x < 0 || x >= grila[0].length) return false;
  return grila[y][x] !== "perete";
}

/** Execută un bloc și returnează toate stările intermediare (pentru animație) */
function executaBloc(
  bloc: BlocComanda,
  stare: StareJoc,
  grila: CelulaGrila[][]
): StareJoc[] {
  if (stare.esuat || stare.completat) return [stare];

  if (bloc.tip === "merge_inainte") {
    const { dx, dy } = deplasare(stare.directie);
    const nx = stare.x + dx;
    const ny = stare.y + dy;
    if (!esteValidaCelula(grila, nx, ny)) {
      return [
        { ...stare, esuat: true, mesajEroare: "Byte s-a lovit de un perete! Încearcă altă cale." },
      ];
    }
    const urmatoarea: StareJoc = { ...stare, x: nx, y: ny };
    if (grila[ny][nx] === "tinta") {
      urmatoarea.completat = true;
    }
    if (grila[ny][nx] === "stea_bonus") {
      urmatoarea.steleColectate += 1;
    }
    return [urmatoarea];
  }

  if (bloc.tip === "intoarce_stanga") {
    return [{ ...stare, directie: rotireStanga(stare.directie) }];
  }

  if (bloc.tip === "intoarce_dreapta") {
    return [{ ...stare, directie: rotireDreapta(stare.directie) }];
  }

  if (bloc.tip === "repeta") {
    const stariFin: StareJoc[] = [];
    let curenta = stare;
    for (let i = 0; i < bloc.deOri; i++) {
      for (const sub of bloc.comenzi) {
        const pasuri = executaBloc(sub, curenta, grila);
        stariFin.push(...pasuri);
        curenta = pasuri[pasuri.length - 1];
        if (curenta.esuat || curenta.completat) return stariFin;
      }
    }
    return stariFin;
  }

  if (bloc.tip === "daca_stea") {
    const areStea = grila[stare.y][stare.x] === "stea_bonus";
    const ramura = areStea ? bloc.atunci : (bloc.altfel ?? []);
    const stariFin: StareJoc[] = [];
    let curenta = stare;
    for (const sub of ramura) {
      const pasuri = executaBloc(sub, curenta, grila);
      stariFin.push(...pasuri);
      curenta = pasuri[pasuri.length - 1];
      if (curenta.esuat || curenta.completat) return stariFin;
    }
    return stariFin;
  }

  return [stare];
}

/**
 * Execută o listă de blocuri și returnează TOATE stările intermediare,
 * util pentru animarea pas-cu-pas.
 */
export function executaProgramJoc(
  blocuri: BlocComanda[],
  startX: number,
  startY: number,
  startDir: DirectieByte,
  grila: CelulaGrila[][]
): StareJoc[] {
  const stareInitiala: StareJoc = {
    x: startX,
    y: startY,
    directie: startDir,
    steleColectate: 0,
    completat: false,
    esuat: false,
  };

  const istoric: StareJoc[] = [stareInitiala];
  let curenta = stareInitiala;

  for (const bloc of blocuri) {
    const pasuri = executaBloc(bloc, curenta, grila);
    istoric.push(...pasuri);
    curenta = pasuri[pasuri.length - 1];
    if (curenta.esuat || curenta.completat) break;
  }

  // Dacă programul s-a terminat fără a ajunge la țintă
  if (!curenta.completat && !curenta.esuat) {
    istoric.push({
      ...curenta,
      esuat: true,
      mesajEroare: "Byte nu a ajuns la steluță! Poate ai nevoie de mai mulți pași?",
    });
  }

  return istoric;
}

/**
 * Calculează numărul de stele (1-3) bazat pe numărul de încercări
 * și dacă soluția este optimă (nr. blocuri minim).
 */
export function calculeazaStele(
  incercari: number,
  nrBlocuriUtilizate: number,
  nrBlocuriOptim: number
): number {
  if (incercari === 1 && nrBlocuriUtilizate <= nrBlocuriOptim + 1) return 3;
  if (incercari <= 3) return 2;
  return 1;
}

/** Generează codul Python dintr-o listă de blocuri */
export function genereazaPython(blocuri: BlocComanda[], indent = 0): string {
  const tab = "    ".repeat(indent);
  return blocuri
    .map((b) => {
      if (b.tip === "merge_inainte") return `${tab}merge_inainte()`;
      if (b.tip === "intoarce_stanga") return `${tab}intoarce_stanga()`;
      if (b.tip === "intoarce_dreapta") return `${tab}intoarce_dreapta()`;
      if (b.tip === "repeta") {
        const corp = genereazaPython(b.comenzi, indent + 1);
        return `${tab}for i in range(${b.deOri}):\n${corp}`;
      }
      if (b.tip === "daca_stea") {
        const atunci = genereazaPython(b.atunci, indent + 1);
        if (b.altfel && b.altfel.length > 0) {
          const altfel = genereazaPython(b.altfel, indent + 1);
          return `${tab}if vad_stea():\n${atunci}\n${tab}else:\n${altfel}`;
        }
        return `${tab}if vad_stea():\n${atunci}`;
      }
      return "";
    })
    .join("\n");
}

/** Numără totalul blocurilor simple dintr-un program (ignoră blocurile container) */
export function numaraBlocuriSimple(blocuri: BlocComanda[]): number {
  let count = 0;
  for (const b of blocuri) {
    if (b.tip === "merge_inainte" || b.tip === "intoarce_stanga" || b.tip === "intoarce_dreapta") {
      count++;
    } else if (b.tip === "repeta") {
      count += numaraBlocuriSimple(b.comenzi);
    } else if (b.tip === "daca_stea") {
      count += numaraBlocuriSimple(b.atunci) + numaraBlocuriSimple(b.altfel ?? []);
    }
  }
  return count;
}
