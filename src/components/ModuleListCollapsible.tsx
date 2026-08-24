"use client";

import { useState } from "react";
import type { Modul } from "@/lib/curriculum";

export default function ModuleListCollapsible({
  module,
  clasa,
}: {
  module: Modul[];
  clasa: string;
}) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div>
      <ul className="mt-4 flex flex-wrap gap-2">
        {module.map((m, idx) => (
          <li
            key={m.cod}
            className={`rounded-full bg-surface border border-border px-3 py-1 text-xs font-medium text-foreground/80 transition-all ${
              idx >= 3 ? (expanded ? "block animate-fade-in" : "hidden sm:block") : "block"
            }`}
          >
            {m.cod} {m.titlu}
          </li>
        ))}
        {!expanded && module.length > 3 && (
          <li className="sm:hidden">
            <button
              type="button"
              onClick={() => setExpanded(true)}
              className="rounded-full bg-brand-light border border-brand-border px-3 py-1 text-xs font-bold text-brand-dark hover:bg-brand/10 transition cursor-pointer"
            >
              + {module.length - 3} module
            </button>
          </li>
        )}
      </ul>
    </div>
  );
}
