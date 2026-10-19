"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { creeazaClientBrowser } from "@/lib/supabase/client";

/** Ultimul pas din „Ai uitat parola?”: /auth/callback a creat deja sesiunea din linkul primit pe email. */
export default function ResetareParolaForm() {
  const router = useRouter();
  const [parola, setParola] = useState("");
  const [confirmare, setConfirmare] = useState("");
  const [seIncarca, setSeIncarca] = useState(false);
  const [eroare, setEroare] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (parola !== confirmare) {
      setEroare("Cele două parole nu coincid.");
      return;
    }
    setSeIncarca(true);
    setEroare(null);
    try {
      const { error } = await creeazaClientBrowser().auth.updateUser({ password: parola });
      if (error) {
        const m = error.message.toLowerCase();
        setEroare(
          m.includes("session") || m.includes("not authenticated")
            ? "Linkul de resetare a expirat. Cere unul nou din pagina de autentificare."
            : m.includes("different from the old")
              ? "Parola nouă trebuie să fie diferită de cea veche."
              : m.includes("password should be")
                ? "Parola trebuie să aibă cel puțin 6 caractere."
                : error.message
        );
        return;
      }
      router.push("/cont");
      router.refresh();
    } catch {
      setEroare("Nu ne-am putut conecta la server. Verifică conexiunea la internet și încearcă din nou.");
    } finally {
      setSeIncarca(false);
    }
  }

  const clasaInput =
    "mt-2 w-full rounded-xl border border-black/10 bg-[#FAF8F3] px-4 py-3 text-sm outline-none transition focus:border-[#2F6191] focus:bg-white";

  return (
    <div className="mx-auto max-w-sm px-4 py-16 sm:px-6">
      <span className="eyebrow">Contul tău</span>
      <h1 className="mt-4 text-3xl font-black text-foreground [font-family:var(--font-fraunces)]">
        Alege o parolă nouă
      </h1>
      <form onSubmit={handleSubmit} className="mt-8 space-y-5">
        <div>
          <label htmlFor="parola-noua" className="block text-sm font-medium text-foreground/80">
            Parolă nouă
          </label>
          <input
            id="parola-noua"
            type="password"
            required
            minLength={6}
            autoComplete="new-password"
            value={parola}
            onChange={(e) => setParola(e.target.value)}
            className={clasaInput}
          />
        </div>
        <div>
          <label htmlFor="parola-confirmare" className="block text-sm font-medium text-foreground/80">
            Repetă parola
          </label>
          <input
            id="parola-confirmare"
            type="password"
            required
            minLength={6}
            autoComplete="new-password"
            value={confirmare}
            onChange={(e) => setConfirmare(e.target.value)}
            className={clasaInput}
          />
        </div>
        {eroare && <p role="alert" className="text-sm text-red-600">{eroare}</p>}
        <button
          type="submit"
          disabled={seIncarca}
          className="w-full rounded-xl bg-[#172033] px-4 py-3 text-sm font-black text-white transition hover:bg-[#2A3852] disabled:opacity-50 shadow-sm cursor-pointer"
        >
          {seIncarca ? "Se salvează..." : "Salvează parola"}
        </button>
      </form>
      <p className="mt-6 text-center text-sm text-foreground/65">
        <Link href="/login" className="font-semibold text-brand">
          Înapoi la autentificare
        </Link>
      </p>
    </div>
  );
}
