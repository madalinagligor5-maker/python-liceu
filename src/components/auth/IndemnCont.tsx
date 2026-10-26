"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

/**
 * Îndemn scurt pentru vizitatorii fără cont, după un quiz: linkuri directe
 * spre cont nou / intră în cont, cu întoarcere pe pagina curentă.
 */
export default function IndemnCont({ text = "ca să-ți salvezi progresul și să câștigi XP." }: { text?: string }) {
  const redirect = encodeURIComponent(usePathname() ?? "/");
  return (
    <>
      <Link href={`/inregistrare?redirect=${redirect}`} className="font-bold text-brand underline underline-offset-2">
        Creează cont gratuit
      </Link>{" "}
      sau{" "}
      <Link href={`/login?redirect=${redirect}`} className="font-bold text-brand underline underline-offset-2">
        intră în cont
      </Link>{" "}
      {text}
    </>
  );
}
