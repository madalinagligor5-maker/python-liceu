"use client";

import { usePathname } from "next/navigation";
import type { ReactNode } from "react";

/**
 * Afișează children (Header/Footer) pe toate rutele, EXCEPTând dashboard-ul
 * de la "/" și vizualizarea detaliată a fișelor PDF de resurse care au propriul
 * lor layout de navigare pe tot ecranul.
 */
export default function HeaderConditional({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  
  // Ascunde pe dashboard-ul principal
  if (pathname === "/") return null;
  
  // Ascunde pe vizualizarea detaliată a resursei PDF (ex: /resurse/IX/slug)
  const parti = pathname.split("/").filter(Boolean);
  if (parti[0] === "resurse" && parti.length === 3) {
    return null;
  }
  
  return <>{children}</>;
}
