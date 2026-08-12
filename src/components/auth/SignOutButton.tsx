"use client";

import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { creeazaClientBrowser } from "@/lib/supabase/client";

export default function SignOutButton({ className }: { className?: string }) {
  const router = useRouter();
  const [sePending, startTransition] = useTransition();

  return (
    <button
      type="button"
      disabled={sePending}
      onClick={() => {
        startTransition(async () => {
          const supabase = creeazaClientBrowser();
          await supabase.auth.signOut();
          router.push("/");
          router.refresh();
        });
      }}
      className={className}
    >
      {sePending ? "Se deconectează..." : "Deconectare"}
    </button>
  );
}
