import { NextResponse, type NextRequest } from "next/server";
import { creeazaClientServer } from "@/lib/supabase/server";

export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const redirectParam = searchParams.get("redirect") || "/cont";
  // Acceptăm doar căi interne (previne open-redirect prin parametrul redirect).
  const redirectTo = redirectParam.startsWith("/") && !redirectParam.startsWith("//")
    ? redirectParam
    : "/cont";

  if (code && process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    const supabase = await creeazaClientServer();
    await supabase.auth.exchangeCodeForSession(code);
  }

  return NextResponse.redirect(`${origin}${redirectTo}`);
}
