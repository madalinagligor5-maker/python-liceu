/**
 * Rulează cod Python într-un Web Worker (public/python-worker.js).
 *
 * De ce nu direct pe pagină: pe firul principal, o buclă infinită îngheață
 * tot tabul, iar un „timeout" cu setTimeout nici nu mai apucă să se execute.
 * Worker-ul poate fi oprit oricând (terminate), fără să blocheze interfața.
 * După o oprire, următoarea rulare pornește un worker nou (reîncarcă
 * interpretorul din cache-ul browserului).
 */

export type EroarePython = {
  /** Tipul excepției Python, ex. "SyntaxError", "NameError". */
  tip: string;
  detaliu: string;
  /** Linia din codul elevului unde a apărut eroarea (dacă e cunoscută). */
  linie: number | null;
  traceback: string;
};

export type RezultatRulare =
  | { status: "ok"; trunchiat: boolean }
  | { status: "eroare-python"; eroare: EroarePython; trunchiat: boolean }
  | { status: "timeout" }
  | { status: "oprit" }
  | { status: "eroare-incarcare"; mesaj: string };

export type OptiuniRulare = {
  /** Date de intrare pentru input(), câte una pe rând. */
  intrare?: string;
  onStdout?: (text: string) => void;
  onStderr?: (text: string) => void;
  /** Apelat când interpretorul e încărcat și codul începe să ruleze. */
  onStart?: () => void;
  /** Limita de timp pentru execuție (fără timpul de încărcare). Implicit 8 s. */
  limitaMs?: number;
};

export const LIMITA_IMPLICITA_MS = 8000;

let worker: Worker | null = null;
let interpretorIncarcat = false;
let urmatorId = 1;
/** Rulările în curs; dacă worker-ul e oprit, toate se încheie, nu rămân agățate. */
const inCurs = new Set<(r: RezultatRulare) => void>();

function obtineWorker(): Worker {
  if (!worker) {
    worker = new Worker("/python-worker.js");
    interpretorIncarcat = false;
  }
  return worker;
}

function distrugeWorker() {
  worker?.terminate();
  worker = null;
  interpretorIncarcat = false;
  for (const inchide of [...inCurs]) inchide({ status: "oprit" });
}

/** True dacă interpretorul e deja încărcat (rularea va începe imediat). */
export function esteInterpretorIncarcat(): boolean {
  return interpretorIncarcat;
}

/** Pornește încărcarea interpretorului din timp (ex. când editorul devine vizibil). */
export function preincarcaPython(): void {
  if (typeof window === "undefined" || typeof Worker === "undefined") return;
  const w = obtineWorker();
  if (!interpretorIncarcat) w.postMessage({ tip: "preincarca" });
}

