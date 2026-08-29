"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { creeazaClientBrowser } from "@/lib/supabase/client";

type Mod = "login" | "inregistrare";

export default function AuthForm({ mod }: { mod: Mod }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get("redirect") || "/cont";
  const profesorPrebifat = searchParams.get("profesor") === "1";

  const [email, setEmail] = useState("");
  const [parola, setParola] = useState("");
  const [suntProfesor, setSuntProfesor] = useState(profesorPrebifat);
  const [scoala, setScoala] = useState("");
  const [seIncarca, setSeIncarca] = useState(false);
  const [eroare, setEroare] = useState<string | null>(null);
  const [mesajSucces, setMesajSucces] = useState<string | null>(null);
  const [cerereProfesorTrimisa, setCerereProfesorTrimisa] = useState(false);

  const configuratCorect = Boolean(
    process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  );

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!configuratCorect) {
      setEroare("Autentificarea nu este încă configurată pe acest mediu (lipsesc cheile Supabase).");
      return;
    }

    setSeIncarca(true);
    setEroare(null);
    setMesajSucces(null);

    const supabase = creeazaClientBrowser();

    if (mod === "login") {
      const { error } = await supabase.auth.signInWithPassword({ email, password: parola });
      setSeIncarca(false);
      if (error) {
        setEroare(traduError(error.message));
        return;
      }
      router.push(redirectTo);
      router.refresh();
    } else {
      const { error } = await supabase.auth.signUp({
        email,
        password: parola,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback?redirect=${encodeURIComponent(
            redirectTo
          )}`,
          data: suntProfesor
            ? { rol_solicitat: "profesor_in_asteptare", scoala }
            : undefined,
        },
      });
      setSeIncarca(false);
      if (error) {
        setEroare(traduError(error.message));
        return;
      }
      if (suntProfesor) {
        setCerereProfesorTrimisa(true);
      } else {
        setMesajSucces("Cont creat! Verifică-ți emailul pentru a confirma adresa înainte de autentificare.");
      }
    }
  }

  async function handleGoogle() {
    if (!configuratCorect) {
      setEroare("Autentificarea nu este încă configurată pe acest mediu (lipsesc cheile Supabase).");
      return;
    }
    const supabase = creeazaClientBrowser();
    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/auth/callback?redirect=${encodeURIComponent(
          redirectTo
        )}`,
      },
    });
  }

  if (cerereProfesorTrimisa) {
    return (
      <div className="mx-auto max-w-sm px-4 py-16 sm:px-6">
        <h1 className="text-2xl font-bold text-foreground">Cerere înregistrată</h1>
        <div className="mt-4 rounded-2xl border border-brand-border bg-brand-light/40 p-5">
          <p className="text-sm font-semibold text-foreground">
            Cererea ta de cont profesor a fost înregistrată.
          </p>
          <p className="mt-2 text-sm text-foreground/70">
            Verifică-ți emailul ca să confirmi adresa. După confirmare, vei primi acces la
            zona de profesor după ce cererea e aprobată manual — vei fi anunțată/anunțat pe email.
          </p>
        </div>
        <p className="mt-6 text-center text-sm text-foreground/60">
          <Link href="/login" className="font-semibold text-brand">
            Mergi la autentificare
          </Link>
        </p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-sm px-4 py-16 sm:px-6">
      <h1 className="text-2xl font-bold text-foreground">
        {mod === "login" ? "Autentificare" : "Creează un cont"}
      </h1>
      <p className="mt-2 text-sm text-foreground/60">
        {mod === "login"
          ? "Intră în cont ca să accesezi toate lecțiile."
          : "Creează-ți contul gratuit — abonamentul se activează separat, din pagina de prețuri."}
      </p>

      {!configuratCorect && (
        <p className="mt-4 rounded-lg border border-amber-300 bg-amber-50 p-3 text-xs text-amber-700">
          Autentificarea nu este configurată pe acest mediu (variabilele Supabase lipsesc). Poți
          totuși parcurge{" "}
          <Link href="/lectii" className="font-semibold underline">
            lecțiile gratuite
          </Link>
          .
        </p>
      )}

      <form onSubmit={handleSubmit} className="mt-6 space-y-4">
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-foreground/80">
            Email
          </label>
          <input
            id="email"
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="mt-1 w-full rounded-lg border border-black/10 px-3 py-2 text-sm outline-none focus:border-brand"
          />
        </div>
        <div>
          <label htmlFor="parola" className="block text-sm font-medium text-foreground/80">
            Parolă
          </label>
          <input
            id="parola"
            type="password"
            required
            minLength={6}
            value={parola}
            onChange={(e) => setParola(e.target.value)}
            className="mt-1 w-full rounded-lg border border-black/10 px-3 py-2 text-sm outline-none focus:border-brand"
          />
        </div>

        {mod === "inregistrare" && (
          <div className="rounded-xl border border-black/10 bg-black/[0.02] p-3.5">
            <label className="flex cursor-pointer items-start gap-2.5">
              <input
                type="checkbox"
                checked={suntProfesor}
                onChange={(e) => setSuntProfesor(e.target.checked)}
                className="mt-0.5 h-4 w-4 shrink-0 accent-brand"
              />
              <span className="text-sm font-semibold text-foreground">
                Sunt profesor / vreau acces pentru profesori
              </span>
            </label>
            <p className="mt-1 pl-6 text-xs text-foreground/55">
              Cererea intră într-o listă de așteptare și e aprobată manual. Accesul de profesor
              e gratuit.
            </p>

            {suntProfesor && (
              <div className="mt-3 pl-6">
                <label htmlFor="scoala" className="block text-xs font-medium text-foreground/70">
                  Școală / liceu (opțional)
                </label>
                <input
                  id="scoala"
                  type="text"
                  value={scoala}
                  onChange={(e) => setScoala(e.target.value)}
                  placeholder="ex. Colegiul Național ..."
                  className="mt-1 w-full rounded-lg border border-black/10 px-3 py-2 text-sm outline-none focus:border-brand"
                />
              </div>
            )}
          </div>
        )}

        {eroare && <p className="text-sm text-red-600">{eroare}</p>}
        {mesajSucces && <p className="text-sm text-success">{mesajSucces}</p>}

        <button
          type="submit"
          disabled={seIncarca}
          className="w-full rounded-xl bg-amber-400 hover:bg-amber-500 px-4 py-2.5 text-sm font-black text-slate-950 transition disabled:opacity-50 shadow-xs cursor-pointer"
        >
          {seIncarca ? "Se procesează..." : mod === "login" ? "Autentificare" : "Creează cont"}
        </button>
      </form>

      <div className="mt-4 flex items-center gap-3 text-xs text-foreground/40">
        <span className="h-px flex-1 bg-black/10" />
        sau
        <span className="h-px flex-1 bg-black/10" />
      </div>

      <button
        type="button"
        onClick={handleGoogle}
        className="mt-4 w-full rounded-xl border border-black/10 px-4 py-2.5 text-sm font-semibold text-foreground transition hover:border-brand hover:text-brand"
      >
        Continuă cu Google
      </button>

      <p className="mt-6 text-center text-sm text-foreground/60">
        {mod === "login" ? (
          <>
            Nu ai cont?{" "}
            <Link href={`/inregistrare?redirect=${encodeURIComponent(redirectTo)}`} className="font-semibold text-brand">
              Creează unul
            </Link>
          </>
        ) : (
          <>
            Ai deja cont?{" "}
            <Link href={`/login?redirect=${encodeURIComponent(redirectTo)}`} className="font-semibold text-brand">
              Autentifică-te
            </Link>
          </>
        )}
      </p>
    </div>
  );
}

function traduError(mesaj: string): string {
  if (mesaj.includes("Invalid login credentials")) return "Email sau parolă incorectă.";
  if (mesaj.includes("User already registered")) return "Există deja un cont cu acest email.";
  if (mesaj.includes("Password should be")) return "Parola trebuie să aibă cel puțin 6 caractere.";
  return mesaj;
}
