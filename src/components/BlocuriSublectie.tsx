import { Bloc } from "@/lib/markdownMini";
import CodeBlock from "@/components/CodeBlock";

const CARD_CLASSE: Record<string, string> = {
  tip: "bloc-card bloc-card--tip",
  exemplu: "bloc-card bloc-card--exemplu",
  atentie: "bloc-card bloc-card--atentie",
};

const CARD_ICON: Record<string, string> = {
  tip: "💡",
  exemplu: "📌",
  atentie: "⚠️",
};

/**
 * Redă blocurile unei sublecții (paragrafe/liste ca HTML, cod ca componentă,
 * carduri de teorie). Pentru sublecțiile de tip „Verifică-ți înțelegerea",
 * nu redăm nimic aici — widget-ul QuizSublectie afișează totul interactiv.
 */
export default function BlocuriSublectie({
  blocuri,
  esteVerificare = false,
  esteExercitii = false,
  permiteRulare = true,
}: {
  blocuri: Bloc[];
  esteVerificare?: boolean;
  esteExercitii?: boolean;
  /** False la pasul „Citește și prezice". */
  permiteRulare?: boolean;
}) {
  if (esteVerificare || esteExercitii) return null;

  return (
    <div className="space-y-5">
      {blocuri
        .filter(
          (b) =>
            !(
              b.tip === "text" &&
              /a\)\s.*b\)\s.*c\)/.test(b.html)
            )
        )
        .map((b, i) => {
          if (b.tip === "code") {
            // Exemplele complete pot fi rulate; cele cu spații de completat (___) nu.
            // Nu și la „Citește și prezice" (ar da răspunsul înainte de predicție),
            // nici exemplele care cer date (input) sau module indisponibile în browser.
            const rulabil =
              permiteRulare &&
              b.lang === "python" &&
              b.code.trim().length > 0 &&
              !b.code.includes("___") &&
              !/\binput\s*\(/.test(b.code) &&
              !/^\s*(import|from)\s+(turtle|tkinter|pygame|numpy|pandas|matplotlib|sklearn|sqlite3|requests)\b/m.test(b.code);
            return <CodeBlock key={i} code={b.code} label={`${b.lang}.py`} ruleaza={rulabil} />;
          }
          if (b.tip === "card") {
            return (
              <div key={i} className={CARD_CLASSE[b.variant]}>
                <div className="flex items-start gap-3">
                  <span className="bloc-card--icon" aria-hidden="true">
                    {CARD_ICON[b.variant]}
                  </span>
                  <div
                    className="bloc-card--corp"
                    dangerouslySetInnerHTML={{ __html: b.html }}
                  />
                </div>
              </div>
            );
          }
          if (b.tip === "text") {
            return (
              <div
                key={i}
                className="max-w-[68ch] text-[15.5px] leading-[1.75] text-foreground/90 [&_p+p]:mt-4"
                dangerouslySetInnerHTML={{ __html: b.html }}
              />
            );
          }
          return null;
        })}
    </div>
  );
}
