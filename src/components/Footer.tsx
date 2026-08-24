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
              <Link href="/despre" className="hover:text-brand">
                Despre
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
          <ul className="mt-3 space-y-2.5 text-sm text-foreground/60">
            <li>
              <Link href="/termeni-si-conditii" className="hover:text-brand transition">
                Termeni și Condiții
              </Link>
            </li>
            <li>
              <Link href="/politica-de-confidentialitate" className="hover:text-brand transition">
                Politică de Confidențialitate
              </Link>
            </li>
            <li>
              <Link href="/politica-de-rambursare" className="hover:text-brand transition">
                Politică de Anulare & Rambursare
              </Link>
            </li>
          </ul>

          {/* ANPC & Stripe Compliance Badges */}
          <div className="mt-5 space-y-2">
            <div className="flex flex-wrap gap-2">
              <a
                href="https://anpc.ro/ce-este-sal/"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center rounded-lg border border-black/10 bg-white px-3 py-1.5 text-[10px] font-bold text-foreground/75 hover:bg-slate-50 transition"
              >
                ⚖️ ANPC - SAL
              </a>
              <a
                href="https://ec.europa.eu/consumers/odr/main/index.cfm?event=main.home2.show&lng=RO"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center rounded-lg border border-black/10 bg-white px-3 py-1.5 text-[10px] font-bold text-foreground/75 hover:bg-slate-50 transition"
              >
                🇪🇺 ANPC - SOL
              </a>
            </div>
            <div className="flex items-center gap-1.5 text-[10px] text-foreground/50 font-semibold">
              <span>💳 Plăți online securizate prin</span>
              <span className="font-black text-foreground bg-black/5 px-1.5 py-0.5 rounded uppercase tracking-wider text-[8px]">
                Stripe
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="border-t border-black/5 px-4 py-4 text-center text-xs text-foreground/50 sm:px-6">
        © {new Date().getFullYear()} Academia Python. Toate drepturile rezervate.
      </div>
    </footer>
  );
}
