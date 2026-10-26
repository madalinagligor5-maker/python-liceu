import { NextResponse, type NextRequest } from "next/server";
import { getUtilizatorCurent } from "@/lib/subscription";
import { esteAdmin } from "@/lib/roluri";
import { catreCsv, filtreaza, FILTRE, listaContacte, type FiltruLista } from "@/lib/listaEmail";

export const dynamic = "force-dynamic";

/** Descarcă lista de emailuri ca CSV. Doar pentru admin (layout-ul nu protejează rutele API). */
export async function GET(request: NextRequest) {
  const { user } = await getUtilizatorCurent();
  if (!user || !esteAdmin(user.email)) {
    return NextResponse.json({ eroare: "Acces interzis" }, { status: 403 });
  }

  const cerut = request.nextUrl.searchParams.get("filtru") ?? "promotie";
  const filtru: FiltruLista = cerut in FILTRE ? (cerut as FiltruLista) : "promotie";
  const contacte = filtreaza(await listaContacte(), filtru);
  const data = new Date().toISOString().slice(0, 10);

  return new NextResponse(catreCsv(contacte), {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="emailuri-${filtru}-${data}.csv"`,
      "Cache-Control": "no-store",
    },
  });
}
