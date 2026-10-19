import { randeazaImagineOg } from "@/lib/imagineOg";

// Imaginea implicită de previzualizare, servită la /og-image.png (adresa la
// care trimit metadatele tuturor paginilor). Generată o singură dată, la build.
export const dynamic = "force-static";

export function GET() {
  return randeazaImagineOg({
    titlu: "Învață Python pas cu pas. Scrie cod și vezi imediat rezultatul.",
    eticheta: "Informatică pentru gimnaziu și liceu · clasele VII–XII",
  });
}
