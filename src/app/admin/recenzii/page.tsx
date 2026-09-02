import { listaRecenzii } from "@/app/actions/admin";

export const metadata = { title: "Admin — Recenzii — Academia Python" };
export const dynamic = "force-dynamic";

function dataScurta(iso: string): string {
  return new Date(iso).toLocaleDateString("ro-RO", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function Stele({ n }: { n: number }) {
  return (
    <span className="text-amber-500" aria-label={`${n} din 5 stele`}>
      {"★".repeat(n)}
      <span className="text-black/15">{"★".repeat(5 - n)}</span>
    </span>
  );
}

export default async function AdminRecenziiPage() {
  const recenzii = await listaRecenzii();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-bold text-foreground">
          Recenzii — tombolă 6 luni gratuit ({recenzii.length})
        </h1>
        <p className="mt-1 text-sm text-foreground/60">
          Toate review-urile lăsate prin formularul de pe{" "}
          <a href="/tombola" className="text-brand hover:underline">
            /tombola
          </a>
          , cele mai recente primele.
        </p>
      </div>

      {recenzii.length === 0 ? (
        <p className="text-sm text-foreground/50">Nicio recenzie încă.</p>
      ) : (
        <div className="space-y-3">
          {recenzii.map((r) => (
            <div key={r.id} className="rounded-xl border border-black/10 bg-white p-4">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <Stele n={r.stele} />
                <span className="text-xs text-foreground/45">{dataScurta(r.creat_la)}</span>
              </div>
              <p className="mt-2 text-sm text-foreground/80">{r.text}</p>
              {r.email && <p className="mt-2 text-xs text-foreground/45">{r.email}</p>}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
