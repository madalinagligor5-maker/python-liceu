import Link from "next/link";
import Mascota from "@/components/Mascota";
import { progresNivel } from "@/lib/progres";

/** Meniul din specificația de UI. Rutele care nu există încă sunt marcate. */
const MENIU = [
  { icon: "🏠", label: "Acasă", href: "/", activ: true },
  { icon: "📚", label: "Cursuri", href: "/lectii" },
  { icon: "📝", label: "Lecții", href: "/lectii" },
  { icon: "✏️", label: "Exerciții", href: null },
  { icon: "🚀", label: "Proiecte", href: null },
  { icon: "🔬", label: "Lab (Cod online)", href: null },
  { icon: "🏆", label: "Provocări", href: null },
  { icon: "💬", label: "Discuții", href: null },
  { icon: "📂", label: "Resurse", href: null },
  { icon: "🎓", label: "Certificări", href: null },
] as const;

export default function SidebarDashboard({
  prenume,
  xpTotal,
}: {
  prenume: string;
  xpTotal: number;
}) {
  const { nivel, xpNivelUrmator, procent } = progresNivel(xpTotal);

  return (
    <aside className="w-full shrink-0 rounded-2xl border border-border bg-white p-4 lg:w-64 lg:rounded-none lg:border-0 lg:border-r lg:bg-white lg:p-5">
      <Link href="/" className="flex items-center gap-2">
        <Mascota size={40} />
        <span className="leading-tight">
          <span className="block text-base font-bold text-foreground">
            academia <span className="text-brand">python</span>
          </span>
          <span className="block text-[9px] font-semibold uppercase tracking-wider text-muted">
            Învață. Practică. Devino dezvoltator.
          </span>
        </span>
      </Link>

      <hr className="my-4 border-border" />

      <nav aria-label="Meniu principal">
        <ul className="space-y-1">
          {MENIU.map((m) => {
            const clase =
              "flex w-full items-center gap-2.5 rounded-xl px-3 py-2 text-sm font-medium transition";

            if (!m.href) {
              return (
                <li key={m.label}>
                  <span
                    className={`${clase} cursor-not-allowed text-foreground/35`}
                    title="Secțiune în curând"
                  >
                    <span aria-hidden="true">{m.icon}</span>
                    {m.label}
                    <span className="ml-auto text-[9px] font-semibold uppercase text-locked">
                      curând
                    </span>
                  </span>
                </li>
              );
            }

            return (
              <li key={m.label}>
                <Link
                  href={m.href}
                  aria-current={"activ" in m && m.activ ? "page" : undefined}
                  className={`${clase} ${
                    "activ" in m && m.activ
                      ? "bg-brand text-white shadow-sm"
                      : "text-foreground/75 hover:bg-brand-light hover:text-brand-dark"
                  }`}
                >
                  <span aria-hidden="true">{m.icon}</span>
                  {m.label}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      <hr className="my-4 border-border" />

      <div className="rounded-2xl bg-brand p-4 text-white">
        <p className="text-sm font-semibold">
          <span aria-hidden="true">🔷</span> Nivelul tău: {nivel}
        </p>
        <div
          className="mt-2 h-2 w-full overflow-hidden rounded-full bg-white/25"
          role="progressbar"
          aria-valuenow={procent}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-label="Progres către nivelul următor"
        >
          <div className="h-full rounded-full bg-white transition-all" style={{ width: `${procent}%` }} />
        </div>
        <p className="mt-2 text-xs text-white/80">
          {xpTotal} / {xpNivelUrmator} XP
        </p>
      </div>

      <hr className="my-4 border-border" />

      <div className="flex items-center gap-2">
        <span className="flex h-9 w-9 items-center justify-center rounded-full bg-brand-light text-sm font-bold text-brand-dark">
          {prenume.charAt(0).toUpperCase()}
        </span>
        <span className="leading-tight">
          <span className="block text-sm font-semibold text-foreground">{prenume}</span>
          <span className="block text-xs italic text-muted">Explorator Python 🐍</span>
        </span>
      </div>
    </aside>
  );
}
