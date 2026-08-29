import { capitole } from "@/lib/curriculum";
import GeneratorTeste from "@/components/profesor/GeneratorTeste";

export const metadata = { title: "Generator de teste — Academia Python" };

const CLASE_LICEU = ["IX", "X", "XI", "XII"];

export default function GeneratorTestePage() {
  const capitoleLiceu = capitole.filter((c) => CLASE_LICEU.includes(c.clasa));
  return <GeneratorTeste capitoleLiceu={capitoleLiceu} />;
}
