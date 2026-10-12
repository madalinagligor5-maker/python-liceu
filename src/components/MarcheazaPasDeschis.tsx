"use client";

import { useEffect } from "react";
import { marcheazaPasDeschis } from "@/lib/progresLocal";
import { trimiteEveniment, trimiteOData } from "@/lib/analytics";

/**
 * Notează că pasul a fost deschis — folosit pentru „Continuă de unde ai rămas"
 * și pentru măsurare (lecție deschisă + prima lecție din acest browser).
 */
export default function MarcheazaPasDeschis({ cod, sursa = "curriculum" }: { cod: string; sursa?: string }) {
  useEffect(() => {
    marcheazaPasDeschis(cod);
    trimiteEveniment("lectie_deschisa", { cod, sursa });
    trimiteOData("prima_lectie", "prima_lectie", { cod, sursa });
  }, [cod, sursa]);
  return null;
}
