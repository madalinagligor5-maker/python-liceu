import Link from "next/link";
import { listaClaseProfesor } from "@/app/actions/clase";
import CreeazaClasaForm from "@/components/profesor/CreeazaClasaForm";

export const metadata = { title: "Clasele mele — Academia Python" };
export const dynamic = "force-dynamic";

export default async function ClaseleProfesorPage() {
  const clase = await listaClaseProfesor();

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-xl font-bold text-foreground">Clasele mele</h1>
        <p className="mt-1 text-sm text-foreground/60">
          Fiecare clasă primește un cod pe care îl dai elevilor tăi — ei se asociază singuri,
          din contul lor, introducând codul.
        </p>
      </div>

      <CreeazaClasaForm />

      {clase.length === 0 ? (
        <p className="text-sm text-foreground/50">Nu ai creat încă nicio clasă.</p>
      ) : (
        <div className="overflow-x-auto rounded-xl border border-black/10 bg-white">
          <table className="w-full min-w-[520px] text-left text-sm">
            <thead className="border-b border-black/10 bg-black/[0.02] text-xs uppercase text-foreground/50">
              <tr>
                <th className="px-4 py-2.5">Clasă</th>
                <th className="px-4 py-2.5">Cod</th>
                <th className="px-4 py-2.5">Elevi</th>
                <th className="px-4 py-2.5 text-right">Progres</th>
              </tr>
            </thead>
            <tbody>
              {clase.map((c) => (
                <tr key={c.id} className="border-b border-black/5 last:border-0">
                  <td className="px-4 py-3 font-medium text-foreground">{c.numeClasa}</td>
                  <td className="px-4 py-3 font-mono font-bold text-brand">{c.codClasa}</td>
                  <td className="px-4 py-3 text-foreground/70">{c.nrElevi}</td>
                  <td className="px-4 py-3 text-right">
                    <Link
                      href={`/profesor/clase/${c.id}`}
                      className="text-sm font-semibold text-brand hover:underline"
                    >
                      Vezi progresul →
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
