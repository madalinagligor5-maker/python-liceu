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
    <aside className="flex w-full shrink-0 flex-col gap-5 bg-sidebar-bg p-4 text-sidebar-text lg:w-64 lg:min-h-screen lg:p-5">
      <Link href="/" className="flex items-center gap-2">
        <Logo className="h-10 w-10" />
        <span className="leading-tight">
          <span className="block text-base font-bold text-sidebar-text">
            Academia <span className="text-python-yellow">Python</span>
          </span>
          <span className="block text-[9px] font-semibold uppercase tracking-wider text-sidebar-muted">
            Învață. Practică. Devino dezvoltator.
          </span>
        </span>
      </Link>

      <nav aria-label="Meniu principal">
        <ul className="space-y-1">
          {MENIU.map((m) => {
            const clase =
              "flex w-full items-center gap-2.5 rounded-xl px-3 py-2 text-sm font-medium transition";

            if (!m.href) {
              return (
                <li key={m.label}>
                  <span
                    className={`${clase} cursor-not-allowed text-sidebar-muted/50`}
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
                      ? "bg-sidebar-active text-white shadow-sm"
                      : "text-sidebar-text/80 hover:bg-white/10 hover:text-white"
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

      <div className="rounded-2xl bg-gradient-to-br from-sidebar-active to-brand-dark p-4">
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
          href="/progres"
          className="mt-2 inline-block text-xs font-semibold text-python-yellow hover:underline"
        >
          Vezi progresul →
        </Link>
      </div>

      <div className="mt-auto flex items-center gap-2 border-t border-white/10 pt-4">
        <span className="flex h-9 w-9 items-center justify-center rounded-full bg-brand text-sm font-bold text-white">
          {initiala}
        </span>
        <span className="leading-tight">
          <span className="block text-sm font-semibold text-white">{prenume}</span>
          <span className="block text-xs italic text-sidebar-muted">
            Explorator Python 🐍
          </span>
        </span>
      </div>
    </aside>
  );
}
