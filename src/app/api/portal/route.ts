import { NextRequest, NextResponse } from "next/server";
import { creeazaClientServer } from "@/lib/supabase/server";
import { getStripe } from "@/lib/stripe";

export async function POST(request: NextRequest) {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    return NextResponse.json({ error: "Autentificarea nu este încă configurată." }, { status: 500 });
  }

  const supabase = await creeazaClientServer();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Trebuie să fii autentificat." }, { status: 401 });
  }

  const { data: meta } = await supabase
    .from("users_meta")
    .select("stripe_customer_id")
    .eq("user_id", user.id)
    .maybeSingle();

  if (!meta?.stripe_customer_id) {
    return NextResponse.json({ error: "Nu ai încă un abonament activ." }, { status: 400 });
  }

  let stripe;
  try {
    stripe = getStripe();
  } catch {
    return NextResponse.json({ error: "Plățile nu sunt încă configurate." }, { status: 500 });
  }

  const portalSession = await stripe.billingPortal.sessions.create({
    customer: meta.stripe_customer_id,
    return_url: `${request.nextUrl.origin}/cont`,
  });

  return NextResponse.json({ url: portalSession.url });
}
