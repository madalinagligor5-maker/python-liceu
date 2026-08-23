import type { Metadata } from "next";
import PythonEditor from "@/components/PythonEditor";

export const metadata: Metadata = {
  title: "Lab (Cod online) — Academia Python",
  description: "Scrie și rulează cod Python direct în browser, fără instalare.",
};

export default function LabPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6">
      <div className="mb-6">
        <h1 className="text-3xl font-extrabold text-foreground sm:text-4xl">Lab (Cod online)</h1>
        <p className="mt-2 text-foreground/70 text-sm">
          Aici este nisiparul tău de experimentat (Sandbox). Scrie orice cod Python dorești și apasă pe butonul de rulare pentru a-l executa pe loc în browser!
        </p>
      </div>
      
      <PythonEditor 
        initialCode={`# Scrie codul tău Python mai jos\n\nfor i in range(5):\n    print("Nivel", i + 1, "la Academia Python! 🐍")\n`}
        titlu="Sandbox Python"
        height={320}
      />
    </div>
  );
}
