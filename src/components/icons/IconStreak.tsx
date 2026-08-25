export default function IconStreak({
  className = "w-5 h-5 text-amber-500",
  size = 20,
}: {
  className?: string;
  size?: number;
}) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
      aria-hidden="true"
    >
      <path d="M12 23c4.97 0 9-3.58 9-8 0-4.42-4-8.5-6-10.5-0.5-0.5-1.5-0.2-1.5 0.5 0 2-1 3.5-3 3.5s-3-2-3-4c0-0.6-0.8-0.9-1.2-0.5C4.2 6.1 3 10.2 3 15c0 4.42 4.03 8 9 8z" />
    </svg>
  );
}
