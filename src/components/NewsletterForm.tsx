"use client";

import { useState, useTransition } from "react";
import { aboneazaNewsletter } from "@/app/actions/newsletter";

export default function NewsletterForm() {
  const [email, setEmail] = useState("");
  const [inLucru, startTransition] = useTransition();
  const [succes, setSucces] = useState(false);
  const [dejaAbonat, setDejaAbonat] = useState(false);
  const [eroare, setEroare] = useState<string | null>(null);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setEroare(null);
    setSucces(false);
    setDejaAbonat(false);

    if (!email) {
      setEroare("Te rugăm să introduci o adresă de email.");
      return;
    }

    startTransition(async () => {
      const res = await aboneazaNewsletter(email);
      if (res.ok) {
        setSucces(true);
        if (res.dejaAbonat) {
          setDejaAbonat(true);
        }
        setEmail("");
      } else {
        setEroare(res.eroare ?? "A apărut o eroare necunoscută.");
      }
    });
  }

  return (
    <div id="newsletter" className="mx-auto max-w-2xl scroll-mt-24 rounded-3xl border border-[#EBE7DF] bg-white p-6 text-center shadow-sm sm:p-8">
      <h2 className="text-lg font-bold text-foreground sm:text-xl">
        Newsletter: module noi și noutăți
      </h2>
      <p className="mt-2 text-sm text-foreground/75 leading-relaxed">
        Lasă-ți emailul dacă vrei să afli când apar module noi. Ocazional, anunțăm și ofertele în curs. Te poți dezabona oricând.
      </p>

      <form onSubmit={handleSubmit} className="mt-5 flex flex-col gap-2.5 sm:flex-row sm:items-stretch justify-center">
        <label htmlFor="newsletter-email" className="sr-only">
          Adresa de email
        </label>
        <input
          id="newsletter-email"
          type="email"
          autoComplete="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Adresa ta de email (ex: nume@email.com)"
          disabled={inLucru || (succes && !dejaAbonat)}
          className="w-full rounded-xl border border-black/10 bg-white px-4 py-3 text-sm text-foreground placeholder:text-muted/60 focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/10 disabled:opacity-60"
        />
        <button
          type="submit"
          disabled={inLucru || (succes && !dejaAbonat)}
          className="shrink-0 rounded-xl bg-amber-400 hover:bg-amber-500 px-6 py-3 text-sm font-black text-slate-950 shadow-sm transition disabled:cursor-not-allowed disabled:opacity-50"
        >
          {inLucru ? "Se abonează..." : "Abonează-mă"}
        </button>
      </form>

      {eroare && (
        <p className="mt-3 text-xs font-semibold text-red-600" role="alert">
          ❌ {eroare}
        </p>
      )}

      {succes && (
        <div className="mt-4 rounded-xl bg-success/10 border border-success/20 p-3 text-sm text-success font-semibold" role="status">
          {dejaAbonat ? (
            <span>😊 Ești deja înscris la newsletter-ul nostru! Îți vom trimite noutățile pe email.</span>
          ) : (
            <span>🎉 Te-ai abonat cu succes! Îți vom scrie când apar noutăți.</span>
          )}
        </div>
      )}
    </div>
  );
}
