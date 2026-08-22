"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AbonaButton({
  plan,
  className,
}: {
  plan: "lunar" | "anual";
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
        body: JSON.stringify({ plan }),
      });

      if (res.status === 401) {
        router.push(`/login?redirect=${encodeURIComponent("/preturi")}`);
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
