import type { Metadata } from "next";
import { metadatePagina } from "@/lib/seo";

// Paginile Kids Junior sunt componente client (fără metadate proprii): profil,
// hartă, niveluri de joc. Fără acest layout moșteneau titlul și canonical-ul
// homepage-ului. Sunt pagini de aplicație, fără text de indexat; pagina
// indexabilă pentru Kids este /kids.
export const metadata: Metadata = metadatePagina({
  titlu: "Kids Junior: aventura cu Pippy",
  descriere:
    "Aventura Kids Junior: programare cu blocuri pentru copii, nivel cu nivel, direct în browser.",
  cale: "/kids/junior",
  noindex: true,
});

export default function KidsJuniorLayout({ children }: LayoutProps<"/kids/junior">) {
  return children;
}
