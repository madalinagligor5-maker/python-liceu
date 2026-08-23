"use client";

export default function PrintFallbackActions() {
  const handlePrint = () => {
    if (typeof window !== "undefined") {
      window.print();
    }
  };

  const handleClose = () => {
    if (typeof window !== "undefined") {
      window.close();
    }
  };

  return (
    <div className="mt-6 flex flex-col gap-2">
      <button
        type="button"
        onClick={handlePrint}
        className="w-full rounded-xl bg-brand px-5 py-3 text-sm font-semibold text-white transition hover:bg-brand-dark cursor-pointer"
      >
        🖨️ Deschide manual caseta de salvare
      </button>
      
      <button
        type="button"
        onClick={handleClose}
        className="w-full rounded-xl border border-black/10 px-5 py-3 text-sm font-semibold text-foreground/80 transition hover:bg-black/5 cursor-pointer"
      >
        Închide această filă
      </button>
    </div>
  );
}
