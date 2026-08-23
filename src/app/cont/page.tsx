import Link from "next/link";
import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { getUtilizatorCurent } from "@/lib/subscription";
import { creeazaClientServer } from "@/lib/supabase/server";
import SignOutButton from "@/components/auth/SignOutButton";
import GestioneazaAbonamentButton from "@/components/auth/GestioneazaAbonamentButton";
import Mascota from "@/components/Mascota";

export const metadata: Metadata = {
  title: "Contul meu — Academia Python",
};

const STATUS_LABEL: Record<string, { text: string; className: string; desc: string }> = {
  active: {
    text: "Abonament Activ (Premium)",
    className: "bg-success/15 text-success border-success/30",
    desc: "Felicitări! Ai acces nelimitat la toate lecțiile, exercițiile practice și materialele din programa de liceu.",
  },
  past_due: {
    text: "Plată restantă",
    className: "bg-amber-150 text-amber-800 border-amber-300/40",
    desc: "Ultima plată a eșuat. Te rugăm să actualizezi datele cardului în portal pentru a nu pierde accesul.",
  },
  canceled: {
    text: "Abonament Anulat",
    className: "bg-red-100 text-red-700 border-red-200",
    desc: "Abonamentul tău a fost anulat. Vei mai avea acces premium până la expirarea perioadei curente.",
  },
  none: {
    text: "Versiune Gratuită (Freemium)",
    className: "bg-black/5 text-foreground/75 border-black/10",
    desc: "Momentan ai acces doar la lecțiile gratuite. Abonează-te pentru a debloca întregul curriculum de liceu.",
  },
};

const LISTA_INSIGNE = [
  { slug: "prima-lectie", nume: "Prima Lecție", descriere: "Ai finalizat prima ta lecție pe site", emoji: "🥇" },
  { slug: "cinci-lectii", nume: "5 Lecții", descriere: "Ai finalizat 5 lecții pe platformă", emoji: "📚" },
  { slug: "zece-lectii", nume: "Dezvoltator", descriere: "Ai terminat 10 lecții diferite", emoji: "🎓" },
  { slug: "serie-3-zile", nume: "Constanță", descriere: "Ai învățat timp de 3 zile consecutiv", emoji: "⚡" },
  { slug: "serie-7-zile", nume: "Dedicare", descriere: "Ai menținut un streak activ de 7 zile", emoji: "🔥" },
  { slug: "quiz-perfect", nume: "Minte Sclipitoare", descriere: "Ai răspuns 100% corect la un quiz", emoji: "💯" },
  { slug: "predictie-reusita", nume: "Prezicător", descriere: "Ai anticipat corect rezultatul unui program", emoji: "🔮" },
];

