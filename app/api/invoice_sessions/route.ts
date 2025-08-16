import { NextResponse } from "next/server";
import { headers } from "next/headers";

import { stripe } from "../../../lib/stripe";
// import { getURL } from "@/lib/utils";
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

		// const headersList = await headers();
		// const origin = headersList.get("origin") ?? getURL();

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
				price_data: {
					price: product.stripe_price ? product.stripe_price : "",
				},
				quantity: item.quantity,
			};
		});

		const lineItems = await Promise.all(lineItemsPromises);
		const user = await supabase.auth.getUser();
		const customerSearchResponse = await stripe.customers.search({
			query: `email:\'${user.data.user?.email}\'`,
		});
		

		let customerId = customerSearchResponse.data[0]?.id;
		if (!customerId) {
			const newCustomer = await stripe.customers.create({
				email: user.data.user?.email,
				name: user.data.user?.email,
			});
			customerId = newCustomer.id;
		}

		const invoice = await stripe.invoices.create({
			customer: customerId,
			auto_advance: true, // Auto-finalize the invoice
			collection_method: "send_invoice", // or 'charge_automatically'
			days_until_due: 30,
		});
		for (const item of lineItems) {
			console.log(item)
			for (const item of lineItems) {
				if (!item.price_data.price) continue; // skip if price is empty

				await stripe.invoiceItems.create({
					customer: customerId,
					pricing: {
						price: item.price_data.price
					},
					quantity: item.quantity, // quantity is allowed when using a price ID
					invoice: invoice.id,
				});
			}
		}

		// Finalize the invoice if not auto-advanced
		if (invoice.status === "draft" && invoice.id) {
			await stripe.invoices.finalizeInvoice(invoice.id);
		}

		// Send the invoice (if using send_invoice)
		if (invoice.id) {
			await stripe.invoices.sendInvoice(invoice.id);
		}
		return NextResponse.redirect("/shop")
	} catch (err) {
		const error = err as { message?: string; statusCode?: number };
		return NextResponse.json(
			{ error: error.message || "An unknown error occurred" },
			{ status: error.statusCode || 500 },
		);
	}
}
