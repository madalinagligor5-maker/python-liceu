import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import KidsAdventureClient from "@/components/KidsAdventureClient";
import { getUtilizatorCurent } from "@/lib/subscription";

type Params = { nivelId: string };

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { nivelId } = await params;
  return {
    title: "Aventura lui Pippy — Kids",
    description: "Rezolvă puzzle-ul de logică, controlează robotul și scrie primele tale instrucțiuni Python.",
    alternates: { canonical: `/kids/aventura/${nivelId}` },
  };
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
          <span className="text-xs font-semibold text-slate-400">
            Nivelul {idNum} din 3
          </span>
        </div>

        {/* Client Interactive Game Board */}
        <KidsAdventureClient nivelId={idNum} autentificat={Boolean(user)} />
      </div>
    </div>
  );
}
