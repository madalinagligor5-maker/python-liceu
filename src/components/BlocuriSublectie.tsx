import { Bloc } from "@/lib/markdownMini";
import CodeBlock from "@/components/CodeBlock";

/** Redă blocurile unei sublecții (paragrafe/liste ca HTML, cod ca componentă). */
export default function BlocuriSublectie({ blocuri }: { blocuri: Bloc[] }) {
  return (
    <div className="space-y-4">
      {blocuri.map((b, i) =>
        b.tip === "code" ? (
          <CodeBlock key={i} code={b.code} label={`${b.lang}.py`} />
        ) : (
          <div
            key={i}
            className="text-[15px] leading-relaxed text-foreground/90"
            dangerouslySetInnerHTML={{ __html: b.html }}
          />
        )
      )}
    </div>
  );
}
