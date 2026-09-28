/**
 * Parser Markdown minimal, fără dependențe externe.
 * Știe doar ce folosește conținutul lecțiilor:
 *  - heading de nivel 3 (### X.Y.Z Titlu) -> delimitează o sublecție
 *  - heading de nivel 1 (# Modulul X.Y — ...) -> delimitează un modul
 *  - **bold**, liste (- sau 1.), paragrafe, și blocuri de cod ```...```
 *
 * Nu folosim react-markdown/toast pentru a evita dependențe grele și
 * riscul de breaking changes pe Next 16.
 */

export type BlocCode = { tip: "code"; lang: string; code: string };
export type BlocText = { tip: "text"; html: string };
export type BlocCard = {
  tip: "card";
  variant: "tip" | "exemplu" | "atentie";
  html: string;
};
export type BlocVerificaCod = {
  tip: "verifica-cod";
  enunt: string;
  template?: string;
  expectedOutput?: string;
};
export type Bloc = BlocCode | BlocText | BlocCard | BlocVerificaCod;

export type SublectieContinut = {
  cod: string; // ex. "1.1.1"
  icon: string; // emoji din titlu
  titlu: string;
  module: string; // cod modul, ex. "1.1"
  blocuri: Bloc[];
  esteVerificare: boolean; // true pentru sublecțiile de tip „Verifică-ți înțelegerea"
  esteExercitii: boolean; // true pentru sublecțiile de exerciții (🤝/🎯) — redată de ExercitiiInteractive
};

export type ModulContinut = {
  cod: string; // "1.1"
  titlu: string;
  sublectii: SublectieContinut[];
};

