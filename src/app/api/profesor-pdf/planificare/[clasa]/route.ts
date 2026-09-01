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

// Landscape A4, margini 40 -> latime utila ~ 761.
const LATIME_COLOANE = [130, 160, 340, 40, 55]; // total 725 (+ margini)
const X0 = 40;
const LATIME_TOTAL = LATIME_COLOANE.reduce((a, b) => a + b, 0);

function numeDinEmail(email: string): string {
  const local = email.split("@")[0] ?? "";
  const curatat = local.replace(/[0-9_.-]/g, " ").trim();
  if (!curatat) return email;
  return curatat.charAt(0).toUpperCase() + curatat.slice(1);
}

/** Tabel alb-negru: chenar complet pe fiecare celulă, umplere gri deschis pe antet. */
function randTabel(doc: PDFKit.PDFDocument, celule: string[], antet = false) {
  doc.font(antet ? "Helvetica-Bold" : "Helvetica").fontSize(8);
  const inaltimi = celule.map((text, i) =>
    doc.heightOfString(curataDiacritice(text), { width: LATIME_COLOANE[i] - 8 })
  );
  const inaltimeRand = Math.max(...inaltimi, 10) + 10;

  if (doc.y + inaltimeRand > 530) doc.addPage();

  const y = doc.y;
  let x = X0;

  if (antet) {
    doc.rect(X0, y, LATIME_TOTAL, inaltimeRand).fillAndStroke("#eeeeee", "#000000");
  }

  celule.forEach((text, i) => {
    doc.rect(x, y, LATIME_COLOANE[i], inaltimeRand).lineWidth(0.75).strokeColor("#000000").stroke();
    doc
      .font(antet ? "Helvetica-Bold" : "Helvetica")
      .fontSize(8)
      .fillColor("#000000")
      .text(curataDiacritice(text), x + 4, y + 5, { width: LATIME_COLOANE[i] - 8 });
    x += LATIME_COLOANE[i];
  });

  doc.y = y + inaltimeRand;
}

function sectiune(doc: PDFKit.PDFDocument, titlu: string) {
  if (doc.y > 500) doc.addPage();
  doc.moveDown(1);
  doc.fontSize(12).font("Helvetica-Bold").fillColor("#000000").text(curataDiacritice(titlu));
  doc.moveTo(X0, doc.y + 2).lineTo(X0 + LATIME_TOTAL, doc.y + 2).lineWidth(0.75).strokeColor("#000000").stroke();
  doc.moveDown(0.6);
}

function listaBuline(doc: PDFKit.PDFDocument, itemi: string[]) {
  doc.fontSize(9).font("Helvetica").fillColor("#000000");
  itemi.forEach((item) => {
    if (doc.y > 530) doc.addPage();
    doc.text(`-  ${curataDiacritice(item)}`, { indent: 4, lineGap: 2 });
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
    const profil = searchParams.get("profil")?.trim() || undefined;

    const programa = await construiestePrograma(clasa, {
      liceu: meta.scoala,
      profesor: numeDinEmail(user.email),
      anScolar,
      profil,
    });
    if (!programa) return new Response("Clasa nu a fost gasita.", { status: 404 });

    const doc = creeazaDocumentPdf({ layout: "landscape" });

    // Pagină de titlu — alb-negru, fără elemente colorate.
    doc.fontSize(12).font("Helvetica-Bold").fillColor("#000000").text(
      curataDiacritice(programa.paginaTitlu.liceu),
      { align: "center" }
    );
    doc.moveDown(1.2);
    doc.fontSize(9).font("Helvetica").fillColor("#000000").text("Programa scolara pentru", { align: "center" });
    doc.fontSize(18).font("Helvetica-Bold").fillColor("#000000").text("PLANIFICARE CALENDARISTICA", {
      align: "center",
    });
    doc.moveDown(1.2);
    doc.fontSize(11).font("Helvetica").fillColor("#000000").text(
      curataDiacritice(`Disciplina: ${programa.paginaTitlu.disciplina}`),
      { align: "center" }
    );
    doc.text(curataDiacritice(`Clasa a ${programa.paginaTitlu.clasa}-a`), { align: "center" });
    doc.text(curataDiacritice(programa.paginaTitlu.profilEticheta), { align: "center" });
    doc.text(
      curataDiacritice(
        `Durata: ${programa.paginaTitlu.durataOreSaptamana} ore/saptamana (${programa.paginaTitlu.durataOreTeoriePractica})`
      ),
      { align: "center" }
    );
    doc.text(
      curataDiacritice(`${programa.paginaTitlu.durataOreTotal} ore alocate module in planificare`),
      { align: "center" }
    );
    doc.moveDown(1.2);
    doc.text(curataDiacritice(`Prof. ${programa.paginaTitlu.profesor}`), { align: "center" });
    doc.text(curataDiacritice(`Anul scolar ${programa.paginaTitlu.anScolar}`), { align: "center" });

    doc.moveDown(1.5);
    doc.fontSize(8).font("Helvetica-Oblique").fillColor("#000000").text(
      "Pagina in lucru -- planificarea se completeaza si se actualizeaza constant.",
      { align: "center" }
    );

    doc.addPage();

    doc.fontSize(14).font("Helvetica-Bold").fillColor("#000000").text(curataDiacritice(programa.paginaTitlu.disciplina));

    sectiune(doc, "Nota de prezentare");
    doc.fontSize(9).font("Helvetica").fillColor("#000000");
    programa.notaDePrezentare.forEach((p) => {
      doc.text(curataDiacritice(p), { align: "justify", lineGap: 2, width: LATIME_TOTAL });
      doc.moveDown(0.6);
    });

    sectiune(doc, "Competente cheie europene vizate");
    listaBuline(doc, programa.competenteCheie);

    sectiune(doc, "Competente generale");
    doc.fontSize(8).font("Helvetica-Oblique").fillColor("#000000").text(
      curataDiacritice(programa.notaCompetenteGenerale),
      { width: LATIME_TOTAL }
    );
    doc.moveDown(0.3);
    listaBuline(doc, programa.competenteGenerale);

    sectiune(doc, "Valori si atitudini");
    doc.fontSize(9).font("Helvetica").fillColor("#000000").text(
      curataDiacritice(programa.notaValoriSiAtitudini),
      { align: "justify", lineGap: 2, width: LATIME_TOTAL }
    );

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
    return raspunsPdf(buffer, `AcademiaPython_Planificare_${clasa}_${programa.paginaTitlu.profil}.pdf`);
  } catch (error) {
    console.error("Eroare generare PDF planificare:", error);
    return raspunsEroarePdf();
  }
}
