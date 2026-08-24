import type { Metadata } from "next";
import Link from "next/link";
import { getUtilizatorCurent } from "@/lib/subscription";
import { getProgresKids } from "@/lib/progres";
import { capitole } from "@/lib/curriculum";

export const metadata: Metadata = {
  title: "Kids — Academia Python pentru clasele I–IV",
  description: "Învață programare vizuală și bazele Python prin jocuri de logică și labirinturi interactive.",
};

const NIVELE = [
  {
    id: 1,
    titlu: "Nivelul 1: Labirintul și Direcțiile",
    clasa: "Clasa I - II",
    descriere: "Ajută-l pe Pippy să ocolească obstacolele și să adune steluțele folosind direcții simple (secvențialitate).",
    emoji: "🧭",
    culoareBg: "bg-emerald-50 border-emerald-200 text-emerald-800 hover:border-emerald-300",
    badgeCuloare: "bg-emerald-100 text-emerald-800"
  },
  {
    id: 2,
    titlu: "Nivelul 2: Puterea Repetiției",
    clasa: "Clasa a III-a",
    descriere: "Învață buclele repetitive! Repetă instrucțiuni de deplasare pentru a ajunge la destinație în mai puțini pași.",
    emoji: "🔁",
    culoareBg: "bg-indigo-50 border-indigo-200 text-indigo-800 hover:border-indigo-300",
    badgeCuloare: "bg-indigo-100 text-indigo-800"
  },
  {
    id: 3,
    titlu: "Nivelul 3: Primul Cod Adevărat",
    clasa: "Clasa a IV-a",
    descriere: "Fă pasul către codul real! Vezi cum se transformă blocurile tale vizuale în instrucțiuni Python adevărate.",
    emoji: "🚀",
    culoareBg: "bg-amber-50 border-amber-200 text-amber-800 hover:border-amber-300",
    badgeCuloare: "bg-amber-100 text-amber-900"
  }
];

