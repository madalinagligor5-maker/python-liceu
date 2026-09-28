import type { Metadata } from "next";
import TombolaForm from "@/components/TombolaForm";

export const metadata: Metadata = {
  title: "Tombolă",
  description:
    "Lasă o recenzie după perioada de probă de 7 zile și intră la tragerea lunară pentru 6 luni de abonament gratuit.",
  alternates: { canonical: "/tombola" },
};

export default function TombolaPage() {
  return (
    <div className="mx-auto max-w-2xl px-4 py-14 sm:px-6">
      <h1 className="text-3xl font-extrabold text-foreground sm:text-4xl">
        Tombolă: 6 luni gratuit
      </h1>

      <div className="mt-6 space-y-4 text-[15px] leading-relaxed text-foreground/80">
        <p className="rounded-2xl border border-brand-border bg-brand-light/40 p-4">
          <strong className="text-brand-dark">Cum funcționează:</strong>
        </p>
        <ol className="list-decimal space-y-2 pl-5">
          <li>
            <strong>Începi perioada de probă de 7 zile.</strong> Îți creezi contul și
            pornești un abonament: cardul se introduce la înscriere, dar nu se
            debitează nimic în primele 7 zile. Poți anula oricând înainte de final.
          </li>
          <li>
            <strong>După 7 zile, lași un review</strong> scurt despre ce ai
            învățat aici.
          </li>
          <li>
            <strong>Intri automat la tombolă.</strong> La fiecare sfârșit de lună,
            tragem la sorți un review și câștigătorul primește{" "}
            <strong>6 luni de abonament gratuit</strong>.
          </li>
        </ol>
        <p className="text-sm text-foreground/60">
          Nu trebuie să plătești ca să participi: dacă anulezi înainte de finalul
          celor 7 zile, nu se debitează nimic. Detalii despre probă și prețuri pe{" "}
          <a href="/preturi" className="text-brand-dark underline">pagina Prețuri</a>.
        </p>
      </div>

      <TombolaForm />

      <p className="mt-8 text-xs text-muted">
        Ai întrebări despre tombolă? Scrie-ne la{" "}
        <a href="mailto:academipython@gmail.com" className="text-brand-dark underline">
          academipython@gmail.com
        </a>
        .
      </p>
    </div>
  );
}
