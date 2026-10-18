import type { Metadata } from "next";
import ResetareParolaForm from "@/components/auth/ResetareParolaForm";

export const metadata: Metadata = {
  title: "Parolă nouă",
  robots: { index: false },
};

export default function ResetareParolaPage() {
  return <ResetareParolaForm />;
}
