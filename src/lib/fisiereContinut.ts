/**
 * Acces la fișierele din content/, cu căi relative la rădăcina proiectului
 * („content/blog/x.md"), dintr-un pachet generat la build de
 * scripts/genereaza-continut.mjs (src/generated/<pachet>.json).
 *
 * Pe Cloudflare Workers nu există sistem de fișiere, deci `fs.readFile` nu
 * merge la cerere. Fiecare loader importă doar pachetul lui, ca rutele să nu
 * includă conținut pe care nu-l folosesc (Worker-ul are limită de mărime).
 * În dezvoltare, după o modificare în content/, repornește `npm run dev`.
 */
export function pachetContinut(fisiere: Record<string, string>) {
  return {
    async citesteText(cale: string): Promise<string> {
      const continut = fisiere[cale];
      if (continut === undefined) throw new Error(`Fișier inexistent în pachetul de conținut: ${cale}`);
      return continut;
    },
    /** Numele fișierelor dintr-un director (nerecursiv), ex. „content/blog". */
    async listeazaFisiere(dir: string): Promise<string[]> {
      const prefix = `${dir.replace(/\/$/, "")}/`;
      return Object.keys(fisiere)
        .filter((c) => c.startsWith(prefix) && !c.slice(prefix.length).includes("/"))
        .map((c) => c.slice(prefix.length));
    },
  };
}
