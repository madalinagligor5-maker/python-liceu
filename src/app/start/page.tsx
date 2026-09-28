import type { Metadata } from "next";
import Link from "next/link";
import CarduriTrasee from "@/components/CarduriTrasee";

export const metadata: Metadata = {
  title: "Începe gratuit — alege traseul",
  description:
    "Alege traseul potrivit — Kids, gimnaziu, liceu sau curs practic — și începe direct prima lecție gratuită de Python, în browser.",
  alternates: { canonical: "/start" },
};

export default function StartPage() {
  return (
    <div className="bg-[#FDFBF7] text-[#1E2430]">
      <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6 sm:py-14">
        <h1 className="text-3xl font-black sm:text-4xl [font-family:var(--font-fraunces)]">
          Cu ce traseu începi?
        </h1>
        <p className="mt-3 max-w-2xl text-base text-[#525B6C]">
          Alege traseul care ți se potrivește. Butonul galben te duce direct la prima activitate —
          nu ai nevoie de cont și nici de card.
        </p>

        <div className="mt-8">
          <CarduriTrasee />
        </div>

        <section className="mt-10 rounded-2xl border border-[#EBE7DF] bg-white p-5 text-sm text-[#3B4252]">
          <h2 className="text-base font-black text-[#1E2430]">Bine de știut înainte să începi</h2>
          <ul className="mt-2 list-disc space-y-1.5 pl-5">
            <li>Codul rulează direct în browser. Prima rulare încarcă interpretorul Python (aprox. 15 MB), apoi merge imediat.</li>
            <li>
              Fără cont, exercițiile rezolvate se rețin doar în acest browser (se pierd dacă ștergi datele
              site-ului sau schimbi dispozitivul). Cu un cont gratuit, rezultatele la „Citește și prezice”
              și la testul de final se salvează în cont.
            </li>
            <li>
              Nu ești sigur de nivel? La liceu, dacă n-ai mai scris cod, începe cu{" "}
              <Link href="/curriculum/VII/primii-pasi-in-python/VII.1.1" className="font-bold underline decoration-amber-400 underline-offset-4">
                primul modul de gimnaziu
              </Link>{" "}
              — e gratuit și scurt.
            </li>
          </ul>
        </section>
      </div>
    </div>
  );
}
