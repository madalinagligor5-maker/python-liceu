import PDFDocument from "pdfkit";
import { NextRequest, NextResponse } from "next/server";
import { getModul } from "@/lib/curriculum";
import { obtineFisaPdfContent } from "@/lib/resursePdfContent";

export const dynamic = "force-dynamic";

function curataDiacritice(text: string): string {
  return text
    .replace(/ș/g, "s")
    .replace(/Ș/g, "S")
    .replace(/ț/g, "t")
    .replace(/Ț/g, "T")
    .replace(/ă/g, "a")
    .replace(/Ă/g, "A")
    .replace(/â/g, "a")
    .replace(/Â/g, "A")
    .replace(/î/g, "i")
    .replace(/Î/g, "I")
    .replace(/î/g, "i");
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ clasa: string; modulSlug: string }> }
) {
  try {
    const { clasa, modulSlug } = await params;
    const modul = getModul(clasa, modulSlug);
    if (!modul) {
      return new NextResponse("Modulul nu a fost gasit", { status: 404 });
    }

    const fisa = obtineFisaPdfContent(modul.cod, modul.titlu);

    // Initializare PDF
    const doc = new PDFDocument({
      size: "A4",
      margin: 40,
    });

    const chunks: Buffer[] = [];
    doc.on("data", (chunk) => chunks.push(chunk));

    // Antet: Logo textual curat
    doc.fontSize(16).font("Helvetica-Bold").fillColor("#16163a").text("Academia", {
      continued: true,
    });
    doc.fillColor("#f5b301").text("Python");
    
    doc.fontSize(8).font("Helvetica-Bold").fillColor("#6b6a7b").text(`FISA DE STUDIU & LUCRU - CLASA A ${clasa.toUpperCase()}-A`, {
      align: "right",
    });

    // Linie separatoare
    doc.moveDown(0.5);
    doc.strokeColor("#e7e0d2").lineWidth(1).moveTo(40, doc.y).lineTo(555, doc.y).stroke();
    doc.moveDown(1.5);

    // Titlu Modul
    doc.fontSize(10).font("Helvetica-Bold").fillColor("#f5b301").text(`MODULUL ${modul.cod}`);
    doc.fontSize(16).font("Helvetica-Bold").fillColor("#16163a").text(curataDiacritice(modul.titlu));
    doc.moveDown(1.5);

    // 1. Sinteza teoretica
    doc.fontSize(11).font("Helvetica-Bold").fillColor("#16163a").text("📌 SINTEZA TEORETICA");
    doc.moveDown(0.3);
    doc.fontSize(10).font("Helvetica").fillColor("#2d2d4d").text(curataDiacritice(fisa.teorie), {
      align: "justify",
      lineGap: 4,
    });
    doc.moveDown(1.5);

    // 2. Sintaxa si Cod Model
    doc.fontSize(11).font("Helvetica-Bold").fillColor("#16163a").text("💻 SINTAXA & COD MODEL (PYTHON)");
    doc.moveDown(0.5);

    // Calcul inaltime caseta terminal
    const codCurat = curataDiacritice(fisa.sintaxa);
    const liniiCod = codCurat.split("\n");
    const codInaltime = liniiCod.length * 13 + 18;

    // Terminal Box
    const startY = doc.y;
    doc.fillColor("#1e1b3a").rect(40, startY, 515, codInaltime).fill();
    doc.fillColor("#ffffff").font("Courier-Bold").fontSize(9);
    
    let currentLineY = startY + 10;
    liniiCod.forEach((line) => {
      doc.text(line, 50, currentLineY);
      currentLineY += 13;
    });

    doc.y = startY + codInaltime;
    doc.moveDown(1.5);

    // 3. Exercitii de antrenament
    doc.fontSize(11).font("Helvetica-Bold").fillColor("#16163a").text("✍️ EXERCITII DE ANTRENAMENT");
    doc.moveDown(0.5);
    
    doc.fontSize(9).font("Helvetica-Oblique").fillColor("#6b6a7b").text("Rezolva urmatoarele exercitii pe foaie sau in editorul online al platformei:");
    doc.moveDown(0.5);

    doc.font("Helvetica").fontSize(10).fillColor("#2d2d4d");
    fisa.exercitii.forEach((ex, idx) => {
      doc.text(`${idx + 1}. ${curataDiacritice(ex)}`, {
        lineGap: 3,
      });
      doc.moveDown(0.4);
    });

    // Linie separatoare subsol
    doc.y = 740;
    doc.strokeColor("#e7e0d2").lineWidth(1).moveTo(40, doc.y).lineTo(555, doc.y).stroke();
    doc.moveDown(0.5);

    // Footer reclama
    doc.fontSize(8.5).font("Helvetica-Bold").fillColor("#16163a").text(
      "Testeaza acest cod si verifica-ti rezolvarea pas cu pas cu asistentul AI pe academiapython.ro",
      { align: "center" }
    );
    doc.fontSize(7.5).font("Helvetica").fillColor("#6b6a7b").text(
      "Fișa de lucru generată automat de AcademiaPython.ro. Toate drepturile rezervate.",
      { align: "center" }
    );

    doc.end();

    // Promisiune pentru asamblare buffer PDF
    const pdfBuffer = await new Promise<Buffer>((resolve, reject) => {
      const buffers: Buffer[] = [];
      doc.on("data", (chunk) => buffers.push(chunk));
      doc.on("end", () => resolve(Buffer.concat(buffers)));
      doc.on("error", (err) => reject(err));
    });

    return new Response(new Uint8Array(pdfBuffer), {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="AcademiaPython_Fisa_${modul.cod.replace(".", "_")}.pdf"`,
      },
    });
  } catch (error) {
    console.error("Eroare generare PDF:", error);
    return new Response("Eroare interna la generarea fisierului PDF.", { status: 500 });
  }
}
