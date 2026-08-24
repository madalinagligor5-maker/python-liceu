import type { MetadataRoute } from "next";
import { capitole } from "@/lib/curriculum";

const SITE_URL = "https://www.academiapython.ro";

export default function sitemap(): MetadataRoute.Sitemap {
  const url = (p: string) => `${SITE_URL}${p}`;

  // Rute statice principale.
  const statice: MetadataRoute.Sitemap = [
    { url: url("/"), changeFrequency: "weekly", priority: 1 },
    { url: url("/curriculum"), changeFrequency: "weekly", priority: 0.9 },
    { url: url("/preturi"), changeFrequency: "monthly", priority: 0.6 },
    { url: url("/lectii"), changeFrequency: "weekly", priority: 0.7 },
    { url: url("/termeni-si-conditii"), changeFrequency: "yearly", priority: 0.2 },
    { url: url("/politica-de-confidentialitate"), changeFrequency: "yearly", priority: 0.2 },
    { url: url("/politica-de-rambursare"), changeFrequency: "yearly", priority: 0.2 },
  ];

  // Toate sublecțiile din structura curriculară (clasă → modul → sublecție).
  const dinCurriculum: MetadataRoute.Sitemap = capitole.flatMap((cap) =>
    cap.module.flatMap((modul) =>
      modul.sublectii.map((s) => ({
        url: url(`/curriculum/${cap.clasa}/${modul.slug}/${s.cod}`),
        changeFrequency: "monthly" as const,
        priority: 0.5,
      }))
    )
  );

  return [...statice, ...dinCurriculum];
}
