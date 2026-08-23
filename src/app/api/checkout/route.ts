import { NextRequest, NextResponse } from "next/server";
import { creeazaClientServer } from "@/lib/supabase/server";
import { getStripe, STRIPE_PRICE_IDS } from "@/lib/stripe";

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

  const body: unknown = await request.json().catch(() => ({}));
  const planBrut =
    typeof body === "object" && body !== null ? (body as { plan?: unknown }).plan : undefined;

  const esteplanValid = (p: unknown): p is "lunar" | "anual" => p === "lunar" || p === "anual";

  if (!esteplanValid(planBrut)) {
    return NextResponse.json({ error: "Plan invalid." }, { status: 400 });
  }
  const plan = planBrut;

  const priceId = STRIPE_PRICE_IDS[plan];
  if (!priceId) {
    return NextResponse.json(
      { error: "Acest plan nu este încă configurat (lipsește price ID-ul Stripe)." },
      { status: 500 }
    );
  }

  let stripe;
  try {
    stripe = getStripe();
  } catch {
    return NextResponse.json({ error: "Plățile nu sunt încă configurate." }, { status: 500 });
  }

  try {
    const { data: meta, error: metaErr } = await supabase
      .from("users_meta")
      .select("stripe_customer_id")
      .eq("user_id", user.id)
      .maybeSingle();

    if (metaErr) {
      return NextResponse.json(
        { error: "Eroare DB users_meta: " + metaErr.message },
        { status: 500 }
      );
    }

    let customerId = meta?.stripe_customer_id ?? null;

    if (!customerId) {
      const customer = await stripe.customers.create({
        email: user.email,
        metadata: { supabase_user_id: user.id },
      });
      customerId = customer.id;
      const { error: updErr } = await supabase
        .from("users_meta")
        .update({ stripe_customer_id: customerId })
        .eq("user_id", user.id);
      if (updErr) {
        return NextResponse.json(
          { error: "Eroare update users_meta: " + updErr.message },
          { status: 500 }
        );
      }
    }

    const origin = request.nextUrl.origin;

    const session = await stripe.checkout.sessions.create({
      mode: "subscription",
      customer: customerId,
      client_reference_id: user.id,
      payment_method_types: ["card"],
      line_items: [{ price: priceId, quantity: 1 }],
      subscription_data: {
        metadata: { supabase_user_id: user.id },
        trial_period_days: 7,
      },
      success_url: `${origin}/cont?checkout=success`,
      cancel_url: `${origin}/preturi`,
    });

    return NextResponse.json({ url: session.url });
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e);
    console.error("CHECKOUT_ERR", msg);
    return NextResponse.json({ error: "Eroare Stripe/Supabase: " + msg }, { status: 500 });
  }
}
