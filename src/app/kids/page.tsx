import Image from "next/image";
import Link from "next/link";
import { getUtilizatorCurent } from "@/lib/subscription";
import { getProgresKids } from "@/lib/progres";
import { capitole } from "@/lib/curriculum";
import { metadatePagina } from "@/lib/seo";

export const metadata = metadatePagina({
  titlu: "Kids — pentru clasele I–IV",
  descriere: "Învață programare vizuală și bazele Python prin jocuri de logică și labirinturi interactive.",
  cale: "/kids",
});

const IMAGINI_VARSTE: Record<string, { src: string; alt: string; eticheta: string }> = {
  P7: {
    src: "/images/kids/copil-directii.png",
    alt: "Fetiță care învață direcțiile cu ajutorul unor cartonașe colorate",
    eticheta: "Primii pași",
  },
  P8: {
    src: "/images/kids/copil-labirint-robot.png",
    alt: "Băiat care ghidează un robot educațional printr-un labirint din lemn",
    eticheta: "Logică prin joacă",
  },
  P9: {
    src: "/images/people/copil-coding.png",
    alt: "Copil care descoperă programarea pe laptop într-un spațiu luminos",
    eticheta: "Idei în mișcare",
  },
  P10: {
    src: "/images/kids/copil-python-biblioteca.png",
    alt: "Elevă care lucrează la o lecție de Python într-o bibliotecă",
    eticheta: "Cod adevărat",
  },
  P11: {
    src: "/images/kids/copil-proiect-python.png",
    alt: "Elev care prezintă un proiect Python realizat pe laptop",
    eticheta: "Proiectul tău",
  },
};

const NIVELE = [
  {
    id: 1,
    titlu: "Labirintul și direcțiile",
    clasa: "Clasa I–II",
    descriere: "Îl ghidezi pe Pippy printre obstacole și descoperi cum se construiește o secvență de pași.",
    imagine: "/images/kids/copil-directii.png",
    alt: "Copil care lucrează cu săgeți de direcție",
  },
  {
    id: 2,
    titlu: "Puterea repetiției",
    clasa: "Clasa a III-a",
    descriere: "Scurtezi drumul cu repetiții și înveți de ce programatorii folosesc bucle.",
    imagine: "/images/kids/copil-labirint-robot.png",
    alt: "Copil care rezolvă un labirint cu un robot educațional",
  },
  {
    id: 3,
    titlu: "Primul cod adevărat",
    clasa: "Clasa a IV-a",
    descriere: "Transformi pașii din joc în instrucțiuni Python și vezi imediat ce face programul tău.",
    imagine: "/images/kids/copil-proiect-python.png",
    alt: "Copil care prezintă un proiect realizat în Python",
  },
];

