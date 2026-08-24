import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Politică de Confidențialitate (GDPR) — Academia Python",
  description: "Politica de confidențialitate și protecție a datelor cu caracter personal conform GDPR pe platforma Academia Python.",
};

export default function PoliticaConfidentialitatePage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-12">
      <article className="prose prose-slate max-w-none">
        <h1 className="text-3xl font-black text-slate-900 border-b border-slate-200 pb-4">
          Politică de Confidențialitate (GDPR)
        </h1>
        
        <p className="text-xs text-slate-500 italic mt-2">
          Ultima actualizare: 24 August 2026
        </p>

        <p className="mt-6 text-sm leading-relaxed text-slate-700">
          La <strong>Academia Python</strong> (operată de GLIGOR MĂDĂLINA-GEORGIANA P.F.A.), ne angajăm să protejăm și să respectăm confidențialitatea datelor dumneavoastră cu caracter personal, în deplină conformitate cu Regulamentul General privind Protecția Datelor (GDPR - Regulamentul UE 2016/679).
        </p>

        <h2 className="text-xl font-bold text-slate-900 mt-8 mb-4">
          1. Ce Date Colectăm
        </h2>
        <p className="text-sm leading-relaxed text-slate-700">
          Colectăm doar datele strict necesare pentru funcționarea optimă a platformei educaționale:
        </p>
        <ul className="list-disc pl-5 text-sm text-slate-700 space-y-2 mt-2">
          <li><strong>Date de autentificare / cont:</strong> Adresa de e-mail și numele/prenumele de utilizator introduse la înregistrare.</li>
          <li><strong>Date de progres și gamificare:</strong> Lecțiile finalizate, scorurile la quiz-uri, XP (puncte de experiență) acumulat, streak-urile de studiu și insignele câștigate.</li>
          <li><strong>Date de analiză tehnică (anonimizate):</strong> Date despre dispozitivul utilizat, paginile vizitate și interacțiunea cu paginile (prin intermediul modulelor de analiză standard care nu vă identifică personal).</li>
        </ul>

        <h2 className="text-xl font-bold text-slate-900 mt-8 mb-4">
          2. Procesarea Securizată a Datelor de Plată (Carduri Bancare)
        </h2>
        <div className="my-4 rounded-r-xl border-l-4 border-success bg-success/5 p-4 text-sm text-slate-800 leading-relaxed font-semibold">
          🔒 Siguranță maximă: Datele sensibile ale cardurilor bancare (numărul cardului, data expirării, codul CVV/CVC) sunt introduse și procesate DIRECT și exclusiv pe serverele securizate ale partenerului nostru de plăți Stripe. 
        </div>
        <p className="text-sm leading-relaxed text-slate-700">
          Platforma Academia Python **NU stochează, NU salvează și NU procesează** niciodată pe serverele proprii datele cardurilor dumneavoastră. Partenerul Stripe ne transmite doar o confirmare securizată (token/webhook) a plății reușite pentru a vă debloca accesul premium.
        </p>

        <h2 className="text-xl font-bold text-slate-900 mt-8 mb-4">
          3. Scopul Prelucrării Datelor
        </h2>
        <p className="text-sm leading-relaxed text-slate-700">
          Datele colectate sunt utilizate exclusiv pentru:
        </p>
        <ul className="list-disc pl-5 text-sm text-slate-700 space-y-2 mt-2">
          <li>Crearea, administrarea și securizarea contului dumneavoastră de elev.</li>
          <li>Salvarea și afișarea în timp real a progresului educațional și a punctajelor acumulate.</li>
          <li>Emiterea facturilor fiscale legale corespunzătoare abonamentelor achitate.</li>
          <li>Transmiterea de comunicări tehnice administrative importante (ex: modificări în cont, facturi, mesaje de asistență tehnică).</li>
        </ul>

        <h2 className="text-xl font-bold text-slate-900 mt-8 mb-4">
          4. Perioada de Stocare a Datelor
        </h2>
        <p className="text-sm leading-relaxed text-slate-700">
          Păstrăm datele cu caracter personal pe durata existenței contului dumneavoastră. Datele de facturare sunt păstrate separat pe durata impusă de legislația fiscală din România (10 ani). În cazul în care solicitați ștergerea contului, datele personale asociate profilului vor fi șterse definitiv în maximum 30 de zile.
        </p>

        <h2 className="text-xl font-bold text-slate-900 mt-8 mb-4">
          5. Drepturile Dumneavoastră (GDPR)
        </h2>
        <p className="text-sm leading-relaxed text-slate-700">
          În calitate de persoană vizată, beneficiați de toate drepturile prevăzute de GDPR:
        </p>
        <ul className="list-disc pl-5 text-sm text-slate-700 space-y-2 mt-2">
          <li><strong>Dreptul de acces:</strong> Puteți solicita o confirmare a datelor personale pe care le prelucrăm.</li>
          <li><strong>Dreptul de rectificare:</strong> Puteți corecta sau actualiza datele incomplete direct din cont sau contactându-ne.</li>
          <li><strong>Dreptul de ștergere („dreptul de a fi uitat”):</strong> Puteți solicita ștergerea contului și a datelor dumneavoastră personale.</li>
          <li><strong>Dreptul de portabilitate:</strong> Puteți cere exportul datelor dumneavoastră într-un format structurat, utilizat în mod curent.</li>
        </ul>
        <p className="mt-4 text-sm leading-relaxed text-slate-700">
          Pentru exercitarea oricăruia dintre aceste drepturi, ne puteți trimite o solicitare prin e-mail la adresa oficială:{" "}
          <a href="mailto:contact@academiapython.ro" className="text-brand hover:underline font-semibold">
            contact@academiapython.ro
          </a>. Cererile vor fi soluționate gratuit și în termen legal de maximum 30 de zile.
        </p>
      </article>
    </div>
  );
}
