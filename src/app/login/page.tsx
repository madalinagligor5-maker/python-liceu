import { Suspense } from "react";
import type { Metadata } from "next";
import AuthForm from "@/components/auth/AuthForm";

export const metadata: Metadata = {
  title: "Autentificare — Academia Python",
};

export default function LoginPage() {
  return (
    <Suspense>
      <AuthForm mod="login" />
    </Suspense>
  );
}
