import { Suspense } from "react";
import type { Metadata } from "next";
import { FARA_INDEXARE } from "@/lib/seo";
import AuthForm from "@/components/auth/AuthForm";

export const metadata: Metadata = {
  title: "Intră în cont",
  robots: FARA_INDEXARE,
};

export default function LoginPage() {
  return (
    <Suspense>
      <AuthForm mod="login" />
    </Suspense>
  );
}
