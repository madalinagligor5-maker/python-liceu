import { notFound } from "next/navigation";
import Link from "next/link";
import { listaClaseProfesor, progresulClasei } from "@/app/actions/clase";

export const metadata = { title: "Progres clasă — Academia Python" };
export const dynamic = "force-dynamic";

function dataScurta(iso: string | null): string {
  if (!iso) return "Fără activitate";
  return new Date(iso).toLocaleDateString("ro-RO", { day: "numeric", month: "short", year: "numeric" });
}

export default async function ProgresClasaPage({
  params,
}: {
  params: Promise<{ claseId: string }>;
}) {
  const { claseId } = await params;

  // listaClaseProfesor e scoped la profesorul curent (RLS) — dacă id-ul din
  // URL nu e printre clasele lui, tratăm ca „nu există", fără să dezvăluim
  // dacă o clasă cu acel id chiar există în alt cont.
  const clase = await listaClaseProfesor();
  const clasa = clase.find((c) => c.id === claseId);
  if (!clasa) notFound();

  const elevi = await progresulClasei(claseId);

  return (
    <div className="space-y-6">
      <div>
        <Link href="/profesor/clase" className="text-sm font-semibold text-brand hover:underline">
          ← Toate clasele
        </Link>
        <h1 className="mt-2 text-xl font-bold text-foreground">{clasa.numeClasa}</h1>
        <p className="mt-1 text-sm text-foreground/60">
          Cod: <span className="font-mono font-bold text-brand">{clasa.codClasa}</span> ·{" "}
          {elevi.length} {elevi.length === 1 ? "elev asociat" : "elevi asociați"}
        </p>
      </div>

      {elevi.length === 0 ? (
        <p className="text-sm text-foreground/50">
          Niciun elev nu s-a asociat încă. Trimite-le codul de mai sus.
        </p>
      ) : (
        <div className="overflow-x-auto rounded-xl border border-black/10 bg-white">
          <table className="w-full min-w-[520px] text-left text-sm">
            <thead className="border-b border-black/10 bg-black/[0.02] text-xs uppercase text-foreground/50">
              <tr>
                <th className="px-4 py-2.5">Elev</th>
                <th className="px-4 py-2.5">Module parcurse</th>
                <th className="px-4 py-2.5">Scor mediu quiz</th>
                <th className="px-4 py-2.5">Ultima activitate</th>
              </tr>
            </thead>
            <tbody>
              {elevi.map((e) => (
                <tr key={e.elevId} className="border-b border-black/5 last:border-0">
                  <td className="px-4 py-3 font-medium text-foreground">{e.numeAfisat}</td>
                  <td className="px-4 py-3 text-foreground/70">{e.procentModule}%</td>
                  <td className="px-4 py-3 text-foreground/70">
                    {e.scorMediu === null ? "—" : `${e.scorMediu}%`}
                  </td>
                  <td className="px-4 py-3 text-foreground/70">{dataScurta(e.ultimaActivitate)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
