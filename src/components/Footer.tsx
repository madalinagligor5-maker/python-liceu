import Link from "next/link";
import Logo from "@/components/Logo";

export default function Footer() {
  return (
    <footer className="mt-auto border-t border-black/5 bg-brand-light/40">
      <div className="mx-auto grid max-w-6xl gap-8 px-4 py-10 sm:px-6 md:grid-cols-3">
        <div>
          <div className="flex items-center gap-2">
            <Logo className="h-9 w-9 rounded-lg" />
            <span className="text-lg font-bold text-foreground">
              Academia<span className="text-brand">Python</span>
            </span>
          </div>
          <p className="mt-3 max-w-xs text-sm text-foreground/60">
            Învață Python pas cu pas, conform programei de Informatică pentru liceu, clasele
            IX-XII.
          </p>
        </div>

        <div>
          <h3 className="text-sm font-semibold text-foreground">Platformă</h3>
          <ul className="mt-3 space-y-2 text-sm text-foreground/60">
            <li>
              <Link href="/lectii" className="hover:text-brand">
                Lecții
              </Link>
            </li>
            <li>
              <Link href="/preturi" className="hover:text-brand">
                Prețuri
              </Link>
            </li>
            <li>
              <Link href="/cont" className="hover:text-brand">
                Contul meu
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <h3 className="text-sm font-semibold text-foreground">Legal</h3>
          <ul className="mt-3 space-y-2 text-sm text-foreground/60">
            <li>
              <Link href="/termeni" className="hover:text-brand">
                Termeni și condiții
              </Link>
            </li>
            <li>
              <Link href="/confidentialitate" className="hover:text-brand">
                Politică de confidențialitate
              </Link>
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-black/5 px-4 py-4 text-center text-xs text-foreground/50 sm:px-6">
        © {new Date().getFullYear()} Academia Python. Toate drepturile rezervate.
      </div>
    </footer>
  );
}
