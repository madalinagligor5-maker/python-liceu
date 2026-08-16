import type { MetadataRoute } from "next";

const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ??
  "https://python-liceu-git-main-mada-s-projects.vercel.app";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/api/", "/cont/", "/login", "/inregistrare", "/auth/"],
    },
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
