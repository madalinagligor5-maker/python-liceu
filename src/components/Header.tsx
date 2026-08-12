import Link from "next/link";
import Mascota from "@/components/Mascota";
import { getUtilizatorCurent } from "@/lib/subscription";
import { getProgresUtilizator, nivelDinXp } from "@/lib/progres";

const linkuri = [
  { href: "/lectii", label: "Lecții" },
  { href: "/preturi", label: "Prețuri" },
];

export default async function Header() {
  const { user } = await getUtilizatorCurent();
  const progres = user ? await getProgresUtilizator(user.id) : null;

  return (
    <header className="sticky top-0 z-40 border-b border-black/5 bg-white/85 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-4 py-3 sm:px-6">
        <Link href="/" className="flex items-center gap-2 text-lg font-bold text-foreground">
          <Mascota size={36} />
          <span className="leading-none">
            academia<span className="text-brand">python</span>
            <span className="mt-0.5 hidden text-[9px] font-semibold uppercase tracking-wider text-foreground/40 sm:block">
              Învață. Practică. Devino dezvoltator.
            </span>
          </span>
        </Link>

        <nav className="hidden items-center gap-6 text-sm font-medium text-foreground/70 sm:flex">
          {linkuri.map((l) => (
            <Link key={l.href} href={l.href} className="transition hover:text-brand">
              {l.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          {progres && (
            <div className="hidden items-center gap-2 sm:flex">
              {progres.streakZile > 0 && (
                <span
                  className="flex items-center gap-1 rounded-lg bg-warning/10 px-2 py-1 text-xs font-bold text-warning"
                  title={`Serie de ${progres.streakZile} zile`}
                >
                  <span aria-hidden="true">🔥</span>
                  {progres.streakZile}
                  <span className="sr-only">zile la rând</span>
                </span>
              )}
              <span
                className="rounded-lg bg-brand-light px-2 py-1 text-xs font-bold text-brand-dark"
                title={`${progres.xpTotal} XP · nivel ${nivelDinXp(progres.xpTotal)}`}
              >
                {progres.xpTotal} XP
              </span>
            </div>
          )}

          {user ? (
            <Link
              href="/cont"
              className="hidden max-w-[11rem] truncate rounded-lg px-3 py-2 text-sm font-medium text-foreground/70 transition hover:text-brand sm:inline-block"
            >
              {user.email}
            </Link>
          ) : (
            <Link
              href="/login"
              className="hidden rounded-lg px-3 py-2 text-sm font-medium text-foreground/70 transition hover:text-brand sm:inline-block"
            >
              Autentificare
            </Link>
          )}
          <Link
            href="/lectii"
            className="rounded-lg bg-brand px-4 py-2 text-sm font-semibold text-white transition hover:bg-brand-dark"
          >
            {user ? "Continuă" : "Începe gratuit"}
          </Link>
        </div>
      </div>
    </header>
  );
}
