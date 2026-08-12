import Link from "next/link";

const ZILE = ["L", "M", "M", "J", "V", "S", "D"] as const;

/**
 * Streak cu indicator pe zilele săptămânii. Zilele aprinse se derivă din
 * streak-ul real și din ziua curentă — nu sunt hardcodate.
 */
export function CardStreakSaptamana({ zile }: { zile: number }) {
  const azi = new Date();
  // getDay(): 0=Duminică. Convertim la index luni-first.
  const indexAzi = (azi.getDay() + 6) % 7;
  const aprinse = new Set<number>();
  for (let i = 0; i < Math.min(zile, indexAzi + 1); i++) {
    aprinse.add(indexAzi - i);
  }

  return (
    <div className="rounded-2xl border border-border bg-white p-5 shadow-sm">
      <h3 className="text-sm font-bold text-foreground">
        <span aria-hidden="true">🔥</span> Streak
      </h3>
      <p className="mt-1 text-lg font-bold text-foreground">
        {zile > 0 ? `${zile} ${zile === 1 ? "zi" : "zile"} la rând!` : "Niciun streak activ"}
      </p>
      <p className="text-xs text-muted">
        {zile > 0 ? "Termină o lecție azi ca să continui." : "O lecție pe zi pornește seria."}
      </p>

      <div className="mt-3 grid grid-cols-7 gap-1 text-center">
        {ZILE.map((z, i) => (
          <span key={`${z}-${i}`} className="text-[11px] font-semibold text-muted">
            {z}
          </span>
        ))}
        {ZILE.map((z, i) => (
          <span
            key={`stare-${i}`}
            className="text-sm"
            title={aprinse.has(i) ? "activitate" : "fără activitate"}
          >
            {aprinse.has(i) ? "🔥" : "⚪"}
            <span className="sr-only">
              {z}: {aprinse.has(i) ? "activitate" : "fără activitate"}
            </span>
          </span>
        ))}
      </div>
    </div>
  );
}

export function CardCitat() {
  return (
    <blockquote className="rounded-xl border-l-4 border-accent bg-surface p-4 text-sm italic text-muted">
      „Programarea este arta de a transforma cafeaua în cod. ☕💻”
    </blockquote>
  );
}

export type RandClasament = {
  nume: string;
  xp: number;
  esteUtilizatorul: boolean;
};

/**
 * Clasament. Când nu există date reale (feature-ul de clasament public nu e
 * activat), afișăm doar poziția utilizatorului, ca să nu inventăm concurenți.
 */
export function CardClasament({ randuri }: { randuri: RandClasament[] }) {
  return (
    <div className="rounded-2xl border border-border bg-white p-5 shadow-sm">
      <h3 className="text-sm font-bold text-foreground">
        <span aria-hidden="true">🏆</span> Clasament
      </h3>

      {randuri.length ? (
        <ol className="mt-3 space-y-2">
          {randuri.map((r, i) => (
            <li
              key={`${r.nume}-${i}`}
              className={`flex items-center justify-between rounded-lg px-2 py-1 text-sm ${
                r.esteUtilizatorul ? "bg-brand-light font-semibold text-brand-dark" : "text-foreground/80"
              }`}
            >
              <span>
                {i + 1}. {r.nume}
                {r.esteUtilizatorul && " (tu)"}
              </span>
              <span className="font-bold">{r.xp.toLocaleString("ro-RO")} XP</span>
            </li>
          ))}
        </ol>
      ) : (
        <p className="mt-2 text-xs text-muted">
          Clasamentul între elevi nu este activat.
        </p>
      )}
    </div>
  );
}

export function CardProvocareZilei({
  enunt,
  href,
  xp,
}: {
  enunt: string;
  href: string | null;
  xp: number;
}) {
  return (
    <div className="rounded-2xl border border-border bg-white p-5 shadow-sm">
      <h3 className="text-sm font-bold text-foreground">
        <span aria-hidden="true">🏆</span> Provocarea zilei
      </h3>
      <p className="mt-2 text-sm text-foreground/80">{enunt}</p>
      <p className="mt-1 text-xs text-muted">
        Recompensă: <strong className="text-foreground">{xp} XP 💎</strong>
      </p>

      {href ? (
        <Link
          href={href}
          className="mt-3 block w-full rounded-xl bg-brand px-4 py-2 text-center text-sm font-semibold text-white transition hover:bg-brand-dark"
        >
          Rezolvă provocarea
        </Link>
      ) : (
        <p className="mt-3 rounded-xl bg-surface px-4 py-2 text-center text-xs text-muted">
          Termină o lecție ca să deblochezi provocări.
        </p>
      )}
    </div>
  );
}
