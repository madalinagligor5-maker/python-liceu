import { NextRequest, NextResponse } from "next/server";
import type Stripe from "stripe";
import { getStripe } from "@/lib/stripe";
import { creeazaClientAdmin } from "@/lib/supabase/admin";

function mapeazaStatus(statusStripe: Stripe.Subscription.Status): "active" | "past_due" | "canceled" | "none" {
  if (statusStripe === "active" || statusStripe === "trialing") return "active";
  if (statusStripe === "past_due" || statusStripe === "unpaid") return "past_due";
  if (statusStripe === "canceled" || statusStripe === "incomplete_expired") return "canceled";
  return "none";
}

async function actualizeazaDinAbonament(subscription: Stripe.Subscription, eventType: string) {
  const supabaseAdmin = creeazaClientAdmin();
  const customerId =
    typeof subscription.customer === "string" ? subscription.customer : subscription.customer.id;

  const perioada = subscription.items.data[0]?.current_period_end;
  const supabaseUserId = subscription.metadata?.supabase_user_id;
  // "produs" a fost salvat la creare (/api/checkout) -- distinge abonamentul
  // de liceu (implicit, pentru abonamente vechi fara aceasta metadata) de
  // "Curs practic de Python", care scrie in coloane separate din users_meta.
  const esteAbonamentCurs = subscription.metadata?.produs === "curs";

  const coloane = esteAbonamentCurs
    ? {
        curs_status: mapeazaStatus(subscription.status),
        curs_current_period_end: perioada ? new Date(perioada * 1000).toISOString() : null,
        curs_cancel_at_period_end: subscription.cancel_at_period_end,
      }
    : {
        subscription_status: mapeazaStatus(subscription.status),
        subscription_current_period_end: perioada ? new Date(perioada * 1000).toISOString() : null,
        cancel_at_period_end: subscription.cancel_at_period_end,
      };

  if (supabaseUserId) {
    const { error } = await supabaseAdmin
      .from("users_meta")
      .update({ stripe_customer_id: customerId, ...coloane })
      .eq("user_id", supabaseUserId);
    if (error) {
      console.error("[stripe-webhook] update users_meta (dupa user_id) a esuat", {
        eventType,
        supabaseUserId,
        customerId,
        esteAbonamentCurs,
        mesaj: error.message,
      });
      throw new Error(`Supabase update users_meta failed: ${error.message}`);
    }
  } else {
    const { error } = await supabaseAdmin
      .from("users_meta")
      .update(coloane)
      .eq("stripe_customer_id", customerId);
    if (error) {
      console.error("[stripe-webhook] update users_meta (dupa stripe_customer_id) a esuat", {
        eventType,
        customerId,
        esteAbonamentCurs,
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
    event = stripe.webhooks.constructEvent(rawBody, signature, webhookSecret);
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
        const supabaseAdmin = creeazaClientAdmin();
        const customerId =
          typeof subscription.customer === "string" ? subscription.customer : subscription.customer.id;
        const esteAbonamentCurs = subscription.metadata?.produs === "curs";
        const coloane = esteAbonamentCurs
          ? { curs_status: "canceled", curs_cancel_at_period_end: false }
          : { subscription_status: "canceled", cancel_at_period_end: false };
        const { error } = await supabaseAdmin
          .from("users_meta")
          .update(coloane)
          .eq("stripe_customer_id", customerId);
        if (error) {
          console.error("[stripe-webhook] update users_meta (anulare abonament) a esuat", {
            eventType: event.type,
            customerId,
            esteAbonamentCurs,
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
