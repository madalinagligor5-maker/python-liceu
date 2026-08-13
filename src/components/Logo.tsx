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
}: {
  className?: string;
  badge?: boolean;
  style?: React.CSSProperties;
}) {
  const img = (
    <Image
      src="/logo.png"
      alt="Academia Python"
      width={1254}
      height={1254}
      className={className}
      style={style}
      priority
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
