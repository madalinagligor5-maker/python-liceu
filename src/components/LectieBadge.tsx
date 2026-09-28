import { ETICHETE_ACCES, type NivelAcces } from "@/lib/acces";

export default function LectieBadge({ nivel }: { nivel: NivelAcces }) {
  const e = ETICHETE_ACCES[nivel];
  return (
    <span
      title={e.explicatie}
      className={`inline-flex items-center gap-1 whitespace-nowrap rounded-full px-2.5 py-1 text-xs font-semibold ${e.clasa}`}
    >
      {nivel === "abonament" && <span aria-hidden="true">🔒</span>}
      {e.text}
    </span>
  );
}
