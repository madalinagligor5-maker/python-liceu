import { FILTRE, filtreaza, listaContacte, type FiltruLista } from "@/lib/listaEmail";

export const metadata = { title: "Admin — Lista de emailuri" };
export const dynamic = "force-dynamic";

const ORDINE_FILTRE: FiltruLista[] = ["promotie", "acord", "toate"];

export default async function AdminEmailuriPage() {
  let contacte;
  try {
    contacte = await listaContacte();
  } catch (e) {
    return (
      <p role="alert" className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
        {e instanceof Error ? e.message : "Nu am putut încărca lista."} Verifică variabila
        SUPABASE_SERVICE_ROLE_KEY.
      </p>
    );
  }

  const conturi = contacte.filter((c) => c.areCont);
  const pentruPromotie = filtreaza(contacte, "promotie");

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-xl font-bold text-foreground">Lista de emailuri</h1>
        <p className="mt-1 text-sm text-foreground/65">
          Pentru promoții (ex. Black Friday) folosește lista „Pentru promoție”: doar oamenii care au
          bifat că vor oferte și care nu au încă abonament plătit.
        </p>
      </div>

      <div className="grid gap-3 sm:grid-cols-4">
        {[
          ["Conturi create", conturi.length],
          ["Cu acord pentru oferte", contacte.filter((c) => c.acord).length],
          ["Abonament plătit activ", contacte.filter((c) => c.platitor).length],
          ["De trimis la promoție", pentruPromotie.length],
        ].map(([eticheta, valoare]) => (
          <div key={eticheta} className="rounded-2xl border border-black/10 bg-white p-4">
            <p className="text-xs font-semibold uppercase tracking-wide text-foreground/65">{eticheta}</p>
            <p className="mt-1 text-2xl font-black text-foreground">{valoare}</p>
          </div>
        ))}
      </div>

      <section className="space-y-3">
        <h2 className="text-sm font-bold uppercase tracking-wide text-foreground/65">Descarcă (CSV)</h2>
        {ORDINE_FILTRE.map((f) => (
          <div
            key={f}
            className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-black/10 bg-white p-4"
          >
            <div>
              <p className="text-sm font-bold text-foreground">
                {FILTRE[f].titlu} · {filtreaza(contacte, f).length}
              </p>
              <p className="text-xs text-foreground/65">{FILTRE[f].descriere}</p>
            </div>
            {/* <a> simplu: e o descărcare de fișier, nu o navigare în aplicație. */}
            <a
              href={`/admin/emailuri/export?filtru=${f}`}
              className={`rounded-xl px-4 py-2.5 text-sm font-bold ${
                f === "promotie" ? "bg-[#172033] text-white" : "border border-black/15 text-foreground"
              }`}
            >
              Descarcă CSV
            </a>
          </div>
        ))}
        <p className="text-xs text-foreground/65">
          Fișierul se importă direct în Resend (Audiences), Brevo sau Mailchimp. Pune în fiecare
          email un link de dezabonare (îl adaugă automat aceste servicii).
        </p>
      </section>

      <section>
        <h2 className="text-sm font-bold uppercase tracking-wide text-foreground/65">
          Pentru promoție — primele {Math.min(50, pentruPromotie.length)}
        </h2>
        {pentruPromotie.length === 0 ? (
          <p className="mt-3 text-sm text-foreground/65">Încă nimeni. Lista crește pe măsură ce oamenii bifează acordul.</p>
        ) : (
          <div className="mt-3 overflow-x-auto rounded-2xl border border-black/10 bg-white">
            <table className="w-full text-left text-sm">
              <thead className="border-b border-black/10 text-xs uppercase text-foreground/65">
                <tr>
                  <th className="px-4 py-2">Email</th>
                  <th className="px-4 py-2">Sursă</th>
                  <th className="px-4 py-2">Creat</th>
                </tr>
              </thead>
              <tbody>
                {pentruPromotie.slice(0, 50).map((c) => (
                  <tr key={c.email} className="border-b border-black/5 last:border-0">
                    <td className="px-4 py-2 font-medium">{c.email}</td>
                    <td className="px-4 py-2 text-foreground/70">
                      {[c.areCont && "cont", c.newsletter && "newsletter"].filter(Boolean).join(" + ")}
                    </td>
                    <td className="px-4 py-2 text-foreground/70">
                      {c.creatLa ? new Date(c.creatLa).toLocaleDateString("ro-RO") : "—"}
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
