"use client";

import { useEffect, useState } from "react";
import PythonEditor from "@/components/PythonEditor";

export default function LabClient() {
  const [initialCode, setInitialCode] = useState<string | null>(null);

  useEffect(() => {
    // Bootstrap client-only (localStorage) -- randat identic (null -> loading)
    // pe server si client la primul pass, actualizat dupa mount.
    const saved = localStorage.getItem("lab_sandbox_code");
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setInitialCode(
      saved || `# Scrie codul tău Python mai jos\n\nfor i in range(5):\n    print("Nivel", i + 1, "la Academia Python! 🐍")\n`
    );
  }, []);

  const handleCodeChange = (code: string) => {
    localStorage.setItem("lab_sandbox_code", code);
  };

  if (initialCode === null) {
    return (
      <div className="flex h-48 items-center justify-center rounded-2xl border border-black/10 bg-slate-50 font-medium text-slate-400">
        Se încarcă laboratorul...
      </div>
    );
  }

  return (
    <PythonEditor
      initialCode={initialCode}
      titlu="Sandbox Python"
      height={320}
      onCodeChange={handleCodeChange}
    />
  );
}
