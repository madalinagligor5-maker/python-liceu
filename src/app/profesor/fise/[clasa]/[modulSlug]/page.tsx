import { notFound } from "next/navigation";
import Link from "next/link";
import { getModul } from "@/lib/curriculum";
import { getExercitiiSublectie } from "@/lib/exercitii";
import FisaExercitii from "@/components/profesor/FisaExercitii";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ clasa: string; modulSlug: string }>;
}) {
  const { clasa, modulSlug } = await params;
  const modul = getModul(clasa, modulSlug);
  return { title: modul ? `Fișă — ${modul.cod} ${modul.titlu} — Academia Python` : "Fișă de lucru" };
}

export default async function FisaModulPage({
  params,
}: {
  params: Promise<{ clasa: string; modulSlug: string }>;
}) {
  const { clasa, modulSlug } = await params;
  const modul = getModul(clasa, modulSlug);
  if (!modul) notFound();

  const grupeExercitii = (
    await Promise.all(
      modul.sublectii.map(async (s) => ({
        sublectieCod: s.cod,
        sublectieTitlu: s.titlu,
        exercitii: await getExercitiiSublectie(s.cod),
      }))
    )
  ).filter((g) => g.exercitii.length > 0);

  return (
    <div>
      <style
        dangerouslySetInnerHTML={{
          __html: `
        @media print {
          @page { size: A4 portrait; margin: 1.5cm; }
          body { background: white !important; }
        }
      `,
        }}
      />

      <Link href="/profesor/fise" className="print-hidden text-sm font-semibold text-brand hover:underline">
        ← Toate fișele
      </Link>

      <h1 className="mt-2 text-xl font-bold text-foreground">
        Fișă de lucru — {modul.cod} {modul.titlu}
      </h1>
      <p className="mt-1 text-sm text-foreground/60">Clasa a {clasa}-a</p>

      {grupeExercitii.length === 0 ? (
        <p className="mt-6 text-sm text-foreground/50">
          Acest modul nu are încă exerciții încărcate în bancă.
        </p>
      ) : (
        <div className="mt-6">
          <FisaExercitii grupeExercitii={grupeExercitii} />
        </div>
      )}
    </div>
  );
}
