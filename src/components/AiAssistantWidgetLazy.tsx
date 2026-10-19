"use client";

import dynamic from "next/dynamic";

/**
 * Asistentul AI demo de pe homepage, încărcat abia după hidratarea paginii
 * (e sub fold și nu are conținut de indexat). Placeholder-ul are înălțimea
 * cardului închis (măsurată: ~154px pe mobil, ~137px pe desktop), ca să nu
 * apară salt de layout.
 */
const AiAssistantWidget = dynamic(() => import("@/components/AiAssistantWidget"), {
  ssr: false,
  loading: () => (
    <div
      aria-hidden="true"
      className="min-h-[154px] rounded-2xl border border-slate-200 bg-white shadow-lg sm:min-h-[137px]"
    />
  ),
});

export default function AiAssistantWidgetLazy() {
  return <AiAssistantWidget />;
}
