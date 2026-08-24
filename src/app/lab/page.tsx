import type { Metadata } from "next";
import LabClient from "@/components/LabClient";

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
      
      <LabClient />
    </div>
  );
}
