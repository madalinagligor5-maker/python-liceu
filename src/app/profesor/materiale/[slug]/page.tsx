import Link from "next/link";
import { notFound } from "next/navigation";
import { getMaterialDupaSlug } from "@/lib/materialeProfesori";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const material = await getMaterialDupaSlug(slug);
  return { title: material ? `${material.titlu} — Academia Python` : "Material" };
}

export default async function MaterialProfesorPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const material = await getMaterialDupaSlug(slug);
  if (!material || material.tip !== "pdf") notFound();

  return (
    <div className="max-w-3xl">
      <Link href="/profesor/materiale" className="text-sm font-semibold text-brand hover:underline">
        ← Toate materialele
      </Link>

      <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-xl font-bold text-foreground">{material.titlu}</h1>
        <a
          href={`/api/profesor-pdf/material/${slug}`}
          className="rounded-full bg-amber-400 hover:bg-amber-500 text-slate-950 font-black px-4 py-2 text-xs transition shadow-sm"
        >
          📄 Descarcă PDF
        </a>
      </div>

      {material.ciorna && (
        <p className="mt-3 rounded-xl border border-amber-200 bg-amber-50 px-4 py-2 text-xs font-semibold text-amber-800">
          Ciornă — text nerevizuit, aflat în așteptarea confirmării fondatoarei.
        </p>
      )}

      <div
        className="mt-6 max-w-[68ch] space-y-4 text-[15px] leading-[1.7] text-foreground/90"
        dangerouslySetInnerHTML={{ __html: material.corpHtml }}
      />
    </div>
  );
}
