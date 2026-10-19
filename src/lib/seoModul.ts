import type { Modul } from "@/lib/curriculum";
import { esteCapitolCopii, numeClasaInText } from "@/lib/curriculum";
import type { Bloc } from "@/lib/markdownMini";
import { scurteaza } from "@/lib/seo";
import textePagini from "../../content/module-seo.json";

/**
 * Textele SEO ale paginilor de modul (titlu, descriere) și conținutul unic
 * derivat din datele existente. Paginile de modul sunt paginile indexabile
 * principale ale curriculumului; sublecțiile (6 per modul) au noindex și
 * canonical către modul.
 */

type TextModul = { intro?: string; rezultate?: string[] };
const texte = (textePagini as { module: Record<string, TextModul> }).module;

/** Intro și rezultate scrise manual (content/module-seo.json), dacă există. */
export function textModul(cod: string): TextModul {
  return texte[cod] ?? {};
}

/** „clasa a IX-a" sau, pentru capitolele Kids, „copii de 7 ani". */
function publicModul(clasa: string): string {
  return esteCapitolCopii(clasa) ? `copii de ${clasa.slice(1)} ani` : numeClasaInText(clasa);
}

/** „<Titlu modul> — Informatică clasa a IX-a" (sufixul „| Academia Python" vine din șablon). */
export function titluModul(modul: Modul, clasa: string): string {
  return esteCapitolCopii(clasa)
    ? `${modul.titlu} — Python pentru copii de ${clasa.slice(1)} ani`
    : `${modul.titlu} — Informatică ${numeClasaInText(clasa)}`;
}

/**
 * Descriere unică, țintă 140–160 de caractere: prima variantă de șablon care
 * se încadrează (titlurile de modul au între 10 și peste 90 de caractere).
 */
export function descriereModul(modul: Modul, clasa: string): string {
  const t = modul.titlu;
  const p = publicModul(clasa);
  const extra = modul.gratuit
    ? [" Gratuită, fără instalare.", " Fără instalare.", ""]
    : [" Fără instalare.", " Fără nicio instalare.", ""];
  const variante = [
    ...extra.map((e) => `${t}: lecție de Python pentru ${p}, în 6 pași — explicație, exemple de cod, exerciții în browser și test.${e}`),
    ...extra.map((e) => `${t} — lecție de Python pentru ${p}, cu exemple de cod, exerciții în browser și test.${e}`),
    ...extra.map((e) => `${t} — Python pentru ${p}: exemple și exerciții în browser.${e}`),
  ];
  const inInterval = variante.find((d) => d.length >= 140 && d.length <= 160);
  if (inInterval) return inInterval;
  const incap = variante.filter((d) => d.length <= 160).sort((x, y) => y.length - x.length);
  return incap[0] ?? scurteaza(variante[variante.length - 1], 160);
}

/** „<Titlu pas> — <Titlu modul> (clasa a IX-a)". */
export function titluSublectie(titluPas: string, modul: Modul, clasa: string): string {
  return `${titluPas} — ${modul.titlu} (${publicModul(clasa)})`;
}

function textDinHtml(html: string): string {
  return html
    .replace(/<[^>]+>/g, "")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .trim();
}

/** Titlurile cardurilor din pasul „Concept nou" — temele concrete ale lecției. */
export function subiecteDinConcept(blocuri: Bloc[]): string[] {
  const titluri: string[] = [];
  for (const b of blocuri) {
    if (b.tip !== "card" && b.tip !== "text") continue;
    const m = b.html.match(/<div class="bloc-card--titlu">(.*?)<\/div>|<h3[^>]*>(.*?)<\/h3>/);
    const brut = m?.[1] ?? m?.[2];
    if (!brut) continue;
    const curat = textDinHtml(brut).replace(/^\d+\.\s*/, "");
    if (curat && !/^atenție|^atentie|^sfaturi/i.test(curat)) titluri.push(curat);
  }
  return titluri.slice(0, 5);
}

const CUVINTE_PYTHON = new Set(
  (
    "def return if elif else for while in not and or is True False None import from class try except " +
    "finally raise with as lambda break continue pass global nonlocal yield assert del " +
    "print input len range int float str bool list dict set tuple sorted sum min max abs round type " +
    "open enumerate zip map filter ord chr isinstance reversed any all super self __init__"
  ).split(" ")
);

/** Un fragment `cod` e termen Python dacă e cuvânt cheie / funcție built-in
 *  (cu sau fără „()") sau apel de metodă („.append()", „str.split()"). */
function esteTermenPython(t: string): boolean {
  const fara = t.replace(/\(\)$/, "");
  if (CUVINTE_PYTHON.has(fara)) return true;
  return /^(?:[A-Za-z_]\w*)?\.[A-Za-z_]\w*\(\)$/.test(t);
}

/**
 * Termenii Python ai modulului, din pasul „Concept nou": întâi fragmentele
 * `cod` din explicații, apoi cuvintele cheie, funcțiile built-in și metodele
 * din exemplele de cod (ex. `def`, `range()`, `.append()`), fără dubluri.
 */
export function termeniPython(blocuri: Bloc[], max = 8): string[] {
  const termeni: string[] = [];
  const vazute = new Set<string>();
  const adauga = (t: string) => {
    // „conn.commit()" și „.commit()" sunt același termen.
    const cheie = t.replace(/\(\)$/, "").replace(/^\w*\./, ".");
    if (termeni.length < max && esteTermenPython(t) && !vazute.has(cheie)) {
      vazute.add(cheie);
      termeni.push(t);
    }
  };
  for (const b of blocuri) {
    if (b.tip !== "card" && b.tip !== "text") continue;
    for (const m of b.html.matchAll(/<code[^>]*>(.*?)<\/code>/g)) adauga(textDinHtml(m[1]));
  }
  for (const b of blocuri) {
    if (b.tip !== "code") continue;
    const fara = b.code.replace(/#.*$/gm, "").replace(/(["'])(?:\\.|(?!\1).)*\1/g, '""');
    for (const m of fara.matchAll(/(\.)?\b([A-Za-z_]\w*)\b(\s*\()?/g)) {
      adauga(m[1] ? `.${m[2]}()` : m[3] ? `${m[2]}()` : m[2]);
    }
  }
  return termeni;
}
