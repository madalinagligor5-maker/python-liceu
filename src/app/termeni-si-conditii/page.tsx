import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Termeni și Condiții — Academia Python",
  description: "Termenii și condițiile de utilizare a platformei educaționale Academia Python.",
};

export default function TermeniSiConditiiPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-12">
      <article className="prose prose-slate max-w-none">
        <h1 className="text-3xl font-black text-slate-900 border-b border-slate-200 pb-4">
          Termeni și Condiții
        </h1>
        
        <p className="text-xs text-slate-500 italic mt-2">
          Ultima actualizare: 24 August 2026
        </p>

        <p className="mt-6 text-sm leading-relaxed text-slate-700">
          Bun venit pe platforma educațională <strong>Academia Python</strong> (disponibilă la adresa{" "}
          <Link href="/" className="text-brand font-semibold hover:underline">
            www.academiapython.ro
          </Link>
          ). Vă rugăm să citiți cu atenție acest document înainte de a utiliza serviciile noastre, de a vă crea un cont sau de a efectua o achiziție.
        </p>

        <h2 className="text-xl font-bold text-slate-900 mt-8 mb-4">
          1. Datele de Identificare ale Comerciantului
        </h2>
        <p className="text-sm leading-relaxed text-slate-700">
          Platforma <strong>Academia Python</strong> este operată de:
        </p>
        <ul className="list-disc pl-5 text-sm text-slate-700 space-y-2 mt-2">
          <li><strong>Denumire:</strong> GLIGOR MĂDĂLINA-GEORGIANA PERSOANĂ FIZICĂ AUTORIZATĂ (GLIGOR MĂDĂLINA-GEORGIANA P.F.A.)</li>
          <li><strong>Cod Unic de Înregistrare (CUI):</strong> 51874932</li>
          <li><strong>Număr Reg. Com:</strong> F05/123/2026</li>
          <li><strong>Sediu Social:</strong> Cluj-Napoca, Județul Cluj, România</li>
          <li><strong>E-mail oficial de contact:</strong> <a href="mailto:academipython@gmail.com" className="text-brand hover:underline font-semibold">academipython@gmail.com</a></li>
        </ul>

        <h2 className="text-xl font-bold text-slate-900 mt-8 mb-4">
          2. Descrierea Serviciului
        </h2>
        <p className="text-sm leading-relaxed text-slate-700">
          Academia Python este o platformă digitală educațională interactivă care oferă acces la cursuri de programare Python, structurate conform programei oficiale românești de liceu (clasele IX-XII). Serviciile includ:
        </p>
        <ul className="list-disc pl-5 text-sm text-slate-700 space-y-2 mt-2">
          <li>Lecții teoretice alternative și interactive de Python.</li>
          <li>Editor de cod direct în browser pentru rularea locală a algoritmilor.</li>
          <li>Evaluări, asistență pedagogică și îndrumare oferită în timp real prin intermediul unui modul integrat de Inteligență Artificială (AI).</li>
          <li>Fișe de lucru în format PDF pentru descărcare și printare la școală sau acasă.</li>
        </ul>

        <h2 className="text-xl font-bold text-slate-900 mt-8 mb-4">
          3. Prețuri și Modalități de Plată
        </h2>
        <ul className="list-disc pl-5 text-sm text-slate-700 space-y-2">
          <li><strong>Afișarea prețurilor:</strong> Toate tarifele pentru abonamentele Premium sunt afișate clar în RON pe pagina <Link href="/preturi" className="text-brand hover:underline">Tarife</Link> și includ toate taxele aplicabile conform legislației din România.</li>
          <li><strong>Procesarea plăților:</strong> Tranzacțiile sunt realizate și procesate securizat prin intermediul procesatorului de plăți partener autorizat <strong>Stripe</strong> (Stripe Payments Europe, Ltd.). Datele cardului dumneavoastră sunt criptate și trimise direct procesatorului, Academia Python nestocând niciodată informații de plată sensibile (număr card, CVV).</li>
        </ul>

        <h2 className="text-xl font-bold text-slate-900 mt-8 mb-4">
          4. Abonamente și Reînnoire Automată
        </h2>
        <p className="text-sm leading-relaxed text-slate-700">
          Pentru a debloca întregul conținut (peste primele 3-5 module gratuite), utilizatorul trebuie să opteze pentru un plan de abonament Premium:
        </p>
        <ul className="list-disc pl-5 text-sm text-slate-700 space-y-2 mt-2">
          <li><strong>Facturare recurentă:</strong> Abonamentele se achită lunar (29 lei/lună) sau anual și sunt supuse reînnoirii automate la finalul fiecărei perioade de facturare.</li>
          <li><strong>Perioada de probă (Trial):</strong> Dacă optați pentru o perioadă de probă gratuită (de exemplu, 7 zile), cardul dumneavoastră va fi debitat automat cu tariful abonamentului la finalul trialului, cu excepția cazului în care anulați înainte de expirarea acestuia.</li>
          <li><strong>Anularea reînnoirii:</strong> Utilizatorul poate anula reînnoirea automată a abonamentului **oricând**, printr-un singur click, accesând secțiunea <Link href="/cont" className="text-brand hover:underline">Contul meu</Link> din platformă. După anulare, accesul la funcțiile premium rămâne activ până la sfârșitul perioadei deja plătite.</li>
        </ul>

        <h2 className="text-xl font-bold text-slate-900 mt-8 mb-4">
          5. Drepturi de Autor și Proprietate Intelectuală
        </h2>
        <p className="text-sm leading-relaxed text-slate-700">
          Întregul conținut al platformei Academia Python (inclusiv textele cursurilor, design-ul grafic, logo-urile, structura curriculumului, materialele video, fișele PDF create și codul sursă) este protejat de legislația privind drepturile de autor și proprietatea intelectuală și aparține în exclusivitate operatorului platformei sau partenerilor săi.
        </p>
        <p className="mt-2 text-sm leading-relaxed text-slate-700">
          Materialele oferite sunt destinate **exclusiv uzului personal, educațional și non-comercial** al elevului sau cadrului didactic. Este strict interzisă copierea, distribuirea, modificarea, republicarea sau comercializarea conținutului fără acordul scris prealabil al comerciantului.
        </p>

        <h2 className="text-xl font-bold text-slate-900 mt-8 mb-4">
          6. Limitarea Răspunderii
        </h2>
        <p className="text-sm leading-relaxed text-slate-700">
          Serviciile noastre sunt oferite „așa cum sunt” și „în limita disponibilității”. Deși depunem toate eforturile pentru ca materialele didactice să fie corecte și aliniate la programa școlară, Academia Python nu garantează obținerea unor note specifice, promovarea examenelor sau funcționarea platformei fără nicio întrerupere tehnică cauzată de terți (procesatori de plăți, furnizori de cloud computing etc.).
        </p>

        <h2 className="text-xl font-bold text-slate-900 mt-8 mb-4">
          7. Legislația Aplicabilă și Litigii
        </h2>
        <p className="text-sm leading-relaxed text-slate-700">
          Prezentul document este guvernat de legislația din România. Orice dispută născută în legătură cu utilizarea platformei va fi soluționată pe cale amiabilă. Dacă soluționarea amiabilă eșuează, litigiile vor fi deferite instanțelor judecătorești competente din România sau prin intermediul platformelor SOL (Soluționarea Online a Litigiilor) puse la dispoziție de Uniunea Europeană.
        </p>
      </article>
    </div>
  );
}
