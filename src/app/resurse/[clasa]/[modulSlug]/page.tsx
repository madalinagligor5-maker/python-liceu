import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getModul, getCapitol } from "@/lib/curriculum";

type Params = { clasa: string; modulSlug: string };

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { clasa, modulSlug } = await params;
  const modul = getModul(clasa, modulSlug);
  return {
    title: modul ? `Vizualizare Fișă: ${modul.titlu} — Academia Python` : "Resurse PDF",
  };
}

export default async function ResursaPdfPreviewPage({
  params,
}: {
  params: Promise<Params>;
}) {
  const { clasa, modulSlug } = await params;
  const modul = getModul(clasa, modulSlug);
  const capitol = getCapitol(clasa);

  if (!modul || !capitol) notFound();

  const pdfUrl = `/api/pdf/${clasa}/${modulSlug}`;
  const downloadUrl = `/api/pdf/${clasa}/${modulSlug}?download=true`;

  return (
    <div className="flex flex-col min-h-screen bg-slate-900 text-white">
      {/* Header bar pentru vizualizare */}
      <div className="flex items-center justify-between gap-4 border-b border-white/10 bg-slate-950 px-4 py-4 sm:px-6 shadow-md">
        <div className="min-w-0">
          <nav className="text-xs text-slate-400 flex items-center gap-1.5">
            <Link href="/resurse" className="hover:text-white transition">
              Resurse
            </Link>
            <span>/</span>
            <Link href={`/resurse/${clasa}`} className="hover:text-white transition">
              Clasa a {clasa}-a
            </Link>
            <span>/</span>
            <span className="text-slate-200 truncate">{modul.cod}</span>
          </nav>
          <h1 className="mt-1 text-base font-extrabold text-white truncate max-w-xs sm:max-w-md md:max-w-xl">
            Modulul {modul.cod} — {modul.titlu}
          </h1>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <Link
            href={`/resurse/${clasa}`}
            className="rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 px-3 py-2 text-xs font-bold text-slate-200 transition"
          >
            ← Înapoi
          </Link>
          <a
            href={downloadUrl}
            className="inline-flex items-center gap-1.5 rounded-xl bg-success px-3 py-2 text-xs font-bold text-white shadow-sm transition hover:bg-success-dark"
          >
            📥 Descarcă
          </a>
        </div>
      </div>

      {/* Container Iframe Viewer */}
      <div className="flex-1 w-full relative bg-slate-800 p-2 sm:p-4 md:p-6 flex justify-center items-center h-[calc(100vh-73px)]">
        <div className="w-full h-full max-w-5xl rounded-2xl border border-white/10 overflow-hidden shadow-2xl bg-white relative">
          <iframe
            src={pdfUrl}
            className="w-full h-full border-none"
            title={`Vizualizare Fisa PDF - Modulul ${modul.cod}`}
          />
        </div>
      </div>
    </div>
  );
}
