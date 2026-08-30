import { NextRequest } from "next/server";
import { getUtilizatorCurent } from "@/lib/subscription";
import { getModul } from "@/lib/curriculum";
import { getExercitiiSublectie } from "@/lib/exercitii";
import type { Exercitiu } from "@/lib/exercitii-tipuri";
import {
  creeazaDocumentPdf,
  deseneazaAntet,
  finalizeazaPdf,
  raspunsPdf,
  raspunsEroarePdf,
  curataDiacritice,
} from "@/lib/pdfProfesor";

export const dynamic = "force-dynamic";

function textBarem(ex: Exercitiu): string | null {
  if (ex.tip === "cod") return ex.expectedOutput ? `Output asteptat: ${ex.expectedOutput}` : null;
  if (ex.tip === "ordonare") return `Ordinea corecta: ${ex.ordineCorecta.join(" -> ")}`;
  return ex.modelRaspuns ? `Model de raspuns: ${ex.modelRaspuns}` : null;
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ clasa: string; modulSlug: string }> }
) {
  try {
    const { meta } = await getUtilizatorCurent();
    if (meta?.rol !== "profesor_aprobat") {
      return new Response("Acces interzis.", { status: 403 });
    }

    const { clasa, modulSlug } = await params;
    const modul = getModul(clasa, modulSlug);
    if (!modul) {
      return new Response("Modulul nu a fost gasit.", { status: 404 });
    }

    const { searchParams } = new URL(request.url);
    const arataBarem = searchParams.get("barem") === "true";

    const grupe = (
      await Promise.all(
        modul.sublectii.map(async (s) => ({
          cod: s.cod,
          titlu: s.titlu,
          exercitii: await getExercitiiSublectie(s.cod),
        }))
      )
    ).filter((g) => g.exercitii.length > 0);

    const doc = creeazaDocumentPdf();
    deseneazaAntet(
      doc,
      `FISA DE LUCRU - CLASA A ${clasa.toUpperCase()}-A${arataBarem ? " (CU BAREM)" : ""}`,
      `${modul.cod} ${modul.titlu}`
    );

    if (grupe.length === 0) {
      doc.fontSize(10).font("Helvetica").fillColor("#6b6a7b").text("Acest modul nu are inca exercitii incarcate.");
    }

    for (const g of grupe) {
      doc.fontSize(11).font("Helvetica-Bold").fillColor("#f5b301").text(curataDiacritice(`${g.cod} ${g.titlu}`));
      doc.moveDown(0.4);

      g.exercitii.forEach((ex, idx) => {
        if (doc.y > 740) doc.addPage();

        doc.fontSize(10).font("Helvetica-Bold").fillColor("#16163a").text(curataDiacritice(`${idx + 1}. ${ex.enunt}`), {
          lineGap: 2,
        });

        if (ex.tip === "ordonare") {
          doc.moveDown(0.2);
          doc.fontSize(9).font("Helvetica").fillColor("#2d2d4d").text(
            curataDiacritice(`Pasi disponibili: ${ex.pasi.join(" | ")}`)
          );
        } else if (ex.tip === "cod" && ex.template) {
          doc.moveDown(0.2);
          doc.fontSize(9).font("Courier").fillColor("#2d2d4d").text(curataDiacritice(ex.template));
        }

        if (arataBarem) {
          const barem = textBarem(ex);
          if (barem) {
            doc.moveDown(0.2);
            doc.fontSize(9).font("Helvetica-Oblique").fillColor("#1a7a4c").text(curataDiacritice(`Barem: ${barem}`));
          }
        } else {
          doc.moveDown(0.6);
          doc.strokeColor("#e7e0d2").lineWidth(0.5).moveTo(40, doc.y).lineTo(555, doc.y).stroke();
          doc.moveDown(0.6);
          doc.strokeColor("#e7e0d2").lineWidth(0.5).moveTo(40, doc.y).lineTo(555, doc.y).stroke();
        }

        doc.moveDown(1);
      });

      doc.moveDown(0.6);
    }

    const buffer = await finalizeazaPdf(doc);
    const sufix = arataBarem ? "_cu_barem" : "";
    return raspunsPdf(buffer, `AcademiaPython_Fisa_${modul.cod.replace(".", "_")}${sufix}.pdf`);
  } catch (error) {
    console.error("Eroare generare PDF fisa:", error);
    return raspunsEroarePdf();
  }
}
