export default function CodeBlock({ code, label }: { code: string; label?: string }) {
  return (
    <div className="overflow-hidden rounded-xl border border-black/10 bg-[#1e1b3a] shadow-sm">
      {label && (
        <div className="flex items-center gap-1.5 border-b border-white/10 px-4 py-2">
          <span className="h-2.5 w-2.5 rounded-full bg-[#ff5f56]" />
          <span className="h-2.5 w-2.5 rounded-full bg-[#ffbd2e]" />
          <span className="h-2.5 w-2.5 rounded-full bg-[#27c93f]" />
          <span className="ml-2 text-xs font-medium text-white/50">{label}</span>
        </div>
      )}
      <pre className="overflow-x-auto p-4 text-sm leading-relaxed text-white">
        <code className="font-mono">{code}</code>
      </pre>
    </div>
  );
}
