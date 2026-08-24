"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const linkuriLiceu = [
  { href: "/curriculum", label: "Curriculum" },
  { href: "/lectii", label: "Lecții" },
  { href: "/exercitii", label: "Exerciții" },
  { href: "/resurse", label: "Resurse" },
  { href: "/preturi", label: "Prețuri" },
  { href: "/despre", label: "Despre" },
];

const linkuriKids = [
  { href: "/kids", label: "🏠 Acasă Kids" },
  { href: "/kids/junior/harta", label: "🗺️ Harta Aventurii" },
  { href: "/kids/fise-print", label: "🖨️ Fișe de Printat" },
];

export default function HeaderNav() {
  const pathname = usePathname();
  const isKids = pathname?.startsWith("/kids");

  if (isKids) {
    return (
      <nav className="hidden items-center gap-4 text-xs font-bold text-slate-700 lg:flex">
        {linkuriKids.map((l) => (
          <Link
            key={l.href}
            href={l.href}
            className="rounded-full bg-slate-100 hover:bg-amber-100 hover:text-amber-900 px-3 py-1.5 transition border border-slate-200"
          >
            {l.label}
          </Link>
        ))}
      </nav>
    );
  }

  return (
    <nav className="hidden items-center gap-6 text-sm font-medium text-foreground/70 lg:flex">
      {linkuriLiceu.map((l) => (
        <Link key={l.href} href={l.href} className="transition hover:text-brand">
          {l.label}
        </Link>
      ))}
    </nav>
  );
}
