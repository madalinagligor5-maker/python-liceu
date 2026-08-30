import { NextRequest } from "next/server";
import { getUtilizatorCurent } from "@/lib/subscription";
import { getPlanificare } from "@/lib/planificari";
import {
  creeazaDocumentPdf,
  deseneazaAntet,
  finalizeazaPdf,
  raspunsPdf,
  raspunsEroarePdf,
  curataDiacritice,
} from "@/lib/pdfProfesor";

export const dynamic = "force-dynamic";

const LATIME_COLOANE = [150, 210, 60, 95]; // total 515

function randTabel(
  doc: PDFKit.PDFDocument,
  celule: string[],
  antet = false
) {
  const x0 = 40;
  doc.font(antet ? "Helvetica-Bold" : "Helvetica").fontSize(9);
  const inaltimi = celule.map((text, i) =>
    doc.heightOfString(curataDiacritice(text), { width: LATIME_COLOANE[i] - 8 })
  );
  const inaltimeRand = Math.max(...inaltimi, 12) + 10;

  if (doc.y + inaltimeRand > 780) {
    doc.addPage();
  }

  const y = doc.y;
  let x = x0;
  celule.forEach((text, i) => {
    doc
      .font(antet ? "Helvetica-Bold" : "Helvetica")
      .fontSize(9)
      .fillColor(antet ? "#16163a" : "#2d2d4d")
      .text(curataDiacritice(text), x + 4, y + 5, { width: LATIME_COLOANE[i] - 8 });
    x += LATIME_COLOANE[i];
  });

  doc.y = y + inaltimeRand;
  doc.strokeColor("#e7e0d2").lineWidth(0.5).moveTo(x0, doc.y).lineTo(x0 + 515, doc.y).stroke();
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ clasa: string }> }
) {
  try {
    const { meta } = await getUtilizatorCurent();
    if (meta?.rol !== "profesor_aprobat") {
      return new Response("Acces interzis.", { status: 403 });
    }

    const { clasa } = await params;
    const planificare = await getPlanificare(clasa);
    if (!planificare) {
      return new Response("Clasa nu a fost gasita.", { status: 404 });
    }

    const doc = creeazaDocumentPdf();
    deseneazaAntet(
      doc,
      `PLANIFICARE CALENDARISTICA - CLASA A ${clasa.toUpperCase()}-A`,
      `Planificare calendaristica - Clasa a ${clasa}-a`
    );

    const totalOre = planificare.unitati.reduce((acc, u) => acc + u.oreAlocate, 0);
    doc
      .fontSize(9)
      .font("Helvetica")
      .fillColor("#6b6a7b")
      .text(
        curataDiacritice(
          `${planificare.unitati.length} unitati de invatare, ${totalOre} ore alocate in total`
        )
      );
    doc.moveDown(1);

    randTabel(doc, ["Unitate de invatare", "Competente vizate", "Ore", "Saptamana"], true);
    for (const u of planificare.unitati) {
      randTabel(doc, [
        `${u.modulCod} - ${u.modulTitlu}`,
        u.competente,
        String(u.oreAlocate),
        `S${u.saptamanaEstimata}`,
      ]);
    }

    const buffer = await finalizeazaPdf(doc);
    return raspunsPdf(buffer, `AcademiaPython_Planificare_${clasa}.pdf`);
  } catch (error) {
    console.error("Eroare generare PDF planificare:", error);
    return raspunsEroarePdf();
  }
}
