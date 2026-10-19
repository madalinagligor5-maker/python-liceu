import pachet from "@/generated/continut.json";

/**
 * Acces la fișierele din content/ (și la fonturile imaginilor Open Graph),
 * cu căi relative la rădăcina proiectului: „content/blog/x.md".
 *
 * Citim din pachetul generat de scripts/genereaza-continut.mjs (rulează
 * automat înainte de `npm run build` și `npm run dev`): pe Cloudflare Workers
 * nu există sistem de fișiere, deci `fs.readFile` nu merge la cerere.
 * În dezvoltare, după o modificare în content/, repornește `npm run dev`.
 */

type Pachet = { text: Record<string, string>; binar: Record<string, string> };
const date = pachet as Pachet;

export async function citesteText(cale: string): Promise<string> {
  const continut = date.text[cale];
  if (continut === undefined) throw new Error(`Fișier inexistent în pachetul de conținut: ${cale}`);
  return continut;
}

export async function citesteBinar(cale: string): Promise<Uint8Array> {
  const b64 = date.binar[cale];
  if (b64 === undefined) throw new Error(`Fișier inexistent în pachetul de conținut: ${cale}`);
  return Uint8Array.from(Buffer.from(b64, "base64"));
}

/** Numele fișierelor dintr-un director (nerecursiv), ex. „content/blog". */
export async function listeazaFisiere(dir: string): Promise<string[]> {
  const prefix = `${dir.replace(/\/$/, "")}/`;
  return Object.keys(date.text)
    .filter((c) => c.startsWith(prefix) && !c.slice(prefix.length).includes("/"))
    .map((c) => c.slice(prefix.length));
}
