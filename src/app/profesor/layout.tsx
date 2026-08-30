import Link from "next/link";
import { redirect } from "next/navigation";
import { getUtilizatorCurent } from "@/lib/subscription";

const LINKURI_PROFESOR = [
  { href: "/profesor/planificari", label: "Planificări" },
  { href: "/profesor/fise", label: "Fișe de lucru" },
  { href: "/profesor/teste/generator", label: "Generator de teste" },
];

/**
 * Gating server-side pentru toată zona /profesor/*, verificat la fiecare
 * randare direct din baza de date (users_meta.rol) — nu dintr-un flag de
 * client sau cookie. Ruta e deja acoperită și de middleware (redirect la
 * /login dacă nu există sesiune), dar verificarea de rol se face DOAR aici,
 * ca un utilizator autentificat fără rolul potrivit să nu poată trece nici
 * printr-un apel direct de URL.
 */
export default async function ProfesorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, meta } = await getUtilizatorCurent();

  if (!user) {
    redirect("/login?redirect=/profesor/planificari");
  }

  if (meta?.rol === "profesor_in_asteptare") {
    redirect("/profesor-asteptare");
  }

  if (meta?.rol !== "profesor_aprobat") {
    redirect("/");
  }

  return (
    <div className="min-h-screen bg-[#FAFAF8]">
      <div className="border-b border-black/10 bg-white print-hidden">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center gap-1 px-4 py-3 sm:px-6">
          <span className="mr-4 text-xs font-bold uppercase tracking-wide text-foreground/40">
            Zona profesor
          </span>
          <nav className="flex flex-wrap gap-1">
            {LINKURI_PROFESOR.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                className="rounded-lg px-3 py-1.5 text-sm font-semibold text-foreground/70 transition hover:bg-black/5 hover:text-foreground"
              >
                {l.label}
              </Link>
            ))}
          </nav>
        </div>
      </div>
      <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6">{children}</div>
    </div>
  );
}
