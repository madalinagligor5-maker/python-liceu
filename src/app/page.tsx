import Link from "next/link";
import Image from "next/image";
import HeroCodeRunner from "@/components/HeroCodeRunner";
import AiAssistantWidget from "@/components/AiAssistantWidget";
import Dashboard from "@/components/Dashboard";
import NewsletterForm from "@/components/NewsletterForm";
import ScrollReveal from "@/components/ScrollReveal";
import { getUtilizatorCurent } from "@/lib/subscription";
import { getProgresUtilizator } from "@/lib/progres";
import { structura, TOATE_CLASELE } from "@/lib/curriculum";
import CarduriTrasee from "@/components/CarduriTrasee";
import { creeazaClientServer } from "@/lib/supabase/server";
import { getToateArticolele } from "@/lib/blog";
import FaqJsonLd from "@/components/seo/FaqJsonLd";
import { metadatePagina } from "@/lib/seo";

export const metadata = metadatePagina({
  titlu: "Python pentru elevi: Informatică VII–XII | Academia Python",
  titluAbsolut: true,
  descriere:
    "Informatică în Python pentru clasele VII–XII, conform programei oficiale. Exerciții în browser; gimnaziul e gratuit, la fel primele 3 module de liceu.",
  cale: "/",
});

const FAQ = [
  {
    intrebare: "Chiar pot începe fără să plătesc nimic?",
    raspuns:
      "Da, fără cont și fără card. Sunt gratuite: toate cele 6 module Kids Junior și lecțiile „Python pentru copii”, toate cele 5 module de gimnaziu (clasele VII–VIII), primele 3 module din clasa a IX-a și modulul 1 din cursul practic. Pagina Prețuri explică exact ce înseamnă „gratuit”, „acces deschis” și „necesită abonament”.",
  },
  {
    intrebare: "Trebuie să instalez Python pe laptop?",
    raspuns:
      "Nu. Codul se scrie și rulează direct în pagină, în browser. Prima rulare descarcă interpretorul Python (aprox. 15 MB), apoi merge imediat.",
  },
  {
    intrebare: "Se potrivește cu ce facem la școală?",
    raspuns:
      "Lecțiile de gimnaziu și liceu sunt organizate pe clase și au fost structurate după programele școlare de Informatică. Pentru detalii despre documentele folosite ca reper, vezi pagina Curriculum. Ordinea temelor de la clasă poate diferi de la profesor la profesor.",
  },
  {
    intrebare: "Mă ajută la Bacalaureat?",
    raspuns:
      "Lecțiile exersează algoritmii și structurile de date studiate la liceu, utile și pentru evaluările de la clasă. Nu sunt un curs oficial de pregătire pentru Bacalaureat. Calendarul și programa examenului se stabilesc prin ordine ale Ministerului Educației; verifică întotdeauna documentele oficiale pentru generația ta.",
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
    const valide: readonly string[] = TOATE_CLASELE;
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

  const articoleRecente = (await getToateArticolele()).slice(0, 3);

  return (
    <div className="text-[#172033] min-h-screen relative overflow-hidden font-sans">
      <FaqJsonLd intrebari={FAQ} />
      <div className="animate-floatSubtle pointer-events-none absolute -top-40 left-1/2 -translate-x-1/2 h-[500px] w-[900px] max-w-full rounded-full bg-gradient-to-tr from-amber-200/30 via-amber-100/40 to-yellow-100/30 blur-[130px]" />

      {/* HERO */}
      <section className="relative mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8 lg:py-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          <div className="enter-slide-up lg:col-span-6 space-y-6">
            <span className="eyebrow">Învață prin practică</span>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight text-[#1E2430] leading-[1.05] [font-family:var(--font-fraunces)]">
              Învață Python pas cu pas.{" "}
              <span className="text-amber-700">Scrie cod și vezi imediat rezultatul.</span>
            </h1>

            <p className="text-base sm:text-lg text-[#3B4252] font-medium leading-relaxed">
              Explicații în română, exerciții ghidate și practică direct în browser.
            </p>

            <div className="flex flex-wrap items-center gap-3 pt-2">
              <Link
                href="/start"
                data-eveniment="cta_incepe_gratuit"
                data-ev-loc="hero"
                className="primary-action px-7 py-3.5 text-base"
              >
                Începe gratuit
              </Link>
              <Link
                href="#trasee"
                className="secondary-action px-7 py-3.5 text-base"
              >
                Vezi cursurile
              </Link>
            </div>
            <p className="text-sm text-[#525B6C]">
              Fără cont și fără card pentru lecțiile gratuite. Fără instalare.
            </p>
          </div>

          <div className="enter-slide-up enter-delay-1 lg:col-span-6 shadow-depth-lg rounded-2xl min-w-0">
            <HeroCodeRunner />
          </div>
        </div>
      </section>

      {/* TRASEE */}
      <section id="trasee" className="mx-auto max-w-7xl scroll-mt-24 px-4 py-14 sm:px-6 lg:px-8 border-t border-[#EBE7DF]">
        <div className="max-w-2xl mb-8">
          <h2 className="text-3xl sm:text-4xl font-black text-[#1E2430] [font-family:var(--font-fraunces)]">
            Alege traseul potrivit
          </h2>
          <p className="mt-3 text-sm sm:text-base text-[#525B6C] font-medium">
            Patru trasee separate, pentru vârste și scopuri diferite. Butonul galben deschide direct prima activitate.
          </p>
        </div>
        <CarduriTrasee nivelTitlu="h3" />
      </section>

      {/* CUM ARATĂ O LECȚIE */}
      <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8 border-t border-[#EBE7DF]">
        <div className="grid gap-8 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <h2 className="text-2xl sm:text-3xl font-black text-[#1E2430] [font-family:var(--font-fraunces)]">
              Cum arată o lecție
            </h2>
            <p className="mt-3 text-sm sm:text-base text-[#525B6C]">
              Fiecare modul are aceiași 6 pași. Explicația vine întâi, apoi exersezi, iar la final verifici ce ai înțeles.
            </p>
            <ul className="mt-5 space-y-2 text-sm text-[#3B4252]">
              <li><strong>Curriculum</strong> — harta materiei, pe clase și module.</li>
              <li><strong>Lecție</strong> — un modul parcurs în cei 6 pași de alături.</li>
              <li><strong>Exerciții</strong> — practică suplimentară pe fiecare modul.</li>
              <li><strong>Laborator</strong> — editor liber, pentru experimente fără cerință.</li>
            </ul>
          </div>
          <ol className="lg:col-span-7 border-t border-black/10">
            {structura.sablon_sublectii.map((pas, i) => (
              <li key={pas.titlu} className="grid grid-cols-[3.5rem_1fr] border-b border-black/10 py-4">
                <span className="font-mono text-xs font-black text-[#B96D08]">0{i + 1}</span>
                <div><p className="font-bold text-[#172033] text-sm">{pas.titlu}</p>
                <p className="mt-1 text-sm text-[#5F6673]">{pas.descriere}</p></div>
              </li>
            ))}
          </ol>
        </div>

        {/* Exemplu demonstrativ de progres — marcat explicit ca atare */}
        <div className="mt-8 max-w-md rounded-2xl border border-dashed border-[#D9D3C7] bg-white p-4 text-[#1E2430]">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-extrabold text-[#525B6C] uppercase tracking-wider">
              Progresul tău, într-un cont
            </span>
            <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-bold uppercase text-slate-700">
              Exemplu demonstrativ
            </span>
          </div>
          <div className="grid grid-cols-3 gap-2 text-center" aria-hidden="true">
            <div className="rounded-xl bg-amber-50 border border-amber-200 p-2">
              <span className="text-lg">🏆</span>
              <p className="text-[11px] text-amber-900 font-bold mt-1">XP</p>
            </div>
            <div className="rounded-xl bg-orange-50 border border-orange-200 p-2">
              <span className="text-lg">🔥</span>
              <p className="text-[11px] text-orange-900 font-bold mt-1">Zile la rând</p>
            </div>
            <div className="rounded-xl bg-indigo-50 border border-indigo-200 p-2">
              <span className="text-lg">⭐</span>
              <p className="text-[11px] text-indigo-900 font-bold mt-1">Insigne</p>
            </div>
          </div>
          <p className="mt-3 text-xs text-[#525B6C]">
            Cu un cont gratuit primești XP pentru predicțiile corecte și testele de final, serii de zile și insigne.
          </p>
        </div>
      </section>

      {/* OAMENII DIN SPATELE PARCURSULUI DE ÎNVĂȚARE */}
      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8 border-t border-[#EBE7DF]">
        <ScrollReveal className="mb-10 max-w-3xl">
          <span className="eyebrow">O academie pentru fiecare etapă</span>
          <h2 className="mt-3 text-3xl font-black leading-tight text-[#1E2430] sm:text-4xl [font-family:var(--font-fraunces)] text-balance">
            De la prima linie de cod la examen și mai departe
          </h2>
          <p className="mt-4 max-w-2xl text-base font-medium leading-relaxed text-[#525B6C]">
            Fiecare traseu pornește de la nivelul real al elevului și explică ideile prin practică,
            exemple și feedback imediat.
          </p>
        </ScrollReveal>

        <div className="grid gap-5 lg:grid-cols-12 lg:grid-rows-2">
          <ScrollReveal className="lg:col-span-7 lg:row-span-2" index={0}>
            <Link
              href="/curriculum"
              className="group relative block min-h-[30rem] overflow-hidden rounded-[2rem] bg-[#1E2430] shadow-depth-lg sm:min-h-[38rem]"
            >
              <Image
                src="/images/people/elev-python-acasa.png"
                alt="Elev de liceu care învață Python la laptop, într-un spațiu de studiu luminos"
                fill
                sizes="(min-width: 1024px) 58vw, 100vw"
                className="object-cover object-[62%_center] transition duration-700 ease-out group-hover:scale-[1.025]"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#171B24]/95 via-[#171B24]/20 to-transparent" />
              <div className="absolute inset-x-0 bottom-0 p-6 text-white sm:p-9">
                <span className="text-xs font-bold uppercase tracking-[0.18em] text-amber-300">Gimnaziu & liceu</span>
                <h3 className="mt-2 max-w-xl text-2xl font-black leading-tight sm:text-3xl [font-family:var(--font-fraunces)]">
                  Înveți în ritmul tău, direct în browser
                </h3>
                <p className="mt-3 max-w-lg text-sm leading-relaxed text-white/80 sm:text-base">
                  Lecții clare, editor Python integrat și exerciții care îți arată imediat unde poți îmbunătăți soluția.
                </p>
                <span className="mt-5 inline-flex items-center gap-2 text-sm font-extrabold text-amber-300">
                  Vezi curriculumul <span aria-hidden="true">→</span>
                </span>
              </div>
            </Link>
          </ScrollReveal>

          <ScrollReveal className="lg:col-span-5" index={1}>
            <Link
              href="/profesori"
              className="group relative block min-h-[22rem] overflow-hidden rounded-[2rem] bg-[#1E2430] shadow-depth-md lg:min-h-full"
            >
              <Image
                src="/images/people/profesoara-informatica.png"
                alt="Profesoară de informatică într-o sală de clasă, lângă laptop"
                fill
                sizes="(min-width: 1024px) 42vw, 100vw"
                className="object-cover object-[center_30%] transition duration-700 ease-out group-hover:scale-[1.025]"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-[#171B24]/90 via-[#171B24]/45 to-transparent" />
              <div className="absolute inset-y-0 left-0 flex max-w-[68%] flex-col justify-end p-6 text-white sm:p-8">
                <span className="text-xs font-bold uppercase tracking-[0.18em] text-amber-300">Pentru profesori</span>
                <h3 className="mt-2 text-2xl font-black leading-tight [font-family:var(--font-fraunces)]">
                  Materiale gata de folosit la clasă
                </h3>
                <span className="mt-4 text-sm font-extrabold text-amber-300">Descoperă resursele →</span>
              </div>
            </Link>
          </ScrollReveal>

          <ScrollReveal className="lg:col-span-5" index={2}>
            <Link
              href="/kids"
              className="group relative block min-h-[22rem] overflow-hidden rounded-[2rem] bg-[#1E2430] shadow-depth-md lg:min-h-full"
            >
              <Image
                src="/images/people/copil-coding.png"
                alt="Copil care descoperă programarea prin exerciții vizuale pe laptop"
                fill
                sizes="(min-width: 1024px) 42vw, 100vw"
                className="object-cover object-center transition duration-700 ease-out group-hover:scale-[1.025]"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-[#171B24]/90 via-[#171B24]/35 to-transparent" />
              <div className="absolute inset-y-0 left-0 flex max-w-[66%] flex-col justify-end p-6 text-white sm:p-8">
                <span className="text-xs font-bold uppercase tracking-[0.18em] text-amber-300">Academia Kids</span>
                <h3 className="mt-2 text-2xl font-black leading-tight [font-family:var(--font-fraunces)]">
                  Programarea începe prin joacă
                </h3>
                <span className="mt-4 text-sm font-extrabold text-amber-300">Descoperă Kids →</span>
              </div>
            </Link>
          </ScrollReveal>
        </div>
      </section>

      {/* ASISTENT AI (demo) — secundar, după trasee */}
      <section className="mx-auto max-w-7xl px-4 pb-6 sm:px-6 lg:px-8">
        <div className="max-w-md">
          <AiAssistantWidget />
        </div>
      </section>

      {/* ULTIMELE DIN BLOG */}
      {articoleRecente.length > 0 && (
        <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 border-t border-[#EBE7DF]">
          <ScrollReveal className="flex items-end justify-between gap-4 mb-8">
            <div>
              <span className="eyebrow mb-3">Din jurnal</span>
              <h2 className="text-2xl sm:text-3xl font-black text-[#1E2430] [font-family:var(--font-fraunces)]">
                Ultimele din blog
              </h2>
            </div>
            <Link
              href="/blog"
              className="hidden sm:inline-block text-sm font-bold text-brand hover:text-brand-dark whitespace-nowrap"
            >
              Vezi tot blogul →
            </Link>
          </ScrollReveal>

          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {articoleRecente.map((a, i) => (
              <ScrollReveal key={a.slug} index={i}>
                <Link
                  href={`/blog/${a.slug}`}
                  className="hover-glow-brand block h-full rounded-3xl border border-[#EBE7DF] bg-white p-6 shadow-depth-sm transition-all"
                >
                  <h3 className="text-base font-black text-[#1E2430] leading-snug">{a.titlu}</h3>
                  <p className="mt-2 text-xs text-[#525B6C] leading-relaxed line-clamp-3">{a.descriere}</p>
                </Link>
              </ScrollReveal>
            ))}
          </div>

          <Link
            href="/blog"
            className="mt-6 inline-block sm:hidden text-sm font-bold text-brand hover:text-brand-dark"
          >
            Vezi tot blogul →
          </Link>
        </section>
      )}

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
