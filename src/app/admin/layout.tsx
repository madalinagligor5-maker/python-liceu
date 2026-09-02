import { redirect } from "next/navigation";
import Link from "next/link";
import { getUtilizatorCurent } from "@/lib/subscription";
import { esteAdmin } from "@/lib/roluri";

/**
 * Gating server-side pentru /admin/*: verifică emailul contului autentificat
 * față de ADMIN_EMAIL (variabilă de mediu, server-only), la fiecare randare.
 * Niciodată doar în UI — un link ascuns tot ar lăsa ruta accesibilă direct
 * din URL dacă verificarea ar lipsi de aici.
 */
export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user } = await getUtilizatorCurent();

  if (!user || !esteAdmin(user.email)) {
    redirect("/");
  }

  return (
    <div className="min-h-screen bg-[#FAFAF8]">
      <div className="border-b border-black/10 bg-white px-4 py-3 sm:px-6">
        <span className="text-xs font-bold uppercase tracking-wide text-foreground/40">
          Panou admin
        </span>
        <nav className="mt-2 flex gap-4 text-sm font-semibold">
          <Link href="/admin/profesori" className="text-foreground/70 hover:text-brand">
            Profesori
          </Link>
          <Link href="/admin/recenzii" className="text-foreground/70 hover:text-brand">
            Recenzii
          </Link>
        </nav>
      </div>
      <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6">{children}</div>
    </div>
  );
}
