"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function HeaderSwitch() {
  const pathname = usePathname();
  const isKids = pathname?.startsWith("/kids");

  return (
    <div className="flex items-center gap-0.5 bg-slate-100/80 p-0.5 rounded-full border border-black/8 select-none shrink-0">
      <Link
        href="/kids"
        className={`px-2.5 py-1 text-[10px] font-bold rounded-full transition ${
          isKids
            ? "bg-amber-400/90 text-amber-950 shadow-sm"
            : "text-foreground/50 hover:text-foreground/80"
        }`}
      >
        Kids
      </Link>
      <Link
        href="/curriculum"
        className={`px-2.5 py-1 text-[10px] font-bold rounded-full transition ${
          !isKids
            ? "bg-amber-400 text-slate-950 font-black shadow-sm"
            : "text-foreground/70 hover:text-foreground"
        }`}
      >
        Liceu
      </Link>
    </div>
  );
}
