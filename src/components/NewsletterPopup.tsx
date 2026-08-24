"use client";

import { useState, useEffect, useTransition } from "react";
import { aboneazaNewsletter } from "@/app/actions/newsletter";

const STORAGE_KEY = "newsletter_popup_dismissed";

export default function NewsletterPopup() {
  const [vizibil, setVizibil] = useState(false);
  const [email, setEmail] = useState("");
  const [inLucru, startTransition] = useTransition();
  const [succes, setSucces] = useState(false);
  const [eroare, setEroare] = useState<string | null>(null);

  useEffect(() => {
    // Afișăm popup-ul doar dacă utilizatorul nu l-a închis anterior
    const deja = localStorage.getItem(STORAGE_KEY);
    if (!deja) {
      const timer = setTimeout(() => setVizibil(true), 5000); // apare după 5s
      return () => clearTimeout(timer);
    }
  }, []);

  function inchide() {
    localStorage.setItem(STORAGE_KEY, "1");
    setVizibil(false);
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setEroare(null);

    if (!email) {
      setEroare("Te rugăm să introduci o adresă de email validă.");
      return;
    }

    startTransition(async () => {
      const res = await aboneazaNewsletter(email);
      if (res.ok) {
        setSucces(true);
        // Închidem automat popup-ul după 3s de la succes
        setTimeout(() => inchide(), 3000);
      } else {
        setEroare(res.eroare ?? "A apărut o eroare. Încearcă din nou.");
      }
    });
  }

  if (!vizibil) return null;

  return (
    <>
      {/* Overlay semi-transparent */}
      <div
        className="fixed inset-0 z-[998] bg-black/40 backdrop-blur-sm"
        onClick={inchide}
        aria-hidden="true"
      />

      {/* Fereastra popup */}
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="newsletter-popup-title"
        className="fixed bottom-4 left-1/2 z-[999] w-[calc(100%-2rem)] max-w-md -translate-x-1/2 rounded-2xl border border-brand/20 bg-white p-6 shadow-2xl sm:bottom-8"
      >
        {/* Buton de închidere */}
        <button
          onClick={inchide}
          aria-label="Închide"
          className="absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-full text-foreground/40 transition hover:bg-black/5 hover:text-foreground/70"
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="h-5 w-5">
            <path d="M6.28 5.22a.75.75 0 0 0-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 1 0 1.06 1.06L10 11.06l3.72 3.72a.75.75 0 1 0 1.06-1.06L11.06 10l3.72-3.72a.75.75 0 0 0-1.06-1.06L10 8.94 6.28 5.22Z" />
          </svg>
        </button>

        {succes ? (
          <div className="flex flex-col items-center gap-3 py-4 text-center">
            <span className="text-5xl">🎉</span>
            <h3 className="text-lg font-bold text-foreground">Mulțumim!</h3>
            <p className="text-sm text-foreground/70">
              Te-ai abonat cu succes! Vei primi noutăți și coduri promoționale direct pe email.
            </p>
          </div>
        ) : (
          <>
            {/* Header popup */}
            <div className="flex items-start gap-3">
              <span className="text-4xl" aria-hidden="true">🎁</span>
              <div>
                <h3
                  id="newsletter-popup-title"
                  className="text-base font-bold leading-tight text-foreground"
                >
                  Coduri promoționale &amp; noutăți exclusive
                </h3>
                <p className="mt-1 text-sm leading-relaxed text-foreground/65">
                  Abonează-te și fii primul care află despre module noi și reduceri speciale la Academia Python!
                </p>
              </div>
            </div>

            {/* Beneficii */}
            <ul className="mt-4 space-y-1.5 text-sm text-foreground/70">
              <li className="flex items-center gap-2"><span className="text-brand">✓</span> Primești cod de reducere la abonament</li>
              <li className="flex items-center gap-2"><span className="text-brand">✓</span> Fii primul anunțat la module noi</li>
              <li className="flex items-center gap-2"><span className="text-brand">✓</span> Sfaturi utile pentru bacalaureatul la Informatică</li>
            </ul>

            {/* Formular */}
            <form onSubmit={handleSubmit} className="mt-4 flex flex-col gap-2.5">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Adresa ta de email"
                disabled={inLucru}
                className="w-full rounded-xl border border-black/10 bg-gray-50 px-4 py-3 text-sm text-foreground placeholder:text-muted/50 focus:border-brand focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand/10 disabled:opacity-60"
              />
              <button
                type="submit"
                disabled={inLucru}
                className="w-full rounded-xl bg-brand px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-brand-dark disabled:cursor-not-allowed disabled:opacity-50"
              >
                {inLucru ? "Se abonează..." : "Abonează-mă gratuit →"}
              </button>
            </form>

            {eroare && (
              <p className="mt-2 text-xs font-semibold text-red-600" role="alert">
                ❌ {eroare}
              </p>
            )}

            <p className="mt-3 text-center text-xs text-foreground/40">
              Niciun spam. Poți anula oricând.
            </p>
          </>
        )}
      </div>
    </>
  );
}
