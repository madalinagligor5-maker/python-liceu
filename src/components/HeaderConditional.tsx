"use client";

import { usePathname } from "next/navigation";
import type { ReactNode } from "react";

/**
 * Afișează children (Header/Footer) pe toate rutele, EXCEPTând dashboard-ul
 * de la "/". Pe dashboard, layout-ul e doar sidebar + conținut (ca în referința
 * vizuală), fără header deasupra.
 */
export default function HeaderConditional({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  if (pathname === "/") return null;
  return <>{children}</>;
}
