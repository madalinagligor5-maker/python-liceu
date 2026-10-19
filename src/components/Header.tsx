import Link from "next/link";
import Logo from "@/components/Logo";
import { getUtilizatorCurent } from "@/lib/subscription";
import { getProgresUtilizator, nivelDinXp } from "@/lib/progres";
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
    <header className="sticky top-0 z-50 border-b border-black/[0.07] bg-[#F8F5EE]/92 backdrop-blur-xl text-[#172033]">
      <div className="mx-auto flex max-w-[86rem] items-center justify-between gap-3 px-4 py-3 sm:px-6">
        {/* Logo Compact pe Mobil */}
        <Link href="/" className="flex items-center gap-2 group shrink-0">
          <Logo prioritar className="h-9 w-9 sm:h-10 sm:w-10 rounded-lg transition duration-300 group-hover:-rotate-2 group-hover:scale-105" />
          <span className="leading-none">
            <span className="text-sm sm:text-base font-black tracking-tight text-[#1E2430] font-sans">
              Academia<span className="text-[#B96D08]">Python</span>
            </span>
            <span className="mt-1 hidden text-[8px] font-bold uppercase tracking-[0.18em] text-[#6D6B67] md:block">
              Python explicat cu răbdare
            </span>
          </span>
        </Link>

        {/* Nav central adaptiv + Meniu Mobil */}
        <HeaderNav esteProfesor={esteProfesor} esteAutentificat={Boolean(user)} />

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
              className="hidden md:inline-block rounded-xl px-3 py-2 text-xs font-bold text-[#1E2430] hover:text-amber-700"
            >
              Autentificare
            </Link>
          )}

          <Link
            href={esteProfesor ? "/profesor/planificari" : user ? "/cont" : "/start"}
            data-eveniment={!esteProfesor && !user ? "cta_incepe_gratuit" : undefined}
            data-ev-loc="header"
            className="rounded-lg bg-[#172033] hover:bg-[#2A3852] text-white font-black px-4 py-2.5 text-xs shadow-sm transition active:scale-95 whitespace-nowrap"
          >
            {esteProfesor ? "Zona profesor" : user ? "Contul meu" : "Începe gratuit"}
          </Link>
        </div>
      </div>
    </header>
  );
}
