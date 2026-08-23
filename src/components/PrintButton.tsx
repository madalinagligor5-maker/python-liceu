"use client";

export default function PrintButton() {
  return (
    <button
      type="button"
      onClick={() => window.print()}
      className="inline-flex items-center gap-2 rounded-xl border border-black/10 bg-white px-4 py-2.5 text-xs font-semibold text-foreground/80 shadow-sm transition hover:border-brand hover:text-brand cursor-pointer"
    >
      <span aria-hidden="true">🖨️</span>
      Printează fișa (sau salvează PDF)
    </button>
  );
}
