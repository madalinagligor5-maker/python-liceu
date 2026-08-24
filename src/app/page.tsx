import Link from "next/link";
import HeroCodeRunner from "@/components/HeroCodeRunner";
import AiAssistantWidget from "@/components/AiAssistantWidget";
import Dashboard from "@/components/Dashboard";
import NewsletterForm from "@/components/NewsletterForm";
import { getUtilizatorCurent } from "@/lib/subscription";
import { getProgresUtilizator } from "@/lib/progres";
import { capitole } from "@/lib/curriculum";
import { creeazaClientServer } from "@/lib/supabase/server";

const CLASE = [
  {
    clasa: "IX",
    titlu: "Bazele programării",
    descriere:
      "De la zero: ce e un algoritm, cum scrii un program, variabile, operații cu numere, liste și cum citești ce a scris altul.",
    icon: "🧭",
    culoare: "border-emerald-500/30 bg-emerald-950/20 text-emerald-300",
  },
  {
    clasa: "X",
    titlu: "Funcții și structuri de date",
    descriere:
      "Înveți să împarți un program în bucăți mai mici (funcții), apoi lucrezi cu tupluri, seturi, dicționare și text.",
    icon: "🔁",
    culoare: "border-sky-500/30 bg-sky-950/20 text-sky-300",
  },
  {
    clasa: "XI",
    titlu: "Programare orientată pe obiecte",
    descriere:
      "Clase și obiecte, cum refolosești codul prin moștenire, plus algoritmi de care ai nevoie la olimpiadă și la școală.",
    icon: "🔀",
    culoare: "border-violet-500/30 bg-violet-950/20 text-violet-300",
  },
  {
    clasa: "XII",
    titlu: "Proiecte și pregătire examen",
    descriere:
      "Pui cap la cap tot ce ai învățat în proiecte mai mari și exersezi exact ce pică la evaluarea de la Informatică.",
    icon: "🎒",
    culoare: "border-amber-500/30 bg-amber-950/20 text-amber-300",
  },
];

const FAQ = [
  {
    intrebare: "Chiar pot începe fără să plătesc nimic?",
    raspuns:
      "Da. Toate cele 6 module din Academia Junior sunt 100% GRATUITE. De asemenea, primele 3 module din liceu sunt deschise complet fără card.",
  },
  {
    intrebare: "Trebuie să instalez Python pe laptop?",
    raspuns:
      "Nu. Codul se scrie și rulează direct în pagină, în browser. Nu ai nevoie de instalări pe calculator.",
  },
  {
    intrebare: "Se potrivește cu ce facem la școală?",
    raspuns:
      "Se potrivește 100%. Lecțiile sunt grupate pe clase (IX–XII & Ciclul Primar) și respectă programa școlară de Informatică.",
  },
  {
    intrebare: "Mă ajută la bacalaureat la Informatică?",
    raspuns:
      "Da. Conținutul acoperă algoritmi, structuri de date, programare și baze de date — exact subiectele de la Bacalaureat.",
  },
];

function prenumeDinEmail(email: string): string {
  const local = email.split("@")[0] ?? "";
  const prima = local.split(/[._-]/)[0] ?? local;
  const faraCifre = prima.replace(/\d+$/, "");
  if (!faraCifre) return "Elev Python";
  if (faraCifre.toLowerCase().startsWith("madalinagligor")) {
    return "Mădălina G.";
  }
  return faraCifre.charAt(0).toUpperCase() + faraCifre.slice(1);
}