export default async function ContPage() {
  const { user, meta } = await getUtilizatorCurent();

  if (!user || !meta) {
    redirect("/login?redirect=/cont");
  }

  // Preluăm insigne din DB
  let insigneDetinute: Set<string> = new Set();
  if (process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    try {
      const supabase = await creeazaClientServer();
      const { data } = await supabase
        .from("insigne_utilizator")
        .select("insigna_slug")
        .eq("user_id", user.id);
      
      if (data) {
        data.forEach((row) => insigneDetinute.add(row.insigna_slug));
      }
    } catch (e) {
      console.error("Eroare incarcare insigne:", e);
    }
  }

  const status = STATUS_LABEL[meta.subscriptionStatus ?? "none"];
  
  const dataReinnoire = meta.subscriptionCurrentPeriodEnd
    ? new Date(meta.subscriptionCurrentPeriodEnd).toLocaleDateString("ro-RO", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : null;

  // Calcule pentru nivel și progress bar
  const xpTotal = meta.xpTotal;
  const nivel = meta.nivel;
  const xpNivelCurent = Math.pow(nivel - 1, 2) * 100;
  const xpNivelUrmator = Math.pow(nivel, 2) * 100;
  const totalXpNivel = xpNivelUrmator - xpNivelCurent;
  const xpCurentInNivel = Math.max(0, xpTotal - xpNivelCurent);
  const procentajNivel = Math.min(100, Math.round((xpCurentInNivel / totalXpNivel) * 100));

  return (
    <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6">
      {/* Panou Profil / Dashboard Elev */}
      <div className="overflow-hidden rounded-3xl border border-black/5 bg-white shadow-sm">
        {/* Header Decorativ */}
        <div className="bg-gradient-to-r from-brand to-brand-dark px-6 py-8 text-white sm:px-8 flex flex-col sm:flex-row items-center gap-6">
          <div className="relative rounded-2xl bg-white/10 p-2 backdrop-blur-sm border border-white/10">
            <Mascota size={80} />
            <span className="absolute -bottom-2 -right-2 flex h-8 w-8 items-center justify-center rounded-full bg-yellow-450 font-mono text-sm font-extrabold text-brand-dark shadow-md border border-white">
              {nivel}
            </span>
          </div>

          <div className="text-center sm:text-left flex-1 min-w-0">
            <p className="text-xs font-semibold uppercase tracking-wider text-brand-light/90">Panoul elevului</p>
            <h1 className="mt-1 text-2xl font-extrabold truncate">{user.email}</h1>
            <p className="text-sm text-white/85 mt-0.5">
              Clasa a {meta.clasa || "IX"}-a · Nivel {nivel}
            </p>
            
            {/* XP progress bar */}
            <div className="mt-4 max-w-md">
              <div className="flex items-center justify-between text-xs text-white/80 mb-1 font-semibold">
                <span>Nivel {nivel}</span>
                <span>{xpTotal} / {xpNivelUrmator} XP</span>
                <span>Nivel {nivel + 1}</span>
              </div>
              <div className="h-2.5 w-full rounded-full bg-white/20 overflow-hidden border border-white/5">
                <div 
                  className="h-full rounded-full bg-yellow-450 transition-all duration-550"
                  style={{ width: `${procentajNivel}%` }}
                />
              </div>
              <p className="text-[11px] text-white/70 mt-1 italic">
                Mai ai nevoie de {xpNivelUrmator - xpTotal} XP până la nivelul următor!
              </p>
            </div>
          </div>
        </div>

        {/* Informații și Statistici Progres */}
        <div className="grid gap-4 border-b border-black/5 bg-brand-light/20 p-6 sm:grid-cols-3 sm:px-8">
          <div className="flex items-center gap-3 rounded-2xl border border-black/5 bg-white p-4 shadow-inner-sm">
            <span className="text-3xl" aria-hidden="true">⭐</span>
            <div>
              <p className="text-xs font-semibold text-foreground/50 uppercase tracking-wider">XP Acumulat</p>
              <p className="text-lg font-extrabold text-foreground">{xpTotal} XP</p>
            </div>
          </div>
          <div className="flex items-center gap-3 rounded-2xl border border-black/5 bg-white p-4 shadow-inner-sm">
            <span className="text-3xl" aria-hidden="true">🔥</span>
            <div>
              <p className="text-xs font-semibold text-foreground/50 uppercase tracking-wider">Streak de Învățare</p>
              <p className="text-lg font-extrabold text-foreground">{meta.streakZile} {meta.streakZile === 1 ? "zi" : "zile"}</p>
            </div>
          </div>
          <div className="flex items-center gap-3 rounded-2xl border border-black/5 bg-white p-4 shadow-inner-sm">
            <span className="text-3xl" aria-hidden="true">🏅</span>
            <div>
              <p className="text-xs font-semibold text-foreground/50 uppercase tracking-wider">Insigne Câștigate</p>
              <p className="text-lg font-extrabold text-foreground">{insigneDetinute.size} / {LISTA_INSIGNE.length}</p>
            </div>
          </div>
        </div>

        {/* Secțiune Abonament / Plăți */}
        <div className="p-6 sm:p-8">
          <h2 className="text-base font-bold text-foreground">Stare Abonament & Plăți</h2>
          <div className={`mt-3 rounded-2xl border p-5 ${status.className}`}>
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <span className="font-extrabold text-sm uppercase tracking-wide">Status: {status.text}</span>
                <p className="mt-1 text-sm text-foreground/80 leading-relaxed max-w-xl">
                  {status.desc}
                </p>
                {dataReinnoire && (
                  <p className="mt-2 text-xs font-semibold text-foreground/60">
                    {meta.subscriptionStatus === "active" ? "Următoarea plată se va efectua pe" : "Abonamentul va expira pe"}:{" "}
                    <span className="text-foreground">{dataReinnoire}</span>
                  </p>
                )}
              </div>
              <div className="shrink-0 mt-2 sm:mt-0">
                {meta.subscriptionStatus === "active" || meta.stripeCustomerId ? (
                  <GestioneazaAbonamentButton />
                ) : (
                  <Link
                    href="/preturi"
                    className="inline-block rounded-xl bg-brand px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-brand-dark"
                  >
                    🚀 Upgrade la Premium
                  </Link>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Secțiune Insigne / Trofee obținute */}
      <div className="mt-8 rounded-3xl border border-black/5 bg-white p-6 sm:p-8 shadow-sm">
        <h2 className="text-lg font-bold text-foreground flex items-center gap-2">
          <span>🏆</span> Insignele Tale
        </h2>
        <p className="text-sm text-foreground/50 mt-1">
          Finalizează modulele de învățare, rezolvă quiz-urile corect și menține-ți streak-ul zilnic pentru a debloca toate medaliile.
        </p>

        <div className="mt-6 grid gap-4 sm:grid-cols-2 md:grid-cols-3">
          {LISTA_INSIGNE.map((badge) => {
            const obtinuta = insigneDetinute.has(badge.slug);
            return (
              <div
                key={badge.slug}
                className={[
                  "flex items-center gap-3 rounded-2xl border p-4 transition",
                  obtinuta
                    ? "border-brand-border bg-brand-light/20"
                    : "border-black/5 bg-black/[0.02] opacity-40 select-none grayscale",
                ].join(" ")}
              >
                <span className="text-3xl shrink-0" aria-hidden="true">
                  {badge.emoji}
                </span>
                <div className="min-w-0">
                  <p className="font-bold text-sm text-foreground truncate">{badge.nume}</p>
                  <p className="text-xs text-foreground/60 leading-tight mt-0.5">{badge.descriere}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Butoane de Ieșire / Navigare */}
      <div className="mt-8 flex flex-wrap items-center justify-between gap-4 px-2">
        <Link 
          href="/lectii" 
          className="text-sm font-semibold text-brand hover:text-brand-dark flex items-center gap-1.5 transition"
        >
          <span>←</span> Înapoi la catalogul de lecții
        </Link>
        <SignOutButton className="rounded-xl border border-black/10 bg-white px-5 py-2.5 text-sm font-semibold text-foreground/80 shadow-sm transition hover:border-red-300 hover:text-red-600 hover:bg-red-50/50" />
      </div>
    </div>
  );
}
