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
export type Bloc = BlocCode | BlocText;

export type SublectieContinut = {
  cod: string; // ex. "1.1.1"
  icon: string; // emoji din titlu
  titlu: string;
  module: string; // cod modul, ex. "1.1"
  blocuri: Bloc[];
};

export type ModulContinut = {
  cod: string; // "1.1"
  titlu: string;
  sublectii: SublectieContinut[];
};

/** Transformă **bold** și liniile noi în HTML minim, escapând restul. */
function inline(text: string): string {
  const escapat = text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
  // **bold** -> <strong> (doar după escape, ca să nu injecteze HTML)
  return escapat.replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>");
}

/** Împarte un bloc de text dintr-o sublecție în blocuri (paragrafe/liste/code). */
function parseazaBlocuri(lines: string[]): Bloc[] {
  const blocuri: Bloc[] = [];
  let i = 0;

  while (i < lines.length) {
    const linie = lines[i];

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
      while (i < lines.length && lines[i].trim() !== "" && !lines[i].trimStart().startsWith("```") && !/^\s*([-*]|\d+\.)\s+/.test(lines[i])) {
        para.push(lines[i]);
        i++;
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
      subCurent.blocuri = parseazaBlocuri(bufferSub);
      modulCurent.sublectii.push(subCurent);
    }
    bufferSub = [];
  };

  for (const linie of lines) {
    const modulMatch = linie.match(/^#\s+(Modulul\s+(\d+\.\d+)\s+—\s+(.+)$)/);
    if (modulMatch) {
      flushSub();
      subCurent = null;
      modulCurent = { cod: modulMatch[2], titlu: modulMatch[3].trim(), sublectii: [] };
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
      subCurent = { cod, icon, titlu, module: moduleCod, blocuri: [] };
      continue;
    }

    if (subCurent) {
      bufferSub.push(linie);
    }
  }
  flushSub();

  return moduleList;
}
