import { ImageResponse } from "next/og";
import { citesteBinar } from "@/lib/fisiereContinut";

/**
 * Imaginea de previzualizare (Open Graph, 1200×630) folosită la distribuirea
 * linkurilor pe WhatsApp, Facebook etc. Fonturile sunt cele ale site-ului
 * (Fraunces pentru titlu, Hanken Grotesk pentru text), în format woff — singurul
 * acceptat de ImageResponse dintre cele disponibile — cu subsetul latin-ext,
 * fără de care ș și ț nu s-ar afișa.
 */
export const DIMENSIUNE_OG = { width: 1200, height: 630 };

const fonturi = Promise.all(
  [
    ["Fraunces", "fraunces-latin-900-normal.woff", 900],
    ["Fraunces Ext", "fraunces-latin-ext-900-normal.woff", 900],
    ["Hanken Grotesk", "hanken-grotesk-latin-600-normal.woff", 600],
    ["Hanken Grotesk Ext", "hanken-grotesk-latin-ext-600-normal.woff", 600],
  ].map(async ([name, fisier, weight]) => ({
    name: name as string,
    data: (await citesteBinar(`assets/og-fonturi/${fisier}`)).buffer as ArrayBuffer,
    weight: weight as 600 | 900,
    style: "normal" as const,
  }))
);

export async function randeazaImagineOg({
  titlu,
  eticheta,
}: {
  titlu: string;
  /** Rândul mic de deasupra titlului, ex. „Blog" sau „Clasele VII–XII". */
  eticheta: string;
}): Promise<ImageResponse> {
  const marimeTitlu = titlu.length > 70 ? 54 : titlu.length > 45 ? 64 : 76;
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: "#172033",
          padding: "72px 80px",
          fontFamily: "Hanken Grotesk, Hanken Grotesk Ext",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <div style={{ width: 18, height: 18, borderRadius: 9, background: "#FBBF24" }} />
          <div style={{ fontSize: 30, color: "#FDE68A", letterSpacing: 1 }}>{eticheta}</div>
        </div>
        <div
          style={{
            display: "flex",
            fontFamily: "Fraunces, Fraunces Ext",
            fontWeight: 900,
            fontSize: marimeTitlu,
            lineHeight: 1.1,
            color: "#FFFFFF",
            maxWidth: 1040,
          }}
        >
          {titlu}
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
          <div style={{ fontFamily: "Fraunces, Fraunces Ext", fontWeight: 900, fontSize: 40, color: "#FBBF24" }}>
            Academia Python
          </div>
          <div style={{ fontSize: 28, color: "#CBD5E1" }}>academiapython.ro</div>
        </div>
      </div>
    ),
    { ...DIMENSIUNE_OG, fonts: await fonturi }
  );
}
