import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Politică de Anulare și Rambursare — Academia Python",
  description: "Politica de anulare a abonamentelor și dreptul la rambursare pentru utilizatorii Academia Python.",
};

export default function PoliticaRambursarePage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-12">
      <article className="prose prose-slate max-w-none">
        <h1 className="text-3xl font-black text-slate-900 border-b border-slate-200 pb-4">
          Politica de Anulare și Rambursare
        </h1>
        
        <p className="text-xs text-slate-500 italic mt-2">
          Ultima actualizare: 24 August 2026
        </p>

        <p className="mt-6 text-sm leading-relaxed text-slate-700">
          Această politică stabilește condițiile în care puteți solicita anularea abonamentelor Premium achiziționate pe platforma <strong>Academia Python</strong> (operată de GLIGOR MĂDĂLINA-GEORGIANA P.F.A.) și condițiile legale privind rambursările de fonduri.
        </p>

        <h2 className="text-xl font-bold text-slate-900 mt-8 mb-4">
          1. Politica de Anulare a Abonamentului
        </h2>
        <p className="text-sm leading-relaxed text-slate-700">
          Abonamentul dumneavoastră Premium este flexibil și poate fi anulat oricând, fără nicio obligație contractuală pe termen lung.
        </p>
        <ul className="list-disc pl-5 text-sm text-slate-700 space-y-2 mt-2">
          <li><strong>Procedura de anulare:</strong> Puteți opri reînnoirea automată cu un singur click din contul dumneavoastră, accesând <Link href="/cont" className="text-brand hover:underline font-semibold">Contul meu</Link> &rarr; *Administrează Abonament*.</li>
          <li><strong>Efectul anulării:</strong> După anulare, contul dumneavoastră nu va mai fi debitat la următoarea scadență. Veți păstra accesul complet la lecțiile Premium, exercițiile de cod și asistentul AI până la sfârșitul perioadei de facturare deja achitate.</li>
          <li><strong>Fără taxe ascunse:</strong> Nu percepem nicio taxă de reziliere sau penalizare pentru anularea abonamentului.</li>
        </ul>

        <h2 className="text-xl font-bold text-slate-900 mt-8 mb-4">
          2. Dreptul Legal de Retragere (OUG 34/2014)
        </h2>
        <p className="text-sm leading-relaxed text-slate-700">
          Conform legislației din România și Uniunea Europeană (OUG nr. 34/2014 privind drepturile consumatorilor în cadrul contractelor încheiate cu profesioniștii):
        </p>
        <div className="my-4 rounded-r-xl border-l-4 border-amber-500 bg-amber-50/50 p-4 text-sm text-slate-800 font-medium leading-relaxed">
          <strong>Articolul 16, litera m):</strong> Sunt exceptate de la dreptul de retragere contractele de furnizare de conținut digital care nu este livrat pe un suport material, dacă prestarea a început cu acordul prealabil expres al consumatorului și după ce acesta a confirmat că a luat cunoștință de faptul că își va pierde dreptul de retragere.
        </div>
        <p className="text-sm leading-relaxed text-slate-700">
          Deoarece serviciile oferite de Academia Python constau în furnizarea instantanee de **conținut digital interactiv needitat pe suport material** (lecții online, rulare de cod, analiză AI, fișe PDF descărcabile), prin crearea contului, achiziționarea abonamentului și începerea utilizării serviciilor sau descărcării resurselor, **vă exprimați acordul prealabil expres pentru începerea prestării serviciului și confirmați că luați cunoștință de pierderea dreptului legal de retragere în termen de 14 zile.**
        </p>

        <h2 className="text-xl font-bold text-slate-900 mt-8 mb-4">
          3. Garanție de Satisfacție și Rambursări Comerciale
        </h2>
        <p className="text-sm leading-relaxed text-slate-700">
          Deși dreptul legal de retragere nu se aplică direct produselor digitale livrate instant, echipa Academia Python dorește să ofere o experiență corectă și transparentă:
        </p>
        <ul className="list-disc pl-5 text-sm text-slate-700 space-y-2 mt-2">
          <li><strong>Probleme Tehnice Nerezolvate:</strong> Dacă întâmpinați erori de rețea, erori tehnice de platformă sau probleme de acces premium care vă împiedică în mod obiectiv să folosiți serviciul și pe care asistența noastră tehnică nu le poate soluționa în termen de 3 zile lucrătoare, aveți dreptul de a solicita o **rambursare completă în termen de 14 zile** de la data achiziției.</li>
          <li><strong>Procedura de Solicitare:</strong> Pentru a solicita o rambursare, trimiteți un e-mail la adresa <a href="mailto:contact@academiapython.ro" className="text-brand hover:underline font-semibold">contact@academiapython.ro</a> cu subiectul *„Solicitare Rambursare Cont”*, precizând e-mail-ul asociat contului și descrierea problemei tehnice întâmpinate.</li>
          <li><strong>Procesarea Rambursării:</strong> Cererile aprobate sunt procesate în maximum 5 zile lucrătoare. Fondurile vor fi returnate pe cardul inițial folosit la plată, prin intermediul partenerului nostru Stripe. Timpul de apariție a banilor în cont depinde de banca emitentă a cardului dumneavoastră (de regulă între 2 și 10 zile lucrătoare).</li>
        </ul>
      </article>
    </div>
  );
}