export default async function KidsPage() {
  const { user } = await getUtilizatorCurent();
  const progres = user ? await getProgresKids(user.id) : {};

  // Capitolele Kids din structura curriculum (P7, P8, P9, P10, P11)
  const capitoleKids = capitole.filter((c) => c.clasa.startsWith("P"));

  const culoriVarste: Record<string, { bg: string; badge: string; border: string }> = {
    P7: { bg: "bg-emerald-50", badge: "bg-emerald-100 text-emerald-800", border: "border-emerald-200" },
    P8: { bg: "bg-sky-50", badge: "bg-sky-100 text-sky-800", border: "border-sky-200" },
    P9: { bg: "bg-violet-50", badge: "bg-violet-100 text-violet-800", border: "border-violet-200" },
    P10: { bg: "bg-amber-50", badge: "bg-amber-100 text-amber-800", border: "border-amber-200" },
    P11: { bg: "bg-rose-50", badge: "bg-rose-100 text-rose-800", border: "border-rose-200" },
  };

  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4 sm:px-6">
      {/* HERO SECTION */}
      <div className="mx-auto max-w-4xl text-center">
        <div className="inline-flex h-24 w-24 items-center justify-center rounded-full bg-amber-100 text-6xl shadow-md animate-bounce">
          🐍
        </div>
        <h1 className="mt-6 text-4xl font-black tracking-tight text-indigo-900 sm:text-5xl font-sans rounded-3xl">
          Salut! Eu sunt <span className="text-amber-500">Pippy</span>! 🤖
        </h1>
        <p className="mt-4 mx-auto max-w-xl text-base text-slate-600 leading-relaxed font-medium">
          Bine ai venit la <strong>Academia Python Kids</strong>! Împreună vom explora lumea algoritmilor prin jocuri distractive și lecții adaptate vârstei tale.
        </p>

        {/* ACADEMIA PYTHON JUNIOR — banner proeminent */}
        <div className="mt-10 mx-auto max-w-2xl rounded-3xl bg-gradient-to-br from-indigo-500 to-violet-600 p-6 text-white shadow-xl">
          <div className="flex flex-col sm:flex-row items-center gap-4">
            <div className="text-6xl shrink-0">🤖</div>
            <div className="text-left">
              <p className="text-xs font-bold uppercase tracking-widest opacity-80 mb-1">NOU · Clasele I–IV (6–10 ani)</p>
              <h2 className="text-2xl font-black">Academia Python Junior</h2>
              <p className="mt-1 text-sm opacity-90">
                Jocuri interactive, robotul Byte și 6 module de programare prin drag-and-drop — fără tastatură, fără text!
              </p>
            </div>
            <Link
              href="/kids/junior"
              className="shrink-0 rounded-2xl bg-white text-indigo-700 hover:bg-indigo-50 font-black px-6 py-3 text-sm shadow-md transition-all active:scale-95"
            >
              Joacă acum! ▶
            </Link>
          </div>
        </div>


        <div className="mt-14 text-left max-w-3xl mx-auto">
          <h2 className="text-xl font-black text-indigo-950 text-center mb-2">
            📚 Lecțiile tale Python — pe vârste
          </h2>
          <p className="text-center text-sm text-slate-500 mb-8">
            Alege vârsta ta și începe să înveți Python pas cu pas!
          </p>
          <div className="space-y-6">
            {capitoleKids.map((cap) => {
              const culori = culoriVarste[cap.clasa] ?? { bg: "bg-slate-50", badge: "bg-slate-100 text-slate-700", border: "border-slate-200" };
              return (
                <div key={cap.clasa} className={`rounded-2xl border p-5 shadow-sm ${culori.bg} ${culori.border}`}>
                  <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
                    <div>
                      <span className={`inline-block rounded-full px-3 py-0.5 text-xs font-bold mb-1 ${culori.badge}`}>
                        {cap.clasa} · {(cap as { virsta?: string }).virsta ?? "7-11 ani"}
                      </span>
                      <h3 className="font-extrabold text-slate-800 text-lg leading-tight">{cap.titlu}</h3>
                    </div>
                    <span className="text-sm text-slate-500">{cap.module.length} module · {cap.module.length * 6} lecții</span>
                  </div>
                  <div className="grid gap-2 sm:grid-cols-3">
                    {cap.module.map((m) => (
                      <Link
                        key={m.cod}
                        href={`/curriculum/${cap.clasa}/${m.slug}`}
                        className="flex items-center gap-2 rounded-xl bg-white border border-slate-200 hover:border-indigo-300 hover:bg-indigo-50 px-4 py-3 text-xs font-bold text-slate-700 transition shadow-sm"
                      >
                        <span className="text-indigo-500 shrink-0">📖</span>
                        <span className="leading-tight">{m.cod} {m.titlu}</span>
                      </Link>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* MAP DE AVENTURĂ */}
        <div className="mt-16 text-left max-w-2xl mx-auto">
          <h2 className="text-xl font-black text-indigo-950 text-center mb-2">
            🗺️ Jocuri Interactive
          </h2>
          <p className="text-center text-sm text-slate-500 mb-6">
            Exersează logica programării prin labirinturi și puzzle-uri distractive!
          </p>
          <div className="space-y-4">
            {NIVELE.map((niv) => {
              const completat = progres[`kids-nivel-${niv.id}`];
              const stele = completat?.stars ?? 0;

              return (
                <div
                  key={niv.id}
                  className={`rounded-2xl border p-5 shadow-sm transition hover:shadow-md ${niv.culoareBg}`}
                >
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div className="flex items-start gap-4">
                      <span className="text-4xl shrink-0" role="img" aria-hidden="true">
                        {niv.emoji}
                      </span>
                      <div>
                        <div className="flex flex-wrap items-center gap-2">
                          <h3 className="font-extrabold text-slate-800 text-lg leading-tight">
                            {niv.titlu}
                          </h3>
                          <span className={`rounded-full px-2.5 py-0.5 text-xs font-bold ${niv.badgeCuloare}`}>
                            {niv.clasa}
                          </span>
                        </div>
                        <p className="mt-1 text-sm text-slate-600 leading-normal">
                          {niv.descriere}
                        </p>
                      </div>
                    </div>

                    <div className="flex flex-row sm:flex-col items-center sm:items-end justify-between gap-2 shrink-0 border-t sm:border-t-0 border-slate-200/50 pt-3 sm:pt-0">
                      <div className="flex gap-0.5 text-lg" aria-label={`Scor: ${stele} stele`}>
                        {[1, 2, 3].map((s) => (
                          <span key={s} className={s <= stele ? "text-amber-400" : "text-slate-300"}>
                            ★
                          </span>
                        ))}
                      </div>

                      <Link
                        href={`/kids/aventura/${niv.id}`}
                        className="rounded-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-6 text-xs transition shadow-sm"
                      >
                        {stele > 0 ? "Rejoacă 🔁" : "Joacă! ▶"}
                      </Link>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* PRINT SECRETS */}
        <div className="mt-16 bg-white max-w-xl mx-auto rounded-3xl border border-black/5 p-6 text-center shadow-sm">
          <span className="text-4xl" role="img" aria-hidden="true">🖨️</span>
          <h3 className="mt-3 font-bold text-slate-800">Vrei activități pe hârtie?</h3>
          <p className="mt-2 text-sm text-slate-500 leading-relaxed">
            Am pregătit fișe didactice offline cu labirinturi de desenat cu creionul (activități de tip Unplugged Coding). Le poți printa gratis!
          </p>
          <Link
            href="/kids/fise-print"
            className="mt-4 inline-block rounded-xl border-2 border-indigo-600 text-indigo-700 hover:bg-indigo-50 font-bold py-2.5 px-6 text-sm transition"
          >
            Descarcă Fișe Printabile A4
          </Link>
        </div>
      </div>
    </div>
  );
}
