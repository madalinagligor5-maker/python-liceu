import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

const PROTECTED_ROUTES = ["/cont", "/preview-dashboard", "/profesor", "/admin"];

/** Limita de timp pentru verificarea sesiunii. Fără ea, un Supabase lent sau
 *  indisponibil ținea fiecare cerere până la 504 MIDDLEWARE_INVOCATION_TIMEOUT. */
const LIMITA_SUPABASE_MS = 4000;

function cuLimita<T>(p: Promise<T>, ms: number): Promise<T | "timeout"> {
  return Promise.race([
    p,
    new Promise<"timeout">((res) => setTimeout(() => res("timeout"), ms)),
  ]);
}

export async function middleware(request: NextRequest) {
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  });

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseAnonKey) {
    return response;
  }

  const pathname = request.nextUrl.pathname;
  const isProtectedRoute = PROTECTED_ROUTES.some(
    (route) => pathname === route || pathname.startsWith(`${route}/`)
  );

  // Fără cookie de sesiune Supabase nu există nimic de verificat sau de
  // reîmprospătat: vizitatorii anonimi nu mai așteaptă deloc după Supabase.
  const areSesiune = request.cookies.getAll().some((c) => c.name.startsWith("sb-"));
  if (!areSesiune) {
    if (isProtectedRoute) {
      const url = request.nextUrl.clone();
      url.pathname = "/login";
      url.searchParams.set("redirectTo", pathname);
      return NextResponse.redirect(url);
    }
    return response;
  }

  const supabase = createServerClient(supabaseUrl, supabaseAnonKey, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value }) =>
          request.cookies.set(name, value)
        );
        response = NextResponse.next({
          request,
        });
        cookiesToSet.forEach(({ name, value, options }) =>
          response.cookies.set(name, value, options)
        );
      },
    },
  });

  const rezultat = await cuLimita(supabase.auth.getUser(), LIMITA_SUPABASE_MS).catch(
    () => "timeout" as const
  );
  if (rezultat === "timeout") {
    // Supabase nu a răspuns la timp: lăsăm cererea să treacă. Paginile
    // protejate își verifică singure accesul pe server.
    console.error("[middleware] Supabase auth.getUser a depășit limita de timp", pathname);
    return response;
  }
  const user = rezultat.data.user;

  if (isProtectedRoute && !user) {
    const url = request.nextUrl.clone();
    url.pathname = "/login";
    url.searchParams.set("redirectTo", pathname);
    return NextResponse.redirect(url);
  }

  return response;
}

export const config = {
  matcher: [
    // Fișierele statice (inclusiv interpretorul Python din /pyodide și
    // worker-ul) nu au nevoie de verificarea sesiunii.
    "/((?!_next/static|_next/image|favicon.ico|pyodide/|python-worker\\.js|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico|js|mjs|wasm|zip|json|map|txt|xml|pdf|woff2?)$).*)",
  ],
};
