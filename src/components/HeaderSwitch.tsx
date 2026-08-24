"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function HeaderSwitch() {
  const pathname = usePathname();
  const isKids = pathname?.startsWith("/kids");

  return (
    <div className="flex items-center gap-0.5 bg-slate-100 p-0.5 rounded-full border border-black/5 select-none shrink-0 scale-90 sm:scale-100">
      <Link
        href="/kids"
        className={`flex items-center gap-1 px-3 py-1.5 text-[11px] sm:text-xs font-extrabold rounded-full transition ${
          isKids
            ? "bg-amber-400 text-amber-950 shadow-sm"
            : "text-foreground/60 hover:text-foreground"
        }`}
      >
        <span>🎒 Kids (I-IV)</span>
      </Link>
      <Link
        href="/curriculum"
        className={`flex items-center gap-1 px-3 py-1.5 text-[11px] sm:text-xs font-extrabold rounded-full transition ${
          !isKids
            ? "bg-brand text-white shadow-sm"
            : "text-foreground/60 hover:text-foreground"
        }`}
      >
        <span>🚀 Liceu (IX-XII)</span>
      </Link>
    </div>
  );
}
