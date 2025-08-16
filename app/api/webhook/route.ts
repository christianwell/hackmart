import { createClient } from "@/lib/supabase/server";
import { stripe } from "@/lib/stripe";
import { headers } from "next/headers";
import type Stripe from "stripe";

export const config = {
	api: {
		bodyParser: false, // Disable default body parsing
	},
};

export async function POST(req: Request) {
	const supabase = await createClient();
	const hea = await headers();
	const sig = hea.get("stripe-signature");

	let event: Stripe.Event;

	try {
		const rawBody = await req.text(); // Stripe needs the raw body
		event = stripe.webhooks.constructEvent(
			rawBody,
			sig ? sig : "",
			(process.env.STRIPE_WEBHOOK_SECRET? process.env.STRIPE_WEBHOOK_SECRET: ""),
		);
	} catch (err) {
		console.error("⚠️ Webhook signature verification failed:", err.message);
		return new Response("Webhook Error", { status: 400 });
	}

	// Handle the event
	switch (event.type) {
		case "payment_intent.succeeded":
			console.log("💰 Payment succeeded!", event.data.object);
			break;
		default:
			console.log(`Unhandled event type ${event.type}`);
	}

	return new Response(JSON.stringify({ received: true }), { status: 200 });
}
