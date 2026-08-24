"use client";

type StareByte = "fericit" | "curios" | "nedumerit" | "sarbatoare" | "trist";

type Props = {
  stare?: StareByte;
  mesaj?: string;
  className?: string;
};

const EMOJI_STARE: Record<StareByte, string> = {
  fericit: "😊",
  curios: "🤔",
  nedumerit: "😕",
  sarbatoare: "🎉",
  trist: "😅",
};

const CULOARE_STARE: Record<StareByte, string> = {
  fericit: "bg-emerald-50 border-emerald-200 text-emerald-800",
  curios: "bg-amber-50 border-amber-200 text-amber-800",
  nedumerit: "bg-slate-50 border-slate-200 text-slate-700",
  sarbatoare: "bg-yellow-50 border-yellow-300 text-yellow-800",
  trist: "bg-orange-50 border-orange-200 text-orange-800",
};

export default function MascotaByte({ stare = "fericit", mesaj, className = "" }: Props) {
  return (
    <div className={`flex items-start gap-3 ${className}`}>
      {/* Avatar Byte */}
      <div
        className={`
          relative flex-shrink-0 flex h-14 w-14 items-center justify-center
          rounded-2xl border-2 text-3xl shadow-md
          ${CULOARE_STARE[stare]}
        `}
        style={{
          animation: stare === "sarbatoare" ? "bounce 0.5s infinite" : undefined,
        }}
        role="img"
        aria-label={`Byte este ${stare}`}
      >
        {/* Corp robot SVG simplu */}
        <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
          {/* Antenă */}
          <line x1="20" y1="4" x2="20" y2="11" stroke="#6366f1" strokeWidth="2" strokeLinecap="round"/>
          <circle cx="20" cy="3" r="2" fill="#6366f1"/>
          {/* Corp */}
          <rect x="8" y="11" width="24" height="20" rx="6" fill="#e0e7ff" stroke="#6366f1" strokeWidth="2"/>
          {/* Ochi */}
          <circle cx="15" cy="19" r="3" fill="#4f46e5"/>
          <circle cx="25" cy="19" r="3" fill="#4f46e5"/>
          {/* Pupile */}
          <circle cx="15.5" cy="19.5" r="1.2" fill="white"/>
          <circle cx="25.5" cy="19.5" r="1.2" fill="white"/>
          {/* Gură (variabilă după stare) */}
          {stare === "fericit" || stare === "sarbatoare" ? (
            <path d="M14 26 Q20 30 26 26" stroke="#4f46e5" strokeWidth="2" fill="none" strokeLinecap="round"/>
          ) : stare === "trist" || stare === "nedumerit" ? (
            <path d="M14 28 Q20 25 26 28" stroke="#4f46e5" strokeWidth="2" fill="none" strokeLinecap="round"/>
          ) : (
            <line x1="14" y1="27" x2="26" y2="27" stroke="#4f46e5" strokeWidth="2" strokeLinecap="round"/>
          )}
          {/* Brațe */}
          <rect x="2" y="14" width="6" height="10" rx="3" fill="#c7d2fe" stroke="#6366f1" strokeWidth="1.5"/>
          <rect x="32" y="14" width="6" height="10" rx="3" fill="#c7d2fe" stroke="#6366f1" strokeWidth="1.5"/>
          {/* Picioare */}
          <rect x="11" y="29" width="7" height="8" rx="3" fill="#c7d2fe" stroke="#6366f1" strokeWidth="1.5"/>
          <rect x="22" y="29" width="7" height="8" rx="3" fill="#c7d2fe" stroke="#6366f1" strokeWidth="1.5"/>
        </svg>
      </div>

      {/* Balon mesaj */}
      {mesaj && (
        <div
          className={`
            relative rounded-2xl rounded-tl-sm border-2 px-4 py-3 text-sm font-semibold leading-snug shadow-sm
            max-w-xs ${CULOARE_STARE[stare]}
          `}
        >
          {mesaj}
        </div>
      )}
    </div>
  );
}
