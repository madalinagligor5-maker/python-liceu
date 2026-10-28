import { NextRequest, NextResponse } from "next/server";
import { creeazaClientServer } from "@/lib/supabase/server";
import { creeazaClientAdmin } from "@/lib/supabase/admin";
import { getUtilizatorCurent } from "@/lib/subscription";
import { areAccesPlatit } from "@/lib/accesPlatit";
import { getStripe, STRIPE_PRICE_IDS, STRIPE_PRICE_IDS_CURS } from "@/lib/stripe";

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
  const bodyObj = typeof body === "object" && body !== null ? (body as Record<string, unknown>) : {};
  const planBrut = bodyObj.plan;
  const produsBrut = bodyObj.produs;

  const esteplanValid = (p: unknown): p is "lunar" | "anual" => p === "lunar" || p === "anual";

  if (!esteplanValid(planBrut)) {
    return NextResponse.json({ error: "Plan invalid." }, { status: 400 });
  }
  const plan = planBrut;

  // "produs" spune din ce pagină s-a cumpărat (liceu sau Curs practic) și
  // alege price ID-urile. Orice abonament dă acces la tot conținutul plătit.
  const produs = produsBrut === "curs" ? "curs" : "liceu";
  const priceId = produs === "curs" ? STRIPE_PRICE_IDS_CURS[plan] : STRIPE_PRICE_IDS[plan];
  if (!priceId) {
    return NextResponse.json(
      { error: "Acest plan nu este încă configurat (lipsește price ID-ul Stripe)." },
      { status: 500 }
    );
  }

  // Un abonament activ include deja tot (liceu + Curs practic): nu lăsăm un
  // al doilea abonament plătit pentru același cont.
  const { meta: metaAcces } = await getUtilizatorCurent();
  if (await areAccesPlatit({ id: user.id, email: user.email ?? "" }, metaAcces)) {
    return NextResponse.json(
      { error: "Ai deja un abonament activ, care include tot: lecțiile de liceu și Cursul practic. Îl găsești în „Contul meu”." },
      { status: 409 }
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
      // stripe_customer_id e protejat de trigger-ul din Supabase: scris cu
      // clientul utilizatorului, update-ul ar fi ignorat în tăcere și fiecare
      // checkout ar crea un client Stripe nou. Doar service_role îl poate scrie.
      const clientScriere = process.env.SUPABASE_SERVICE_ROLE_KEY ? creeazaClientAdmin() : supabase;
      const { error: updErr } = await clientScriere
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
      allow_promotion_codes: true,
      line_items: [{ price: priceId, quantity: 1 }],
      subscription_data: {
        metadata: { supabase_user_id: user.id, produs },
        trial_period_days: 7,
      },
      success_url: `${origin}/cont?checkout=success`,
      cancel_url: `${origin}${produs === "curs" ? "/curs-practic/preturi" : "/preturi"}`,
    });

    return NextResponse.json({ url: session.url });
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e);
    console.error("CHECKOUT_ERR", msg);
    return NextResponse.json({ error: "Eroare Stripe/Supabase: " + msg }, { status: 500 });
  }
}
