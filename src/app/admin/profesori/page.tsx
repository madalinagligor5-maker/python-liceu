import {
  listaProfesoriInAsteptare,
  listaProfesoriAprobati,
  aprobaProfesor,
  respingeProfesor,
  revocaProfesor,
} from "@/app/actions/admin";
import { ButonAprobare } from "@/components/admin/ButoaneProfesor";

export const metadata = { title: "Admin — Profesori — Academia Python" };
export const dynamic = "force-dynamic";

function dataScurta(iso: string | null): string {
  if (!iso) return "—";
  return new Date(iso).toLocaleDateString("ro-RO", { day: "numeric", month: "short", year: "numeric" });
}

export default async function AdminProfesoriPage() {
  const [inAsteptare, aprobati] = await Promise.all([
    listaProfesoriInAsteptare(),
    listaProfesoriAprobati(),
  ]);

  return (
    <div className="space-y-10">
      <div>
        <h1 className="text-xl font-bold text-foreground">Cereri de acces — profesori</h1>
        <p className="mt-1 text-sm text-foreground/60">
          Aprobarea e manuală, o singură dată per cont. Un cont respins revine la rolul de elev
          și poate reaplica oricând.
        </p>
      </div>

      <section>
        <h2 className="text-sm font-bold uppercase tracking-wide text-foreground/50">
          În așteptare ({inAsteptare.length})
        </h2>
        {inAsteptare.length === 0 ? (
          <p className="mt-3 text-sm text-foreground/50">Nicio cerere în așteptare.</p>
        ) : (
          <div className="mt-3 overflow-x-auto rounded-xl border border-black/10 bg-white">
            <table className="w-full min-w-[560px] text-left text-sm">
              <thead className="border-b border-black/10 bg-black/[0.02] text-xs uppercase text-foreground/50">
                <tr>
                  <th className="px-4 py-2.5">Email</th>
                  <th className="px-4 py-2.5">Școală</th>
                  <th className="px-4 py-2.5">Data cererii</th>
                  <th className="px-4 py-2.5 text-right">Acțiuni</th>
                </tr>
              </thead>
              <tbody>
                {inAsteptare.map((p) => (
                  <tr key={p.user_id} className="border-b border-black/5 last:border-0">
                    <td className="px-4 py-3 font-medium text-foreground">{p.email}</td>
                    <td className="px-4 py-3 text-foreground/70">{p.scoala || "—"}</td>
                    <td className="px-4 py-3 text-foreground/70">{dataScurta(p.created_at)}</td>
                    <td className="px-4 py-3">
                      <div className="flex justify-end gap-2">
                        <ButonAprobare
                          userId={p.user_id}
                          actiune={aprobaProfesor}
                          eticheta="Aprobă"
                          clasa="bg-emerald-100 text-emerald-800 hover:bg-emerald-200"
                        />
                        <ButonAprobare
                          userId={p.user_id}
                          actiune={respingeProfesor}
                          eticheta="Respinge"
                          clasa="bg-red-50 text-red-700 hover:bg-red-100"
                        />
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      <section>
        <h2 className="text-sm font-bold uppercase tracking-wide text-foreground/50">
          Aprobați ({aprobati.length})
        </h2>
        {aprobati.length === 0 ? (
          <p className="mt-3 text-sm text-foreground/50">Niciun profesor aprobat încă.</p>
        ) : (
          <div className="mt-3 overflow-x-auto rounded-xl border border-black/10 bg-white">
            <table className="w-full min-w-[480px] text-left text-sm">
              <thead className="border-b border-black/10 bg-black/[0.02] text-xs uppercase text-foreground/50">
                <tr>
                  <th className="px-4 py-2.5">Email</th>
                  <th className="px-4 py-2.5">Școală</th>
                  <th className="px-4 py-2.5 text-right">Acțiuni</th>
                </tr>
              </thead>
              <tbody>
                {aprobati.map((p) => (
                  <tr key={p.user_id} className="border-b border-black/5 last:border-0">
                    <td className="px-4 py-3 font-medium text-foreground">{p.email}</td>
                    <td className="px-4 py-3 text-foreground/70">{p.scoala || "—"}</td>
                    <td className="px-4 py-3 text-right">
                      <ButonAprobare
                        userId={p.user_id}
                        actiune={revocaProfesor}
                        eticheta="Revocă acces"
                        clasa="bg-red-50 text-red-700 hover:bg-red-100"
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
}
