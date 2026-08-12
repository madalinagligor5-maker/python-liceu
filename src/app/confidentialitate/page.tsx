import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Politică de confidențialitate — PythonLiceu",
};

export default function ConfidentialitatePage() {
  return (
    <div className="mx-auto max-w-2xl px-4 py-14 sm:px-6">
      <h1 className="text-2xl font-bold text-foreground">Politică de confidențialitate</h1>
      <p className="mt-4 text-sm leading-relaxed text-foreground/70">
        Acest text este un substituent (placeholder) și nu constituie un document legal valid.
        Înainte de lansarea publică a platformei, această politică trebuie redactată sau revizuită
        de un specialist în protecția datelor (GDPR), acoperind cel puțin: ce date sunt colectate
        (cont, plăți prin Stripe, progres la lecții), scopul colectării, temeiul legal, durata de
        stocare, drepturile utilizatorului (acces, rectificare, ștergere) și modalitatea de
        exercitare a acestora.
      </p>
    </div>
  );
}
