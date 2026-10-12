"use client";

import Link from "next/link";
import Script from "next/script";
import { useEffect, useState } from "react";

const CHEIE = "consimtamant_cookie_v1";
export const EVENIMENT_SETARI_COOKIE = "academia-setari-cookie";

type Alegere = "acceptat" | "refuzat";

function citesteAlegerea(): Alegere | null {
  try {
    const v = window.localStorage.getItem(CHEIE);
    return v === "acceptat" || v === "refuzat" ? v : null;
  } catch {
    return null;
  }
}

/** Șterge cookie-urile Google Analytics (_ga, _ga_XXXX) de pe domeniul curent și cel părinte. */
function stergeCookieAnalytics() {
  const gazda = window.location.hostname;
  const domenii = ["", gazda, `.${gazda.replace(/^www\./, "")}`];
  for (const bucata of document.cookie.split(";")) {
    const nume = bucata.split("=")[0].trim();
    if (!nume.startsWith("_ga")) continue;
    for (const d of domenii) {
      document.cookie = `${nume}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/${d ? `; domain=${d}` : ""}`;
    }
  }
}

/**
 * Bannerul de cookie-uri. Google Analytics se încarcă DOAR după „Accept";
 * fără alegere sau la „Refuz" nu pleacă nicio cerere spre Google.
 * Cookie-urile strict necesare (autentificare) și progresul din browser
 * funcționează oricum și nu depind de alegere.
 */
export default function ConsimtamantCookie({ gaId, activ }: { gaId: string; activ: boolean }) {
  const [alegere, setAlegere] = useState<Alegere | null>(null);
  const [vizibil, setVizibil] = useState(false);

  useEffect(() => {
    const a = citesteAlegerea();
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setAlegere(a);
    setVizibil(a === null);
    const deschide = () => setVizibil(true);
    window.addEventListener(EVENIMENT_SETARI_COOKIE, deschide);
    return () => window.removeEventListener(EVENIMENT_SETARI_COOKIE, deschide);
  }, []);

  function alege(noua: Alegere) {
    try {
      window.localStorage.setItem(CHEIE, noua);
    } catch {
      // fără stocare, alegerea ține doar până la reîncărcare
    }
    setVizibil(false);
    if (noua === "refuzat" && alegere === "acceptat") {
      // Scriptul e deja încărcat: ștergem cookie-urile și reîncărcăm fără el.
      stergeCookieAnalytics();
      window.location.reload();
      return;
    }
    setAlegere(noua);
  }

  return (
    <>
      {activ && alegere === "acceptat" && (
        <>
          <Script src={`https://www.googletagmanager.com/gtag/js?id=${gaId}`} strategy="afterInteractive" />
          <Script id="google-analytics" strategy="afterInteractive">
            {`
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              window.gtag = gtag;
              gtag('js', new Date());
              gtag('config', '${gaId}');
            `}
          </Script>
        </>
      )}

      {vizibil && (
        <section
          aria-label="Cookie-uri"
          className="fixed inset-x-0 bottom-0 z-[9000] border-t border-[#EBE7DF] bg-white/95 px-4 py-4 shadow-[0_-4px_20px_rgba(0,0,0,0.08)] backdrop-blur sm:inset-x-auto sm:bottom-4 sm:left-4 sm:max-w-md sm:rounded-2xl sm:border"
        >
          <p className="text-sm text-[#1E2430]">
            Folosim <strong>Google Analytics</strong> ca să vedem câți vizitatori ajung la lecții și ce
            putem îmbunătăți — doar dacă ești de acord. Autentificarea și progresul tău funcționează oricum.{" "}
            <Link href="/politica-de-confidentialitate#cookie" className="font-semibold underline underline-offset-2">
              Detalii
            </Link>
          </p>
          <div className="mt-3 flex gap-2">
            <button
              type="button"
              onClick={() => alege("acceptat")}
              className="flex-1 rounded-xl bg-amber-400 px-4 py-2.5 text-sm font-black text-slate-950 transition hover:bg-amber-500"
            >
              Accept
            </button>
            <button
              type="button"
              onClick={() => alege("refuzat")}
              className="flex-1 rounded-xl border border-[#D9D3C7] bg-white px-4 py-2.5 text-sm font-black text-[#1E2430] transition hover:bg-[#F3EFE6]"
            >
              Refuz
            </button>
          </div>
        </section>
      )}
    </>
  );
}
