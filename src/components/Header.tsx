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
  const { user, meta } = await getUtilizatorCurent();
  const esteProfesor = meta?.rol === "profesor_aprobat";
  const progres = user && !esteProfesor ? await getProgresUtilizator(user.id) : null;

  return (
    <header className="sticky top-0 z-50 border-b border-[#EBE7DF] bg-[#FDFBF7]/95 backdrop-blur-md text-[#1E2430] shadow-xs">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-2 px-3 py-2.5 sm:px-6 sm:py-3">
        {/* Logo Compact pe Mobil */}
        <Link href="/" className="flex items-center gap-2 group shrink-0">
          <Logo className="h-9 w-9 sm:h-10 sm:w-10 rounded-xl transition group-hover:scale-105" />
          <span className="leading-none">
            <span className="text-sm sm:text-base font-black tracking-tight text-[#1E2430] font-sans">
              Academia<span className="text-amber-500">Python</span>
            </span>
            <span className="mt-0.5 hidden text-[9px] font-bold uppercase tracking-widest text-[#525B6C] md:block">
              Învață. Practică. Devino dezvoltator.
            </span>
          </span>
        </Link>

        {/* Switch discret Kids/Liceu — ascuns pentru profesori, nu are sens acolo */}
        {!esteProfesor && (
          <div className="shrink-0">
            <HeaderSwitch />
          </div>
        )}

        {/* Nav central adaptiv + Meniu Mobil */}
        <HeaderNav esteProfesor={esteProfesor} />

        {/* Acțiuni Dreapta (Desktop) */}
        <div className="hidden sm:flex items-center gap-2.5 shrink-0">
          {progres && (
            <div className="hidden lg:flex items-center gap-2">
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

          {!esteProfesor && (
            <Link
              href="/kids"
              className="hidden xl:flex items-center gap-1.5 rounded-xl border border-[#EBE7DF] bg-white hover:bg-[#F3EFE6] px-3.5 py-2 text-xs font-bold text-[#1E2430] transition shadow-xs"
            >
              <span>👥</span>
              <span>Pentru părinți</span>
            </Link>
          )}

          {user ? (
            <Link
              href={esteProfesor ? "/profesor/planificari" : "/cont"}
              className="hidden md:inline-block max-w-[10rem] truncate rounded-xl border border-[#EBE7DF] bg-white px-3.5 py-2 text-xs font-bold text-[#1E2430] hover:text-indigo-600"
            >
              {extrageAliasNume(user.email)}
            </Link>
          ) : (
            <Link
              href="/login"
              className="hidden md:inline-block rounded-xl px-3 py-2 text-xs font-bold text-[#525B6C] hover:text-indigo-600"
            >
              Autentificare
            </Link>
          )}

          <Link
            href={esteProfesor ? "/profesor/planificari" : "/curriculum"}
            className="rounded-xl bg-amber-400 hover:bg-amber-500 text-slate-950 font-black px-4 py-2 text-xs shadow-xs transition active:scale-95 whitespace-nowrap"
          >
            {esteProfesor ? "Zona profesor" : user ? "Contul meu" : "Începe gratuit"}
          </Link>
        </div>
      </div>
    </header>
  );
}
