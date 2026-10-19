import { execFileSync } from "node:child_process";
import { readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";

/**
 * Data ultimei modificări reale a unui fișier, din istoricul Git — folosită
 * pentru `lastModified` din sitemap (rulează la build, nu la fiecare cerere).
 *
 * Clonele de pe Vercel (și multe clone locale) sunt „shallow": istoricul
 * începe la un commit-limită. Un fișier neatins în istoricul disponibil ar
 * primi data acelui commit, nu data reală — în cazul ăsta întoarcem
 * `undefined` (sitemap fără lastmod pentru pagina respectivă), nu o dată falsă.
 * Pe Vercel, istoricul complet se obține cu variabila VERCEL_DEEP_CLONE=true.
 */

function git(args: string[]): string {
  try {
    return execFileSync("git", args, { encoding: "utf8", stdio: ["ignore", "pipe", "ignore"] }).trim();
  } catch {
    return "";
  }
}

let commitLimita: string | null | undefined;
function shaLimita(): string | null {
  if (commitLimita === undefined) {
    const shallow = git(["rev-parse", "--is-shallow-repository"]) === "true";
    commitLimita = shallow ? git(["rev-list", "--max-parents=0", "HEAD"]).split("\n")[0] || null : null;
  }
  return commitLimita;
}

const cache = new Map<string, Date | undefined>();

export function dataModificareFisier(caleRelativa: string): Date | undefined {
  if (cache.has(caleRelativa)) return cache.get(caleRelativa);
  const iesire = git(["log", "-1", "--format=%H %cI", "--", caleRelativa]);
  const [sha, data] = iesire.split(" ");
  const rezultat = sha && data && sha !== shaLimita() ? new Date(data) : undefined;
  cache.set(caleRelativa, rezultat);
  return rezultat;
}

/** Cea mai recentă dintre date (ignorând lipsurile). */
export function ceaMaiRecenta(...date: (Date | undefined)[]): Date | undefined {
  const valide = date.filter((d): d is Date => d instanceof Date);
  return valide.length ? new Date(Math.max(...valide.map((d) => d.getTime()))) : undefined;
}

let fisierPeModul: Map<string, string> | null = null;
/** Fișierul Markdown din content/ care conține lecțiile unui modul („2.6", „CP1.1"). */
export function fisierContinutModul(codModul: string): string | undefined {
  if (!fisierPeModul) {
    fisierPeModul = new Map();
    const dir = join(process.cwd(), "content");
    for (const f of readdirSync(dir)) {
      if (!/^(lectii_|curs-practic-).*\.md$/.test(f)) continue;
      for (const m of readFileSync(join(dir, f), "utf8").matchAll(/^# Modulul (\S+)/gm)) {
        fisierPeModul.set(m[1], `content/${f}`);
      }
    }
  }
  return fisierPeModul.get(codModul);
}
