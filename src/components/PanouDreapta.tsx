"use client";

import { useState } from "react";
import Link from "next/link";
import { valideazaProvocareZilnica } from "@/app/actions/gamification";

const ZILE = ["L", "M", "M", "J", "V", "S", "D"] as const;

/**
 * Streak cu indicator pe zilele săptămânii. Zilele aprinse se derivă din
 * streak-ul real și din ziua curentă — nu sunt hardcodate.
 */
export function CardStreakSaptamana({ zile }: { zile: number }) {
  const azi = new Date();
  const indexAzi = (azi.getDay() + 6) % 7;
  const aprinse = new Set<number>();
  for (let i = 0; i < Math.min(zile, indexAzi + 1); i++) {
    aprinse.add(indexAzi - i);
  }

  return (
    <div className="rounded-2xl border border-border bg-white p-5 shadow-sm">
      <h3 className="text-sm font-bold text-foreground">
        <span aria-hidden="true">🔥</span> Streak de Învățare
      </h3>
      <p className="mt-1 text-lg font-bold text-foreground">
        {zile > 0 ? `${zile} ${zile === 1 ? "zi" : "zile"} la rând!` : "Niciun streak activ"}
      </p>
      <p className="text-xs text-muted">
        {zile > 0 ? "Menține seria activă rezolvând o lecție zilnic!" : "O lecție pe zi pornește seria."}
      </p>

      <div className="mt-3 grid grid-cols-7 gap-1 text-center">
        {ZILE.map((z, i) => (
          <span key={`${z}-${i}`} className="text-[11px] font-semibold text-muted">
            {z}
          </span>
        ))}
        {ZILE.map((z, i) => (
          <span
            key={`stare-${i}`}
            className="text-sm"
            title={aprinse.has(i) ? "activitate" : "fără activitate"}
          >
            {aprinse.has(i) ? "🔥" : "⚪"}
            <span className="sr-only">
              {z}: {aprinse.has(i) ? "activitate" : "fără activitate"}
            </span>
          </span>
        ))}
      </div>
    </div>
  );
}

export function CardCitat() {
  return (
    <blockquote className="rounded-xl border-l-4 border-accent bg-surface p-4 text-sm italic text-muted">
      „Programarea este arta de a transforma cafeaua în cod. ☕💻”
    </blockquote>
  );
}

export type RandClasament = {
  nume: string;
  xp: number;
  esteUtilizatorul: boolean;
};

/**
 * Clasament. Când nu există date reale (feature-ul de clasament public nu e
 * activat), afișăm doar poziția utilizatorului, ca să nu inventăm concurenți.
 */
export function CardClasament({ randuri }: { randuri: RandClasament[] }) {
  return (
    <div className="rounded-2xl border border-border bg-white p-5 shadow-sm">
      <h3 className="text-sm font-bold text-foreground">
        <span aria-hidden="true">🏆</span> Clasament (Leaderboard)
      </h3>

      {randuri.length ? (
        <ol className="mt-3 space-y-2">
          {randuri.map((r, i) => (
            <li
              key={`${r.nume}-${i}`}
              className={`flex items-center justify-between rounded-lg px-2.5 py-1.5 text-sm ${
                r.esteUtilizatorul ? "bg-brand-light font-bold text-brand-dark" : "text-foreground/80"
              }`}
            >
              <span className="truncate">
                {i + 1}. {r.nume}
                {r.esteUtilizatorul && " (tu)"}
              </span>
              <span className="font-extrabold text-xs bg-brand/10 text-brand px-2 py-0.5 rounded-full shrink-0">
                {r.xp.toLocaleString("ro-RO")} XP
              </span>
            </li>
          ))}
        </ol>
      ) : (
        <p className="mt-2 text-xs text-muted">
          Clasamentul între elevi nu este activat.
        </p>
      )}
    </div>
  );
}

export function CardProvocareZilei({
  intrebare,
  variante,
  corect,
  xp,
  deblocata,
  dejaRezolvata,
}: {
  intrebare: string;
  variante: string[];
  corect: number;
  xp: number;
  deblocata: boolean;
  dejaRezolvata: boolean;
}) {
  const [selectat, setSelectat] = useState<number | null>(null);
  const [rezolvata, setRezolvata] = useState(dejaRezolvata);
  const [feedback, setFeedback] = useState<{ ok: boolean; text: string } | null>(
    dejaRezolvata ? { ok: true, text: "Ai răspuns corect deja astăzi! +50 XP în cont 💎" } : null
  );
  const [loading, setLoading] = useState(false);

  const handleAlegeVarianta = async (index: number) => {
    if (rezolvata || loading) return;
    setSelectat(index);
    
    if (index !== corect) {
      setFeedback({ ok: false, text: "Greșit! Mai încearcă, citește cu atenție enunțul." });
      return;
    }

    setLoading(true);
    try {
      const res = await valideazaProvocareZilnica(index);
      if (res.ok) {
        setRezolvata(true);
        setFeedback({ ok: true, text: res.mesaj });
      } else {
        setFeedback({ ok: false, text: res.mesaj });
      }
    } catch (e) {
      console.error(e);
      setFeedback({ ok: false, text: "A apărut o problemă la comunicarea cu serverul." });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="rounded-2xl border border-border bg-white p-5 shadow-sm">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-bold text-foreground">
          <span aria-hidden="true">🎯</span> Provocarea Zilei
        </h3>
        <span className="rounded-full bg-brand-light px-2 py-0.5 text-[10px] font-bold text-brand-dark">
          {xp} XP 💎
        </span>
      </div>

      <p className="mt-3 text-sm font-semibold text-foreground/90 leading-relaxed">
        {intrebare}
      </p>

      {deblocata ? (
        <div className="mt-4 space-y-2">
          {variante.map((varText, idx) => {
            let btnClass = "w-full text-left rounded-xl border border-black/10 px-4 py-2.5 text-xs font-medium bg-white hover:bg-slate-50 transition cursor-pointer";
            if (selectat === idx) {
              if (idx === corect) {
                btnClass = "w-full text-left rounded-xl border border-success/40 bg-success/15 px-4 py-2.5 text-xs font-bold text-success-dark transition";
              } else {
                btnClass = "w-full text-left rounded-xl border-2 border-red-500/40 bg-red-50 px-4 py-2.5 text-xs font-bold text-red-700 transition";
              }
            } else if (rezolvata && idx === corect) {
              // Evidențiem varianta corectă după rezolvare
              btnClass = "w-full text-left rounded-xl border border-success/40 bg-success/10 px-4 py-2.5 text-xs font-bold text-success-dark transition";
            }

            return (
              <button
                key={idx}
                type="button"
                disabled={rezolvata || loading}
                onClick={() => handleAlegeVarianta(idx)}
                className={btnClass}
              >
                {String.fromCharCode(97 + idx)}) {varText}
              </button>
            );
          })}
        </div>
      ) : (
        <p className="mt-4 rounded-xl bg-surface px-4 py-3 text-center text-xs text-muted leading-relaxed italic border border-black/5">
          Termină cel puțin o lecție din platformă pentru a debloca quiz-urile zilnice de antrenament.
        </p>
      )}

      {feedback && (
        <div
          className={`mt-4 rounded-xl px-4 py-3 text-xs font-semibold leading-relaxed border ${
            feedback.ok
              ? "bg-success/15 border-success/20 text-success-dark"
              : "bg-red-50 border-red-100 text-red-700"
          }`}
        >
          {feedback.ok ? "🎉 " : "⚠️ "} {feedback.text}
        </div>
      )}
    </div>
  );
}
