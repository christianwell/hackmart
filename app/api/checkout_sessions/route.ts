import { NextResponse } from "next/server";
import { headers } from "next/headers";

import { stripe } from "../../../lib/stripe";
import { getURL } from "@/lib/utils";
import type { CartItem } from "@/lib/context/cart";

export async function POST(req: Request) {
	try {
		const formData = await req.formData();
		const rawCart = formData.get("cart");
		if (typeof rawCart !== "string") {
			return NextResponse.json(
				{ error: "Invalid form input" },
				{ status: 400 },
			);
		}

		const cartItems: CartItem[] = JSON.parse(rawCart);

		const headersList = await headers();
		const origin = headersList.get("origin") ?? getURL();

		// Transform cart items to Stripe line items
		const lineItems = cartItems.map((item: CartItem) => ({
			price_data: {
				currency: "usd",
				product_data: {
					name: item.name,
					images: item.imgSrc ? [item.imgSrc] : [],
				},
				unit_amount: Math.round(item.price * 100),
			},
			quantity: item.quantity,
		}));

		const session = await stripe.checkout.sessions.create({
			line_items: lineItems,
			mode: "payment",
			success_url: `${origin}/success?session_id={CHECKOUT_SESSION_ID}`,
			cancel_url: `${origin}/?canceled=true`,
		});

		if (!session.url) {
			return NextResponse.json(
				{ error: "Failed to create checkout session" },
				{ status: 500 },
			);
		}

		return NextResponse.redirect(session.url, 303);
	} catch (err) {
		const error = err as { message?: string; statusCode?: number };
		return NextResponse.json(
			{ error: error.message || "An unknown error occurred" },
			{ status: error.statusCode || 500 },
		);
	}
}
