import { NextResponse } from "next/server";
import { headers } from "next/headers";

import { stripe } from "../../../lib/stripe";
import { getURL } from "@/lib/utils";
import type { CartItem } from "@/lib/context/cart";
import { createClient } from "@/lib/supabase/server";

export async function POST(req: Request) {
	try {
		const supabase = await createClient();
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
		const lineItemsPromises = cartItems.map(async (item: CartItem) => {
			const { data: product, error } = await supabase
				.from("products")
				.select("*")
				.eq("id", item.id)
				.single();

			if (error) {
				throw new Error(
					`Failed to fetch product with id ${item.id}: ${error.message}`,
				);
			}

			return {
				price: product.stripe_price ? product.stripe_price : "",

				quantity: item.quantity,
			};
		});

		const lineItems = await Promise.all(lineItemsPromises);
		const user = await supabase.auth.getUser();
		// const customer = await stripe.customers.create({
		// 	email: user.data.user?.email,
		// 	name: user.data.user?.email,

		// });
		const customer = await stripe.customers.search({
			query: `email:\'${user.data.user?.email}\'`,
		});

		let customerId = customer.data[0]?.id;
		if (!customerId) {
			const newCustomer = await stripe.customers.create({
				email: user.data.user?.email,
				name: user.data.user?.email,
			});
			customerId = newCustomer.id;
		}
		const session = await stripe.checkout.sessions.create({
			billing_address_collection: "required",
			payment_method_types: ["card", 'us_bank_account'],
			customer: customerId,
			shipping_address_collection: {
				allowed_countries: ["US", "CA", "DK", "DE", "IN"],
			},
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
