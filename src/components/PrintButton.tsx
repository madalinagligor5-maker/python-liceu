"use client";

export default function PrintButton() {
  return (
    <button
      type="button"
      onClick={() => {
        if (typeof window !== "undefined") window.print();
      }}
      className="rounded-full bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold py-2 px-6 text-xs transition shadow-sm cursor-pointer"
    >
      🖨️ Printează Acum
    </button>
  );
}
