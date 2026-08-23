import Link from "next/link";
import Logo from "@/components/Logo";
import { progresNivel } from "@/lib/progres";

/** Meniul din referința vizuală. Rutele care nu există încă sunt marcate. */
const MENIU = [
  { icon: "🏠", label: "Acasă", href: "/", activ: true },
  { icon: "📚", label: "Curriculum", href: "/curriculum" },
  { icon: "📝", label: "Lecții", href: "/lectii" },
  { icon: "✏️", label: "Exerciții", href: null },
  { icon: "🚀", label: "Proiecte", href: null },
  { icon: "🔬", label: "Lab (Cod online)", href: null },
  { icon: "🏆", label: "Provocări", href: null },
  { icon: "💬", label: "Discuții", href: null },
  { icon: "📂", label: "Resurse", href: null },
  { icon: "🎓", label: "Certificări", href: null },
] as const;

function HexagonNivel({ nivel }: { nivel: number }) {
  return (
    <svg
      viewBox="0 0 24 24"
      className="h-7 w-7 shrink-0"
      aria-hidden="true"
      fill="none"
    >
      <path
        d="M12 2.5 20 7v10l-8 4.5L4 17V7l8-4.5Z"
        fill="#f5b301"
        stroke="#d99a00"
        strokeWidth="1"
      />
      <text
        x="12"
        y="16"
        textAnchor="middle"
        fontSize="9"
        fontWeight="bold"
        fill="#16163a"
      >
        {nivel}
      </text>
    </svg>
  );
}

export default function SidebarDashboard({
  prenume,
  xpTotal,
}: {
  prenume: string;
  xpTotal: number;
}) {
  const { nivel, xpNivelUrmator, procent } = progresNivel(xpTotal);
  const initiala = (prenume.charAt(0) || "?").toUpperCase();

  return (
    <aside className="flex w-full shrink-0 flex-col gap-4 bg-sidebar-bg p-4 text-sidebar-text lg:w-64 lg:min-h-screen lg:p-5">
      {/* Header cu logo și profil (pe mobil stau pe același rând) */}
      <div className="flex items-center justify-between gap-3 lg:flex-col lg:items-start lg:gap-5">
        <Link href="/" className="flex items-center gap-2">
          <Logo className="h-9 w-9 lg:h-10 lg:w-10" />
          <span className="leading-tight">
            <span className="block text-sm lg:text-base font-bold text-sidebar-text">
              Academia <span className="text-python-yellow">Python</span>
            </span>
            <span className="block text-[8px] lg:text-[9px] font-semibold uppercase tracking-wider text-sidebar-muted">
              Învață. Practică. Devino dezvoltator.
            </span>
          </span>
        </Link>

        {/* Profilul utilizatorului vizibil în dreapta pe mobil */}
        <div className="flex items-center gap-2 lg:hidden">
          <span className="flex h-8 w-8 items-center justify-center rounded-full bg-brand text-xs font-bold text-white border border-white/10">
            {initiala}
          </span>
          <span className="text-xs font-semibold text-white truncate max-w-[80px]">
            {prenume}
          </span>
          <span className="rounded-lg bg-python-yellow/10 border border-python-yellow/20 px-1.5 py-0.5 text-[10px] font-bold text-python-yellow">
            Lvl {nivel}
          </span>
        </div>
      </div>

      {/* Navigare - listă orizontală pe mobil, listă verticală pe desktop */}
      <nav aria-label="Meniu principal" className="w-full overflow-hidden">
        <ul className="flex flex-row gap-2 overflow-x-auto pb-1 max-w-full scrollbar-none lg:flex-col lg:space-y-1 lg:overflow-x-visible lg:pb-0">
          {MENIU.map((m) => {
            const clase =
              "flex items-center gap-2.5 rounded-xl px-3 py-2 text-xs lg:text-sm font-medium transition shrink-0 whitespace-nowrap lg:w-full";

            if (!m.href) {
              return (
                <li key={m.label} className="shrink-0">
                  <span
                    className={`${clase} cursor-not-allowed text-sidebar-muted/40`}
                    title="Secțiune în curând"
                  >
                    <span aria-hidden="true">{m.icon}</span>
                    {m.label}
                    <span className="ml-1 text-[8px] font-semibold uppercase text-locked/70 lg:ml-auto">
                      curând
                    </span>
                  </span>
                </li>
              );
            }

            return (
              <li key={m.label} className="shrink-0">
                <Link
                  href={m.href}
                  aria-current={"activ" in m && m.activ ? "page" : undefined}
                  className={`${clase} ${
                    "activ" in m && m.activ
                      ? "bg-sidebar-active text-foreground shadow-sm font-extrabold"
                      : "text-sidebar-text/80 hover:bg-white/15 hover:text-white"
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

      {/* Caseta de Nivel (ascunsă pe mobil deoarece profilul de sus e suficient) */}
      <div className="hidden lg:block rounded-2xl bg-sidebar-bg-2 border border-white/5 p-4">
        <div className="flex items-center gap-2">
          <HexagonNivel nivel={nivel} />
          <div className="leading-tight">
            <p className="text-xs font-semibold text-white/80">Nivelul tău</p>
            <p className="text-sm font-bold text-white">{nivel}</p>
          </div>
        </div>
        <div
          className="mt-3 h-2 w-full overflow-hidden rounded-full bg-white/25"
          role="progressbar"
          aria-valuenow={procent}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-label="Progres către nivelul următor"
        >
          <div
            className="h-full rounded-full bg-python-yellow transition-all"
            style={{ width: `${procent}%` }}
          />
        </div>
        <p className="mt-2 text-xs text-white/80">
          {xpTotal} / {xpNivelUrmator} XP
        </p>
        <Link
          href="/cont"
          className="mt-2 inline-block text-xs font-semibold text-python-yellow hover:underline"
        >
          Vezi progresul →
        </Link>
      </div>

      {/* Profilul extins în partea de jos (doar pe desktop) */}
      <div className="hidden lg:flex mt-auto items-center gap-2 border-t border-white/10 pt-4">
        <span className="flex h-9 w-9 items-center justify-center rounded-full bg-brand text-sm font-bold text-white">
          {initiala}
        </span>
        <div className="leading-tight min-w-0">
          <span className="block text-sm font-semibold text-white truncate">{prenume}</span>
          <span className="block text-xs italic text-sidebar-muted truncate">
            Explorator Python 🐍
          </span>
        </div>
      </div>
    </aside>
  );
}