export default async function HomePage({ searchParams }: PageProps<"/">) {
  const { user } = await getUtilizatorCurent();

  if (user) {
    const progres = await getProgresUtilizator(user.id);
    const params = await searchParams;
    const cerut = Array.isArray(params?.clasa) ? params.clasa[0] : params?.clasa;
    const valide = ["IX", "X", "XI", "XII"];
    const clasaSelectata =
      (cerut && valide.includes(cerut) ? cerut : null) ??
      (progres?.clasa && valide.includes(progres.clasa) ? progres.clasa : null) ??
      "IX";

    if (progres) {
      let provocareRezolvata = false;
      try {
        const supabase = await creeazaClientServer();
        const azi = new Date().toISOString().split("T")[0];
        const { data: provAzi } = await supabase
          .from("provocari_zilnice")
          .select("finalizata")
          .eq("user_id", user.id)
          .eq("data", azi)
          .maybeSingle();
        provocareRezolvata = Boolean(provAzi?.finalizata);
      } catch (err) {
        console.error("Eroare citire provocare zilnica:", err);
      }

      return (
        <Dashboard
          prenume={prenumeDinEmail(user.email)}
          progres={progres}
          clasaSelectata={clasaSelectata}
          provocareRezolvata={provocareRezolvata}
        />
      );
    }
  }

  const moduleGratuite =
    capitole
      .find((c) => c.clasa === "IX")
      ?.module.slice(0, 5)
      .map((m, i) => ({ cod: m.cod, titlu: m.titlu, slug: m.slug, gratuit: i < 3 })) ?? [];

  return (
    <div className="bg-slate-950 text-slate-100 min-h-screen relative overflow-hidden font-sans">
      {/* Glow decorative radial background accents */}
      <div className="pointer-events-none absolute -top-40 left-1/2 -translate-x-1/2 h-[500px] w-[800px] rounded-full bg-gradient-to-tr from-indigo-600/20 via-purple-600/10 to-amber-500/10 blur-[120px]" />

      {/* HERO SECTION */}
      <section className="relative mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
        {/* Sub-brand Pills */}
        <div className="flex flex-wrap items-center justify-start gap-3 mb-6">
          <Link
            href="/curriculum"
            className="flex items-center gap-2 rounded-full bg-indigo-950/80 border border-indigo-500/40 px-4 py-1.5 text-xs font-bold text-indigo-300 shadow-md hover:border-indigo-400 transition"
          >
            <span>🎓 Academia Python Liceu</span>
            <span className="text-indigo-400/70">Clasele IX–XII</span>
          </Link>
          <Link
            href="/kids/junior"
            className="flex items-center gap-2 rounded-full bg-emerald-950/80 border border-emerald-500/40 px-4 py-1.5 text-xs font-bold text-emerald-300 shadow-md hover:border-emerald-400 transition"
          >
            <span>🎮 Academia Python Junior</span>
            <span className="text-emerald-400/70">Clasele I–IV (100% Gratuit)</span>
          </Link>
        </div>

        {/* Layout cu 3 coloane / 2 randuri */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Coloana Stânga: Text & CTA (5 Cols) */}
          <div className="lg:col-span-5 space-y-6">
            <h1
              className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight text-white leading-none"
              style={{ fontFamily: "'Baloo 2', sans-serif" }}
            >
              Învață. Practică. <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-amber-300 to-yellow-200">
                Devino dezvoltator.
              </span>
            </h1>

            <p className="text-base sm:text-lg text-slate-300 font-medium leading-relaxed">
              Platforma educațională Python pentru liceu și juniori, direct în browser. De la prima linie de cod până la proiecte reale.
            </p>

            {/* Lista bife verzi */}
            <div className="space-y-3 pt-2">
              {[
                "Python direct în browser — fără instalări",
                "Lecții interactive, aliniate cu programa școlară",
                "Profesor Asistent AI, exerciții cu feedback instant",
                "XP, streak-uri și diplome pentru motivație",
              ].map((bifa, i) => (
                <div key={i} className="flex items-center gap-3">
                  <div className="flex h-6 w-6 items-center justify-center rounded-full bg-emerald-500/20 text-emerald-400 text-xs font-black border border-emerald-500/40 shrink-0">
                    ✓
                  </div>
                  <span className="text-sm font-semibold text-slate-200">{bifa}</span>
                </div>
              ))}
            </div>

            {/* Butoane CTA */}
            <div className="flex flex-wrap items-center gap-4 pt-4">
              <Link
                href="/curriculum"
                className="rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-black px-7 py-3.5 text-base shadow-xl shadow-amber-400/20 active:scale-95 transition-all flex items-center gap-2"
              >
                <span>Începe să înveți</span>
                <span>🎯</span>
              </Link>
              <Link
                href="/kids/junior"
                className="rounded-xl border border-slate-700 bg-slate-900/80 hover:bg-slate-800 text-slate-200 font-extrabold px-6 py-3.5 text-base transition shadow-md"
              >
                Testează gratuit
              </Link>
            </div>
          </div>

          {/* Coloana Centru: IDE Mockup Interactiv (4 Cols) */}
          <div className="lg:col-span-4">
            <HeroCodeRunner />
          </div>

          {/* Coloana Dreapta: Floating Widgets (3 Cols) */}
          <div className="lg:col-span-3 space-y-4">
            {/* Widget Asistent AI */}
            <AiAssistantWidget />

            {/* Widget Progres & Gamification */}
            <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-4 shadow-xl backdrop-blur-md">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-extrabold text-slate-400 uppercase tracking-wider">
                  Progres & Gamification
                </span>
                <span className="text-xs text-amber-400 font-black">Level 12</span>
              </div>
              <div className="grid grid-cols-3 gap-2 text-center">
                <div className="rounded-xl bg-amber-500/10 border border-amber-500/30 p-2">
                  <span className="text-lg">🏆</span>
                  <p className="text-[10px] text-amber-300 font-bold uppercase mt-1">+1250 XP</p>
                </div>
                <div className="rounded-xl bg-orange-500/10 border border-orange-500/30 p-2">
                  <span className="text-lg">🔥</span>
                  <p className="text-[10px] text-orange-300 font-bold uppercase mt-1">7 Zile</p>
                </div>
                <div className="rounded-xl bg-indigo-500/10 border border-indigo-500/30 p-2">
                  <span className="text-lg">⭐</span>
                  <p className="text-[10px] text-indigo-300 font-bold uppercase mt-1">Badge-uri</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* PILONI DE ÎNCREDERE (4 CARDE VIZUALE) */}
      <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 border-t border-slate-800/80">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5 shadow-lg flex items-center gap-4 hover:border-indigo-500/50 transition">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-500/20 text-2xl border border-indigo-500/30 shrink-0">
              💻
            </div>
            <div>
              <h3 className="font-extrabold text-white text-sm">Învățare în ritm propriu</h3>
              <p className="text-xs text-slate-400">Oriunde, oricând pe laptop sau tabletă</p>
            </div>
          </div>

          <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5 shadow-lg flex items-center gap-4 hover:border-emerald-500/50 transition">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-500/20 text-2xl border border-emerald-500/30 shrink-0">
              📋
            </div>
            <div>
              <h3 className="font-extrabold text-white text-sm">Exerciții interactive</h3>
              <p className="text-xs text-slate-400">Feedback instant la fiecare linie</p>
            </div>
          </div>

          <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5 shadow-lg flex items-center gap-4 hover:border-amber-500/50 transition">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-500/20 text-2xl border border-amber-500/30 shrink-0">
              🎓
            </div>
            <div>
              <h3 className="font-extrabold text-white text-sm">Pregătire Bac & Școală</h3>
              <p className="text-xs text-slate-400">Aliniat la programa oficială RO</p>
            </div>
          </div>

          <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5 shadow-lg flex items-center gap-4 hover:border-purple-500/50 transition">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-purple-500/20 text-2xl border border-purple-500/30 shrink-0">
              👥
            </div>
            <div>
              <h3 className="font-extrabold text-white text-sm">Comunitate activă</h3>
              <p className="text-xs text-slate-400">Suport de la profesori și elevi</p>
            </div>
          </div>
        </div>
      </section>

      {/* CLASE CURRICULUM */}
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="inline-flex rounded-full bg-indigo-950 border border-indigo-500/30 px-3.5 py-1 text-xs font-bold text-indigo-300 uppercase tracking-widest mb-3">
            Programa Școlară
          </span>
          <h2 className="text-3xl sm:text-4xl font-black text-white">Ce înveți pe clase</h2>
          <p className="mt-2 text-sm text-slate-400 font-medium">
            Parcurge modulele de la clasa a IX-a până la examenul de Bacalaureat.
          </p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {CLASE.map((c) => (
            <Link
              key={c.clasa}
              href={`/curriculum/${c.clasa}`}
              className={`rounded-3xl border ${c.culoare} p-6 shadow-xl transition-all hover:-translate-y-1 hover:shadow-2xl`}
            >
              <div className="flex items-center justify-between mb-4">
                <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-white/10 font-black text-lg">
                  {c.clasa}
                </span>
                <span className="text-3xl">{c.icon}</span>
              </div>
              <h3 className="text-lg font-black text-white">{c.titlu}</h3>
              <p className="mt-2 text-xs text-slate-300 leading-relaxed">{c.descriere}</p>
            </Link>
          ))}
        </div>
      </section>

      {/* FAQ */}
      <section className="mx-auto max-w-4xl px-4 py-16 sm:px-6 lg:px-8 border-t border-slate-800">
        <h2 className="text-2xl font-black text-white text-center mb-8 sm:text-3xl">
          Întrebări frecvente
        </h2>
        <div className="space-y-4">
          {FAQ.map((f) => (
            <details
              key={f.intrebare}
              className="group rounded-2xl border border-slate-800 bg-slate-900/60 p-5 font-sans"
            >
              <summary className="cursor-pointer font-bold text-white text-sm sm:text-base flex items-center justify-between">
                <span>{f.intrebare}</span>
                <span className="text-amber-400 text-xl group-open:rotate-45 transition-transform">+</span>
              </summary>
              <p className="mt-3 text-xs sm:text-sm text-slate-300 leading-relaxed">{f.raspuns}</p>
            </details>
          ))}
        </div>
      </section>

      {/* NEWSLETTER */}
      <section className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
        <NewsletterForm />
      </section>
    </div>
  );
}
