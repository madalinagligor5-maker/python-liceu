import type { MetadataRoute } from "next";
import { capitole } from "@/lib/curriculum";
import { unitati as unitatiCurs } from "@/lib/curs";
import { getToateArticolele } from "@/lib/blog";

const SITE_URL = "https://www.academiapython.ro";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const url = (p: string) => `${SITE_URL}${p}`;

  // Rute statice principale.
  const statice: MetadataRoute.Sitemap = [
    { url: url("/"), changeFrequency: "weekly", priority: 1 },
    { url: url("/curriculum"), changeFrequency: "weekly", priority: 0.9 },
    { url: url("/preturi"), changeFrequency: "monthly", priority: 0.6 },
    { url: url("/curs-practic"), changeFrequency: "weekly", priority: 0.8 },
    { url: url("/curs-practic/preturi"), changeFrequency: "monthly", priority: 0.6 },
    { url: url("/lectii"), changeFrequency: "weekly", priority: 0.7 },
    { url: url("/blog"), changeFrequency: "weekly", priority: 0.7 },
    { url: url("/termeni-si-conditii"), changeFrequency: "yearly", priority: 0.2 },
    { url: url("/politica-de-confidentialitate"), changeFrequency: "yearly", priority: 0.2 },
    { url: url("/politica-de-rambursare"), changeFrequency: "yearly", priority: 0.2 },
  ];

  // Paginile de clasă (/curriculum/[clasa]) — conținut propriu, unic per
  // clasă (lista de module), indiferent dacă modulele din ea sunt gratuite
  // sau nu. Lipseau complet din sitemap înainte.
  const dinClase: MetadataRoute.Sitemap = capitole.map((cap) => ({
    url: url(`/curriculum/${cap.clasa}`),
    changeFrequency: "weekly" as const,
    priority: 0.7,
  }));

  // Paginile de modul (/curriculum/[clasa]/[modul]) — conținut propriu, unic
  // per modul (titlu, descriere, lista celor 6 sublecții), inclusiv pentru
  // modulele premium: pagina de modul NU e un teaser gol, arată structura
  // reală. Le includem pe toate — spre deosebire de sublecțiile individuale.
  const dinModule: MetadataRoute.Sitemap = capitole.flatMap((cap) =>
    cap.module.map((modul) => ({
      url: url(`/curriculum/${cap.clasa}/${modul.slug}`),
      changeFrequency: "monthly" as const,
      priority: 0.6,
    }))
  );

  // Sublecțiile individuale — doar din modulele cu adevărat publice (aceeași
  // regulă de acces ca în pagina de sublecție). Pentru restul, pagina arată
  // un "teaser" aproape identic pe sute de URL-uri (doar titlul diferă) —
  // conținut subțire și cvasi-duplicat, exact motivul pentru care Google
  // raportează "Discovered - currently not indexed" în masă. Nu le includem
  // în sitemap; rămân accesibile prin navigare, doar nu trimise spre indexare.
  const dinCurriculum: MetadataRoute.Sitemap = capitole.flatMap((cap) =>
    cap.module
      .filter((modul) => modul.gratuit || modul.numar <= 5)
      .flatMap((modul) =>
        modul.sublectii.map((s) => ({
          url: url(`/curriculum/${cap.clasa}/${modul.slug}/${s.cod}`),
          changeFrequency: "monthly" as const,
          priority: 0.5,
        }))
      )
  );

  // Articolele de blog — generate dinamic din content/blog/, nu hardcodate.
  const articoleBlog = await getToateArticolele();
  const dinBlog: MetadataRoute.Sitemap = articoleBlog.map((articol) => ({
    url: url(`/blog/${articol.slug}`),
    changeFrequency: "monthly" as const,
    priority: 0.6,
  }));

  // "Curs practic de Python" -- sistem de continut complet separat de
  // capitole/clase (vezi src/lib/curs.ts). Aceeasi regula ca la liceu:
  // paginile de modul intra toate, sublectiile individuale doar din
  // modulele gratuite.
  const dinModuleCurs: MetadataRoute.Sitemap = unitatiCurs.flatMap((u) =>
    u.module.map((modul) => ({
      url: url(`/curs-practic/${modul.slug}`),
      changeFrequency: "monthly" as const,
      priority: 0.6,
    }))
  );

  const dinCursPractic: MetadataRoute.Sitemap = unitatiCurs.flatMap((u) =>
    u.module
      .filter((modul) => modul.gratuit)
      .flatMap((modul) =>
        modul.sublectii.map((s) => ({
          url: url(`/curs-practic/${modul.slug}/${s.cod}`),
          changeFrequency: "monthly" as const,
          priority: 0.5,
        }))
      )
  );

  return [
    ...statice,
    ...dinClase,
    ...dinModule,
    ...dinCurriculum,
    ...dinModuleCurs,
    ...dinCursPractic,
    ...dinBlog,
  ];
}
