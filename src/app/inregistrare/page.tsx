import { Suspense } from "react";
import type { Metadata } from "next";
import AuthForm from "@/components/auth/AuthForm";

export const metadata: Metadata = {
  title: "Înregistrare — PythonLiceu",
};

export default function InregistrarePage() {
  return (
    <Suspense>
      <AuthForm mod="inregistrare" />
    </Suspense>
  );
}
