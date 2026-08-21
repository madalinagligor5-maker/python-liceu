import type { Metadata } from "next";
import TombolaForm from "@/components/TombolaForm";

export const metadata: Metadata = {
  title: "Tombolă — Academia Python",
  description:
    "Încearcă 7 zile gratuit, lasă un review și intră la tombola pentru 6 luni de abonament gratuit.",
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
            <strong>Începi cu 7 zile gratuit.</strong> Îți creezi contul și ai acces
            complet la toate lecțiile, fără card.
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
          Nu e nevoie să cumperi ceva ca să participi — perioada de 7 zile e
          gratuită pentru oricine. Review-ul e pentru noi, premiul e pentru tine.
        </p>
      </div>

      <TombolaForm />

      <p className="mt-8 text-xs text-muted">
        Ai întrebări despre tombolă? Scrie-ne de pe pagina de{" "}
        <a href="/contact" className="text-brand hover:underline">
          contact
        </a>
        .
      </p>
    </div>
  );
}
