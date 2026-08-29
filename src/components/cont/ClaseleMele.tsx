"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { asociazaLaClasa, paraseesteClasa, type ClasaElev } from "@/app/actions/clase-elev";

export default function ClaseleMele({ claseInitiale }: { claseInitiale: ClasaElev[] }) {
  const router = useRouter();
  const [cod, setCod] = useState("");
  const [eroare, setEroare] = useState<string | null>(null);
  const [mesaj, setMesaj] = useState<string | null>(null);
  const [sePending, startTransition] = useTransition();

  function trimiteCod(e: React.FormEvent) {
    e.preventDefault();
    setEroare(null);
    setMesaj(null);
    startTransition(async () => {
      const rez = await asociazaLaClasa(cod);
      if (!rez.ok) {
        setEroare(rez.eroare ?? "Nu s-a putut asocia clasa.");
        return;
      }
      setMesaj(`Te-ai asociat cu clasa „${rez.numeClasa}".`);
      setCod("");
      router.refresh();
    });
  }

  function paraseste(clasaId: string) {
    startTransition(async () => {
      await paraseesteClasa(clasaId);
      router.refresh();
    });
  }

  return (
    <div className="mt-8 rounded-3xl border border-black/5 bg-white p-6 sm:p-8 shadow-sm">
      <h2 className="text-lg font-bold text-foreground flex items-center gap-2">
        <span>🏫</span> Clasele mele
      </h2>
      <p className="text-sm text-foreground/50 mt-1">
        Dacă ai un cod de la profesorul tău, introdu-l aici ca să te asociezi cu clasa lui.
      </p>

      {claseInitiale.length > 0 && (
        <ul className="mt-4 space-y-2">
          {claseInitiale.map((c) => (
            <li
              key={c.clasaId}
              className="flex items-center justify-between rounded-xl border border-black/10 bg-black/[0.02] px-4 py-2.5"
            >
              <span className="text-sm font-semibold text-foreground">{c.numeClasa}</span>
              <button
                type="button"
                disabled={sePending}
                onClick={() => paraseste(c.clasaId)}
                className="text-xs font-semibold text-red-600 hover:underline disabled:opacity-50"
              >
                Părăsește clasa
              </button>
            </li>
          ))}
        </ul>
      )}

      <form onSubmit={trimiteCod} className="mt-4 flex flex-wrap gap-2">
        <input
          type="text"
          value={cod}
          onChange={(e) => setCod(e.target.value)}
          placeholder="Am un cod de la profesor"
          className="min-w-0 flex-1 rounded-xl border border-black/10 px-3 py-2 text-sm outline-none focus:border-brand"
        />
        <button
          type="submit"
          disabled={sePending || !cod.trim()}
          className="rounded-xl bg-brand px-4 py-2 text-sm font-semibold text-white transition hover:bg-brand-dark disabled:opacity-50"
        >
          {sePending ? "Se procesează..." : "Asociază-mă"}
        </button>
      </form>

      {eroare && <p className="mt-2 text-sm text-red-600">{eroare}</p>}
      {mesaj && <p className="mt-2 text-sm text-success">{mesaj}</p>}
    </div>
  );
}
