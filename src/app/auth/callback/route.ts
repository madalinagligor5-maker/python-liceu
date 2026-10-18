import { NextResponse, type NextRequest } from "next/server";
import type { EmailOtpType } from "@supabase/supabase-js";
import { creeazaClientServer } from "@/lib/supabase/server";
import { trimiteEmailAdmin } from "@/lib/email";

export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const tokenHash = searchParams.get("token_hash");
  const tip = searchParams.get("type") as EmailOtpType | null;
  const redirectParam = searchParams.get("redirect") || "/cont";
  // Acceptăm doar căi interne (previne open-redirect prin parametrul redirect).
  let redirectTo = redirectParam.startsWith("/") && !redirectParam.startsWith("//")
    ? redirectParam
    : "/cont";

  // Fără un rezultat valid trimitem utilizatorul înapoi la login cu un mesaj,
  // nu în tăcere spre /cont (care îl arunca la /login fără nicio explicație).
  const laLoginCuEroare = () =>
    NextResponse.redirect(
      `${origin}/login?eroare=link&redirect=${encodeURIComponent(redirectTo)}`
    );

  // Supabase pune aici motivul când linkul din email a expirat sau a fost deja folosit.
  if (searchParams.get("error") || searchParams.get("error_description")) {
    return laLoginCuEroare();
  }

  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    return NextResponse.redirect(`${origin}${redirectTo}`);
  }

  if (!code && !tokenHash) {
    return laLoginCuEroare();
  }

  const supabase = await creeazaClientServer();

  // token_hash (șablon de email cu {{ .TokenHash }}) merge pe orice dispozitiv;
  // code (PKCE) merge doar în browserul în care s-a creat contul — deschis din
  // aplicația de email pe telefon, schimbul eșuează.
  const { data, error } = tokenHash && tip
    ? await supabase.auth.verifyOtp({ token_hash: tokenHash, type: tip })
    : await supabase.auth.exchangeCodeForSession(code ?? "");

  if (error || !data?.user) {
    console.error("[auth/callback] confirmarea a eșuat:", error?.message);
    return laLoginCuEroare();
  }

  // Linkul de resetare a parolei duce direct la formularul de parolă nouă.
  if (tip === "recovery" || redirectTo === "/resetare-parola") {
    return NextResponse.redirect(`${origin}/resetare-parola`);
  }

  // Codul de schimb e cu unică folosință — acest bloc rulează exact o
  // singură dată per confirmare de email, deci notificarea nu se poate
  // trimite de mai multe ori pentru aceeași cerere.
  const { data: meta } = await supabase
    .from("users_meta")
    .select("rol, scoala")
    .eq("user_id", data.user.id)
    .maybeSingle();

  if (meta?.rol === "profesor_in_asteptare") {
    redirectTo = "/profesor-asteptare";
    await trimiteEmailAdmin(
      "Cerere nouă de cont profesor — Academia Python",
      `${data.user.email} a cerut acces de profesor.\n` +
        `Școală menționată: ${meta.scoala || "(nespecificată)"}\n\n` +
        `Aprobă sau respinge din: https://www.academiapython.ro/admin/profesori`
    );
  }

  return NextResponse.redirect(`${origin}${redirectTo}`);
}
