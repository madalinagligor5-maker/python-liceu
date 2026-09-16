"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AbonaButton({
  plan,
  produs = "liceu",
  redirectLogin = "/preturi",
  className,
}: {
  plan: "lunar" | "anual";
  /** Ce se cumpără -- abonamentul de liceu (implicit) sau Cursul practic
   *  de Python, produs separat cu propriile price ID-uri Stripe. */
  produs?: "liceu" | "curs";
  redirectLogin?: string;
  className?: string;
}) {
  const router = useRouter();
  const [seIncarca, setSeIncarca] = useState(false);
  const [eroare, setEroare] = useState<string | null>(null);

  async function handleClick() {
    setSeIncarca(true);
    setEroare(null);

    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ plan, produs }),
      });

      if (res.status === 401) {
        router.push(`/login?redirect=${encodeURIComponent(redirectLogin)}`);
        return;
      }

      const data = await res.json();
      if (!res.ok || !data.url) {
        setEroare(data.error || "Nu am putut porni plata. Încearcă din nou.");
        setSeIncarca(false);
        return;
      }

      window.location.href = data.url;
    } catch {
      setEroare("A apărut o eroare de rețea. Încearcă din nou.");
      setSeIncarca(false);
    }
  }

  return (
    <div>
      <button type="button" onClick={handleClick} disabled={seIncarca} className={className}>
        {seIncarca ? "Se procesează..." : "Abonează-te"}
      </button>
      {eroare && <p className="mt-2 text-center text-xs text-red-600">{eroare}</p>}
    </div>
  );
}
