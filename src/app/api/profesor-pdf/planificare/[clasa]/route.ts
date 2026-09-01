import { NextRequest } from "next/server";
import { getUtilizatorCurent } from "@/lib/subscription";
import { construiestePrograma, anScolarImplicit } from "@/lib/planificarePrograma";
import {
  creeazaDocumentPdf,
  finalizeazaPdf,
  raspunsPdf,
  raspunsEroarePdf,
  curataDiacritice,
} from "@/lib/pdfProfesor";

export const dynamic = "force-dynamic";

const LATIME_COLOANE = [85, 115, 210, 35, 60]; // total 505 (+ margini)

function numeDinEmail(email: string): string {
  const local = email.split("@")[0] ?? "";
  const curatat = local.replace(/[0-9_.-]/g, " ").trim();
  if (!curatat) return email;
  return curatat.charAt(0).toUpperCase() + curatat.slice(1);
}

function randTabel(doc: PDFKit.PDFDocument, celule: string[], antet = false) {
  const x0 = 40;
  doc.font(antet ? "Helvetica-Bold" : "Helvetica").fontSize(8);
  const inaltimi = celule.map((text, i) =>
    doc.heightOfString(curataDiacritice(text), { width: LATIME_COLOANE[i] - 6 })
  );
  const inaltimeRand = Math.max(...inaltimi, 10) + 8;

  if (doc.y + inaltimeRand > 770) doc.addPage();

  const y = doc.y;
  let x = x0;
  celule.forEach((text, i) => {
    doc
      .font(antet ? "Helvetica-Bold" : "Helvetica")
      .fontSize(8)
      .fillColor(antet ? "#16163a" : "#2d2d4d")
      .text(curataDiacritice(text), x + 3, y + 4, { width: LATIME_COLOANE[i] - 6 });
    x += LATIME_COLOANE[i];
  });

  doc.y = y + inaltimeRand;
  doc.strokeColor("#e7e0d2").lineWidth(0.5).moveTo(x0, doc.y).lineTo(x0 + 505, doc.y).stroke();
}

function sectiune(doc: PDFKit.PDFDocument, titlu: string) {
  if (doc.y > 740) doc.addPage();
  doc.moveDown(1);
  doc.fontSize(12).font("Helvetica-Bold").fillColor("#16163a").text(curataDiacritice(titlu));
  doc.moveDown(0.4);
}

function listaBuline(doc: PDFKit.PDFDocument, itemi: string[]) {
  doc.fontSize(9).font("Helvetica").fillColor("#2d2d4d");
  itemi.forEach((item) => {
    if (doc.y > 770) doc.addPage();
    doc.text(`•  ${curataDiacritice(item)}`, { indent: 4, lineGap: 2 });
    doc.moveDown(0.2);
  });
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ clasa: string }> }
) {
  try {
    const { user, meta } = await getUtilizatorCurent();
    if (!user || meta?.rol !== "profesor_aprobat") {
      return new Response("Acces interzis.", { status: 403 });
    }

    const { clasa } = await params;
    const { searchParams } = new URL(request.url);
    const anScolar = searchParams.get("anScolar")?.trim() || anScolarImplicit(new Date());

    const programa = await construiestePrograma(clasa, {
      liceu: meta.scoala,
      profesor: numeDinEmail(user.email),
      anScolar,
    });
    if (!programa) return new Response("Clasa nu a fost gasita.", { status: 404 });

    const doc = creeazaDocumentPdf();

    // Pagină de titlu.
    doc.fontSize(12).font("Helvetica-Bold").fillColor("#16163a").text(
      curataDiacritice(programa.paginaTitlu.liceu),
      { align: "center" }
    );
    doc.moveDown(1.5);
    doc.fontSize(9).font("Helvetica").fillColor("#6b6a7b").text("Programa scolara pentru", { align: "center" });
    doc.fontSize(18).font("Helvetica-Bold").fillColor("#16163a").text("PLANIFICARE CALENDARISTICA", {
      align: "center",
    });
    doc.moveDown(1.5);
    doc.fontSize(11).font("Helvetica").fillColor("#2d2d4d").text(
      curataDiacritice(`Disciplina: ${programa.paginaTitlu.disciplina}`),
      { align: "center" }
    );
    doc.text(curataDiacritice(`Clasa a ${programa.paginaTitlu.clasa}-a`), { align: "center" });
    doc.text(
      curataDiacritice(
        `Durata: ${programa.paginaTitlu.durataOreSaptamana ?? "-"} ore/saptamana, ${programa.paginaTitlu.durataOreTotal} ore total`
      ),
      { align: "center" }
    );
    doc.moveDown(1.5);
    doc.text(curataDiacritice(`Prof. ${programa.paginaTitlu.profesor}`), { align: "center" });
    doc.text(curataDiacritice(`Anul scolar ${programa.paginaTitlu.anScolar}`), { align: "center" });

    doc.addPage();

    doc.fontSize(14).font("Helvetica-Bold").fillColor("#16163a").text(curataDiacritice(programa.paginaTitlu.disciplina));

    sectiune(doc, "Nota de prezentare");
    doc.fontSize(9).font("Helvetica").fillColor("#2d2d4d");
    programa.notaDePrezentare.forEach((p) => {
      doc.text(curataDiacritice(p), { align: "justify", lineGap: 2 });
      doc.moveDown(0.6);
    });

    sectiune(doc, "Competente cheie europene vizate");
    listaBuline(doc, programa.competenteCheie);

    sectiune(doc, "Competente generale");
    if (programa.competenteGenerale) {
      listaBuline(doc, programa.competenteGenerale);
    } else {
      doc.fontSize(9).font("Helvetica-Oblique").fillColor("#a15c00").text(
        "[DE COMPLETAT - text oficial din Ordinul 4.370/2026]"
      );
    }

    sectiune(doc, "Valori si atitudini");
    if (programa.valoriSiAtitudini) {
      listaBuline(doc, programa.valoriSiAtitudini);
    } else {
      doc.fontSize(9).font("Helvetica-Oblique").fillColor("#a15c00").text(
        "[DE COMPLETAT - text oficial din Ordinul 4.370/2026]"
      );
    }

    sectiune(doc, "Competente specifice si continuturi");
    randTabel(doc, ["Unitate", "Competente specifice", "Continuturi", "Ore", "Sapt."], true);
    for (const r of programa.tabel) {
      randTabel(doc, [
        r.unitate,
        r.competenteSpecifice,
        r.continuturi.join("; "),
        String(r.oreAlocate),
        `S${r.saptamana}`,
      ]);
    }

    sectiune(doc, "Sugestii metodologice");
    listaBuline(doc, programa.sugestiiMetodologice);

    sectiune(doc, "Modalitati de evaluare");
    listaBuline(doc, programa.modalitatiEvaluare);

    sectiune(doc, "Bibliografie");
    listaBuline(doc, programa.bibliografie);

    const buffer = await finalizeazaPdf(doc);
    return raspunsPdf(buffer, `AcademiaPython_Planificare_${clasa}.pdf`);
  } catch (error) {
    console.error("Eroare generare PDF planificare:", error);
    return raspunsEroarePdf();
  }
}