export function ruleazaPython(
  cod: string,
  optiuni: OptiuniRulare = {}
): { rezultat: Promise<RezultatRulare>; opreste: () => void } {
  if (typeof window === "undefined" || typeof Worker === "undefined") {
    return {
      rezultat: Promise.resolve({
        status: "eroare-incarcare",
        mesaj: "Browserul nu permite rularea codului în fundal (Web Worker).",
      }),
      opreste: () => {},
    };
  }

  const id = urmatorId++;
  const w = obtineWorker();
  let terminat = false;
  let cronometru: ReturnType<typeof setTimeout> | null = null;
  let rezolva: (r: RezultatRulare) => void = () => {};

  const rezultat = new Promise<RezultatRulare>((res) => {
    rezolva = res;
  });

  const finalizeaza = (r: RezultatRulare, oprireWorker = false) => {
    if (terminat) return;
    terminat = true;
    inCurs.delete(finalizeaza);
    if (cronometru) clearTimeout(cronometru);
    w.removeEventListener("message", asculta);
    w.removeEventListener("error", laEroare);
    if (oprireWorker) distrugeWorker();
    rezolva(r);
  };

  function asculta(e: MessageEvent) {
    const m = e.data as {
      tip: string;
      id?: number;
      text?: string;
      ok?: boolean;
      trunchiat?: boolean;
      mesaj?: string;
      eroare?: EroarePython;
    };
    if (m.tip === "gata-incarcare") {
      interpretorIncarcat = true;
      return;
    }
    if (m.tip === "eroare-incarcare") {
      finalizeaza({ status: "eroare-incarcare", mesaj: m.mesaj ?? "" }, true);
      return;
    }
    if (m.id !== id) return;
    if (m.tip === "start") {
      optiuni.onStart?.();
      cronometru = setTimeout(
        () => finalizeaza({ status: "timeout" }, true),
        optiuni.limitaMs ?? LIMITA_IMPLICITA_MS
      );
    } else if (m.tip === "stdout") {
      optiuni.onStdout?.(m.text ?? "");
    } else if (m.tip === "stderr") {
      optiuni.onStderr?.(m.text ?? "");
    } else if (m.tip === "final") {
      finalizeaza(
        m.ok
          ? { status: "ok", trunchiat: Boolean(m.trunchiat) }
          : { status: "eroare-python", eroare: m.eroare!, trunchiat: Boolean(m.trunchiat) }
      );
    }
  }

  function laEroare(e: ErrorEvent) {
    e.preventDefault();
    finalizeaza(
      { status: "eroare-incarcare", mesaj: e.message || "Worker-ul Python a eșuat." },
      true
    );
  }

  inCurs.add(finalizeaza);
  w.addEventListener("message", asculta);
  w.addEventListener("error", laEroare);
  w.postMessage({ tip: "ruleaza", id, cod, intrare: optiuni.intrare ?? "" });

  return {
    rezultat,
    opreste: () => finalizeaza({ status: "oprit" }, true),
  };
}

/** Explicație scurtă, în română, pentru cele mai frecvente erori Python. */
export function explicaEroarea(e: EroarePython): string {
  const unde = e.linie ? ` (linia ${e.linie})` : "";
  switch (e.tip) {
    case "SyntaxError":
      return `Eroare de sintaxă${unde}: Python nu poate citi linia așa cum e scrisă. Verifică parantezele, ghilimelele și cele două puncte „:” de la final de if/for/while/def.`;
    case "IndentationError":
    case "TabError":
      return `Indentare greșită${unde}: liniile din interiorul unui bloc (după „:”) trebuie să aibă aceeași retragere, de obicei 4 spații.`;
    case "NameError":
      return `Nume necunoscut${unde}: folosești o variabilă sau o funcție care nu a fost definită încă. Verifică dacă e scrisă exact la fel (litere mari/mici) și dacă i-ai dat o valoare înainte.`;
    case "TypeError":
      return `Tipuri incompatibile${unde}: operația nu se poate face cu aceste valori (de exemplu, text + număr). Folosește int(), float() sau str() pentru conversie.`;
    case "ValueError":
      return `Valoare nepotrivită${unde}: funcția a primit o valoare pe care nu o poate folosi (de exemplu, int("abc")).`;
    case "ZeroDivisionError":
      return `Împărțire la zero${unde}: verifică împărțitorul înainte de a împărți.`;
    case "IndexError":
      return `Index în afara listei${unde}: poziția cerută nu există. Pozițiile încep de la 0 și se termină la len(lista) - 1.`;
    case "KeyError":
      return `Cheie inexistentă${unde}: dicționarul nu conține cheia cerută.`;
    case "AttributeError":
      return `Atribut sau metodă inexistentă${unde}: valoarea nu are metoda folosită. Verifică numele metodei și tipul valorii.`;
    case "EOFError":
      return `Programul a cerut date cu input(), dar nu a mai primit niciuna. Scrie datele de intrare în câmpul „Date de intrare”, câte una pe rând.`;
    case "ModuleNotFoundError":
    case "ImportError":
      return `Modulul importat nu este disponibil în editorul din browser${unde}.`;
    case "RecursionError":
      return `Prea multe apeluri recursive${unde}: probabil funcția se apelează la nesfârșit. Verifică dacă are un caz de oprire.`;
    default:
      return `Programul s-a oprit cu o eroare de tip ${e.tip}${unde}.`;
  }
}
