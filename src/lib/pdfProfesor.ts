import PDFDocument from "pdfkit";

/**
 * Helper comun pentru cele trei PDF-uri din zona de profesor (planificare,
 * fișă de lucru, test/barem). Reutilizează exact tiparul deja folosit în
 * src/app/api/pdf/[clasa]/[modulSlug]/route.ts (fișele PDF de pe /resurse,
 * pentru elevi) — pdfkit, generare server-side, streaming într-un Buffer —
 * ca să nu existe două metode diferite de generat PDF în același proiect.
 * Fontul standard PDFKit (Helvetica) nu are diacritice, de-aia orice text
 * afișat trece prin curataDiacritice, la fel ca în fișierul original.
 */

export function curataDiacritice(text: string): string {
  if (!text) return "";
  return text
    .replace(/[șşȘŞ]/g, "s")
    .replace(/[țţȚŢ]/g, "t")
    .replace(/[ăĂ]/g, "a")
    .replace(/[âÂ]/g, "a")
    .replace(/[îÎ]/g, "i")
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "");
}

export function creeazaDocumentPdf(opts?: { layout?: "portrait" | "landscape" }): PDFKit.PDFDocument {
  return new PDFDocument({
    size: "A4",
    layout: opts?.layout ?? "portrait",
    margin: 40,
    bufferPages: true, // necesar ca să putem adăuga subsolul pe FIECARE pagină la final
  });
}

/** Antet comun: logo textual + titlu + subtitlu (clasă/modul, după caz). */
export function deseneazaAntet(doc: PDFKit.PDFDocument, subtitluDreapta: string, titlu: string) {
  doc.fontSize(16).font("Helvetica-Bold").fillColor("#16163a").text("Academia", {
    continued: true,
  });
  doc.fillColor("#f5b301").text("Python");

  doc.fontSize(8).font("Helvetica-Bold").fillColor("#6b6a7b").text(curataDiacritice(subtitluDreapta), {
    align: "right",
  });

  doc.moveDown(0.5);
  doc.strokeColor("#e7e0d2").lineWidth(1).moveTo(40, doc.y).lineTo(555, doc.y).stroke();
  doc.moveDown(1);

  doc.fontSize(16).font("Helvetica-Bold").fillColor("#16163a").text(curataDiacritice(titlu));
  doc.moveDown(1);
}

/**
 * Aplică subsolul discret ("Academia Python — academiapython.ro") pe
 * fiecare pagină deja generată — trebuie apelat chiar înainte de doc.end(),
 * după ce tot conținutul a fost scris (bufferPages: true ține paginile
 * disponibile pentru editare până la acel moment).
 */
export function adaugaSubsolPeToatePaginile(doc: PDFKit.PDFDocument) {
  const interval = doc.bufferedPageRange();
  const latimeUtila = doc.page.width - 80; // margini de 40 pe fiecare parte
  const ySubsol = doc.page.height - 62;
  for (let i = interval.start; i < interval.start + interval.count; i++) {
    doc.switchToPage(i);
    const yInitial = doc.y;
    doc
      .fontSize(8)
      .font("Helvetica")
      .fillColor("#6b6a7b")
      .text("Academia Python -- academiapython.ro", 40, ySubsol, {
        width: latimeUtila,
        align: "center",
      });
    doc.y = yInitial;
  }
}

export async function finalizeazaPdf(doc: PDFKit.PDFDocument): Promise<Buffer> {
  adaugaSubsolPeToatePaginile(doc);
  const bufferPromise = new Promise<Buffer>((resolve, reject) => {
    const buffers: Buffer[] = [];
    doc.on("data", (chunk) => buffers.push(chunk));
    doc.on("end", () => resolve(Buffer.concat(buffers)));
    doc.on("error", (err) => reject(err));
  });
  doc.end();
  return bufferPromise;
}

export function raspunsPdf(buffer: Buffer, numeFisier: string): Response {
  return new Response(new Uint8Array(buffer), {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="${numeFisier}"`,
    },
  });
}

export function raspunsEroarePdf(): Response {
  return new Response(
    JSON.stringify({ eroare: "Nu am putut genera PDF-ul, incearca din nou." }),
    { status: 500, headers: { "Content-Type": "application/json" } }
  );
}
