"use client";
type Props = {
  cod: string;
  vizibil: boolean;
};

export default function PythonPanel({ cod, vizibil }: Props) {
  if (!vizibil) return null;

  return (
    <div className="rounded-2xl border-2 border-indigo-300 bg-slate-900 overflow-hidden shadow-lg">
      <div className="flex items-center gap-2 bg-slate-800 px-4 py-2">
        <span className="text-lg">🐍</span>
        <span className="text-xs font-bold text-indigo-300 uppercase tracking-widest">
          Limba secretă Python
        </span>
        <span className="ml-auto text-xs text-slate-500">read-only</span>
      </div>
      <pre className="p-4 text-sm text-emerald-300 font-mono leading-relaxed overflow-x-auto whitespace-pre-wrap min-h-[80px]">
        {cod || (
          <span className="text-slate-500 italic">
            # Adaugă blocuri ca să apară codul Python...
          </span>
        )}
      </pre>
    </div>
  );
}
