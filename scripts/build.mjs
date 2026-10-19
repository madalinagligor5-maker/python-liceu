// `npm run build`:
//  - pe Vercel și local: `next build`, ca până acum;
//  - în Cloudflare Workers Builds (variabila WORKERS_CI=1): build-ul complet
//    pentru Cloudflare (OpenNext + cache-ul paginilor pre-generate), ca deploy-ul
//    să meargă și dacă în dashboard au rămas comenzile implicite
//    (`npm run build` + `npx wrangler deploy`).
// OpenNext rulează la rândul lui `npm run build`, după ce setează
// NEXT_PRIVATE_STANDALONE=true: atunci facem doar `next build`. Așa nu apare un
// build OpenNext în alt build OpenNext, oricare ar fi comanda din dashboard
// (`npm run build`, `npm run cf:build` sau `npx opennextjs-cloudflare build`).
import { execSync } from "node:child_process";

const ruleaza = (comanda, env = {}) =>
  execSync(comanda, { stdio: "inherit", env: { ...process.env, ...env } });

const apelatDeOpenNext = process.env.NEXT_PRIVATE_STANDALONE === "true";
if (process.env.WORKERS_CI === "1" && !apelatDeOpenNext) {
  ruleaza("npx opennextjs-cloudflare build");
  ruleaza("npx opennextjs-cloudflare populateCache local");
} else {
  ruleaza("npx next build");
}
