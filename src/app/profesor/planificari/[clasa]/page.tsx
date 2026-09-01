import { notFound } from "next/navigation";
import Link from "next/link";
import { getUtilizatorCurent } from "@/lib/subscription";
import { construiestePrograma, anScolarImplicit } from "@/lib/planificarePrograma";

function numeDinEmail(email: string): string {
  const local = email.split("@")[0] ?? "";
  const curatat = local.replace(/[0-9_.-]/g, " ").trim();
  if (!curatat) return email;
  return curatat.charAt(0).toUpperCase() + curatat.slice(1);
}

export async function generateMetadata({ params }: { params: Promise<{ clasa: string }> }) {
  const { clasa } = await params;
  return { title: `Planificare clasa a ${clasa}-a — Academia Python` };
}

export default async function PlanificareClasaPage({
  params,
  searchParams,
}: {
  params: Promise<{ clasa: string }>;
  searchParams: Promise<{ anScolar?: string }>;
}) {
  const { clasa } = await params;
  const { anScolar: anScolarQuery } = await searchParams;
  const anScolar = anScolarQuery?.trim() || anScolarImplicit(new Date());

  const { user, meta } = await getUtilizatorCurent();
  if (!user) notFound();

  const programa = await construiestePrograma(clasa, {
    liceu: meta?.scoala ?? null,
    profesor: numeDinEmail(user.email),
    anScolar,
  });
  if (!programa) notFound();

  const hrefPdf = `/api/profesor-pdf/planificare/${clasa}?anScolar=${encodeURIComponent(anScolar)}`;

  return (
    <div>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <Link href="/profesor/planificari" className="text-sm font-semibold text-brand hover:underline">
          ← Toate clasele
        </Link>
        <a
          href={hrefPdf}
          className="rounded-full bg-amber-400 hover:bg-amber-500 text-slate-950 font-black py-2 px-6 text-xs transition shadow-sm"
        >
          📄 Descarcă PDF
        </a>
      </div>

      <form method="get" className="mb-8 flex flex-wrap items-end gap-3 rounded-xl border border-black/10 bg-black/[0.02] p-4">
        <div>
          <label htmlFor="anScolar" className="block text-xs font-semibold text-foreground/70">
            An școlar
          </label>
          <input
            id="anScolar"
            name="anScolar"
            type="text"
            defaultValue={anScolar}
            className="mt-1 w-32 rounded-lg border border-black/10 px-2.5 py-1.5 text-sm"
          />
        </div>
        <button
          type="submit"
          className="rounded-lg border border-black/10 bg-white px-3.5 py-1.5 text-xs font-semibold text-foreground transition hover:border-brand hover:text-brand"
        >
          Actualizează
        </button>
      </form>

      {/* Pagină de titlu */}
      <div className="rounded-2xl border border-black/10 bg-white p-6 text-center">
        <p className="text-sm font-semibold text-foreground">{programa.paginaTitlu.liceu}</p>
        <p className="mt-4 text-xs uppercase tracking-wide text-foreground/50">Programă școlară pentru</p>
        <h1 className="mt-1 text-xl font-extrabold text-foreground">PLANIFICARE CALENDARISTICĂ</h1>
        <p className="mt-3 text-sm text-foreground/70">
          Disciplina: <strong>{programa.paginaTitlu.disciplina}</strong> · Clasa a {programa.paginaTitlu.clasa}-a
        </p>
        <p className="mt-1 text-sm text-foreground/70">
          Durata: {programa.paginaTitlu.durataOreSaptamana ?? "—"} ore/săptămână,{" "}
          {programa.paginaTitlu.durataOreTotal} ore total
        </p>
        <p className="mt-1 text-sm text-foreground/70">Prof. {programa.paginaTitlu.profesor}</p>
        <p className="mt-1 text-sm text-foreground/70">Anul școlar {programa.paginaTitlu.anScolar}</p>
      </div>

      {/* Notă de prezentare */}
      <section className="mt-8">
        <h2 className="text-lg font-bold text-foreground">Notă de prezentare</h2>
        <div className="mt-2 space-y-3 text-sm leading-relaxed text-foreground/80">
          {programa.notaDePrezentare.map((p, i) => (
            <p key={i}>{p}</p>
          ))}
        </div>
      </section>

      {/* Competențe cheie */}
      <section className="mt-8">
        <h2 className="text-lg font-bold text-foreground">Competențe cheie europene vizate</h2>
        <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-foreground/80">
          {programa.competenteCheie.map((c) => (
            <li key={c}>{c}</li>
          ))}
        </ul>
      </section>

      {/* Competențe generale */}
      <section className="mt-8">
        <h2 className="text-lg font-bold text-foreground">Competențe generale</h2>
        {programa.competenteGenerale ? (
          <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-foreground/80">
            {programa.competenteGenerale.map((c, i) => (
              <li key={i}>{c}</li>
            ))}
          </ul>
        ) : (
          <p className="mt-2 rounded-xl border border-amber-200 bg-amber-50 p-3 text-sm text-amber-800">
            [DE COMPLETAT — text oficial din Ordinul 4.370/2026]
          </p>
        )}
      </section>

      {/* Valori și atitudini */}
      <section className="mt-8">
        <h2 className="text-lg font-bold text-foreground">Valori și atitudini</h2>
        {programa.valoriSiAtitudini ? (
          <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-foreground/80">
            {programa.valoriSiAtitudini.map((c, i) => (
              <li key={i}>{c}</li>
            ))}
          </ul>
        ) : (
          <p className="mt-2 rounded-xl border border-amber-200 bg-amber-50 p-3 text-sm text-amber-800">
            [DE COMPLETAT — text oficial din Ordinul 4.370/2026]
          </p>
        )}
      </section>

      {/* Competențe specifice și conținuturi */}
      <section className="mt-8">
        <h2 className="text-lg font-bold text-foreground">Competențe specifice și conținuturi</h2>
        <div className="mt-3 overflow-x-auto rounded-xl border border-black/10">
          <table className="w-full min-w-[640px] border-collapse text-left text-sm">
            <thead className="bg-black/[0.03] text-xs uppercase text-foreground/50">
              <tr>
                <th className="border border-black/10 px-3 py-2">Unitate de învățare</th>
                <th className="border border-black/10 px-3 py-2">Competențe specifice</th>
                <th className="border border-black/10 px-3 py-2">Conținuturi</th>
                <th className="border border-black/10 px-3 py-2">Ore</th>
                <th className="border border-black/10 px-3 py-2">Săptămâna</th>
              </tr>
            </thead>
            <tbody>
              {programa.tabel.map((r) => (
                <tr key={r.unitate}>
                  <td className="border border-black/10 px-3 py-2 font-semibold text-foreground">{r.unitate}</td>
                  <td className="border border-black/10 px-3 py-2 text-foreground/70">{r.competenteSpecifice}</td>
                  <td className="border border-black/10 px-3 py-2 text-foreground/70">
                    <ul className="list-disc space-y-0.5 pl-4">
                      {r.continuturi.map((c) => (
                        <li key={c}>{c}</li>
                      ))}
                    </ul>
                  </td>
                  <td className="border border-black/10 px-3 py-2 text-foreground/70">{r.oreAlocate}</td>
                  <td className="border border-black/10 px-3 py-2 text-foreground/70">S{r.saptamana}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="mt-2 text-xs text-foreground/45">
          Numărul de ore și săptămânile sunt valori implicite, editabile din fișierul{" "}
          <code className="rounded bg-black/5 px-1">content/planificari/{clasa}.json</code> — nu necesită cod.
        </p>
      </section>

      {/* Sugestii metodologice */}
      <section className="mt-8">
        <h2 className="text-lg font-bold text-foreground">Sugestii metodologice</h2>
        <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-foreground/80">
          {programa.sugestiiMetodologice.map((s, i) => (
            <li key={i}>{s}</li>
          ))}
        </ul>
      </section>

      {/* Modalități de evaluare */}
      <section className="mt-8">
        <h2 className="text-lg font-bold text-foreground">Modalități de evaluare</h2>
        <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-foreground/80">
          {programa.modalitatiEvaluare.map((m, i) => (
            <li key={i}>{m}</li>
          ))}
        </ul>
      </section>

      {/* Bibliografie */}
      <section className="mt-8 mb-4">
        <h2 className="text-lg font-bold text-foreground">Bibliografie</h2>
        <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-foreground/80">
          {programa.bibliografie.map((b, i) => (
            <li key={i}>{b}</li>
          ))}
        </ul>
      </section>
    </div>
  );
}
