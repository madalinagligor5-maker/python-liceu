// Generează imaginile de previzualizare (Open Graph, 1200×630) la build:
//  - public/og-image.png       imaginea implicită a site-ului
//  - public/og/blog/<slug>.png câte una pentru fiecare articol (titlul lui)
// Rulează automat înainte de `npm run build` și `npm run dev`.
//
// De ce la build și nu printr-o rută Next: generatorul (satori + resvg,
// ~600 KB comprimat) ar intra altfel în Worker-ul de pe Cloudflare, care are
// limită de mărime. Imaginile oricum nu se schimbă între două build-uri.
//
// Fonturile site-ului (Fraunces, Hanken Grotesk), în format woff, cu subsetul
// latin-ext separat — fără el, ș și ț nu s-ar desena.
import { ImageResponse } from "next/dist/compiled/@vercel/og/index.node.js";
import { mkdirSync, readFileSync, readdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const radacina = process.cwd();
const font = (fisier) => readFileSync(join(radacina, "assets/og-fonturi", fisier));
const FONTURI = [
  { name: "Fraunces", data: font("fraunces-latin-900-normal.woff"), weight: 900, style: "normal" },
  { name: "Fraunces Ext", data: font("fraunces-latin-ext-900-normal.woff"), weight: 900, style: "normal" },
  { name: "Hanken Grotesk", data: font("hanken-grotesk-latin-600-normal.woff"), weight: 600, style: "normal" },
  { name: "Hanken Grotesk Ext", data: font("hanken-grotesk-latin-ext-600-normal.woff"), weight: 600, style: "normal" },
];

const el = (style, ...children) => ({ type: "div", props: { style: { display: "flex", ...style }, children } });

async function imagine({ titlu, eticheta }, destinatie) {
  const marimeTitlu = titlu.length > 70 ? 54 : titlu.length > 45 ? 64 : 76;
  const continut = el(
    {
      width: "100%",
      height: "100%",
      flexDirection: "column",
      justifyContent: "space-between",
      background: "#172033",
      padding: "72px 80px",
      fontFamily: "Hanken Grotesk, Hanken Grotesk Ext",
    },
    el(
      { alignItems: "center", gap: 16 },
      el({ width: 18, height: 18, borderRadius: 9, background: "#FBBF24" }),
      el({ fontSize: 30, color: "#FDE68A", letterSpacing: 1 }, eticheta)
    ),
    el(
      { fontFamily: "Fraunces, Fraunces Ext", fontWeight: 900, fontSize: marimeTitlu, lineHeight: 1.1, color: "#FFFFFF", maxWidth: 1040 },
      titlu
    ),
    el(
      { justifyContent: "space-between", alignItems: "flex-end" },
      el({ fontFamily: "Fraunces, Fraunces Ext", fontWeight: 900, fontSize: 40, color: "#FBBF24" }, "Academia Python"),
      el({ fontSize: 28, color: "#CBD5E1" }, "academiapython.ro")
    )
  );
  const raspuns = new ImageResponse(continut, { width: 1200, height: 630, fonts: FONTURI });
  writeFileSync(destinatie, Buffer.from(await raspuns.arrayBuffer()));
}

/** Câmpurile din frontmatter-ul unui articol (același format ca src/lib/blog.ts). */
function frontmatter(md) {
  const bloc = md.replace(/\r\n/g, "\n").match(/^---\n([\s\S]*?)\n---/);
  const meta = {};
  for (const linie of (bloc?.[1] ?? "").split("\n")) {
    const m = linie.match(/^([a-z_]+):\s*(.*)$/);
    if (m) meta[m[1]] = m[2].trim();
  }
  return meta;
}

await imagine(
  {
    titlu: "Învață Python pas cu pas. Scrie cod și vezi imediat rezultatul.",
    eticheta: "Informatică pentru gimnaziu și liceu · clasele VII–XII",
  },
  join(radacina, "public/og-image.png")
);

const dirBlog = join(radacina, "content/blog");
const dirImagini = join(radacina, "public/og/blog");
mkdirSync(dirImagini, { recursive: true });
let n = 0;
for (const fisier of readdirSync(dirBlog).filter((f) => f.endsWith(".md"))) {
  const meta = frontmatter(readFileSync(join(dirBlog, fisier), "utf8"));
  if (!meta.slug || !meta.titlu) continue;
  await imagine({ titlu: meta.titlu, eticheta: "Blog · Academia Python" }, join(dirImagini, `${meta.slug}.png`));
  n++;
}
console.log(`imagini OG: og-image.png + ${n} articole`);
