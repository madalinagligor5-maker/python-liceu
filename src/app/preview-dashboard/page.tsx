import Dashboard from "@/components/Dashboard";
import type { ProgresUtilizator } from "@/lib/progres";
import { toateLectiile } from "@/lib/content";

export const metadata = {
  title: "Previzualizare dashboard — Academia Python",
  robots: { index: false, follow: false },
};

/**
 * Pagină de previzualizare pentru dashboard, cu date fictive.
 * Există ca să se poată verifica interfața fără cont și fără Supabase
 * configurat. Nu citește și nu scrie nimic în baza de date.
 */
export default async function PreviewDashboard({
  searchParams,
}: {
  searchParams: Promise<{ clasa?: string | string[] }>;
}) {
  const params = await searchParams;
  const cerut = Array.isArray(params?.clasa) ? params.clasa[0] : params?.clasa;
  const clasa = cerut && ["IX", "X", "XI", "XII"].includes(cerut) ? cerut : "IX";

  // Marcăm primele 2 lecții ale clasei ca finalizate, ca să se vadă toate
  // stările din drumul de învățare: finalizat, curent, blocat.
  const finalizate = toateLectiile
    .filter((l) => l.clasa === clasa)
    .slice(0, 2)
    .map((l) => l.lectie_slug);

  const progresDemo: ProgresUtilizator = {
    lectiiFinalizate: finalizate,
    xpTotal: 340,
    streakZile: 3,
    ultimaActivitate: new Date().toISOString().slice(0, 10),
    clasa,
    insigne: ["prima-lectie", "serie-3-zile"],
  };

  return (
    <>
      <p className="bg-warning/15 px-4 py-2 text-center text-xs font-semibold text-foreground">
        Previzualizare cu date fictive — nu reflectă progresul unui cont real.
      </p>
      <Dashboard prenume="Madalina" progres={progresDemo} clasaSelectata={clasa} />
    </>
  );
}
