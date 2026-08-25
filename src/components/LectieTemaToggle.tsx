"use client";

export default function LectieTemaToggle({
  isDark = false,
  onToggle,
}: {
  isDark?: boolean;
  onToggle?: () => void;
}) {
  return (
    <button
      onClick={onToggle}
      type="button"
      className={`flex items-center gap-1.5 rounded-xl border px-3.5 py-1.5 text-xs font-black transition shadow-xs cursor-pointer ${
        isDark
          ? "border-amber-400/50 bg-[#2A2A3C] text-amber-300 hover:bg-[#35354B]"
          : "border-slate-300 bg-white text-slate-900 hover:bg-slate-50"
      }`}
      aria-label="Comută modul întunecat de lectură"
      title="Comută modul întunecat de lectură"
    >
      <span>{isDark ? "☀️ Mod Luminos" : "🌙 Mod Întunecat (Notebook)"}</span>
    </button>
  );
}
