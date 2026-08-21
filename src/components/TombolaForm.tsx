"use client";

import { useState, useTransition } from "react";
import { trimiteReview } from "@/app/actions/review";

const STELE = [1, 2, 3, 4, 5];

export default function TombolaForm() {
  const [stele, setStele] = useState(0);
  const [text, setText] = useState("");
  const [email, setEmail] = useState("");
  const [mesaj, setMesaj] = useState<{ ok: boolean; text: string } | null>(null);
  const [inLucru, startTransition] = useTransition();

  const trimite = () => {
    setMesaj(null);
    startTransition(async () => {
      const r = await trimiteReview(stele, text, email || undefined);
      if (r.ok) {
        setMesaj({
          ok: true,
          text: "Mulțumim! Review-ul tău a intrat la tombolă. Ți-am trimis (dacă ai lăsat email) confirmarea.",
        });
        setStele(0);
        setText("");
        setEmail("");
      } else {
        setMesaj({ ok: false, text: r.eroare ?? "A apărut o eroare." });
      }
    });
  };

  return (
    <div className="mt-8 rounded-2xl border border-brand-border bg-white p-6 shadow-sm">
      <h2 className="text-lg font-bold text-foreground">
        Lasă reviewul tău
      </h2>
      <p className="mt-1 text-sm text-foreground/60">
        Ce ai învățat în cele 7 zile? Cât de clară ți s-a părut explicația?
      </p>

      <div className="mt-4 flex items-center gap-1">
        {STELE.map((s) => (
          <button
            key={s}
            type="button"
            onClick={() => setStele(s)}
            className={`text-3xl transition ${s <= stele ? "text-warning" : "text-black/15"}`}
            aria-label={`${s} stele`}
          >
            ★
          </button>
        ))}
        <span className="ml-2 text-sm text-foreground/50">
          {stele > 0 ? `${stele} / 5` : "alege"}
        </span>
      </div>

      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Scrie câteva cuvinte despre experiența ta..."
        rows={4}
        className="mt-4 w-full rounded-xl border border-black/15 p-3 text-sm text-foreground outline-none focus:border-brand"
      />

      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Email (opțional, pentru confirmare)"
        className="mt-3 w-full rounded-xl border border-black/15 p-3 text-sm text-foreground outline-none focus:border-brand"
      />

      <button
        type="button"
        onClick={trimite}
        disabled={inLucru || stele === 0 || text.trim().length < 10}
        className="mt-4 rounded-lg bg-brand px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-brand-dark disabled:cursor-not-allowed disabled:opacity-40"
      >
        {inLucru ? "Se trimite..." : "Intră la tombolă"}
      </button>

      {mesaj && (
        <p
          className={`mt-3 text-sm font-semibold ${mesaj.ok ? "text-success" : "text-red-600"}`}
        >
          {mesaj.text}
        </p>
      )}
    </div>
  );
}
