"use client";

import IconMeniu from "@/components/icons/IconMeniu";
import IconInchide from "@/components/icons/IconInchide";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import KidsHeaderRight from "@/components/KidsHeaderRight";
import Logo from "@/components/Logo";
import HeaderSwitch from "@/components/HeaderSwitch";

const linkuriLiceu = [
  { href: "/curriculum", label: "📚 Curriculum & Cursuri", sub: "Clasele IX–XII" },
  { href: "/lectii", label: "📖 Lecții Interactive", sub: "Învățare pas cu pas" },
  { href: "/exercitii", label: "💻 Exerciții & Algoritmi", sub: "Feedback instant" },
  { href: "/lab", label: "🔬 Lab (Cod online)", sub: "Sandbox Python liber" },
  { href: "/resurse", label: "📥 Resurse & Fișe PDF", sub: "Materiale didactice" },
  { href: "/blog", label: "✍️ Blog", sub: "Ghiduri și noutăți" },
  { href: "/preturi", label: "🏷️ Prețuri & Abonamente", sub: "Planuri transparente" },
  { href: "/despre", label: "ℹ️ Despre Platformă", sub: "Misiune și echipa" },
];

const linkuriKids = [
  { href: "/kids", label: "🏠 Acasă Kids", sub: "Centrul de aventură" },
  { href: "/kids/junior/harta", label: "🗺️ Harta Aventurii", sub: "Modulele 1–6 (100% Gratuit)" },
  { href: "/kids/fise-print", label: "🖨️ Fișe de Printat", sub: "Activități pe hârtie" },
];

const linkuriProfesor = [
  { href: "/profesor/planificari", label: "🗓️ Planificări", sub: "Calendar per clasă" },
  { href: "/profesor/fise", label: "📄 Fișe de lucru", sub: "Printabile, cu/fără barem" },
  { href: "/profesor/teste/generator", label: "📝 Generator de teste", sub: "Din bancă de quiz-uri" },
];

export default function HeaderNav({ esteProfesor = false }: { esteProfesor?: boolean }) {
  const pathname = usePathname();
  const isKids = pathname?.startsWith("/kids");
  const [mobileMeniuDeschis, setMobileMeniuDeschis] = useState(false);

  const linkuriActive = esteProfesor ? linkuriProfesor : isKids ? linkuriKids : linkuriLiceu;

  // Previne scroll-ul pe fundal când meniul mobil este deschis
  useEffect(() => {
    if (mobileMeniuDeschis) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileMeniuDeschis]);

  return (
    <>
      {/* Desktop Navigation */}
      {isKids && !esteProfesor ? (
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
          {linkuriActive.map((l) => (
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
        onClick={() => setMobileMeniuDeschis(true)}
        className="lg:hidden flex h-10 w-10 items-center justify-center rounded-xl border border-[#EBE7DF] bg-white text-[#1E2430] shadow-xs hover:bg-[#F3EFE6] transition active:scale-95 shrink-0"
        aria-label="Deschide Meniu Mobil"
      >
        <IconMeniu className="h-6 w-6 text-[#1E2430]" />
      </button>

      {/* 100% FULL-SCREEN MOBILE OVERLAY (Acoperă tot ecranul) */}
      {mobileMeniuDeschis && (
        <div className="fixed inset-0 h-screen w-screen z-[99999] bg-[#FDFBF7] p-4 sm:p-6 overflow-y-auto lg:hidden flex flex-col justify-between animate-fadeIn">
          <div className="flex flex-col gap-4 max-w-lg mx-auto w-full pb-8">
            {/* Header Meniu Mobil: Logo + Switch + Buton Închidere ✕ */}
            <div className="flex items-center justify-between pb-4 border-b border-[#EBE7DF]">
              <Link
                href="/"
                onClick={() => setMobileMeniuDeschis(false)}
                className="flex items-center gap-2"
              >
                <Logo className="h-9 w-9 rounded-xl" />
                <span className="text-sm font-black text-[#1E2430]">
                  Academia<span className="text-amber-500">Python</span>
                </span>
              </Link>

              {!esteProfesor && <HeaderSwitch />}

              <button
                onClick={() => setMobileMeniuDeschis(false)}
                className="flex h-10 w-10 items-center justify-center rounded-xl bg-white border border-[#EBE7DF] text-slate-900 shadow-sm active:scale-95 transition"
                aria-label="Închide Meniu"
              >
                <IconInchide className="h-5 w-5 text-slate-900" />
              </button>
            </div>

            {/* Stele / Profil dacă e pe Kids */}
            {isKids && !esteProfesor && (
              <div className="p-3.5 bg-white rounded-2xl border border-[#EBE7DF] shadow-xs">
                <KidsHeaderRight />
              </div>
            )}

            {/* Titlu meniu */}
            <div className="flex items-center justify-between pt-1">
              <span className="text-xs font-black uppercase tracking-widest text-blue-900">
                {esteProfesor ? "Zona Profesor" : "Toate Cursurile & Opțiunile"}
              </span>
              <span className="text-xs text-[#525B6C] font-semibold">
                {esteProfesor ? "Instrumente" : isKids ? "Ciclul Primar" : "Clasele IX–XII"}
              </span>
            </div>

            {/* TOATE LINK-URILE DIN MENIU VIZIBILE COMPLET */}
            <div className="flex flex-col gap-2.5 my-1">
              {linkuriActive.map((l) => (
                <Link
                  key={l.href}
                  href={l.href}
                  onClick={() => setMobileMeniuDeschis(false)}
                  className="rounded-2xl border border-[#EBE7DF] bg-white p-4 text-left transition shadow-xs hover:border-amber-400 active:bg-amber-50 flex items-center justify-between group"
                >
                  <div>
                    <span className="text-base font-black text-[#1E2430] group-hover:text-amber-700 block">
                      {l.label}
                    </span>
                    <span className="text-xs font-medium text-[#525B6C] block mt-0.5">
                      {l.sub}
                    </span>
                  </div>
                  <span className="text-amber-500 font-black text-lg">→</span>
                </Link>
              ))}
            </div>

            {/* Butoane Acțiuni Rapide la Baza Meniului Mobil */}
            {!esteProfesor && (
              <div className="pt-4 border-t border-[#EBE7DF] flex flex-col gap-3">
                <Link
                  href="/kids"
                  onClick={() => setMobileMeniuDeschis(false)}
                  className="rounded-2xl border border-slate-200 bg-white p-3.5 text-xs font-bold text-slate-800 text-center flex items-center justify-center gap-2 shadow-xs"
                >
                  <span>👥</span>
                  <span>Secțiunea pentru părinți</span>
                </Link>
                <Link
                  href="/curriculum"
                  onClick={() => setMobileMeniuDeschis(false)}
                  className="rounded-2xl bg-amber-400 hover:bg-amber-500 text-slate-950 font-black p-4 text-sm text-center shadow-md active:scale-95 transition"
                >
                  🚀 Începe gratuit / Vezi Cursurile
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
