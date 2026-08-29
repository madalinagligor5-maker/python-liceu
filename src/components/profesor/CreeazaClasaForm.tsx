"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { creeazaClasa } from "@/app/actions/clase";

export default function CreeazaClasaForm() {
  const router = useRouter();
  const [nume, setNume] = useState("");
  const [eroare, setEroare] = useState<string | null>(null);
  const [codNou, setCodNou] = useState<string | null>(null);
  const [sePending, startTransition] = useTransition();

  function submit(e: React.FormEvent) {
    e.preventDefault();
    setEroare(null);
    setCodNou(null);
    startTransition(async () => {
      const rez = await creeazaClasa(nume);
      if (!rez.ok) {
        setEroare(rez.eroare ?? "Eroare necunoscută.");
        return;
      }
      setCodNou(rez.codClasa ?? null);
      setNume("");
      router.refresh();
    });
  }

  return (
    <div className="rounded-2xl border border-black/10 bg-white p-5">
      <h2 className="font-bold text-foreground">Creează o clasă nouă</h2>
      <form onSubmit={submit} className="mt-3 flex flex-wrap gap-2">
        <input
          type="text"
          value={nume}
          onChange={(e) => setNume(e.target.value)}
          placeholder="ex. Clasa a X-a B"
          className="min-w-0 flex-1 rounded-xl border border-black/10 px-3 py-2 text-sm outline-none focus:border-brand"
        />
        <button
          type="submit"
          disabled={sePending || !nume.trim()}
          className="rounded-xl bg-brand px-4 py-2 text-sm font-semibold text-white transition hover:bg-brand-dark disabled:opacity-50"
        >
          {sePending ? "Se creează..." : "Creează clasa"}
        </button>
      </form>
      {eroare && <p className="mt-2 text-sm text-red-600">{eroare}</p>}
      {codNou && (
        <p className="mt-3 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-2.5 text-sm text-emerald-800">
          Clasă creată! Codul pentru elevi: <span className="font-mono font-black">{codNou}</span>
        </p>
      )}
    </div>
  );
}
