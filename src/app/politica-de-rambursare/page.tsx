import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Politică de Anulare și Rambursare — Academia Python",
  description: "Politica de anulare a abonamentelor și garanția necondiționată de rambursare în 14 zile pentru Academia Python.",
};

export default function PoliticaRambursarePage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-12">
      <article className="prose prose-slate max-w-none">
        <h1 className="text-3xl font-black text-slate-900 border-b border-slate-200 pb-4">
          Politica de Anulare și Garanție de Rambursare 14 Zile
        </h1>
        
        <p className="text-xs text-slate-500 italic mt-2">
          Ultima actualizare: 25 August 2026
        </p>

        <p className="mt-6 text-sm leading-relaxed text-slate-700">
          Această politică stabilește condițiile în care puteți solicita anularea abonamentelor Premium achiziționate pe platforma <strong>Academia Python</strong> (operată de GLIGOR MĂDĂLINA-GEORGIANA P.F.A.) și condițiile garanției comerciale necondiționate de 14 zile.
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
        <p className="text-sm leading-relaxed text-slate-700 font-medium text-amber-900 bg-amber-50/40 p-3 rounded-xl border border-amber-200">
          👉 <strong>Tranziție și Clauză Comercială:</strong> Cu toate acestea, independent de excepția legală de mai sus, Academia Python oferă voluntar o <strong>garanție comercială necondiționată de rambursare în 14 zile</strong>, descrisă detaliat mai jos.
        </p>

        <h2 className="text-xl font-bold text-slate-900 mt-8 mb-4">
          3. Garanție Comercială Necondiționată de 14 Zile
        </h2>
        <p className="text-sm leading-relaxed text-slate-700">
          Echipa Academia Python dorește să aveți încredere deplină în calitatea cursurilor noastre. Din acest motiv, oferim o garanție reală și necondiționată:
        </p>
        <ul className="list-disc pl-5 text-sm text-slate-700 space-y-2 mt-2">
          <li><strong>Rambursare Necondiționată în 14 Zile:</strong> Orice utilizator poate solicita rambursarea integrală a plății în termen de 14 zile calendaristice de la achiziție, din orice motiv, fără să fie nevoie să justifice sau să demonstreze o problemă tehnică. Dacă simțiți că cursurile nu vi se potrivesc, vă returnăm banii integral.</li>
          <li><strong>Procedura de Solicitare Simplă:</strong> Pentru a solicita rambursarea, trimiteți un e-mail la adresa <a href="mailto:academipython@gmail.com" className="text-brand hover:underline font-semibold">academipython@gmail.com</a> cu subiectul <em>„Solicitare Rambursare Cont”</em>, specificând doar adresa de e-mail asociată contului dumneavoastră. Nu este nevoie să descrieți niciun motiv.</li>
          <li><strong>Procesarea Rambursării:</strong> Cererile sunt procesate în maximum 3 zile lucrătoare. Fondurile vor fi returnate integral pe cardul inițial folosit la plată, prin intermediul procesatorului nostru Stripe. Nicio taxă suplimentară nu va fi reținută.</li>
        </ul>
      </article>
    </div>
  );
}
