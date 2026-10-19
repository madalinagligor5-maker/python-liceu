// Împachetează fișierele din content/ citite de aplicație la runtime în câte un
// JSON pe domeniu (src/generated/<pachet>.json), importat de loadere prin
// src/lib/fisiereContinut.ts.
//
// De ce: pe Cloudflare Workers nu există sistem de fișiere — `fs.readFile`
// din content/ nu merge la cerere. Pachetele sunt separate ca fiecare rută să
// includă doar ce folosește (ex. sitemap-ul nu trage după el lecțiile): Worker-ul
// are limită de mărime. Rulează automat înainte de `npm run build` / `npm run dev`.
import { readdirSync, readFileSync, statSync, mkdirSync, writeFileSync } from "node:fs";
import { join, relative, sep } from "node:path";

const radacina = process.cwd();
const PACHETE = {
  lectii: /^content\/(lectii_|curs-practic-)[^/]*\.md$/,
  blog: /^content\/blog\/[^/]*\.md$/,
  profesori: /^content\/(materiale-profesori\/[^/]*\.md|planificari\/[^/]*\.json)$/,
  exercitii: /^content\/exercitii\.json$/,
  predictii: /^content\/predicții\.json$/,
};

function parcurge(dir) {
  return readdirSync(dir).flatMap((nume) => {
    const cale = join(dir, nume);
    return statSync(cale).isDirectory() ? parcurge(cale) : [cale];
  });
}

const fisiere = parcurge(join(radacina, "content")).map((c) => relative(radacina, c).split(sep).join("/"));
mkdirSync(join(radacina, "src/generated"), { recursive: true });
const rezumat = [];
for (const [nume, tipar] of Object.entries(PACHETE)) {
  const continut = {};
  for (const cale of fisiere.filter((f) => tipar.test(f))) continut[cale] = readFileSync(join(radacina, cale), "utf8");
  writeFileSync(join(radacina, `src/generated/${nume}.json`), JSON.stringify(continut));
  rezumat.push(`${nume}: ${Object.keys(continut).length}`);
}
console.log(`pachete de conținut — ${rezumat.join(", ")}`);
