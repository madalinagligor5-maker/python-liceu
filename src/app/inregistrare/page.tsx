import { Suspense } from "react";
import type { Metadata } from "next";
import { FARA_INDEXARE } from "@/lib/seo";
import AuthForm from "@/components/auth/AuthForm";

export const metadata: Metadata = {
  title: "Înregistrare",
  robots: FARA_INDEXARE,
};

export default function InregistrarePage() {
  return (
    <Suspense>
      <AuthForm mod="inregistrare" />
    </Suspense>
  );
}
