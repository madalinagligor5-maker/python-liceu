// Împachetează fișierele citite de aplicație la runtime (content/ și fonturile
// imaginilor Open Graph) într-un singur JSON importat de src/lib/fisiereContinut.ts.
//
// De ce: pe Cloudflare Workers nu există sistem de fișiere — `fs.readFile`
// din content/ nu merge la cerere. Rulează automat înainte de `npm run build`
// și `npm run dev` (scripturile prebuild/predev din package.json).
import { readdirSync, readFileSync, statSync, mkdirSync, writeFileSync } from "node:fs";
import { join, relative, sep } from "node:path";

const radacina = process.cwd();
const SURSE = [
  { dir: "content", extensii: [".md", ".json"], binar: false },
  { dir: "assets/og-fonturi", extensii: [".woff"], binar: true },
];

function parcurge(dir) {
  return readdirSync(dir).flatMap((nume) => {
    const cale = join(dir, nume);
    return statSync(cale).isDirectory() ? parcurge(cale) : [cale];
  });
}

const text = {};
const binar = {};
for (const sursa of SURSE) {
  for (const cale of parcurge(join(radacina, sursa.dir))) {
    if (!sursa.extensii.some((e) => cale.endsWith(e))) continue;
    const cheie = relative(radacina, cale).split(sep).join("/");
    if (sursa.binar) binar[cheie] = readFileSync(cale).toString("base64");
    else text[cheie] = readFileSync(cale, "utf8");
  }
}

mkdirSync(join(radacina, "src/generated"), { recursive: true });
writeFileSync(join(radacina, "src/generated/continut.json"), JSON.stringify({ text, binar }));
console.log(`continut.json: ${Object.keys(text).length} fișiere text, ${Object.keys(binar).length} binare`);
