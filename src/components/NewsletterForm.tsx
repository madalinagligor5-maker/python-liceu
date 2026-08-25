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
    <div className="mx-auto max-w-2xl rounded-3xl border border-brand/20 bg-brand-light/40 p-6 text-center shadow-sm sm:p-8">
      <span className="text-4xl" aria-hidden="true">🎁</span>
      <h3 className="mt-3 text-lg font-bold text-foreground sm:text-xl">
        Abonează-te pentru coduri promoționale & noutăți
      </h3>
      <p className="mt-2 text-sm text-foreground/75 leading-relaxed">
        Lasă-ți emailul mai jos pentru a fi primul care află de noile module lansate și primește **coduri promoționale de reducere** direct în inbox!
      </p>

      <form onSubmit={handleSubmit} className="mt-5 flex flex-col gap-2.5 sm:flex-row sm:items-stretch justify-center">
        <input
          type="email"
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
            <span>🎉 Te-ai abonat cu succes! Verifică-ți inbox-ul în curând pentru codul de reducere.</span>
          )}
        </div>
      )}
    </div>
  );
}
