import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Termeni și condiții — PythonLiceu",
};

export default function TermeniPage() {
  return (
    <div className="mx-auto max-w-2xl px-4 py-14 sm:px-6">
      <h1 className="text-2xl font-bold text-foreground">Termeni și condiții</h1>
      <p className="mt-4 text-sm leading-relaxed text-foreground/70">
        Acest text este un substituent (placeholder) și nu constituie un document legal valid.
        Înainte de lansarea publică a platformei, acest conținut trebuie redactat sau revizuit de
        un avocat/consultant specializat, ținând cont de forma juridică sub care este operată
        platforma, de modalitatea de facturare și de legislația română aplicabilă serviciilor
        digitale pe bază de abonament.
      </p>
    </div>
  );
}
