import { NextRequest } from "next/server";
import {
  Document,
  Packer,
  Paragraph,
  TextRun,
  HeadingLevel,
  AlignmentType,
  Table,
  TableRow,
  TableCell,
  WidthType,
} from "docx";
import { getUtilizatorCurent } from "@/lib/subscription";
import { construiestePrograma, anScolarImplicit } from "@/lib/planificarePrograma";

export const dynamic = "force-dynamic";

function numeDinEmail(email: string): string {
  const local = email.split("@")[0] ?? "";
  const curatat = local.replace(/[0-9_.-]/g, " ").trim();
  if (!curatat) return email;
  return curatat.charAt(0).toUpperCase() + curatat.slice(1);
}

function celula(text: string, antet = false): TableCell {
  return new TableCell({
    children: [new Paragraph({ children: [new TextRun({ text, bold: antet })] })],
    width: { size: 20, type: WidthType.PERCENTAGE },
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

    const listaCuBuline = (itemi: string[]) =>
      itemi.map(
        (item) =>
          new Paragraph({ text: item, bullet: { level: 0 }, spacing: { after: 100 } })
      );

    const paragrafeSectiune = (titlu: string, continut: Paragraph[]) => [
      new Paragraph({ text: titlu, heading: HeadingLevel.HEADING_2, spacing: { before: 300, after: 150 } }),
      ...continut,
    ];

    const randTabel = (celule: string[], antet = false) =>
      new TableRow({
        children: celule.map((c) => celula(c, antet)),
      });

    const doc = new Document({
      sections: [
        {
          children: [
            // Pagină de titlu — datele de identificare (liceu, profesor) sunt
            // completate automat mai jos, dar rămân editabile direct în Word,
            // exact ce a cerut fondatoarea.
            new Paragraph({
              text: programa.paginaTitlu.liceu,
              alignment: AlignmentType.CENTER,
              spacing: { after: 400 },
            }),
            new Paragraph({
              text: "Programă școlară pentru",
              alignment: AlignmentType.CENTER,
              spacing: { after: 100 },
            }),
            new Paragraph({
              children: [new TextRun({ text: "PLANIFICARE CALENDARISTICĂ", bold: true, size: 36 })],
              alignment: AlignmentType.CENTER,
              spacing: { after: 400 },
            }),
            new Paragraph({
              text: `Disciplina: ${programa.paginaTitlu.disciplina}`,
              alignment: AlignmentType.CENTER,
            }),
            new Paragraph({
              text: `Clasa a ${programa.paginaTitlu.clasa}-a`,
              alignment: AlignmentType.CENTER,
            }),
            new Paragraph({
              text: `Durata: ${programa.paginaTitlu.durataOreSaptamana} ore/săptămână (${programa.paginaTitlu.durataOreTeoriePractica})`,
              alignment: AlignmentType.CENTER,
            }),
            new Paragraph({
              text: `${programa.paginaTitlu.durataOreTotal} ore alocate module în planificare`,
              alignment: AlignmentType.CENTER,
              spacing: { after: 400 },
            }),
            new Paragraph({
              text: `Prof. ${programa.paginaTitlu.profesor}`,
              alignment: AlignmentType.CENTER,
            }),
            new Paragraph({
              text: `Anul școlar ${programa.paginaTitlu.anScolar}`,
              alignment: AlignmentType.CENTER,
              pageBreakBefore: false,
            }),

            new Paragraph({
              text: programa.paginaTitlu.disciplina,
              heading: HeadingLevel.HEADING_1,
              pageBreakBefore: true,
              spacing: { after: 200 },
            }),

            ...paragrafeSectiune(
              "Notă de prezentare",
              programa.notaDePrezentare.map(
                (p) => new Paragraph({ text: p, spacing: { after: 150 }, alignment: AlignmentType.JUSTIFIED })
              )
            ),

            ...paragrafeSectiune("Competențe cheie europene vizate", listaCuBuline(programa.competenteCheie)),

            ...paragrafeSectiune(
              "Competențe generale",
              [
                new Paragraph({
                  children: [
                    new TextRun({
                      text: "Text oficial, identic pentru toate clasele IX-XII (Ordinul 4.370/2026, Anexele 8-11).",
                      italics: true,
                      size: 18,
                    }),
                  ],
                  spacing: { after: 150 },
                }),
                ...listaCuBuline(programa.competenteGenerale),
              ]
            ),

            ...paragrafeSectiune("Valori și atitudini", [
              new Paragraph({ text: programa.notaValoriSiAtitudini, alignment: AlignmentType.JUSTIFIED }),
            ]),

            new Paragraph({
              text: "Competențe specifice și conținuturi",
              heading: HeadingLevel.HEADING_2,
              spacing: { before: 300, after: 150 },
            }),
            new Table({
              width: { size: 100, type: WidthType.PERCENTAGE },
              rows: [
                randTabel(["Unitate de învățare", "Competențe specifice", "Conținuturi", "Ore", "Săptămâna"], true),
                ...programa.tabel.map((r) =>
                  randTabel([
                    r.unitate,
                    r.competenteSpecifice,
                    r.continuturi.join("; "),
                    String(r.oreAlocate),
                    `S${r.saptamana}`,
                  ])
                ),
              ],
            }),

            ...paragrafeSectiune("Sugestii metodologice", listaCuBuline(programa.sugestiiMetodologice)),
            ...paragrafeSectiune("Modalități de evaluare", listaCuBuline(programa.modalitatiEvaluare)),
            ...paragrafeSectiune("Bibliografie", listaCuBuline(programa.bibliografie)),
          ],
        },
      ],
    });

    const buffer = await Packer.toBuffer(doc);

    return new Response(new Uint8Array(buffer), {
      headers: {
        "Content-Type": "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        "Content-Disposition": `attachment; filename="AcademiaPython_Planificare_${clasa}.docx"`,
      },
    });
  } catch (error) {
    console.error("Eroare generare Word planificare:", error);
    return new Response(
      JSON.stringify({ eroare: "Nu am putut genera documentul Word, incearca din nou." }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}
