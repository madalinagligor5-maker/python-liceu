import Link from "next/link";
import Logo from "@/components/Logo";
import { getUtilizatorCurent } from "@/lib/subscription";
import { getProgresUtilizator, nivelDinXp } from "@/lib/progres";
import HeaderSwitch from "@/components/HeaderSwitch";
import HeaderNav from "@/components/HeaderNav";

const linkuri = [
  { href: "/curriculum", label: "Curriculum" },
  { href: "/lectii", label: "Lecții" },
  { href: "/exercitii", label: "Exerciții" },
  { href: "/resurse", label: "Resurse" },
  { href: "/preturi", label: "Prețuri" },
  { href: "/despre", label: "Despre" },
];

function extrageAliasNume(email: string): string {
  const localPart = email.split("@")[0];
  if (localPart.includes("madalinagligor")) {
    return "Mădălina G.";
  }
  return localPart.charAt(0).toUpperCase() + localPart.slice(1).replace(/[0-9_.-]/g, " ").trim();
}

export default async function Header() {
  const { user } = await getUtilizatorCurent();
  const progres = user ? await getProgresUtilizator(user.id) : null;

  return (
    <header className="sticky top-0 z-40 border-b border-black/5 bg-white/85 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-4 py-3 sm:px-6">
        <Link href="/" className="flex items-center gap-2">
          <Logo className="h-12 w-12 rounded-lg" />
          <span className="leading-none">
            <span className="text-[15px] font-bold text-foreground">
              Academia<span className="text-brand">Python</span>
            </span>
            <span className="mt-0.5 hidden text-[9px] font-semibold uppercase tracking-wider text-foreground/40 sm:block">
              Învață. Practică. Devino dezvoltator.
            </span>
          </span>
        </Link>

        <HeaderSwitch />

        <HeaderNav />

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
              {extrageAliasNume(user.email)}
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
