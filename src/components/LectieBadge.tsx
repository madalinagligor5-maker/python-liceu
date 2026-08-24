export default function LectieBadge({ gratuit }: { gratuit: boolean }) {
  if (gratuit) {
    return (
      <span className="inline-flex items-center rounded-full bg-success/10 px-2.5 py-1 text-xs font-semibold text-success">
        Gratuit
      </span>
    );
  }

  return (
    <span className="inline-flex items-center gap-1 rounded-full bg-brand-light px-2.5 py-1 text-xs font-semibold text-brand-dark">
      🔒 Premium
    </span>
  );
}