export default async function KidsPage() {
  const { user } = await getUtilizatorCurent();
  const progres = user ? await getProgresKids(user.id) : {};
  const capitoleKids = capitole.filter((c) => c.clasa.startsWith("P"));

  return (
    <div className="min-h-screen bg-[#FDFBF7] text-[#1E2430]">
      <section className="mx-auto max-w-7xl px-4 pt-6 sm:px-6 lg:px-8 lg:pt-10">
        <div className="relative min-h-[38rem] overflow-hidden rounded-[2rem] bg-[#DCEAF0] shadow-depth-lg sm:min-h-[42rem]">
          <Image
            src="/images/kids/hero-pippy-copii.png"
            alt="Doi copii care descoperă algoritmii alături de Pippy, mascota Academia Python Kids"
            fill
            priority
            sizes="(min-width: 1280px) 80rem, 100vw"
            className="object-cover object-[64%_center]"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#FCF7EC] via-[#FCF7EC]/88 to-transparent" />
          <div className="relative flex min-h-[38rem] max-w-2xl flex-col justify-center p-7 sm:min-h-[42rem] sm:p-12 lg:p-16">
            <span className="w-fit rounded-full border border-amber-300 bg-amber-100/90 px-4 py-1.5 text-xs font-extrabold uppercase tracking-[0.16em] text-amber-900">
              Academia Python Kids · Clasele I–IV
            </span>
            <h1 className="mt-5 max-w-xl text-4xl font-black leading-[0.98] tracking-tight sm:text-6xl [font-family:var(--font-fraunces)] text-balance">
              Salut! Eu sunt <span className="text-amber-600">Pippy</span>!
            </h1>
            <p className="mt-5 max-w-lg text-base font-semibold leading-relaxed text-[#4D5666] sm:text-lg">
              Bine ai venit la <strong className="text-[#1E2430]">Academia Python Kids</strong>! Împreună vom
              explora lumea algoritmilor prin jocuri distractive și lecții adaptate vârstei tale.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                href="/kids/junior"
                className="rounded-xl bg-[#1E2430] px-6 py-3.5 text-sm font-black text-white transition hover:-translate-y-0.5 hover:bg-[#2B3342] active:translate-y-0"
              >
                Hai să începem aventura
              </Link>
              <a
                href="#trasee"
                className="rounded-xl border border-[#1E2430]/20 bg-white/75 px-6 py-3.5 text-sm font-black text-[#1E2430] backdrop-blur-sm transition hover:bg-white"
              >
                Vezi traseele
              </a>
            </div>
          </div>
        </div>
      </section>

      <section id="trasee" className="mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-8">
        <div className="mb-12 max-w-3xl">
          <span className="text-xs font-extrabold uppercase tracking-[0.2em] text-amber-800">Crește odată cu ei</span>
          <h2 className="mt-3 text-3xl font-black leading-tight sm:text-5xl [font-family:var(--font-fraunces)] text-balance">
            Un traseu vizual pentru fiecare vârstă
          </h2>
          <p className="mt-4 max-w-2xl text-base font-medium leading-relaxed text-[#596170]">
            Fiecare etapă pornește de la o situație ușor de înțeles și ajunge treptat la Python adevărat.
          </p>
        </div>

        <div className="space-y-16">
          {capitoleKids.map((cap, index) => {
            const vizual = IMAGINI_VARSTE[cap.clasa] ?? IMAGINI_VARSTE.P9;
            const inversat = index % 2 === 1;

            return (
              <article key={cap.clasa} className="grid items-center gap-8 lg:grid-cols-12 lg:gap-14">
                <div className={`relative min-h-[22rem] overflow-hidden rounded-[2rem] shadow-depth-md sm:min-h-[28rem] lg:col-span-6 ${inversat ? "lg:order-2" : ""}`}>
                  <Image
                    src={vizual.src}
                    alt={vizual.alt}
                    fill
                    sizes="(min-width: 1024px) 50vw, 100vw"
                    className="object-cover transition duration-700 hover:scale-[1.02]"
                  />
                  <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-[#171B24]/80 to-transparent p-6 pt-20 text-white">
                    <span className="text-xs font-extrabold uppercase tracking-[0.18em] text-amber-300">{vizual.eticheta}</span>
                  </div>
                </div>

                <div className={`lg:col-span-6 ${inversat ? "lg:order-1" : ""}`}>
                  <p className="text-sm font-extrabold text-amber-700">
                    {cap.clasa} · {(cap as { virsta?: string }).virsta ?? "7–11 ani"}
                  </p>
                  <h3 className="mt-2 text-3xl font-black leading-tight [font-family:var(--font-fraunces)]">{cap.titlu}</h3>
                  <p className="mt-3 text-sm font-semibold text-[#687080]">
                    {cap.module.length} module · {cap.module.length * 6} lecții practice
                  </p>
                  <div className="mt-7 border-t border-[#DDD7CA]">
                    {cap.module.map((modul, modulIndex) => (
                      <Link
                        key={modul.cod}
                        href={`/curriculum/${cap.clasa}/${modul.slug}`}
                        className="group flex items-center justify-between gap-5 border-b border-[#DDD7CA] py-4 text-left transition hover:pl-2"
                      >
                        <span className="flex items-baseline gap-3">
                          <span className="font-mono text-xs font-bold text-amber-700">{String(modulIndex + 1).padStart(2, "0")}</span>
                          <span className="font-extrabold text-[#283142]">{modul.titlu}</span>
                        </span>
                        <span className="text-lg text-amber-700 transition group-hover:translate-x-1" aria-hidden="true">→</span>
                      </Link>
                    ))}
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </section>

      <section className="bg-[#EEE9DD] py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-10 max-w-2xl">
            <span className="text-xs font-extrabold uppercase tracking-[0.2em] text-amber-800">Jocuri interactive</span>
            <h2 className="mt-3 text-3xl font-black sm:text-5xl [font-family:var(--font-fraunces)] text-balance">
              Învață făcând, nu memorând
            </h2>
          </div>

          <div className="grid gap-5 lg:grid-cols-3">
            {NIVELE.map((nivel) => {
              const completat = progres[`kids-nivel-${nivel.id}`];
              const stele = completat?.stars ?? 0;

              return (
                <article key={nivel.id} className="group overflow-hidden rounded-[1.75rem] bg-white shadow-depth-sm">
                  <div className="relative aspect-[4/3] overflow-hidden">
                    <Image
                      src={nivel.imagine}
                      alt={nivel.alt}
                      fill
                      sizes="(min-width: 1024px) 33vw, 100vw"
                      className="object-cover transition duration-700 group-hover:scale-[1.03]"
                    />
                  </div>
                  <div className="p-6">
                    <div className="flex items-center justify-between gap-3">
                      <span className="text-xs font-extrabold uppercase tracking-[0.16em] text-amber-700">{nivel.clasa}</span>
                      <span className="text-sm tracking-wide" aria-label={`Scor: ${stele} stele`}>
                        {[1, 2, 3].map((stea) => (
                          <span key={stea} className={stea <= stele ? "text-amber-500" : "text-[#D5D0C6]"}>★</span>
                        ))}
                      </span>
                    </div>
                    <h3 className="mt-3 text-2xl font-black leading-tight [font-family:var(--font-fraunces)]">{nivel.titlu}</h3>
                    <p className="mt-3 min-h-16 text-sm font-medium leading-relaxed text-[#626A78]">{nivel.descriere}</p>
                    <Link
                      href={`/kids/aventura/${nivel.id}`}
                      className="mt-6 inline-flex items-center gap-2 text-sm font-black text-[#1E2430] transition hover:text-amber-700"
                    >
                      {stele > 0 ? "Joacă din nou" : "Începe jocul"} <span aria-hidden="true">→</span>
                    </Link>
                  </div>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-5xl px-4 py-20 text-center sm:px-6">
        <p className="text-xs font-extrabold uppercase tracking-[0.18em] text-amber-700">Și departe de ecran</p>
        <h2 className="mt-3 text-3xl font-black [font-family:var(--font-fraunces)]">Labirinturi și jocuri pe hârtie, gata de printat</h2>
        <p className="mx-auto mt-4 max-w-2xl text-sm font-medium leading-relaxed text-[#626A78]">
          Fișe A4 gratuite pentru exersarea pașilor, secvențelor și logicii cu creionul în mână.
        </p>
        <Link
          href="/kids/fise-print"
          className="mt-7 inline-flex rounded-xl bg-amber-400 px-6 py-3.5 text-sm font-black text-[#1E2430] transition hover:bg-amber-500 active:scale-95"
        >
          Descarcă fișele printabile
        </Link>
      </section>
    </div>
  );
}
