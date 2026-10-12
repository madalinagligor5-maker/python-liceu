"use client";

import { EVENIMENT_SETARI_COOKIE } from "@/components/ConsimtamantCookie";

/** Redeschide bannerul de cookie-uri, ca alegerea să poată fi schimbată oricând. */
export default function ButonSetariCookie({ className }: { className?: string }) {
  return (
    <button type="button" onClick={() => window.dispatchEvent(new Event(EVENIMENT_SETARI_COOKIE))} className={className}>
      Setări cookie
    </button>
  );
}
