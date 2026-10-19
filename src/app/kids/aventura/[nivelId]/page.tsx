import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import KidsAdventureClient from "@/components/KidsAdventureClient";
import { getUtilizatorCurent } from "@/lib/subscription";
import { metadatePagina } from "@/lib/seo";

type Params = { nivelId: string };

/** Numele misiunilor, ca în enunțurile din KidsAdventureClient. */
const MISIUNI: Record<string, string> = {
  "1": "Secvențialitate",
  "2": "Puterea Repetiției",
  "3": "Primul tău cod Python",
};

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { nivelId } = await params;
  const misiune = MISIUNI[nivelId];
  if (!misiune) return {};
  return metadatePagina({
    titlu: `Aventura lui Pippy, nivelul ${nivelId}: ${misiune} — Kids`,
    descriere: `Nivelul ${nivelId} din 3 („${misiune}”): rezolvă puzzle-ul de logică, controlează robotul și scrie primele tale instrucțiuni Python.`,
    cale: `/kids/aventura/${nivelId}`,
  });
}

export default async function KidsLevelPage({ params }: { params: Promise<Params> }) {
  const { nivelId } = await params;
  const idNum = parseInt(nivelId);

  if (isNaN(idNum) || idNum < 1 || idNum > 3) {
    notFound();
  }

  const { user } = await getUtilizatorCurent();

  return (
    <div className="min-h-screen bg-slate-100 py-6 px-4">
      <div className="mx-auto max-w-6xl">
        {/* Navigation Breadcrumb */}
        <div className="mb-4 flex items-center justify-between">
          <Link
            href="/kids"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-indigo-600 transition"
          >
            ← Înapoi la Hartă
          </Link>
          <h1 className="text-xs font-semibold text-slate-400">
            Aventura lui Pippy · Nivelul {idNum} din 3
          </h1>
        </div>

        {/* Client Interactive Game Board */}
        <KidsAdventureClient nivelId={idNum} autentificat={Boolean(user)} />
      </div>
    </div>
  );
}
