import type { MetadataRoute } from "next";

const SITE_URL = "https://www.academiapython.ro";

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
