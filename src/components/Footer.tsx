import Link from "next/link";
import Logo from "@/components/Logo";
import ButonSetariCookie from "@/components/ButonSetariCookie";

export default function Footer() {
  return (
    <footer className="mt-auto bg-[#172033] text-white">
      <div className="mx-auto grid max-w-7xl gap-12 px-5 py-14 sm:px-6 lg:grid-cols-[1.35fr_0.75fr_0.9fr] lg:py-18">
        <div className="max-w-md">
          <div className="flex items-center gap-2">
            <Logo className="h-10 w-10 rounded-lg" />
            <span className="text-lg font-bold text-white">
              Academia<span className="text-[#F4B942]">Python</span>
            </span>
          </div>
          <p className="mt-5 text-lg leading-relaxed text-white/72 [font-family:var(--font-fraunces)]">
            Programarea devine mai simplă când fiecare idee este explicată la momentul potrivit.
          </p>
          <a
            href="mailto:academipython@gmail.com"
            className="mt-5 inline-flex items-center border-b border-[#F4B942]/60 pb-1 text-sm font-bold text-[#F4B942] hover:border-[#F4B942]"
          >
            academipython@gmail.com
          </a>
        </div>

        <div>
          <h3 className="text-xs font-extrabold uppercase tracking-[0.18em] text-white/45">Explorează</h3>
          <ul className="mt-5 space-y-3 text-sm text-white/70">
            <li>
              <Link href="/curriculum" className="hover:text-white">
                Curriculum
              </Link>
            </li>
            <li>
              <Link href="/preturi" className="hover:text-white">
                Prețuri
              </Link>
            </li>
            <li>
              <Link href="/despre" className="hover:text-white">
                Despre
              </Link>
            </li>
            <li>
              <Link href="/kids" className="hover:text-white">
                Academia Kids
              </Link>
            </li>
            <li>
              <Link href="/cont" className="hover:text-white">
                Contul meu
              </Link>
            </li>
            <li>
              <Link href="/profesori" className="hover:text-white">
                Pentru profesori
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <h3 className="text-xs font-extrabold uppercase tracking-[0.18em] text-white/45">Informații</h3>
          <ul className="mt-5 space-y-3 text-sm text-white/70">
            <li>
              <Link href="/termeni-si-conditii" className="hover:text-white transition">
                Termeni și Condiții
              </Link>
            </li>
            <li>
              <Link href="/politica-de-confidentialitate" className="hover:text-white transition">
                Politică de Confidențialitate
              </Link>
            </li>
            <li>
              <Link href="/politica-de-rambursare" className="hover:text-white transition">
                Politică de Anulare & Rambursare
              </Link>
            </li>
            <li>
              <ButonSetariCookie className="hover:text-white transition" />
            </li>
          </ul>

          {/* ANPC & Stripe Compliance Badges */}
          <div className="mt-6 space-y-3">
            <div className="flex flex-wrap gap-2">
              <a
                href="https://anpc.ro/ce-este-sal/"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center rounded-md border border-white/15 px-3 py-1.5 text-[10px] font-bold text-white/65 hover:border-white/35 hover:text-white transition"
              >
                ⚖️ ANPC - SAL
              </a>
              <a
                href="https://ec.europa.eu/consumers/odr/main/index.cfm?event=main.home2.show&lng=RO"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center rounded-md border border-white/15 px-3 py-1.5 text-[10px] font-bold text-white/65 hover:border-white/35 hover:text-white transition"
              >
                🇪🇺 ANPC - SOL
              </a>
            </div>
            <div className="flex items-center gap-1.5 text-[10px] text-white/40 font-semibold">
              <span>Plăți online securizate prin</span>
              <span className="font-black text-white/75 border border-white/10 px-1.5 py-0.5 rounded uppercase tracking-wider text-[8px]">
                Stripe
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="border-t border-white/10 px-5 py-5 text-center text-xs text-white/40 sm:px-6">
        © {new Date().getFullYear()} Academia Python · Creat pentru elevi, părinți și profesori din România.
      </div>
    </footer>
  );
}
