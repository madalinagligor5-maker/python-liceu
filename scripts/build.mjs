// `npm run build`:
//  - pe Vercel și local: `next build`, ca până acum;
//  - în Cloudflare Workers Builds (variabila WORKERS_CI=1): build-ul complet
//    pentru Cloudflare (OpenNext + cache-ul paginilor pre-generate), ca deploy-ul
//    să meargă și dacă în dashboard au rămas comenzile implicite
//    (`npm run build` + `npx wrangler deploy`).
// OpenNext rulează la rândul lui `npm run build`; CF_BUILD_INTERIOR evită bucla.
import { execSync } from "node:child_process";

const ruleaza = (comanda, env = {}) =>
  execSync(comanda, { stdio: "inherit", env: { ...process.env, ...env } });

if (process.env.WORKERS_CI === "1" && process.env.CF_BUILD_INTERIOR !== "1") {
  ruleaza("npx opennextjs-cloudflare build", { CF_BUILD_INTERIOR: "1" });
  ruleaza("npx opennextjs-cloudflare populateCache local");
} else {
  ruleaza("npx next build");
}
