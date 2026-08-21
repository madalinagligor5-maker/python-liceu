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
}: {
  blocuri: Bloc[];
  esteVerificare?: boolean;
  esteExercitii?: boolean;
}) {
  if (esteVerificare || esteExercitii) return null;

  return (
    <div className="space-y-4">
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
            return <CodeBlock key={i} code={b.code} label={`${b.lang}.py`} />;
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
                className="text-[15px] leading-relaxed text-foreground/90"
                dangerouslySetInnerHTML={{ __html: b.html }}
              />
            );
          }
          return null;
        })}
    </div>
  );
}