function escapeaza(text: string): string {
  return text.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

/** Formatare inline pentru textul din afara codului: **bold**, *italic*. */
function formatareText(escapat: string): string {
  return escapat
    .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
    // *italic*: doar când asteriscul e lipit de text (nu „2 * 3 * 4").
    .replace(/(^|[^*\w])\*(?=\S)([^*\n]+?)(?<=\S)\*(?![*\w])/g, "$1<em>$2</em>");
}

/**
 * Transformă Markdown-ul inline în HTML minim, escapând restul:
 * `cod` -> <code> (conținutul rămâne exact, fără altă formatare),
 * **bold** -> <strong>, *italic* -> <em>. Codul inline e înlocuit temporar
 * cu marcaje, ca **`print()`** să devină cod îngroșat, nu asteriscuri.
 */
function inline(text: string): string {
  const coduri: string[] = [];
  const cuMarcaje = text.replace(/`([^`\n]+)`/g, (_, cod: string) => {
    coduri.push(`<code class="cod-inline">${escapeaza(cod)}</code>`);
    return `\u0000${coduri.length - 1}\u0000`;
  });
  return formatareText(escapeaza(cuMarcaje)).replace(/\u0000(\d+)\u0000/g, (_, i: string) => coduri[Number(i)]);
}

/** Împarte un bloc de text dintr-o sublecție în blocuri (paragrafe/liste/code). */
function parseazaBlocuri(lines: string[]): Bloc[] {
  const blocuri: Bloc[] = [];
  let i = 0;

  while (i < lines.length) {
    const linie = lines[i];

    // Directivă de card: :::tip / :::exemplu / :::atentie ... :::
    const dirMatch = linie.trim().match(/^:::(tip|exemplu|atentie)\s*$/);
    if (dirMatch) {
      const variant = dirMatch[1] as "tip" | "exemplu" | "atentie";
      const inner: string[] = [];
      i++;
      while (i < lines.length && lines[i].trim() !== ":::") {
        inner.push(lines[i]);
        i++;
      }
      i++; // sară ::: de închidere
      const continut = inner.join("\n").trim();
      // Suportăm un titlu opțional pe prima linie (## Titlu) urmat de rest.
      const liniiInner = continut.split("\n");
      let titluCard = "";
      let rest = continut;
      const hMatch = liniiInner[0]?.match(/^##\s+(.+)$/);
      if (hMatch && liniiInner.length > 1) {
        titluCard = hMatch[1].trim();
        rest = liniiInner.slice(1).join("\n").trim();
      }
      // Rânduri simple -> paragrafe; rânduri „- ..." consecutive -> listă.
      let corpHtml = "";
      let lista: string[] = [];
      const inchideLista = () => {
        if (lista.length) corpHtml += `<ul class="list-disc pl-5 space-y-1">${lista.join("")}</ul>`;
        lista = [];
      };
      const liniiCorp = rest.split("\n");
      for (let k = 0; k < liniiCorp.length; k++) {
        const l = liniiCorp[k];
        // Bloc de cod în interiorul cardului: redat ca <pre>, păstrând exact
        // spațiile (indentarea contează în Python).
        if (l.trimStart().startsWith("```")) {
          inchideLista();
          const cod: string[] = [];
          k++;
          while (k < liniiCorp.length && !liniiCorp[k].trimStart().startsWith("```")) {
            cod.push(liniiCorp[k]);
            k++;
          }
          corpHtml += `<pre class="card-cod"><code>${escapeaza(cod.join("\n"))}</code></pre>`;
          continue;
        }
        if (l.trim() === "") continue;
        const item = l.match(/^\s*[-*]\s+(.*)$/);
        if (item) {
          lista.push(`<li>${inline(item[1])}</li>`);
        } else {
          inchideLista();
          corpHtml += `<p>${inline(l)}</p>`;
        }
      }
      inchideLista();
      blocuri.push({
        tip: "card",
        variant,
        html: titluCard
          ? `<div class="bloc-card--titlu">${inline(titluCard)}</div>${corpHtml}`
          : corpHtml,
      });
      continue;
    }

    // Directivă de verificare prin cod: :::verifica-cod ... :::
    // Adaugă la quiz un item de scriere/corectare cod (transfer real de
    // competență), nu doar grilă. Format:
    //   ## Enunț (opțional)
    //   template: <cod>
    //   output: <așteptat>
    const verifMatch = linie.trim().match(/^:::verifica-cod\s*$/);
    if (verifMatch) {
      const inner: string[] = [];
      i++;
      while (i < lines.length && lines[i].trim() !== ":::") {
        inner.push(lines[i]);
        i++;
      }
      i++; // sară ::: de închidere
      const liniiInner = inner.join("\n").split("\n");
      const enuntBuf: string[] = [];
      let templateBuf: string[] | null = null;
      let outputBuf: string[] | null = null;
      let sectiune: "enunt" | "template" | "output" = "enunt";
      for (const l of liniiInner) {
        const tm = l.match(/^template:\s*(.*)$/);
        const om = l.match(/^output:\s*(.*)$/);
        if (tm) {
          templateBuf = [tm[1]];
          sectiune = "template";
        } else if (om) {
          outputBuf = [om[1]];
          sectiune = "output";
        } else if (sectiune === "enunt") {
          enuntBuf.push(l);
        } else if (sectiune === "template") {
          templateBuf!.push(l);
        } else {
          outputBuf!.push(l);
        }
      }
      const enunt = enuntBuf.join("\n").trim() || "Scrie codul care rezolvă cerința de mai sus.";
      const template = templateBuf ? templateBuf.join("\n").trim() || undefined : undefined;
      const expectedOutput = outputBuf ? outputBuf.join("\n").trim() || undefined : undefined;
      blocuri.push({ tip: "verifica-cod", enunt, template, expectedOutput });
      continue;
    }

    // Bloc de cod
    if (linie.trimStart().startsWith("```")) {
      const lang = linie.trim().slice(3).trim() || "python";
      const code: string[] = [];
      i++;
      while (i < lines.length && !lines[i].trimStart().startsWith("```")) {
        code.push(lines[i]);
        i++;
      }
      i++; // sară ``` de închidere
      blocuri.push({ tip: "code", lang, code: code.join("\n") });
      continue;
    }

    // Linie orizontală (---): separator vizual, nu text.
    if (/^\s*-{3,}\s*$/.test(linie)) {
      i++;
      continue;
    }

    // Titlu de secțiune (## sau ####) în afara cardurilor.
    const titluMatch = linie.match(/^\s*#{2,4}\s+(.+)$/);
    if (titluMatch) {
      blocuri.push({ tip: "text", html: `<h3 class="lectie-subtitlu">${inline(titluMatch[1].trim())}</h3>` });
      i++;
      continue;
    }

    // Listă (linii care încep cu - sau 1.)
    if (/^\s*([-*]|\d+\.)\s+/.test(linie)) {
      const items: string[] = [];
      while (i < lines.length && /^\s*([-*]|\d+\.)\s+/.test(lines[i])) {
        const m = lines[i].match(/^\s*([-*]|\d+\.)\s+(.*)$/);
        if (m) items.push(inline(m[2]));
        i++;
      }
      const lista = items.map((it) => `<li>${it}</li>`).join("");
      blocuri.push({ tip: "text", html: `<ul class="list-disc pl-5 space-y-1">${lista}</ul>` });
      continue;
    }

    // Paragraf (linii non-goale consecutive)
    if (linie.trim() !== "") {
      const para: string[] = [];
      while (
        i < lines.length &&
        lines[i].trim() !== "" &&
        !lines[i].trimStart().startsWith("```") &&
        !/^\s*([-*]|\d+\.)\s+/.test(lines[i]) &&
        !/^\s*#{2,4}\s+/.test(lines[i]) &&
        !/^\s*:::/.test(lines[i])
      ) {
        para.push(lines[i]);
        i++;
      }
      if (para.length === 0) {
        i++; // linie care nu începe nimic valid (ex. „:::" rătăcit) — o sărim
        continue;
      }
      blocuri.push({ tip: "text", html: `<p>${inline(para.join(" "))}</p>` });
      continue;
    }

    i++; // linie goală
  }

  return blocuri;
}

