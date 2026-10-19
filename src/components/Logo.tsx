import Image from "next/image";

/**
 * Logo-ul oficial (PNG trimis de utilizator, fundal alb).
 * Pe fundal deschis (header, footer) stă direct. Pe sidebar-ul închis
 * se folosește varianta cu `badge` (cartonaș rotunjit deschis) ca să nu
 * fie un pătrat alb brutal pe mov.
 */
export default function Logo({
  className = "",
  badge = false,
  style,
  prioritar = false,
}: {
  className?: string;
  badge?: boolean;
  style?: React.CSSProperties;
  /** Doar pentru logo-ul din header (vizibil imediat la încărcare). */
  prioritar?: boolean;
}) {
  // Logo-ul apare mereu lângă numele scris „Academia Python", deci e
  // decorativ: alt="" (altfel cititoarele de ecran ar anunța numele de două ori).
  // width/height = mărimea afișată (max. 40px), fără `sizes`: next/image
  // generează doar variantele 1x/2x (48 și 96px). Înainte cerea varianta de
  // 3840px a PNG-ului de 1254×1254 (~100 KB).
  const img = (
    <Image
      src="/logo.png"
      alt=""
      width={40}
      height={40}
      className={className}
      style={style}
      priority={prioritar}
    />
  );

  if (badge) {
    return (
      <div className="rounded-2xl bg-white p-2 shadow-sm">
        <div className="relative aspect-square w-full overflow-hidden">{img}</div>
      </div>
    );
  }

  return img;
}
