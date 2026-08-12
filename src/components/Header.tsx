import Link from "next/link";
import { getUtilizatorCurent } from "@/lib/subscription";

const linkuri = [
  { href: "/lectii", label: "Lecții" },
  { href: "/preturi", label: "Prețuri" },
];

export default async function Header() {
  const { user } = await getUtilizatorCurent();

  return (
    <header className="sticky top-0 z-40 border-b border-black/5 bg-white/80 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3 sm:px-6">
        <Link href="/" className="flex items-center gap-2 text-lg font-bold text-foreground">
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-brand text-white">
            🐍
          </span>
          <span>
            Python<span className="text-brand">Liceu</span>
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
          {user ? (
            <Link
              href="/cont"
              className="hidden rounded-lg px-3 py-2 text-sm font-medium text-foreground/70 transition hover:text-brand sm:inline-block"
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
            {user ? "Continuă lecțiile" : "Începe gratuit"}
          </Link>
        </div>
      </div>
    </header>
  );
}
