import Link from "next/link";
import Logo from "@/components/Logo";
import { getUtilizatorCurent } from "@/lib/subscription";
import { getProgresUtilizator, nivelDinXp } from "@/lib/progres";
import HeaderSwitch from "@/components/HeaderSwitch";
import HeaderNav from "@/components/HeaderNav";

function extrageAliasNume(email: string): string {
  const localPart = email.split("@")[0];
  if (localPart.includes("madalinagligor")) {
    return "Mădălina G.";
  }
  return localPart.charAt(0).toUpperCase() + localPart.slice(1).replace(/[0-9_.-]/g, " ").trim();
}

export default async function Header() {
  const { user } = await getUtilizatorCurent();
  const progres = user ? await getProgresUtilizator(user.id) : null;

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200 bg-white/90 backdrop-blur-md text-slate-900 shadow-xs">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3 sm:px-6">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2.5 group">
          <Logo className="h-10 w-10 rounded-xl transition group-hover:scale-105" />
          <span className="leading-none">
            <span className="text-base font-black tracking-tight text-slate-900 font-sans">
              Academia<span className="text-amber-500">Python</span>
            </span>
            <span className="mt-0.5 hidden text-[9px] font-bold uppercase tracking-widest text-slate-500 sm:block">
              Învață. Practică. Devino dezvoltator.
            </span>
          </span>
        </Link>

        {/* Switch discret Kids/Liceu */}
        <HeaderSwitch />

        {/* Nav central adaptiv */}
        <HeaderNav />

        {/* Acțiuni Dreapta */}
        <div className="flex items-center gap-2.5">
          {progres && (
            <div className="hidden items-center gap-2 sm:flex">
              {progres.streakZile > 0 && (
                <span
                  className="flex items-center gap-1 rounded-xl bg-orange-50 border border-orange-200 px-2.5 py-1 text-xs font-black text-orange-600"
                  title={`Serie de ${progres.streakZile} zile`}
                >
                  <span>🔥</span>
                  <span>{progres.streakZile}</span>
                </span>
              )}
              <span
                className="rounded-xl bg-amber-50 border border-amber-200 px-2.5 py-1 text-xs font-black text-amber-800"
                title={`${progres.xpTotal} XP · Nivel ${nivelDinXp(progres.xpTotal)}`}
              >
                {progres.xpTotal} XP
              </span>
            </div>
          )}

          {/* Buton Pentru Părinți */}
          <Link
            href="/kids"
            className="hidden md:flex items-center gap-1.5 rounded-xl border border-slate-200 bg-slate-50 hover:bg-slate-100 px-3.5 py-2 text-xs font-bold text-slate-700 transition shadow-xs"
          >
            <span>👥</span>
            <span>Pentru părinți</span>
          </Link>

          {user ? (
            <Link
              href="/cont"
              className="hidden max-w-[10rem] truncate rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2 text-xs font-bold text-slate-700 hover:text-indigo-600 sm:inline-block"
            >
              {extrageAliasNume(user.email)}
            </Link>
          ) : (
            <Link
              href="/login"
              className="hidden rounded-xl px-3 py-2 text-xs font-bold text-slate-600 hover:text-indigo-600 sm:inline-block"
            >
              Autentificare
            </Link>
          )}

          <Link
            href="/curriculum"
            className="rounded-xl bg-amber-400 hover:bg-amber-500 text-slate-950 font-black px-4.5 py-2 text-xs shadow-sm transition active:scale-95"
          >
            {user ? "Contul meu" : "Începe gratuit"}
          </Link>
        </div>
      </div>
    </header>
  );
}
