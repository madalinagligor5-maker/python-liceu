export default function IconXp({
  className = "w-5 h-5 text-indigo-500",
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
      fill="none"
      stroke="currentColor"
      strokeWidth="2.2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <path d="M6 3h12l4 6-10 12L2 9l4-6z" />
      <path d="M11 3l-3 6 4 12 4-12-3-6" />
      <path d="M2 9h20" />
    </svg>
  );
}
