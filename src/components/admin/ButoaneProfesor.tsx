"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";

type Actiune = (userId: string) => Promise<{ ok: boolean; eroare?: string }>;

export function ButonAprobare({ userId, actiune, eticheta, clasa }: {
  userId: string;
  actiune: Actiune;
  eticheta: string;
  clasa: string;
}) {
  const router = useRouter();
  const [sePending, startTransition] = useTransition();
  const [eroare, setEroare] = useState<string | null>(null);

  return (
    <div className="inline-flex flex-col items-end gap-1">
      <button
        type="button"
        disabled={sePending}
        onClick={() => {
          setEroare(null);
          startTransition(async () => {
            const rez = await actiune(userId);
            if (!rez.ok) setEroare(rez.eroare ?? "Eroare necunoscută.");
            else router.refresh();
          });
        }}
        className={`rounded-lg px-3 py-1.5 text-xs font-bold transition disabled:opacity-50 ${clasa}`}
      >
        {sePending ? "Se procesează..." : eticheta}
      </button>
      {eroare && <span className="text-[11px] text-red-600">{eroare}</span>}
    </div>
  );
}
