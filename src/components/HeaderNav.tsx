"use client";

import IconMeniu from "@/components/icons/IconMeniu";
import IconInchide from "@/components/icons/IconInchide";

import { useState, useEffect, useRef, useId } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import KidsHeaderRight from "@/components/KidsHeaderRight";
import Logo from "@/components/Logo";
import { TRASEE } from "@/lib/trasee";

type LinkNav = { href: string; label: string; sub: string };

/** Traseele, grupate sub „Cursuri". */
const linkuriCursuri: LinkNav[] = [
  ...TRASEE.map((t) => ({ href: t.ansamblu.href, label: `${t.icon} ${t.nume}`, sub: t.subtitlu })),
];

/** Opțiuni secundare, grupate sub „Mai mult". */
const linkuriMaiMult: LinkNav[] = [
  { href: "/lectii", label: "Catalog de lecții", sub: "Toate modulele, pe clase, într-o singură listă" },
  { href: "/exercitii", label: "Exerciții practice", sub: "Probleme suplimentare, cu verificare automată" },
  { href: "/resurse", label: "Fișe PDF", sub: "Materiale de printat pentru fiecare modul" },
  { href: "/profesori", label: "Pentru profesori", sub: "Planificări, fișe și teste" },
  { href: "/blog", label: "Blog", sub: "Ghiduri și noutăți" },
  { href: "/despre", label: "Despre", sub: "Cum sunt construite lecțiile" },
];

const linkuriKids: LinkNav[] = [
  { href: "/kids", label: "🏠 Acasă Kids", sub: "Toate activitățile pentru copii" },
  { href: "/kids/junior/harta", label: "🗺️ Harta aventurii", sub: "Modulele Junior 1–6 (gratuit)" },
  { href: "/kids/fise-print", label: "🖨️ Fișe de printat", sub: "Activități pe hârtie" },
];

const linkuriProfesor: LinkNav[] = [
  { href: "/profesor/planificari", label: "🗓️ Planificări", sub: "Calendar per clasă" },
  { href: "/profesor/materiale", label: "📚 Materiale", sub: "Resurse suplimentare" },
  { href: "/profesor/fise", label: "📄 Fișe de lucru", sub: "Printabile, cu/fără barem" },
  { href: "/profesor/teste/generator", label: "📝 Generator de teste", sub: "Din bancă de quiz-uri" },
];

/** Glosar scurt: ce înseamnă fiecare zonă a site-ului. */
const GLOSAR = [
  ["Curriculum", "harta materiei, pe clase și module"],
  ["Lecție", "un modul parcurs în 6 pași, de la explicație la verificare"],
  ["Exerciții", "practică suplimentară pe fiecare modul"],
  ["Laborator", "editor liber, fără cerință, pentru experimente"],
];

function Dropdown({
  eticheta,
  activ,
  children,
  latime = "w-[26rem]",
}: {
  eticheta: string;
  activ: boolean;
  children: (inchide: () => void) => React.ReactNode;
  latime?: string;
}) {
  const [deschis, setDeschis] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const idPanou = useId();

  useEffect(() => {
    if (!deschis) return;
    const laClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setDeschis(false);
    };
    const laTasta = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setDeschis(false);
        (ref.current?.querySelector("button") as HTMLButtonElement | null)?.focus();
      }
    };
    document.addEventListener("mousedown", laClick);
    document.addEventListener("keydown", laTasta);
    return () => {
      document.removeEventListener("mousedown", laClick);
      document.removeEventListener("keydown", laTasta);
    };
  }, [deschis]);

  return (
    <div
      ref={ref}
      className="relative"
      onBlur={(e) => {
        if (ref.current && !ref.current.contains(e.relatedTarget as Node)) setDeschis(false);
      }}
    >
      <button
        type="button"
        aria-expanded={deschis}
        aria-controls={idPanou}
        onClick={() => setDeschis((d) => !d)}
        className={`flex items-center gap-1 rounded-lg px-2 py-1.5 transition-colors hover:text-amber-700 ${
          activ ? "text-amber-700" : ""
        }`}
      >
        {eticheta}
        <span aria-hidden="true" className={`text-[10px] transition-transform ${deschis ? "rotate-180" : ""}`}>
          ▼
        </span>
      </button>
      {deschis && (
        <div
          id={idPanou}
          className={`absolute left-0 top-full z-50 mt-2 ${latime} rounded-2xl border border-[#EBE7DF] bg-white p-3 shadow-depth-lg`}
        >
          {children(() => setDeschis(false))}
        </div>
      )}
    </div>
  );
}

