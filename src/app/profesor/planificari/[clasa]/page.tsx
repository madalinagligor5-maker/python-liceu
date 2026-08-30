import { notFound } from "next/navigation";
import Link from "next/link";
import { getPlanificare } from "@/lib/planificari";

export async function generateMetadata({ params }: { params: Promise<{ clasa: string }> }) {
  const { clasa } = await params;
  return { title: `Planificare clasa a ${clasa}-a — Academia Python` };
}

export default async function PlanificareClasaPage({
  params,
}: {
  params: Promise<{ clasa: string }>;
}) {
  const { clasa } = await params;
  const planificare = await getPlanificare(clasa);
  if (!planificare) notFound();

  const totalOre = planificare.unitati.reduce((acc, u) => acc + u.oreAlocate, 0);

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <Link href="/profesor/planificari" className="text-sm font-semibold text-brand hover:underline">
          ← Toate clasele
        </Link>
        <a
          href={`/api/profesor-pdf/planificare/${clasa}`}
          className="rounded-full bg-amber-400 hover:bg-amber-500 text-slate-950 font-black py-2 px-6 text-xs transition shadow-sm"
        >
          📄 Descarcă PDF
        </a>
      </div>

      <h1 className="text-xl font-bold text-foreground">
        Planificare calendaristică — Clasa a {clasa}-a
      </h1>
      <p className="mt-1 text-sm text-foreground/60">
        {planificare.unitati.length} unități de învățare · {totalOre} ore alocate în total
      </p>

      <table className="mt-6 w-full border-collapse overflow-hidden rounded-xl border border-black/10 text-left text-sm">
        <thead className="bg-black/[0.03] text-xs uppercase text-foreground/50">
          <tr>
            <th className="border border-black/10 px-3 py-2">Unitate de învățare</th>
            <th className="border border-black/10 px-3 py-2">Competențe vizate</th>
            <th className="border border-black/10 px-3 py-2">Ore alocate</th>
            <th className="border border-black/10 px-3 py-2">Săptămâna estimată</th>
          </tr>
        </thead>
        <tbody>
          {planificare.unitati.map((u) => (
            <tr key={u.modulCod}>
              <td className="border border-black/10 px-3 py-2 font-semibold text-foreground">
                {u.modulCod} — {u.modulTitlu}
              </td>
              <td className="border border-black/10 px-3 py-2 text-foreground/70">{u.competente}</td>
              <td className="border border-black/10 px-3 py-2 text-foreground/70">{u.oreAlocate}</td>
              <td className="border border-black/10 px-3 py-2 text-foreground/70">
                S{u.saptamanaEstimata}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <p className="mt-4 text-xs text-foreground/45">
        Numărul de ore și săptămânile sunt valori implicite, editabile din fișierul{" "}
        <code className="rounded bg-black/5 px-1">content/planificari/{clasa}.json</code> — nu necesită cod.
      </p>
    </div>
  );
}
