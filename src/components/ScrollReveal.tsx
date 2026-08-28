"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Dezvăluie copiii la intrarea în viewport (fade + slide-up), cu stagger
 * opțional via `index` (fiecare element următor pornește puțin mai târziu).
 * Respectă prefers-reduced-motion prin clasa CSS `.reveal` din globals.css —
 * acolo animația e complet dezactivată, elementul rămâne vizibil instant.
 *
 * Folosit consecvent în homepage, dashboard și lecții — un singur sistem de
 * mișcare, nu cod de animație diferit de fiecare dată.
 */
export default function ScrollReveal({
  children,
  index = 0,
  delayMs = 80,
  as: Tag = "div",
  className = "",
}: {
  children: React.ReactNode;
  /** Poziția elementului într-un grup — controlează decalajul de stagger. */
  index?: number;
  /** Decalaj în ms per poziție de index. */
  delayMs?: number;
  as?: "div" | "section" | "li";
  className?: string;
}) {
  const ref = useRef<HTMLElement | null>(null);
  const [vizibil, setVizibil] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observator = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setVizibil(true);
            observator.disconnect();
          }
        }
      },
      { threshold: 0.15, rootMargin: "0px 0px -40px 0px" }
    );
    observator.observe(el);
    return () => observator.disconnect();
  }, []);

  return (
    <Tag
      ref={ref as never}
      className={`reveal ${vizibil ? "is-visible" : ""} ${className}`}
      style={{ "--reveal-delay": `${index * delayMs}ms` } as React.CSSProperties}
    >
      {children}
    </Tag>
  );
}
