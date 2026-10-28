import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { getStripe } from "@/lib/stripe";
import { creeazaClientAdmin } from "@/lib/supabase/admin";

function mapeazaStatus(statusStripe: Stripe.Subscription.Status): "active" | "past_due" | "canceled" | "none" {
  if (statusStripe === "active" || statusStripe === "trialing") return "active";
  if (statusStripe === "past_due" || statusStripe === "unpaid") return "past_due";
  if (statusStripe === "canceled" || statusStripe === "incomplete_expired") return "canceled";
  return "none";
}

function coloaneAbonament(status: string, perioadaFinal: string | null, anulareLaFinal: boolean) {
  return {
    subscription_status: status,
    subscription_current_period_end: perioadaFinal,
    cancel_at_period_end: anulareLaFinal,
    curs_status: status,
    curs_current_period_end: perioadaFinal,
    curs_cancel_at_period_end: anulareLaFinal,
  };
}

/**
 * Update pe users_meta. Dacă baza de date nu are încă coloanele curs_*
 * (migrare-curs-practic.sql nerulată), reîncearcă fără ele, ca accesul de
 * liceu să nu se blocheze din cauza lor.
 */
async function scrieUsersMeta(
  coloanaFiltru: "user_id" | "stripe_customer_id",
  valoareFiltru: string,
  valori: Record<string, unknown>
) {
  const supabaseAdmin = creeazaClientAdmin();
  let { error } = await supabaseAdmin.from("users_meta").update(valori).eq(coloanaFiltru, valoareFiltru);
  if (error && error.message.includes("curs_")) {
    const faraCurs = Object.fromEntries(Object.entries(valori).filter(([k]) => !k.startsWith("curs_")));
    ({ error } = await supabaseAdmin.from("users_meta").update(faraCurs).eq(coloanaFiltru, valoareFiltru));
  }
  return error;
}

async function actualizeazaDinAbonament(subscription: Stripe.Subscription, eventType: string) {
  const customerId =
    typeof subscription.customer === "string" ? subscription.customer : subscription.customer.id;

  const perioada = subscription.items.data[0]?.current_period_end;
  const supabaseUserId = subscription.metadata?.supabase_user_id;
  // Orice abonament plătit dă acces la tot (liceu + Curs practic de Python),
  // așa că scriem ambele seturi de coloane, indiferent de "produs".
  const coloane = coloaneAbonament(
    mapeazaStatus(subscription.status),
    perioada ? new Date(perioada * 1000).toISOString() : null,
    subscription.cancel_at_period_end
  );

  if (supabaseUserId) {
    const error = await scrieUsersMeta("user_id", supabaseUserId, { stripe_customer_id: customerId, ...coloane });
    if (error) {
      console.error("[stripe-webhook] update users_meta (dupa user_id) a esuat", {
        eventType,
        supabaseUserId,
        customerId,
        mesaj: error.message,
      });
      throw new Error(`Supabase update users_meta failed: ${error.message}`);
    }
  } else {
    const error = await scrieUsersMeta("stripe_customer_id", customerId, coloane);
    if (error) {
      console.error("[stripe-webhook] update users_meta (dupa stripe_customer_id) a esuat", {
        eventType,
        customerId,
        mesaj: error.message,
      });
      throw new Error(`Supabase update users_meta failed: ${error.message}`);
    }
  }
}

export async function POST(request: NextRequest) {
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!webhookSecret) {
    return NextResponse.json({ error: "Webhook Stripe neconfigurat." }, { status: 500 });
  }

  const signature = request.headers.get("stripe-signature");
  if (!signature) {
    return NextResponse.json({ error: "Semnătură lipsă." }, { status: 400 });
  }

  const rawBody = await request.text();

  let event: Stripe.Event;
  try {
    const stripe = getStripe();
    // Varianta asincronă cu Web Crypto: pe Cloudflare Workers nu există
    // verificarea sincronă (crypto din Node); merge identic și pe Node.
    event = await stripe.webhooks.constructEventAsync(
      rawBody,
      signature,
      webhookSecret,
      undefined,
      Stripe.createSubtleCryptoProvider()
    );
  } catch (err) {
    return NextResponse.json(
      { error: `Semnătură invalidă: ${err instanceof Error ? err.message : "eroare necunoscută"}` },
      { status: 400 }
    );
  }

  try {
    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object as Stripe.Checkout.Session;
        if (session.subscription && session.customer) {
          const stripe = getStripe();
          const subscriptionId =
            typeof session.subscription === "string" ? session.subscription : session.subscription.id;
          const subscription = await stripe.subscriptions.retrieve(subscriptionId);
          await actualizeazaDinAbonament(subscription, event.type);
        }
        break;
      }
      case "invoice.paid":
      case "invoice.payment_succeeded": {
        const invoice = event.data.object as Stripe.Invoice & {
          parent?: { subscription_details?: { subscription?: string | { id: string } } };
          subscription?: string | { id: string };
        };
        const subscriptionId = invoice.parent?.subscription_details?.subscription
          || invoice.subscription;
        if (subscriptionId) {
          const stripe = getStripe();
          const subId = typeof subscriptionId === "string" ? subscriptionId : subscriptionId.id;
          const subscription = await stripe.subscriptions.retrieve(subId);
          await actualizeazaDinAbonament(subscription, event.type);
        }
        break;
      }
      case "customer.subscription.updated":
      case "customer.subscription.created": {
        await actualizeazaDinAbonament(event.data.object as Stripe.Subscription, event.type);
        break;
      }
      case "customer.subscription.deleted": {
        const subscription = event.data.object as Stripe.Subscription;
        const customerId =
          typeof subscription.customer === "string" ? subscription.customer : subscription.customer.id;
        // Un alt abonament încă activ al aceluiași client păstrează accesul.
        const altele = await getStripe().subscriptions.list({ customer: customerId, status: "all", limit: 20 });
        if (altele.data.some((s) => s.id !== subscription.id && (s.status === "active" || s.status === "trialing"))) {
          break;
        }
        const error = await scrieUsersMeta("stripe_customer_id", customerId, {
          subscription_status: "canceled",
          cancel_at_period_end: false,
          curs_status: "canceled",
          curs_cancel_at_period_end: false,
        });
        if (error) {
          console.error("[stripe-webhook] update users_meta (anulare abonament) a esuat", {
            eventType: event.type,
            customerId,
            mesaj: error.message,
          });
          throw new Error(`Supabase update users_meta failed: ${error.message}`);
        }
        break;
      }
      default:
        break;
    }
  } catch (err) {
    console.error("[stripe-webhook] eroare la procesarea evenimentului", {
      eventType: event.type,
      mesaj: err instanceof Error ? err.message : String(err),
    });
    return NextResponse.json(
      { error: "Eroare internă la procesarea evenimentului." },
      { status: 500 }
    );
  }

  return NextResponse.json({ received: true });
}
