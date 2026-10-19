/** Un bloc <script type="application/ld+json">. Datele vin din src/lib/dateStructurate.ts. */
export default function JsonLd({ date }: { date: object }) {
  return (
    <script
      type="application/ld+json"
      // „<" e escapat ca textul din date să nu poată închide tag-ul <script>.
      dangerouslySetInnerHTML={{ __html: JSON.stringify(date).replace(/</g, "\\u003c") }}
    />
  );
}
