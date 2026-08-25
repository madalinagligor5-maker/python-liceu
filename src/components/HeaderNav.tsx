"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import KidsHeaderRight from "@/components/KidsHeaderRight";

const linkuriLiceu = [
  { href: "/curriculum", label: "📚 Curriculum & Cursuri", sub: "Clasele IX–XII" },
  { href: "/lectii", label: "📖 Lecții Interactive", sub: "Învățare pas cu pas" },
  { href: "/exercitii", label: "💻 Exerciții & Algoritmi", sub: "Feedback instant" },
  { href: "/resurse", label: "📥 Resurse & Fișe PDF", sub: "Materiale didactice" },
  { href: "/preturi", label: "🏷️ Prețuri & Abonamente", sub: "Planuri transparente" },
  { href: "/despre", label: "ℹ️ Despre Platformă", sub: "Misiune și echipa" },
];

const linkuriKids = [
  { href: "/kids", label: "🏠 Acasă Kids", sub: "Centrul de aventură" },
  { href: "/kids/junior/harta", label: "🗺️ Harta Aventurii", sub: "Modulele 1–6 (100% Gratuit)" },
  { href: "/kids/fise-print", label: "🖨️ Fișe de Printat", sub: "Activități pe hârtie" },
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
              {l.label.split(" ")[1] ?? l.label}
            </Link>
          ))}
        </nav>
      )}

      {/* Mobile Hamburger Button */}
      <button
        onClick={() => setMobileMeniuDeschis(!mobileMeniuDeschis)}
        className="lg:hidden flex h-10 w-10 items-center justify-center rounded-xl border border-[#EBE7DF] bg-white text-[#1E2430] shadow-xs hover:bg-[#F3EFE6] transition active:scale-95 shrink-0 z-50"
        aria-label="Meniu Mobil"
      >
        <span className="text-xl font-black">{mobileMeniuDeschis ? "✕" : "☰"}</span>
      </button>

      {/* FULL-SCREEN MOBILE OVERLAY MENU */}
      {mobileMeniuDeschis && (
        <div className="fixed inset-0 top-[52px] sm:top-[57px] z-[9999] bg-[#FDFBF7] p-5 sm:p-8 overflow-y-auto lg:hidden border-t-2 border-[#EBE7DF] flex flex-col justify-between">
          <div className="flex flex-col gap-4 max-w-lg mx-auto w-full pb-10">
            {/* Header Meniu Mobil */}
            <div className="flex items-center justify-between pb-3 border-b border-[#EBE7DF]">
              <span className="text-xs font-black uppercase tracking-widest text-indigo-900">
                Meniu Navigație {isKids ? "Kids" : "Liceu"}
              </span>
              <span className="text-xs text-[#525B6C] font-semibold">
                {isKids ? "Ciclul Primar" : "Clasele IX–XII"}
              </span>
            </div>

            {/* Status Stele Kids dacă pe Kids */}
            {isKids && (
              <div className="p-3 bg-white rounded-2xl border border-[#EBE7DF] shadow-xs">
                <KidsHeaderRight />
              </div>
            )}

            {/* Lista Toate Linkurile Vizibile Complet */}
            <div className="flex flex-col gap-2.5 my-2">
              {(isKids ? linkuriKids : linkuriLiceu).map((l) => (
                <Link
                  key={l.href}
                  href={l.href}
                  onClick={() => setMobileMeniuDeschis(false)}
                  className="rounded-2xl border border-[#EBE7DF] bg-white p-3.5 text-left transition shadow-xs hover:border-amber-400 active:bg-amber-50 flex items-center justify-between group"
                >
                  <div>
                    <span className="text-sm font-black text-[#1E2430] group-hover:text-amber-700 block">
                      {l.label}
                    </span>
                    <span className="text-[11px] font-medium text-[#525B6C] block mt-0.5">
                      {l.sub}
                    </span>
                  </div>
                  <span className="text-amber-500 font-bold text-base">→</span>
                </Link>
              ))}
            </div>

            {/* Butoane Acțiuni Rapide Mobil */}
            <div className="pt-3 border-t border-[#EBE7DF] flex flex-col gap-2.5">
              <Link
                href="/kids"
                onClick={() => setMobileMeniuDeschis(false)}
                className="rounded-2xl border border-slate-200 bg-slate-100/70 p-3 text-xs font-bold text-slate-800 text-center flex items-center justify-center gap-2"
              >
                <span>👥</span>
                <span>Secțiunea pentru părinți</span>
              </Link>
              <Link
                href="/curriculum"
                onClick={() => setMobileMeniuDeschis(false)}
                className="rounded-2xl bg-amber-400 hover:bg-amber-500 text-slate-950 font-black p-3.5 text-sm text-center shadow-md active:scale-95 transition"
              >
                🚀 Începe gratuit / Toate Cursurile
              </Link>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
