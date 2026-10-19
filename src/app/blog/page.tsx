import Link from "next/link";
import { getToateArticolele } from "@/lib/blog";
import { metadatePagina } from "@/lib/seo";

export const metadata = metadatePagina({
  titlu: "Blog",
  descriere: "Ghiduri Python în română pentru începători, elevi și părinți: variabile, if, for, liste, funcții, erori frecvente și probleme rezolvate.",
  cale: "/blog",
});

function formateazaData(data: string): string {
  if (!data) return "";
  const d = new Date(`${data}T00:00:00`);
  if (Number.isNaN(d.getTime())) return data;
  return new Intl.DateTimeFormat("ro-RO", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(d);
}

export default async function BlogPage() {
  const articole = await getToateArticolele();

  return (
    <div className="page-shell max-w-6xl">
      <span className="eyebrow">Jurnalul Academiei</span>
      <h1 className="mt-5 max-w-3xl text-4xl font-black leading-[1.03] text-foreground sm:text-6xl [font-family:var(--font-fraunces)]">
        Idei care fac programarea mai ușor de înțeles
      </h1>
      <p className="mt-5 max-w-2xl text-base leading-relaxed text-muted sm:text-lg">
        Ghiduri Python pentru începători, elevi, părinți și profesori — cu exemple pe care le poți rula în browser.
      </p>

      {articole.length === 0 ? (
        <div className="mt-10 rounded-2xl border border-border bg-white p-8 text-center shadow-sm">
          <p className="text-sm text-foreground/65">
            Nu există încă niciun articol publicat. Revino în curând.
          </p>
        </div>
      ) : (
        <div className="mt-14 border-t border-black/10">
          {articole.map((articol, index) => (
            <Link
              key={articol.slug}
              href={`/blog/${articol.slug}`}
              className="group grid gap-3 border-b border-black/10 py-7 transition hover:bg-white/55 sm:grid-cols-[3rem_1fr_auto] sm:items-start sm:px-4"
            >
              <span className="font-mono text-xs text-[#B96D08]">{String(index + 1).padStart(2, "0")}</span>
              <div><p className="text-xs font-medium text-foreground/70">
                {formateazaData(articol.data)} · {articol.minuteCitire} min
              </p>
              <h2 className="mt-2 text-xl font-bold leading-tight text-foreground transition group-hover:text-[#2F6191] sm:text-2xl [font-family:var(--font-fraunces)]">
                {articol.titlu}
              </h2>
              <p className="mt-2 text-sm leading-relaxed text-foreground/70">
                {articol.descriere}
              </p>
              </div><span className="hidden pt-6 text-xl transition group-hover:translate-x-1 sm:block">→</span>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
