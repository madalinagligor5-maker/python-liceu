"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { creeazaClientBrowser } from "@/lib/supabase/client";
import { dateAcordMarketing } from "@/lib/marketing";

type Mod = "login" | "inregistrare";

/** Doar căi interne — un `redirect` extern ar trimite utilizatorul pe alt site. */
function caleInterna(cale: string | null): string {
  return cale && cale.startsWith("/") && !cale.startsWith("//") ? cale : "/cont";
}

export default function AuthForm({ mod }: { mod: Mod }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  // `redirectTo` e forma veche, trimisă de middleware înainte de unificare.
  const redirectTo = caleInterna(searchParams.get("redirect") ?? searchParams.get("redirectTo"));
  const profesorPrebifat = searchParams.get("profesor") === "1";

  const [email, setEmail] = useState("");
  const [parola, setParola] = useState("");
  const [suntProfesor, setSuntProfesor] = useState(profesorPrebifat);
  const [scoala, setScoala] = useState("");
  // Acord pentru emailuri de marketing (oferte, reduceri). Nebifat implicit (GDPR).
  const [acceptMarketing, setAcceptMarketing] = useState(false);
  const [seIncarca, setSeIncarca] = useState(false);
  const [eroare, setEroare] = useState<string | null>(
    searchParams.get("eroare") === "link"
      ? "Linkul de confirmare a expirat sau a fost deschis în alt browser. Dacă ai confirmat deja emailul, autentifică-te mai jos; altfel cere un link nou."
      : null
  );
  const [mesajSucces, setMesajSucces] = useState<string | null>(null);
  const [cerereProfesorTrimisa, setCerereProfesorTrimisa] = useState(false);
  // Apare când contul există dar emailul nu e confirmat (sau tocmai s-a creat).
  const [poateRetrimite, setPoateRetrimite] = useState(searchParams.get("eroare") === "link");

  const configuratCorect = Boolean(
    process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  );

  const linkCallback = () =>
    `${window.location.origin}/auth/callback?redirect=${encodeURIComponent(redirectTo)}`;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!configuratCorect) {
      setEroare("Autentificarea nu este încă configurată pe acest mediu (lipsesc cheile Supabase).");
      return;
    }

    setSeIncarca(true);
    setEroare(null);
    setMesajSucces(null);
    setPoateRetrimite(false);

    const supabase = creeazaClientBrowser();

    try {
      if (mod === "login") {
        const { error } = await supabase.auth.signInWithPassword({ email, password: parola });
        if (error) {
          setEroare(traduError(error.message));
          setPoateRetrimite(esteEmailNeconfirmat(error.message));
          return;
        }
        router.push(redirectTo);
        router.refresh();
      } else {
        const { data, error } = await supabase.auth.signUp({
          email,
          password: parola,
          options: {
            emailRedirectTo: linkCallback(),
            data: {
              ...(suntProfesor ? { rol_solicitat: "profesor_in_asteptare", scoala } : {}),
              ...(acceptMarketing ? dateAcordMarketing(true) : {}),
            },
          },
        });
        if (error) {
          setEroare(traduError(error.message));
          return;
        }
        // Pentru un email deja înregistrat, Supabase nu întoarce eroare (ca să nu
        // dezvăluie ce conturi există) și nici nu trimite email — doar un user
        // fără identități. Fără verificarea asta, omul aștepta un email care nu vine.
        if (data.user && data.user.identities?.length === 0) {
          setEroare(
            "Există deja un cont cu acest email. Intră în cont sau folosește „Ai uitat parola?” din pagina „Intră în cont”."
          );
          return;
        }
        // Confirmarea pe email e dezactivată în Supabase: contul e deja activ.
        if (data.session && !suntProfesor) {
          router.push(redirectTo);
          router.refresh();
          return;
        }
        if (suntProfesor) {
          setCerereProfesorTrimisa(true);
        } else {
          setMesajSucces(
            "Cont creat! Ți-am trimis un email de confirmare — deschide linkul din el, apoi intră în cont. Verifică și folderul Spam / Promoții."
          );
          setPoateRetrimite(true);
        }
      }
    } catch {
      setEroare("Nu ne-am putut conecta la server. Verifică conexiunea la internet și încearcă din nou.");
    } finally {
      setSeIncarca(false);
    }
  }

  async function handleRetrimite() {
    if (!email) {
      setEroare("Scrie adresa de email mai sus, apoi apasă din nou.");
      return;
    }
    setSeIncarca(true);
    setEroare(null);
    try {
      const { error } = await creeazaClientBrowser().auth.resend({
        type: "signup",
        email,
        options: { emailRedirectTo: linkCallback() },
      });
      if (error) {
        setEroare(traduError(error.message));
        return;
      }
      setMesajSucces(`Am retrimis emailul de confirmare la ${email}. Verifică și folderul Spam / Promoții.`);
    } catch {
      setEroare("Nu ne-am putut conecta la server. Verifică conexiunea la internet și încearcă din nou.");
    } finally {
      setSeIncarca(false);
    }
  }

  async function handleParolaUitata() {
    if (!configuratCorect) return;
    if (!email) {
      setEroare("Scrie adresa de email mai sus, apoi apasă „Ai uitat parola?”.");
      return;
    }
    setSeIncarca(true);
    setEroare(null);
    setMesajSucces(null);
    try {
      const { error } = await creeazaClientBrowser().auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/auth/callback?redirect=${encodeURIComponent("/resetare-parola")}`,
      });
      if (error) {
        setEroare(traduError(error.message));
        return;
      }
      setMesajSucces(
        `Dacă există un cont pentru ${email}, ți-am trimis un link de resetare a parolei. Deschide-l în acest browser.`
      );
    } catch {
      setEroare("Nu ne-am putut conecta la server. Verifică conexiunea la internet și încearcă din nou.");
    } finally {
      setSeIncarca(false);
    }
  }

  async function handleGoogle() {
    if (!configuratCorect) {
      setEroare("Autentificarea nu este încă configurată pe acest mediu (lipsesc cheile Supabase).");
      return;
    }
    setEroare(null);
    try {
      const { error } = await creeazaClientBrowser().auth.signInWithOAuth({
        provider: "google",
        options: { redirectTo: linkCallback() },
      });
      if (error) setEroare(traduError(error.message));
    } catch {
      setEroare("Nu ne-am putut conecta la server. Verifică conexiunea la internet și încearcă din nou.");
    }
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
        <p className="mt-6 text-center text-sm text-foreground/65">
          <Link href="/login" className="font-semibold text-brand">
            Intră în cont
          </Link>
        </p>
      </div>
    );
  }

  const eInregistrare = mod === "inregistrare";

  return (
    <div className="page-shell max-w-5xl">
      <div className="grid overflow-hidden rounded-[1.75rem] border border-black/10 bg-white/85 shadow-[0_24px_70px_rgba(42,37,29,0.09)] lg:grid-cols-[0.95fr_1.05fr]">
        <div className="relative hidden min-h-[42rem] bg-[#172033] lg:block">
          <Image src="/images/people/elev-python-acasa.png" alt="Elev care învață Python într-un spațiu luminos" fill sizes="45vw" className="object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#172033]/85 via-[#172033]/10 to-transparent" />
          <p className="absolute bottom-0 max-w-md p-9 text-2xl font-bold leading-snug text-white [font-family:var(--font-fraunces)]">Un loc calm în care poți încerca, greși și înțelege.</p>
        </div>
        <div className="p-6 sm:p-10 lg:p-12">
          {/* Comutator clar între cele două acțiuni */}
          <nav aria-label="Cont" className="grid grid-cols-2 gap-1 rounded-xl bg-[#F3F0E8] p-1 text-sm font-bold">
            <Link
              href={`/login?redirect=${encodeURIComponent(redirectTo)}`}
              aria-current={!eInregistrare ? "page" : undefined}
              className="rounded-lg px-3 py-2.5 text-center text-foreground/65 transition aria-[current=page]:bg-white aria-[current=page]:text-foreground aria-[current=page]:shadow-sm"
            >
              Intră în cont
            </Link>
            <Link
              href={`/inregistrare?redirect=${encodeURIComponent(redirectTo)}`}
              aria-current={eInregistrare ? "page" : undefined}
              className="rounded-lg px-3 py-2.5 text-center text-foreground/65 transition aria-[current=page]:bg-white aria-[current=page]:text-foreground aria-[current=page]:shadow-sm"
            >
              Cont gratuit
            </Link>
          </nav>

          <h1 className="mt-6 text-3xl font-black text-foreground [font-family:var(--font-fraunces)]">
            {eInregistrare ? "Creează cont gratuit" : "Bine ai revenit!"}
          </h1>
          {eInregistrare ? (
            <ul className="mt-3 space-y-1.5 text-sm text-foreground/75">
              <li>✓ Progresul tău rămâne salvat, pe orice dispozitiv</li>
              <li>✓ Primești XP și insigne pe măsură ce înveți</li>
              <li>✓ Lecțiile gratuite, fără card bancar</li>
            </ul>
          ) : (
            <p className="mt-3 text-sm leading-relaxed text-foreground/65">
              Intră în cont ca să continui de unde ai rămas.
            </p>
          )}

          {!configuratCorect && (
            <p className="mt-4 rounded-lg border border-amber-300 bg-amber-50 p-3 text-xs text-amber-700">
              Autentificarea nu este configurată pe acest mediu (variabilele Supabase lipsesc). Poți
              totuși parcurge{" "}
              <Link href="/start" className="font-semibold underline">
                lecțiile gratuite
              </Link>
              .
            </p>
          )}

          <button
            type="button"
            onClick={handleGoogle}
            className="mt-6 flex w-full items-center justify-center gap-2.5 rounded-xl border border-black/15 bg-white px-4 py-3 text-sm font-bold text-foreground shadow-sm transition hover:border-[#2F6191] hover:text-[#2F6191]"
          >
            <IconGoogle />
            Continuă cu Google
          </button>

          <div className="mt-5 flex items-center gap-3 text-xs text-foreground/65">
            <span className="h-px flex-1 bg-black/10" />
            sau cu emailul
            <span className="h-px flex-1 bg-black/10" />
          </div>

          <form onSubmit={handleSubmit} className="mt-5 space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-foreground/80">
                Email
              </label>
              <input
                id="email"
                type="email"
                required
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-2 w-full rounded-xl border border-black/10 bg-[#FAF8F3] px-4 py-3 text-sm outline-none transition focus:border-[#2F6191] focus:bg-white"
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
                autoComplete={eInregistrare ? "new-password" : "current-password"}
                value={parola}
                onChange={(e) => setParola(e.target.value)}
                className="mt-2 w-full rounded-xl border border-black/10 bg-[#FAF8F3] px-4 py-3 text-sm outline-none transition focus:border-[#2F6191] focus:bg-white"
              />
              {eInregistrare && <p className="mt-1.5 text-xs text-foreground/65">Minimum 6 caractere.</p>}
              {!eInregistrare && (
                <button
                  type="button"
                  onClick={handleParolaUitata}
                  disabled={seIncarca}
                  className="mt-2 text-xs font-semibold text-brand hover:underline disabled:opacity-50"
                >
                  Ai uitat parola?
                </button>
              )}
            </div>

            {eInregistrare && (
              <label className="flex cursor-pointer items-start gap-2.5 rounded-xl border border-amber-200 bg-amber-50/60 p-3.5">
                <input
                  type="checkbox"
                  checked={acceptMarketing}
                  onChange={(e) => setAcceptMarketing(e.target.checked)}
                  className="mt-0.5 h-4 w-4 shrink-0 accent-brand"
                />
                <span className="text-sm text-foreground">
                  <span className="font-semibold">Vreau să primesc pe email oferte și reduceri</span>{" "}
                  (de exemplu, la Black Friday). Mă pot dezabona oricând din cont.
                </span>
              </label>
            )}

            {eInregistrare && (
              <details open={profesorPrebifat} className="rounded-xl border border-black/10 bg-black/[0.02] p-3.5">
                <summary className="cursor-pointer text-sm font-semibold text-foreground/80">Ești profesor?</summary>
                <label className="mt-3 flex cursor-pointer items-start gap-2.5">
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
                <p className="mt-1 pl-6 text-xs text-foreground/65">
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
              </details>
            )}

            {eroare && <p role="alert" className="text-sm text-red-600">{eroare}</p>}
            {mesajSucces && <p role="status" className="text-sm text-success">{mesajSucces}</p>}
            {poateRetrimite && (
              <button
                type="button"
                onClick={handleRetrimite}
                disabled={seIncarca}
                className="text-sm font-semibold text-brand hover:underline disabled:opacity-50"
              >
                Nu a venit emailul? Retrimite-l
              </button>
            )}

            <button
              type="submit"
              disabled={seIncarca}
              className="w-full rounded-xl bg-[#172033] px-4 py-3.5 text-sm font-black text-white transition hover:bg-[#2A3852] disabled:opacity-50 shadow-sm cursor-pointer"
            >
              {seIncarca ? "Se procesează..." : eInregistrare ? "Creează cont gratuit" : "Intră în cont"}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-foreground/65">
            {eInregistrare ? (
              <>
                Ai deja cont?{" "}
                <Link href={`/login?redirect=${encodeURIComponent(redirectTo)}`} className="font-semibold text-brand">
                  Intră în cont
                </Link>
              </>
            ) : (
              <>
                Nu ai cont?{" "}
                <Link href={`/inregistrare?redirect=${encodeURIComponent(redirectTo)}`} className="font-semibold text-brand">
                  Creează unul gratuit
                </Link>
              </>
            )}
          </p>
          {eInregistrare && (
            <p className="mt-3 text-center text-xs text-foreground/65">
              Creând contul, ești de acord cu{" "}
              <Link href="/termeni-si-conditii" className="underline">termenii</Link> și{" "}
              <Link href="/politica-de-confidentialitate" className="underline">politica de confidențialitate</Link>.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

function IconGoogle() {
  return (
    <svg aria-hidden="true" viewBox="0 0 48 48" className="h-5 w-5">
      <path fill="#FFC107" d="M43.6 20.5H42V20H24v8h11.3C33.7 32.7 29.2 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.8 1.2 7.9 3.1l5.7-5.7C34 6.1 29.3 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20 20-8.9 20-20c0-1.3-.1-2.4-.4-3.5z" />
      <path fill="#FF3D00" d="M6.3 14.7l6.6 4.8C14.7 15.1 19 12 24 12c3.1 0 5.8 1.2 7.9 3.1l5.7-5.7C34 6.1 29.3 4 24 4 16.3 4 9.7 8.3 6.3 14.7z" />
      <path fill="#4CAF50" d="M24 44c5.2 0 9.9-2 13.4-5.2l-6.2-5.2C29.2 35.1 26.7 36 24 36c-5.2 0-9.6-3.3-11.3-7.9l-6.5 5C9.5 39.6 16.2 44 24 44z" />
      <path fill="#1976D2" d="M43.6 20.5H42V20H24v8h11.3c-.8 2.2-2.2 4.2-4.1 5.6l6.2 5.2C37 39.2 44 34 44 24c0-1.3-.1-2.4-.4-3.5z" />
    </svg>
  );
}

function esteEmailNeconfirmat(mesaj: string): boolean {
  return mesaj.toLowerCase().includes("email not confirmed");
}

function traduError(mesaj: string): string {
  const m = mesaj.toLowerCase();
  if (esteEmailNeconfirmat(mesaj))
    return "Emailul nu e confirmat încă. Deschide linkul din emailul de confirmare (verifică și Spam / Promoții) sau cere unul nou mai jos.";
  if (mesaj.includes("Invalid login credentials")) return "Email sau parolă incorectă.";
  if (mesaj.includes("User already registered")) return "Există deja un cont cu acest email.";
  if (mesaj.includes("Password should be")) return "Parola trebuie să aibă cel puțin 6 caractere.";
  if (mesaj.toLowerCase().includes("email rate limit exceeded"))
    return "S-au trimis prea multe emailuri de confirmare într-un timp scurt. Așteaptă câteva minute și încearcă din nou.";
  if (m.includes("for security purposes"))
    return "Ai cerut deja un email acum câteva secunde. Așteaptă un minut și încearcă din nou.";
  if (m.includes("unable to validate email") || m.includes("invalid format") || m.includes("is invalid"))
    return "Adresa de email nu pare validă. Verifică dacă e scrisă corect.";
  if (m.includes("signups not allowed")) return "Înregistrarea de conturi noi e oprită momentan.";
  if (m.includes("database error")) return "Contul nu a putut fi creat din cauza unei erori pe server. Încearcă din nou peste câteva minute.";
  if (m.includes("failed to fetch") || m.includes("network"))
    return "Nu ne-am putut conecta la server. Verifică conexiunea la internet și încearcă din nou.";
  if (m.includes("provider is not enabled")) return "Autentificarea cu Google nu e activată momentan. Folosește emailul și parola.";
  return mesaj;
}
