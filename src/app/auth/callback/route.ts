import { NextResponse, type NextRequest } from "next/server";
import { creeazaClientServer } from "@/lib/supabase/server";
import { trimiteEmailAdmin } from "@/lib/email";

export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const redirectParam = searchParams.get("redirect") || "/cont";
  // Acceptăm doar căi interne (previne open-redirect prin parametrul redirect).
  let redirectTo = redirectParam.startsWith("/") && !redirectParam.startsWith("//")
    ? redirectParam
    : "/cont";

  if (code && process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    const supabase = await creeazaClientServer();
    const { data } = await supabase.auth.exchangeCodeForSession(code);

    // Codul de schimb e cu unică folosință — acest bloc rulează exact o
    // singură dată per confirmare de email, deci notificarea nu se poate
    // trimite de mai multe ori pentru aceeași cerere.
    if (data?.user) {
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
    }
  }

  return NextResponse.redirect(`${origin}${redirectTo}`);
}
