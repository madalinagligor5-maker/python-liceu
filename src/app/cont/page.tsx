import Link from "next/link";
import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { getUtilizatorCurent } from "@/lib/subscription";
import SignOutButton from "@/components/auth/SignOutButton";
import GestioneazaAbonamentButton from "@/components/auth/GestioneazaAbonamentButton";

export const metadata: Metadata = {
  title: "Contul meu — Academia Python",
};

const STATUS_LABEL: Record<string, { text: string; className: string }> = {
  active: { text: "Activ", className: "bg-success/10 text-success" },
  past_due: { text: "Plată restantă", className: "bg-amber-100 text-amber-700" },
  canceled: { text: "Anulat", className: "bg-red-100 text-red-600" },
  none: { text: "Fără abonament", className: "bg-black/5 text-foreground/60" },
};

export default async function ContPage() {
  const { user, meta } = await getUtilizatorCurent();

  if (!user) {
    redirect("/login?redirect=/cont");
  }

  const status = STATUS_LABEL[meta?.subscriptionStatus ?? "none"];
  const dataReinnoire = meta?.subscriptionCurrentPeriodEnd
    ? new Date(meta.subscriptionCurrentPeriodEnd).toLocaleDateString("ro-RO", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : null;

  return (
    <div className="mx-auto max-w-2xl px-4 py-14 sm:px-6">
      <h1 className="text-2xl font-bold text-foreground">Contul meu</h1>

      <div className="mt-6 rounded-2xl border border-black/10 bg-white p-6 shadow-sm">
        <p className="text-sm text-foreground/50">Email</p>
        <p className="font-medium text-foreground">{user.email}</p>

        <p className="mt-4 text-sm text-foreground/50">Status abonament</p>
        <span
          className={`mt-1 inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${status.className}`}
        >
          {status.text}
        </span>

        {dataReinnoire && (
          <p className="mt-3 text-sm text-foreground/60">
            {meta?.subscriptionStatus === "active" ? "Se reînnoiește pe" : "Valabil până pe"}{" "}
            <span className="font-medium text-foreground">{dataReinnoire}</span>
          </p>
        )}

        <div className="mt-6 flex flex-wrap items-center gap-3">
          {meta?.subscriptionStatus === "active" || meta?.stripeCustomerId ? (
            <GestioneazaAbonamentButton />
          ) : (
            <Link
              href="/preturi"
              className="rounded-xl bg-brand px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-brand-dark"
            >
              Vezi planurile de abonament
            </Link>
          )}
          <SignOutButton className="rounded-xl border border-black/10 px-5 py-2.5 text-sm font-semibold text-foreground transition hover:border-red-400 hover:text-red-600" />
        </div>
      </div>

      <div className="mt-6 text-center">
        <Link href="/lectii" className="text-sm font-medium text-brand hover:text-brand-dark">
          ← Vezi toate lecțiile
        </Link>
      </div>
    </div>
  );
}
