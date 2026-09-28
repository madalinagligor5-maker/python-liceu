import Link from "next/link";
import { TRASEE } from "@/lib/trasee";

/**
 * Cele patru trasee, cu public, cunoștințe necesare, rezultat și acces
 * gratuit. Butonul principal duce direct la prima activitate a traseului.
 */
export default function CarduriTrasee({ nivelTitlu = "h2" }: { nivelTitlu?: "h2" | "h3" }) {
  const Titlu = nivelTitlu;
  return (
    <ul className="grid gap-5 sm:grid-cols-2">
      {TRASEE.map((t) => (
        <li
          key={t.id}
          className="flex flex-col rounded-3xl border border-[#EBE7DF] bg-white p-5 shadow-depth-sm sm:p-6"
        >
          <div className="flex items-center gap-3">
            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-amber-50 text-2xl border border-amber-200" aria-hidden="true">
              {t.icon}
            </span>
            <div>
              <Titlu className="text-xl font-black text-[#1E2430]">{t.nume}</Titlu>
              <p className="text-xs font-semibold text-[#525B6C]">{t.subtitlu}</p>
            </div>
          </div>

          <dl className="mt-4 space-y-2.5 text-sm text-[#3B4252]">
            <div>
              <dt className="text-[11px] font-black uppercase tracking-wider text-[#525B6C]">Pentru cine</dt>
              <dd>{t.public}</dd>
            </div>
            <div>
              <dt className="text-[11px] font-black uppercase tracking-wider text-[#525B6C]">Ce trebuie să știi</dt>
              <dd>{t.necesar}</dd>
            </div>
            <div>
              <dt className="text-[11px] font-black uppercase tracking-wider text-[#525B6C]">Ce vei putea face</dt>
              <dd>{t.rezultat}</dd>
            </div>
            <div>
              <dt className="text-[11px] font-black uppercase tracking-wider text-[#525B6C]">Acces gratuit</dt>
              <dd>{t.gratuit}</dd>
            </div>
          </dl>

          <div className="mt-auto flex flex-wrap items-center gap-x-4 gap-y-2 pt-5">
            <Link
              href={t.primaActivitate.href}
              className="rounded-xl bg-amber-400 px-5 py-3 text-sm font-black text-slate-950 shadow-xs transition hover:bg-amber-500 active:scale-95"
            >
              {t.primaActivitate.eticheta} →
            </Link>
            <Link href={t.ansamblu.href} className="text-sm font-bold text-[#1E2430] underline decoration-amber-400 underline-offset-4 hover:text-amber-800">
              {t.ansamblu.eticheta}
            </Link>
            {t.alternativa && (
              <Link href={t.alternativa.href} className="basis-full text-xs font-semibold text-[#525B6C] underline underline-offset-4 hover:text-amber-800">
                sau: {t.alternativa.eticheta}
              </Link>
            )}
          </div>
        </li>
      ))}
    </ul>
  );
}
