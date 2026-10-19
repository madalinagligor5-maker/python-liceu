import { getArticolDupaSlug } from "@/lib/blog";
import { DIMENSIUNE_OG, randeazaImagineOg } from "@/lib/imagineOg";

// Imagine de previzualizare proprie fiecărui articol (titlul articolului).
// Are prioritate față de imaginea implicită setată din metadate.
export const alt = "Articol de blog — Academia Python";
export const size = DIMENSIUNE_OG;
export const contentType = "image/png";

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const articol = await getArticolDupaSlug(slug);
  return randeazaImagineOg({
    titlu: articol?.titlu ?? "Blog Academia Python",
    eticheta: "Blog · Academia Python",
  });
}