/** Parsează tot fișierul Markdown într-o listă de module cu sublecții. */
export function parseazaContinut(md: string): ModulContinut[] {
  const lines = md.split("\n");
  const moduleList: ModulContinut[] = [];
  let modulCurent: ModulContinut | null = null;
  let subCurent: SublectieContinut | null = null;
  let bufferSub: string[] = [];

  const flushSub = () => {
    if (modulCurent && subCurent) {
      // O sublecție de „Verifică-ți înțelegerea" e recunoscută după variantele
      // de tip „a) ... b) ... c)" care apar pe aceeași linie în sursă. În acest
      // caz blocurile sunt redate de widget-ul QuizSublectie, nu în articol.
      const eVerificare = /a\)\s.*b\)\s.*c\)/.test(bufferSub.join("\n"));
      const titluSubCurent = subCurent.titlu;
      // O sublecție de exerciții (🤝/🎯) e redată de ExercitiiInteractive, nu
      // în articol (ca să nu se dubleze textul întrebărilor).
      const eExercitii = /(Exerciții ghidate|Exerciții independente)/.test(titluSubCurent);
      subCurent.blocuri = eExercitii ? [] : parseazaBlocuri(bufferSub);
      subCurent.esteVerificare = eVerificare;
      subCurent.esteExercitii = eExercitii;
      modulCurent.sublectii.push(subCurent);
    }
    bufferSub = [];
  };

  for (const linie of lines) {
    const modulMatch = linie.match(/^#\s+Modulul\s+(\S+\.\S+)\s+—\s+(.+)$/);
    if (modulMatch) {
      flushSub();
      subCurent = null;
      modulCurent = { cod: modulMatch[1], titlu: modulMatch[2].trim(), sublectii: [] };
      moduleList.push(modulCurent);
      continue;
    }

    const subMatch = linie.match(/^###\s+(\S+)\s+(\S+)\s+(.+)$/);
    if (subMatch) {
      flushSub();
      const icon = subMatch[1]; // emoji
      const cod = subMatch[2]; // ex. 1.1.1
      const titlu = subMatch[3].trim();
      const moduleCod = cod.split(".").slice(0, 2).join(".");
      subCurent = { cod, icon, titlu, module: moduleCod, blocuri: [], esteVerificare: false, esteExercitii: false };
      continue;
    }

    if (subCurent) {
      bufferSub.push(linie);
    }
  }
  flushSub();

  return moduleList;
}
