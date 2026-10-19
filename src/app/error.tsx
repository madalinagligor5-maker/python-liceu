"use client";

import Link from "next/link";

// Eroare la randarea unei pagini (răspuns 500). Componentă client: fără
// `metadata`, deci <title> și meta robots sunt randate direct (React le mută în <head>).
export default function Eroare({ retry }: { error: Error & { digest?: string }; retry: () => void }) {
  return (
    <div className="mx-auto max-w-xl px-4 py-20 text-center sm:px-6">
      <title>A apărut o eroare | Academia Python</title>
      <meta name="robots" content="noindex" />
      <p className="text-sm font-bold text-brand">Eroare</p>
      <h1 className="mt-2 text-3xl font-black text-foreground [font-family:var(--font-fraunces)]">
        Ceva nu a mers bine
      </h1>
      <p className="mt-3 text-foreground/70">
        Pagina nu s-a putut încărca acum. Încearcă din nou sau continuă de pe una dintre paginile de mai jos.
      </p>
      <div className="mt-6 flex flex-wrap justify-center gap-3">
        <button
          type="button"
          onClick={() => retry()}
          className="rounded-xl bg-[#172033] px-5 py-2.5 text-sm font-black text-white hover:bg-[#2A3852]"
        >
          Încearcă din nou
        </button>
        <Link href="/" className="rounded-xl border border-black/10 px-5 py-2.5 text-sm font-semibold text-foreground hover:border-brand">
          Pagina principală
        </Link>
        <Link href="/curriculum" className="rounded-xl border border-black/10 px-5 py-2.5 text-sm font-semibold text-foreground hover:border-brand">
          Curriculum
        </Link>
      </div>
    </div>
  );
}
