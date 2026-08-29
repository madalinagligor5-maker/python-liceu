import Link from "next/link";
import { redirect } from "next/navigation";
import { getUtilizatorCurent } from "@/lib/subscription";

export const metadata = { title: "Cerere în așteptare — Academia Python" };

export default async function AsteptarePage() {
  const { user, meta } = await getUtilizatorCurent();

  if (!user) redirect("/login");
  if (meta?.rol === "profesor_aprobat") redirect("/profesor/clase");
  if (meta?.rol !== "profesor_in_asteptare") redirect("/");

  return (
    <div className="mx-auto max-w-md px-4 py-20 text-center sm:px-6">
      <div className="text-4xl">⏳</div>
      <h1 className="mt-4 text-xl font-bold text-foreground">
        Cererea ta de cont profesor e în așteptare
      </h1>
      <p className="mt-3 text-sm text-foreground/65">
        Cererea a fost înregistrată și așteaptă aprobare manuală. Vei avea acces la zona de
        profesor imediat ce e aprobată.
      </p>
      <Link
        href="/"
        className="mt-6 inline-block rounded-xl border border-black/10 px-5 py-2.5 text-sm font-semibold text-foreground transition hover:border-brand hover:text-brand"
      >
        Înapoi la pagina principală
      </Link>
    </div>
  );
}
