import { NextRequest } from "next/server";
import { getUtilizatorCurent } from "@/lib/subscription";
import { getMaterialDupaSlug } from "@/lib/materialeProfesori";
import {
  creeazaDocumentPdf,
  deseneazaAntet,
  finalizeazaPdf,
  raspunsPdf,
  raspunsEroarePdf,
  curataDiacritice,
} from "@/lib/pdfProfesor";

export const dynamic = "force-dynamic";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { meta } = await getUtilizatorCurent();
    if (meta?.rol !== "profesor_aprobat") {
      return new Response("Acces interzis.", { status: 403 });
    }

    const { slug } = await params;
    const material = await getMaterialDupaSlug(slug);
    if (!material || material.tip !== "pdf") {
      return new Response("Materialul nu a fost gasit.", { status: 404 });
    }

    const doc = creeazaDocumentPdf();
    deseneazaAntet(doc, "MATERIAL PENTRU PROFESORI", material.titlu);

    if (material.ciorna) {
      doc.fontSize(9).font("Helvetica-Oblique").fillColor("#a15c00").text(
        "Ciorna - text nerevizuit, aflat in asteptarea confirmarii fondatoarei."
      );
      doc.moveDown(1);
    }

    // Text simplu, derivat din corpul Markdown (fara formatare HTML) - suficient
    // pentru un ghid, fara sa reimplementam un randerer Markdown->PDF complet.
    const paragrafe = material.corpText
      .split("\n")
      .map((l) => l.replace(/^#+\s*/, "").replace(/[*_`>-]/g, "").trim())
      .filter((l) => l.length > 0);

    doc.fontSize(10).font("Helvetica").fillColor("#2d2d4d");
    paragrafe.forEach((p) => {
      if (doc.y > 770) doc.addPage();
      doc.text(curataDiacritice(p), { align: "left", lineGap: 3 });
      doc.moveDown(0.5);
    });

    const buffer = await finalizeazaPdf(doc);
    return raspunsPdf(buffer, `AcademiaPython_${slug}.pdf`);
  } catch (error) {
    console.error("Eroare generare PDF material:", error);
    return raspunsEroarePdf();
  }
}
