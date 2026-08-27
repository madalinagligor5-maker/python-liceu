type Props = {
  className?: string;
  /** Mărimea în px a laturii. Mascota e pătrată. */
  size?: number;
  /** Ascunde mascota de la cititoarele de ecran când e pur decorativă. */
  eticheta?: string;
};

/**
 * Mascota platformei: „Py”, un șarpe albastru cu ochelari (paleta oficială
 * Python: galben + albastru, fără verde).
 * SVG inline (nu fișier extern) ca să moștenească culorile din temă și să nu
 * adauge un request de rețea pe fiecare pagină.
 */
export default function Mascota({ className, size = 96, eticheta }: Props) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 120 120"
      className={className}
      role={eticheta ? "img" : "presentation"}
      aria-label={eticheta}
      aria-hidden={eticheta ? undefined : true}
    >
      {/* corp în spirală */}
      <path
        d="M34 96c0-16 12-24 26-24s24-6 24-18-10-18-22-18H36"
        fill="none"
        stroke="var(--python-blue)"
        strokeWidth="15"
        strokeLinecap="round"
      />
      <path
        d="M34 96c0-16 12-24 26-24"
        fill="none"
        stroke="var(--python-yellow)"
        strokeWidth="7"
        strokeLinecap="round"
        opacity="0.55"
      />

      {/* cap */}
      <circle cx="36" cy="36" r="21" fill="var(--python-blue)" />
      <ellipse cx="33" cy="45" rx="12" ry="8" fill="var(--python-yellow)" opacity="0.85" />

      {/* ochelari */}
      <g stroke="#1b1533" strokeWidth="2.6" fill="#ffffff">
        <circle cx="28" cy="33" r="8" />
        <circle cx="46" cy="33" r="8" />
      </g>
      <path d="M36 33h2" stroke="#1b1533" strokeWidth="2.6" />
      <circle cx="29" cy="34" r="3.1" fill="#1b1533" />
      <circle cx="47" cy="34" r="3.1" fill="#1b1533" />
      <circle cx="30.2" cy="32.8" r="1" fill="#ffffff" />
      <circle cx="48.2" cy="32.8" r="1" fill="#ffffff" />

      {/* zâmbet + limbă */}
      <path
        d="M31 45q6 5 12 0"
        fill="none"
        stroke="#1b1533"
        strokeWidth="2.2"
        strokeLinecap="round"
      />
      <path
        d="M37 49v5l-2.5-2 2.5-1"
        fill="none"
        stroke="#e0446a"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}
