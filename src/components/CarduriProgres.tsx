import Link from "next/link";
import { progresNivel } from "@/lib/progres";

export function CardNivel({ xpTotal }: { xpTotal: number }) {
  const { nivel, xpNivelUrmator, xpRamasi, procent } = progresNivel(xpTotal);

  return (
    <div className="rounded-2xl bg-brand-dark p-5 text-white">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs uppercase tracking-wide text-white/60">Nivelul tău</p>
          <p className="text-2xl font-extrabold">Nivel {nivel}</p>
        </div>
        <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-accent text-lg font-extrabold text-brand-dark">
          {nivel}
        </span>
      </div>

      <div
        className="mt-4 h-2 w-full overflow-hidden rounded-full bg-white/15"
        role="progressbar"
        aria-valuenow={procent}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label="Progres către nivelul următor"
      >
        <div className="h-full rounded-full bg-accent transition-all" style={{ width: `${procent}%` }} />
      </div>

      <p className="mt-2 text-xs text-white/70">
        {xpTotal} / {xpNivelUrmator} XP · încă {xpRamasi} XP până la nivelul {nivel + 1}
      </p>
      <p className="mt-3 text-[11px] leading-snug text-white/50">
        Nivelul arată cât ai exersat. Nu influențează accesul la lecții.
      </p>
    </div>
  );
}

export function CardStreak({ zile }: { zile: number }) {
  const activ = zile > 0;

  return (
    <div className="rounded-2xl border border-black/5 bg-white p-5 shadow-sm">
      <div className="flex items-center gap-3">
        <span className="text-2xl" aria-hidden="true">
          {activ ? "🔥" : "🌱"}
        </span>
        <div>
          <p className="text-lg font-bold text-foreground">
            {activ ? `${zile} ${zile === 1 ? "zi" : "zile"} la rând` : "Începe un ritm"}
          </p>
          <p className="text-xs text-foreground/55">
            {activ
              ? "Termină o lecție azi ca să continui seria."
              : "O lecție pe zi e de ajuns pentru a porni seria."}
          </p>
        </div>
      </div>
    </div>
  );
}

export function CardContinua({
  href,
  titlu,
  unitate,
}: {
  href: string;
  titlu: string;
  unitate: string;
}) {
  return (
    <Link
      href={href}
      className="group block rounded-2xl border border-brand/20 bg-brand-light/60 p-5 transition hover:border-brand hover:bg-brand-light"
    >
      <p className="text-xs font-semibold uppercase tracking-wide text-brand-dark/70">
        Continuă de unde ai rămas
      </p>
      <p className="mt-1 text-lg font-bold text-foreground">{titlu}</p>
      <p className="mt-1 text-xs text-foreground/55">{unitate}</p>
      <span className="mt-3 inline-flex items-center gap-1 text-sm font-semibold text-brand group-hover:gap-2">
        Deschide lecția <span aria-hidden="true">→</span>
      </span>
    </Link>
  );
}

export function CardProvocare({
  intrebare,
  href,
  xp,
}: {
  intrebare: string;
  href: string;
  xp: number;
}) {
  return (
    <div className="rounded-2xl border border-accent/40 bg-accent/10 p-5">
      <div className="flex items-center justify-between gap-2">
        <p className="text-xs font-semibold uppercase tracking-wide text-foreground/60">
          Provocarea zilei
        </p>
        <span className="rounded-full bg-accent px-2 py-0.5 text-[11px] font-bold text-brand-dark">
          +{xp} XP
        </span>
      </div>
      <p className="mt-2 text-sm font-medium leading-snug text-foreground">{intrebare}</p>
      <Link
        href={href}
        className="mt-3 inline-flex text-sm font-semibold text-brand hover:text-brand-dark"
      >
        Recapitulează lecția →
      </Link>
    </div>
  );
}

export function CardInsigne({ insigne }: { insigne: string[] }) {
  return (
    <div className="rounded-2xl border border-black/5 bg-white p-5 shadow-sm">
      <p className="text-xs font-semibold uppercase tracking-wide text-foreground/60">Insigne</p>
      {insigne.length ? (
        <ul className="mt-3 flex flex-wrap gap-2">
          {insigne.map((slug) => (
            <li
              key={slug}
              className="rounded-full bg-brand-light px-3 py-1 text-xs font-semibold text-brand-dark"
            >
              {slug.replaceAll("-", " ")}
            </li>
          ))}
        </ul>
      ) : (
        <p className="mt-2 text-xs text-foreground/55">
          Prima insignă vine după ce termini prima lecție.
        </p>
      )}
    </div>
  );
}