function ListaLinkuri({ linkuri, onAles }: { linkuri: LinkNav[]; onAles: () => void }) {
  return (
    <ul className="space-y-1">
      {linkuri.map((l) => (
        <li key={l.href}>
          <Link
            href={l.href}
            onClick={onAles}
            className="block rounded-xl px-3 py-2 hover:bg-amber-50 focus-visible:bg-amber-50"
          >
            <span className="block text-sm font-bold text-[#1E2430]">{l.label}</span>
            <span className="block text-xs font-medium text-[#525B6C]">{l.sub}</span>
          </Link>
        </li>
      ))}
    </ul>
  );
}

export default function HeaderNav({
  esteProfesor = false,
  esteAutentificat = false,
}: {
  esteProfesor?: boolean;
  esteAutentificat?: boolean;
}) {
  const pathname = usePathname() ?? "";
  const isKids = pathname.startsWith("/kids");
  const [mobileMeniuDeschis, setMobileMeniuDeschis] = useState(false);
  const butonMeniuRef = useRef<HTMLButtonElement>(null);

  // Previne scroll-ul pe fundal când meniul mobil este deschis; Esc îl închide.
  useEffect(() => {
    if (!mobileMeniuDeschis) return;
    document.body.style.overflow = "hidden";
    const laTasta = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setMobileMeniuDeschis(false);
        butonMeniuRef.current?.focus();
      }
    };
    document.addEventListener("keydown", laTasta);
    return () => {
      document.body.style.overflow = "";
      document.removeEventListener("keydown", laTasta);
    };
  }, [mobileMeniuDeschis]);

  const inchideMobil = () => setMobileMeniuDeschis(false);
  const cursuriActiv =
    pathname.startsWith("/curriculum") || pathname.startsWith("/kids") || pathname.startsWith("/curs-practic");

  return (
    <>
      {/* Navigație desktop */}
      {esteProfesor ? (
        <nav aria-label="Navigație profesor" className="hidden lg:flex items-center gap-5 text-sm font-semibold text-slate-700">
          {linkuriProfesor.map((l) => (
            <Link key={l.href} href={l.href} className="transition-colors hover:text-amber-700">
              {l.label}
            </Link>
          ))}
        </nav>
      ) : (
        <nav aria-label="Navigație principală" className="hidden lg:flex items-center gap-2 text-sm font-semibold text-slate-700">
          <Dropdown eticheta="Cursuri" activ={cursuriActiv}>
            {(inchide) => (
              <>
                <p className="px-3 pb-1 text-[11px] font-black uppercase tracking-widest text-[#525B6C]">Alege traseul</p>
                <ListaLinkuri linkuri={linkuriCursuri} onAles={inchide} />
                <div className="mt-2 border-t border-[#EBE7DF] pt-2">
                  <Link
                    href="/start"
                    onClick={inchide}
                    className="block rounded-xl px-3 py-2 text-sm font-bold text-amber-800 hover:bg-amber-50"
                  >
                    Nu știi ce să alegi? Te ajutăm în 1 pas →
                  </Link>
                </div>
              </>
            )}
          </Dropdown>
          <Link
            href="/lab"
            aria-current={pathname === "/lab" ? "page" : undefined}
            className="rounded-lg px-2 py-1.5 transition-colors hover:text-amber-700 aria-[current=page]:text-amber-700"
          >
            Laborator
          </Link>
          <Link
            href="/preturi"
            aria-current={pathname === "/preturi" ? "page" : undefined}
            className="rounded-lg px-2 py-1.5 transition-colors hover:text-amber-700 aria-[current=page]:text-amber-700"
          >
            Prețuri
          </Link>
          <Dropdown eticheta="Mai mult" activ={false} latime="w-[22rem]">
            {(inchide) => (
              <>
                <ListaLinkuri linkuri={linkuriMaiMult} onAles={inchide} />
                <dl className="mt-2 space-y-1 border-t border-[#EBE7DF] px-3 pt-2 text-[11px] text-[#525B6C]">
                  {GLOSAR.map(([t, d]) => (
                    <div key={t}>
                      <dt className="inline font-bold text-[#1E2430]">{t}:</dt> <dd className="inline">{d}</dd>
                    </div>
                  ))}
                </dl>
              </>
            )}
          </Dropdown>
          {isKids && <KidsHeaderRight />}
        </nav>
      )}

      {/* Buton meniu mobil */}
      <button
        ref={butonMeniuRef}
        type="button"
        onClick={() => setMobileMeniuDeschis(true)}
        aria-expanded={mobileMeniuDeschis}
        className="order-last lg:hidden flex h-10 w-10 items-center justify-center rounded-xl border border-[#EBE7DF] bg-white text-[#1E2430] shadow-xs hover:bg-[#F3EFE6] transition active:scale-95 shrink-0"
        aria-label="Deschide meniul"
      >
        <IconMeniu className="h-6 w-6 text-[#1E2430]" />
      </button>

      {mobileMeniuDeschis && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Meniu"
          className="fixed inset-0 h-dvh w-full z-[99999] bg-[#FDFBF7] p-4 sm:p-6 overflow-y-auto lg:hidden animate-fadeIn"
        >
          <div className="flex flex-col gap-4 max-w-lg mx-auto w-full pb-8">
            <div className="flex items-center justify-between pb-4 border-b border-[#EBE7DF]">
              <Link href="/" onClick={inchideMobil} className="flex items-center gap-2">
                <Logo className="h-9 w-9 rounded-xl" />
                <span className="text-sm font-black text-[#1E2430]">
                  Academia<span className="text-amber-600">Python</span>
                </span>
              </Link>
              <button
                type="button"
                autoFocus
                onClick={() => {
                  inchideMobil();
                  butonMeniuRef.current?.focus();
                }}
                className="flex h-10 w-10 items-center justify-center rounded-xl bg-white border border-[#EBE7DF] text-slate-900 shadow-sm active:scale-95 transition"
                aria-label="Închide meniul"
              >
                <IconInchide className="h-5 w-5 text-slate-900" />
              </button>
            </div>

            {isKids && !esteProfesor && (
              <div className="p-3.5 bg-white rounded-2xl border border-[#EBE7DF] shadow-xs">
                <KidsHeaderRight />
              </div>
            )}

            {!esteProfesor && (
              <Link
                href="/start"
                onClick={inchideMobil}
                className="rounded-2xl bg-amber-400 hover:bg-amber-500 text-slate-950 font-black p-4 text-sm text-center shadow-md active:scale-95 transition"
              >
                Începe gratuit
              </Link>
            )}

            {esteProfesor ? (
              <section>
                <h2 className="text-xs font-black uppercase tracking-widest text-[#525B6C]">Zona profesor</h2>
                <div className="mt-2 rounded-2xl border border-[#EBE7DF] bg-white p-2">
                  <ListaLinkuri linkuri={linkuriProfesor} onAles={inchideMobil} />
                </div>
              </section>
            ) : (
              <>
                <section>
                  <h2 className="text-xs font-black uppercase tracking-widest text-[#525B6C]">Cursuri</h2>
                  <div className="mt-2 rounded-2xl border border-[#EBE7DF] bg-white p-2">
                    <ListaLinkuri linkuri={isKids ? linkuriKids : linkuriCursuri} onAles={inchideMobil} />
                  </div>
                </section>
                <section>
                  <h2 className="text-xs font-black uppercase tracking-widest text-[#525B6C]">Instrumente și cont</h2>
                  <div className="mt-2 rounded-2xl border border-[#EBE7DF] bg-white p-2">
                    <ListaLinkuri
                      linkuri={[
                        { href: "/lab", label: "Laborator", sub: "Editor Python liber, rulează în browser" },
                        { href: "/preturi", label: "Prețuri", sub: "Ce e gratuit și ce include abonamentul" },
                        esteAutentificat
                          ? { href: "/cont", label: "Contul meu", sub: "Progres și abonament" }
                          : { href: "/login", label: "Autentificare", sub: "Intră în cont sau creează unul" },
                      ]}
                      onAles={inchideMobil}
                    />
                  </div>
                </section>
                <section>
                  <h2 className="text-xs font-black uppercase tracking-widest text-[#525B6C]">Mai mult</h2>
                  <div className="mt-2 rounded-2xl border border-[#EBE7DF] bg-white p-2">
                    <ListaLinkuri linkuri={linkuriMaiMult} onAles={inchideMobil} />
                  </div>
                </section>
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
}
