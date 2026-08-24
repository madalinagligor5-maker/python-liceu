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
    <header className="sticky top-0 z-50 border-b border-slate-800/80 bg-slate-950/90 backdrop-blur-md text-slate-100">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3 sm:px-6">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2.5 group">
          <Logo className="h-10 w-10 rounded-xl transition group-hover:scale-105" />
          <span className="leading-none">
            <span className="text-base font-black tracking-tight text-white font-mono">
              academia<span className="text-amber-400">python.ro</span>
            </span>
            <span className="mt-0.5 hidden text-[9px] font-bold uppercase tracking-widest text-slate-400 sm:block">
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
                  className="flex items-center gap-1 rounded-xl bg-orange-500/20 border border-orange-500/40 px-2.5 py-1 text-xs font-black text-orange-400"
                  title={`Serie de ${progres.streakZile} zile`}
                >
                  <span>🔥</span>
                  <span>{progres.streakZile}</span>
                </span>
              )}
              <span
                className="rounded-xl bg-amber-500/20 border border-amber-500/40 px-2.5 py-1 text-xs font-black text-amber-300"
                title={`${progres.xpTotal} XP · Nivel ${nivelDinXp(progres.xpTotal)}`}
              >
                {progres.xpTotal} XP
              </span>
            </div>
          )}

          {/* Buton Pentru Părinți */}
          <Link
            href="/kids"
            className="hidden md:flex items-center gap-1.5 rounded-xl border border-slate-700 bg-slate-900/60 hover:bg-slate-800 px-3.5 py-2 text-xs font-extrabold text-slate-200 transition shadow-sm"
          >
            <span>👥</span>
            <span>Pentru părinți</span>
          </Link>

          {user ? (
            <Link
              href="/cont"
              className="hidden max-w-[10rem] truncate rounded-xl border border-slate-800 bg-slate-900 px-3.5 py-2 text-xs font-bold text-slate-200 hover:text-white sm:inline-block"
            >
              {extrageAliasNume(user.email)}
            </Link>
          ) : (
            <Link
              href="/login"
              className="hidden rounded-xl px-3 py-2 text-xs font-bold text-slate-300 hover:text-white sm:inline-block"
            >
              Autentificare
            </Link>
          )}

          <Link
            href={user ? "/curriculum" : "/curriculum"}
            className="rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-black px-4 py-2 text-xs shadow-md shadow-amber-400/20 transition active:scale-95"
          >
            {user ? "Continuă" : "Începe acum"}
          </Link>
        </div>
      </div>
    </header>
  );
}
