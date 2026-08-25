"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import KidsHeaderRight from "@/components/KidsHeaderRight";

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
  const [mobileMeniuDeschis, setMobileMeniuDeschis] = useState(false);

  return (
    <>
      {/* Desktop Navigation */}
      {isKids ? (
        <div className="hidden md:flex items-center gap-3">
          <nav className="flex items-center gap-2 text-xs font-bold text-slate-700">
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
          <KidsHeaderRight />
        </div>
      ) : (
        <nav className="hidden lg:flex items-center gap-6 text-sm font-semibold text-slate-700">
          {linkuriLiceu.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="transition-colors hover:text-indigo-600"
            >
              {l.label}
            </Link>
          ))}
        </nav>
      )}

      {/* Mobile Hamburger Toggle Button */}
      <button
        onClick={() => setMobileMeniuDeschis(!mobileMeniuDeschis)}
        className="lg:hidden flex h-9 w-9 items-center justify-center rounded-xl border border-[#EBE7DF] bg-white text-slate-800 shadow-xs hover:bg-[#F3EFE6] transition active:scale-95 shrink-0"
        aria-label="Meniu Navigație"
      >
        <span className="text-lg font-bold">{mobileMeniuDeschis ? "✕" : "☰"}</span>
      </button>

      {/* Mobile Drawer Overlay */}
      {mobileMeniuDeschis && (
        <div className="fixed inset-x-0 top-[61px] bottom-0 z-50 bg-[#FDFBF7] p-6 shadow-2xl overflow-y-auto lg:hidden animate-fadeIn">
          <div className="flex flex-col gap-5 max-w-md mx-auto">
            {/* Status Kids Right (Stele / Nume) pe mobil */}
            {isKids && (
              <div className="pb-3 border-b border-[#EBE7DF]">
                <KidsHeaderRight />
              </div>
            )}

            {/* Links List */}
            <div className="flex flex-col gap-2">
              <p className="text-[10px] font-black uppercase tracking-widest text-[#525B6C] mb-1">
                Navigație {isKids ? "Kids" : "Platformă"}
              </p>
              {(isKids ? linkuriKids : linkuriLiceu).map((l) => (
                <Link
                  key={l.href}
                  href={l.href}
                  onClick={() => setMobileMeniuDeschis(false)}
                  className="rounded-2xl border border-[#EBE7DF] bg-white px-4 py-3 text-sm font-bold text-[#1E2430] hover:border-amber-400 hover:text-amber-700 transition shadow-xs flex items-center justify-between"
                >
                  <span>{l.label}</span>
                  <span className="text-slate-400 text-xs">→</span>
                </Link>
              ))}
            </div>

            {/* Extra Mobile Actions */}
            <div className="pt-4 border-t border-[#EBE7DF] flex flex-col gap-3">
              <Link
                href="/kids"
                onClick={() => setMobileMeniuDeschis(false)}
                className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-xs font-bold text-slate-800 text-center flex items-center justify-center gap-2"
              >
                <span>👥</span>
                <span>Secțiune pentru părinți</span>
              </Link>
              <Link
                href="/curriculum"
                onClick={() => setMobileMeniuDeschis(false)}
                className="rounded-2xl bg-amber-400 hover:bg-amber-500 text-slate-950 font-black px-4 py-3 text-sm text-center shadow-md active:scale-95 transition"
              >
                🚀 Începe gratuit / Cursuri
              </Link>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
