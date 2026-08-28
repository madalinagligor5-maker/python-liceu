import Link from "next/link";
import HeroCodeRunner from "@/components/HeroCodeRunner";
import AiAssistantWidget from "@/components/AiAssistantWidget";
import Dashboard from "@/components/Dashboard";
import NewsletterForm from "@/components/NewsletterForm";
import ScrollReveal from "@/components/ScrollReveal";
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
    culoare: "border-[#EBE7DF] bg-white text-[#1E2430]",
  },
  {
    clasa: "X",
    titlu: "Funcții și structuri de date",
    descriere:
      "Înveți să împarți un program în bucăți mai mici (funcții), apoi lucrezi cu tupluri, seturi, dicționare și text.",
    icon: "🔁",
    culoare: "border-[#EBE7DF] bg-white text-[#1E2430]",
  },
  {
    clasa: "XI",
    titlu: "Programare orientată pe obiecte",
    descriere:
      "Clase și obiecte, cum refolosești codul prin moștenire, plus algoritmi de care ai nevoie la olimpiadă și la școală.",
    icon: "🔀",
    culoare: "border-[#EBE7DF] bg-white text-[#1E2430]",
  },
  {
    clasa: "XII",
    titlu: "Proiecte și pregătire examen",
    descriere:
      "Pui cap la cap tot ce ai învățat în proiecte mai mari și exersezi exact ce pică la evaluarea de la Informatică.",
    icon: "🎒",
    culoare: "border-[#EBE7DF] bg-white text-[#1E2430]",
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
    intrebare: "Mă ajută la Bacalaureat și la evaluările de la școală?",
    raspuns:
      "Da! Conținutul acoperă integral algoritmii de bază, structurile de date și cerințele pentru evaluări sumative, teste curente și olimpiade școlare. Important de știut: noua programă școlară se aplică treptat, iar examenul oficial de Bacalaureat pe noua programă va fi introdus începând din anul 2030.",
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

      let recapitulare = null;
      try {
        const { getRecapitulareSpatiata } = await import("@/lib/progres");
        recapitulare = await getRecapitulareSpatiata(user.id);
      } catch (err) {
        console.error("Eroare citire recapitulare spatiata:", err);
      }

      return (
        <Dashboard
          prenume={prenumeDinEmail(user.email)}
          progres={progres}
          clasaSelectata={clasaSelectata}
          provocareRezolvata={provocareRezolvata}
          recapitulare={recapitulare}
        />
      );
    }
  }

  return (
    <div className="bg-[#FDFBF7] text-[#1E2430] min-h-screen relative overflow-hidden font-sans">
      {/* Soft ambient background glow — plutire discretă, nu statică */}
      <div className="animate-floatSubtle pointer-events-none absolute -top-40 left-1/2 -translate-x-1/2 h-[500px] w-[900px] rounded-full bg-gradient-to-tr from-amber-200/30 via-amber-100/40 to-yellow-100/30 blur-[130px]" />

      {/* HERO SECTION */}
      <section className="relative mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 lg:py-16 bg-hero-glow rounded-3xl">
        {/* Pastile de Acces Rapid */}
        <div className="flex flex-wrap items-center justify-start gap-3 mb-6">
          <Link
            href="/curriculum"
            className="flex items-center gap-2 rounded-full bg-blue-50 border border-blue-200 px-4 py-1.5 text-xs font-bold text-blue-900 hover:bg-blue-100 transition shadow-xs"
          >
            <span>🎓 Academia Liceu</span>
            <span className="text-blue-700 font-semibold">Clasele IX–XII</span>
          </Link>
          <Link
            href="/kids/junior"
            className="flex items-center gap-2 rounded-full bg-emerald-50 border border-emerald-200 px-4 py-1.5 text-xs font-bold text-emerald-900 hover:bg-emerald-100 transition shadow-xs"
          >
            <span>🎮 Academia Kids</span>
            <span className="text-emerald-700 font-semibold">Clasele I–IV (100% Gratuit)</span>
          </Link>
        </div>

        {/* Layout Hero */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Coloana Stânga: Text & CTA */}
          <div className="enter-slide-up lg:col-span-5 space-y-6">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight text-[#1E2430] leading-none [font-family:var(--font-fraunces)]">
              Învață Python direct în browser. <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-500 via-amber-600 to-amber-700">
                Progresezi pas cu pas.
              </span>
            </h1>

            <p className="text-base sm:text-lg text-[#525B6C] font-medium leading-relaxed">
              Platforma educațională creată pentru elevii de liceu, gimnaziu și clasele primare. Fără instalări complicate, aliniată la programa școlară.
            </p>

            {/* Lista bife verzi calde */}
            <div className="space-y-3 pt-2">
              {[
                "Exerciții interactive cu feedback instant",
                "Aliniat cu programa oficială de informatică",
                "Profesor Asistent AI care explică prietenos",
                "Gamification: XP, streak-uri, insigne și diplome",
              ].map((bifa, i) => (
                <div key={i} className="flex items-center gap-3">
                  <div className="flex h-6 w-6 items-center justify-center rounded-full bg-emerald-100 text-emerald-700 text-xs font-black border border-emerald-300 shrink-0">
                    ✓
                  </div>
                  <span className="text-sm font-semibold text-[#1E2430]">{bifa}</span>
                </div>
              ))}
            </div>

            {/* Butoane CTA */}
            <div className="flex flex-wrap items-center gap-4 pt-4">
              <Link
                href="/curriculum"
                className="rounded-xl bg-amber-400 hover:bg-amber-500 text-slate-950 font-black px-7 py-3.5 text-base shadow-xs active:scale-95 transition-all flex items-center gap-2"
              >
                <span>Începe gratuit</span>
                <span>🎯</span>
              </Link>
              <Link
                href="/curriculum"
                className="rounded-xl border border-[#EBE7DF] bg-white hover:bg-[#F3EFE6] text-[#1E2430] font-bold px-7 py-3.5 text-base transition shadow-xs"
              >
                Explorează lecțiile
              </Link>
            </div>
          </div>

          {/* Coloana Centru: IDE Editor (Păstrat Dark doar pentru cod) */}
          <div className="enter-slide-up enter-delay-1 lg:col-span-4 shadow-depth-lg rounded-2xl">
            <HeroCodeRunner />
          </div>

          {/* Coloana Dreapta: Floating Widgets pe carduri albe */}
          <div className="enter-slide-up enter-delay-2 lg:col-span-3 space-y-4">
            {/* Widget Asistent AI */}
            <AiAssistantWidget />

            {/* Widget Progres & Gamification */}
            <div className="rounded-2xl border border-[#EBE7DF] bg-white p-4 shadow-depth-md text-[#1E2430]">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-extrabold text-[#525B6C] uppercase tracking-wider">
                  Progres & Gamification
                </span>
                <span className="text-xs text-amber-600 font-black">Level 12</span>
              </div>
              <div className="grid grid-cols-3 gap-2 text-center">
                <div className="rounded-xl bg-amber-50 border border-amber-200 p-2">
                  <span className="text-lg">🏆</span>
                  <p className="text-[10px] text-amber-800 font-bold uppercase mt-1">+1250 XP</p>
                </div>
                <div className="rounded-xl bg-orange-50 border border-orange-200 p-2">
                  <span className="text-lg">🔥</span>
                  <p className="text-[10px] text-orange-800 font-bold uppercase mt-1">7 Zile</p>
                </div>
                <div className="rounded-xl bg-indigo-50 border border-indigo-200 p-2">
                  <span className="text-lg">⭐</span>
                  <p className="text-[10px] text-indigo-800 font-bold uppercase mt-1">Badge-uri</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* PILONI DE ÎNCREDERE (4 CARDE ALBE PE FILDEȘ) */}
      <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8 border-t border-[#EBE7DF]">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { icon: "💻", bg: "bg-amber-50 border-amber-200", hover: "hover:border-amber-300 hover-glow-brand", titlu: "Învățare în ritm propriu", text: "Oriunde, oricând pe laptop sau tabletă" },
            { icon: "📋", bg: "bg-emerald-50 border-emerald-200", hover: "hover:border-emerald-300", titlu: "Exerciții interactive", text: "Feedback instant la fiecare linie" },
            { icon: "🎓", bg: "bg-amber-50 border-amber-200", hover: "hover:border-amber-300 hover-glow-brand", titlu: "Pregătire Bac & Școală", text: "Aliniat la programa oficială RO" },
            { icon: "👥", bg: "bg-purple-50 border-purple-200", hover: "hover:border-purple-300", titlu: "Comunitate activă", text: "Suport de la profesori și elevi" },
          ].map((p, i) => (
            <ScrollReveal key={p.titlu} index={i}>
              <div className={`rounded-2xl border border-[#EBE7DF] bg-white p-5 shadow-depth-sm flex items-center gap-4 transition ${p.hover}`}>
                <div className={`flex h-12 w-12 items-center justify-center rounded-2xl text-2xl border shrink-0 ${p.bg}`}>
                  {p.icon}
                </div>
                <div>
                  <h3 className="font-extrabold text-[#1E2430] text-sm">{p.titlu}</h3>
                  <p className="text-xs text-[#525B6C]">{p.text}</p>
                </div>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </section>

      {/* CLASE CURRICULUM */}
      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
        <ScrollReveal className="text-center max-w-2xl mx-auto mb-14">
          <span className="inline-flex rounded-full bg-indigo-50 border border-indigo-200 px-3.5 py-1 text-xs font-bold text-indigo-900 uppercase tracking-widest mb-3">
            Programa Școlară
          </span>
          <h2 className="text-3xl sm:text-4xl font-black text-[#1E2430] [font-family:var(--font-fraunces)]">Ce înveți pe clase</h2>
          <p className="mt-3 text-sm text-[#525B6C] font-medium">
            Parcurge modulele de la clasa a IX-a până la examenul de Bacalaureat.
          </p>
        </ScrollReveal>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {CLASE.map((c, i) => (
            <ScrollReveal key={c.clasa} index={i}>
              <Link
                href={`/curriculum/${c.clasa}`}
                className="hover-glow-brand block rounded-3xl border border-[#EBE7DF] bg-white p-6 shadow-depth-sm transition-all"
              >
                <div className="flex items-center justify-between mb-4">
                  <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[#F5F2EA] font-black text-lg text-[#1E2430]">
                    {c.clasa}
                  </span>
                  <span className="text-3xl">{c.icon}</span>
                </div>
                <h3 className="text-lg font-black text-[#1E2430]">{c.titlu}</h3>
                <p className="mt-2 text-xs text-[#525B6C] leading-relaxed">{c.descriere}</p>
              </Link>
            </ScrollReveal>
          ))}
        </div>
      </section>

      {/* FAQ */}
      <section className="mx-auto max-w-4xl px-4 py-20 sm:px-6 lg:px-8 border-t border-[#EBE7DF]">
        <h2 className="text-2xl font-black text-[#1E2430] text-center mb-10 sm:text-3xl [font-family:var(--font-fraunces)]">
          Întrebări frecvente
        </h2>
        <div className="space-y-4">
          {FAQ.map((f, i) => (
            <ScrollReveal key={f.intrebare} index={i} delayMs={60}>
              <details className="group rounded-2xl border border-[#EBE7DF] bg-white p-5 font-sans shadow-depth-sm open:shadow-depth-md transition-shadow">
                <summary className="cursor-pointer font-bold text-[#1E2430] text-sm sm:text-base flex items-center justify-between">
                  <span>{f.intrebare}</span>
                  <span className="text-amber-500 text-xl group-open:rotate-45 transition-transform">+</span>
                </summary>
                <p className="mt-3 text-xs sm:text-sm text-[#525B6C] leading-relaxed">{f.raspuns}</p>
              </details>
            </ScrollReveal>
          ))}
        </div>
      </section>

      {/* NEWSLETTER */}
      <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
        <ScrollReveal>
          <NewsletterForm />
        </ScrollReveal>
      </section>
    </div>
  );
}
