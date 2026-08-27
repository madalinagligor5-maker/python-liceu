"use client";

import { usePathname } from "next/navigation";
import type { ReactNode } from "react";

/**
 * Afișează children (Header/Footer) pe toate rutele, EXCEPTând dashboard-ul
 * de la "/" (are propriul meniu, SidebarDashboard) și vizualizarea detaliată
 * a fișelor PDF de resurse care au propriul lor layout de navigare pe tot
 * ecranul. Pe "/" fără autentificare se afișează homepage-ul de marketing —
 * acela TREBUIE să păstreze Header/Footer, altfel vizitatorul anonim rămâne
 * fără nicio cale de navigare pe site.
 */
export default function HeaderConditional({
  children,
  esteAutentificat = false,
}: {
  children: ReactNode;
  esteAutentificat?: boolean;
}) {
  const pathname = usePathname();

  // Ascunde pe dashboard-ul principal (doar când chiar se afișează Dashboard-ul).
  if (pathname === "/" && esteAutentificat) return null;
  
  // Ascunde pe vizualizarea detaliată a resursei PDF (ex: /resurse/IX/slug)
  const parti = pathname.split("/").filter(Boolean);
  if (parti[0] === "resurse" && parti.length === 3) {
    return null;
  }
  
  return <>{children}</>;
}
