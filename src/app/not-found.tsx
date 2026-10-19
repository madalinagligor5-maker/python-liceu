import Link from "next/link";
import type { Metadata } from "next";

// Next.js adaugă singur <meta name="robots" content="noindex"> pe paginile 404.
export const metadata: Metadata = {
  title: "Pagina nu a fost găsită",
};

const LINKURI = [
  { href: "/", eticheta: "Pagina principală" },
  { href: "/start", eticheta: "Începe gratuit: alege traseul" },
  { href: "/curriculum", eticheta: "Curriculum pe clase (VII–XII)" },
  { href: "/blog", eticheta: "Ghiduri Python pe blog" },
];

export default function NotFound() {
  return (
    <div className="mx-auto max-w-xl px-4 py-20 text-center sm:px-6">
      <p className="text-sm font-bold text-brand">Eroare 404</p>
      <h1 className="mt-2 text-3xl font-black text-foreground [font-family:var(--font-fraunces)]">
        Pagina nu a fost găsită
      </h1>
      <p className="mt-3 text-foreground/70">
        Adresa poate fi greșită sau pagina a fost mutată. Poate te ajută una dintre acestea:
      </p>
      <ul className="mt-6 space-y-2">
        {LINKURI.map((l) => (
          <li key={l.href}>
            <Link href={l.href} className="font-semibold text-brand-dark underline underline-offset-2 hover:text-brand">
              {l.eticheta}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
