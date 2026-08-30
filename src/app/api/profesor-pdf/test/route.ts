import { NextRequest } from "next/server";
import { getUtilizatorCurent } from "@/lib/subscription";
import {
  creeazaDocumentPdf,
  deseneazaAntet,
  finalizeazaPdf,
  raspunsPdf,
  raspunsEroarePdf,
  curataDiacritice,
} from "@/lib/pdfProfesor";

export const dynamic = "force-dynamic";

type IntrebareTestBody = {
  intrebare: string;
  variante: string[];
  corect: number;
};

/**
 * Primește exact setul de întrebări deja generat (client-side, din
 * genereazaTest — care la rândul lui citește doar din quizSublectii.ts,
 * niciodată date inventate de client) și randează fie testul, fie baremul,
 * din ACELAȘI payload — ca să nu poată apărea vreodată o discrepanță între
 * cele două PDF-uri descărcate separat.
 */
export async function POST(request: NextRequest) {
  try {
    const { meta } = await getUtilizatorCurent();
    if (meta?.rol !== "profesor_aprobat") {
      return new Response("Acces interzis.", { status: 403 });
    }

    const body = await request.json();
    const clasa = typeof body?.clasa === "string" ? body.clasa : "";
    const arataRaspunsuri = body?.arataRaspunsuri === true;
    const intrebari: IntrebareTestBody[] = Array.isArray(body?.intrebari) ? body.intrebari : [];

    const valide = intrebari.filter(
      (i) =>
        i &&
        typeof i.intrebare === "string" &&
        Array.isArray(i.variante) &&
        typeof i.corect === "number"
    );

    if (valide.length === 0) {
      return new Response("Niciun test de generat.", { status: 400 });
    }

    const doc = creeazaDocumentPdf();
    deseneazaAntet(
      doc,
      `${arataRaspunsuri ? "BAREM" : "TEST"} - CLASA A ${clasa.toUpperCase()}-A`,
      arataRaspunsuri ? "Barem" : "Test de verificare"
    );

    valide.forEach((i, idx) => {
      if (doc.y > 740) doc.addPage();

      doc.fontSize(10).font("Helvetica-Bold").fillColor("#16163a").text(
        curataDiacritice(`${idx + 1}. ${i.intrebare}`),
        { lineGap: 2 }
      );
      doc.moveDown(0.2);

      i.variante.forEach((v, vi) => {
        const litera = String.fromCharCode(97 + vi);
        const corect = arataRaspunsuri && vi === i.corect;
        doc
          .fontSize(9)
          .font(corect ? "Helvetica-Bold" : "Helvetica")
          .fillColor(corect ? "#1a7a4c" : "#2d2d4d")
          .text(curataDiacritice(`${litera}) ${v}${corect ? "  <-- corect" : ""}`), { indent: 12 });
      });

      doc.moveDown(0.8);
    });

    const buffer = await finalizeazaPdf(doc);
    const nume = arataRaspunsuri ? "Barem" : "Test";
    return raspunsPdf(buffer, `AcademiaPython_${nume}_${clasa}.pdf`);
  } catch (error) {
    console.error("Eroare generare PDF test:", error);
    return raspunsEroarePdf();
  }
}
