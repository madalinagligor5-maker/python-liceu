"use client";

export default function PrintButton() {
  return (
    <button
      type="button"
      onClick={() => {
        if (typeof window !== "undefined") window.print();
      }}
      className="rounded-full bg-amber-400 hover:bg-amber-500 text-slate-950 font-black py-2 px-6 text-xs transition shadow-sm cursor-pointer"
    >
      🖨️ Printează Acum
    </button>
  );
}
