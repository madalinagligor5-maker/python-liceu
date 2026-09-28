"use client";

import { useEffect } from "react";
import { marcheazaPasDeschis } from "@/lib/progresLocal";

/** Notează că pasul a fost deschis — folosit doar pentru „Continuă de unde ai rămas". */
export default function MarcheazaPasDeschis({ cod }: { cod: string }) {
  useEffect(() => {
    marcheazaPasDeschis(cod);
  }, [cod]);
  return null;
}
