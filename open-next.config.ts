// Configurația adaptorului OpenNext pentru Cloudflare Workers.
// Vezi CLOUDFLARE.md pentru build, test local și deploy.
import { defineCloudflareConfig } from "@opennextjs/cloudflare";
import staticAssetsIncrementalCache from "@opennextjs/cloudflare/overrides/incremental-cache/static-assets-incremental-cache";

export default defineCloudflareConfig({
  // Paginile pre-generate la build (blog, module, sitemap, imaginile OG) se
  // servesc din fișierele statice ale Worker-ului. Site-ul nu folosește ISR
  // (revalidare periodică), deci nu e nevoie de un bucket R2 pentru cache.
  incrementalCache: staticAssetsIncrementalCache,
  enableCacheInterception: true,
});
