import Link from "next/link";
import { claseleDisponibile } from "@/lib/planificari";

export const metadata = { title: "Planificări — Academia Python" };

export default function PlanificariPage() {
  return (
    <div>
      <h1 className="text-xl font-bold text-foreground">Planificări calendaristice</h1>
      <p className="mt-1 text-sm text-foreground/60">
        Alege clasa pentru care vrei planificarea. Fiecare planificare e gata de print (format A4).
      </p>

      <div className="mt-6 grid gap-3 sm:grid-cols-2 md:grid-cols-4">
        {claseleDisponibile().map((clasa) => (
          <Link
            key={clasa}
            href={`/profesor/planificari/${clasa}`}
            className="rounded-2xl border border-black/10 bg-white p-5 text-center font-bold text-foreground transition hover:border-brand hover:text-brand"
          >
            Clasa a {clasa}-a
          </Link>
        ))}
      </div>
    </div>
  );
}
