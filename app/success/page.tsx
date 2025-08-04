import { redirect } from "next/navigation";

import { stripe } from "../../lib/stripe";
import { createClient } from "@/lib/supabase/server";

import type Stripe from "stripe";

interface SuccessSearchParams {
	session_id: string;
}

export default async function Success({
	searchParams,
}: { searchParams: SuccessSearchParams }) {
	const { session_id } = searchParams;
	const supabase = await createClient();

	if (!session_id) {
		throw new Error("Please provide a valid session_id (`cs_test_...`)");
	}

	const session = await stripe.checkout.sessions.retrieve(session_id, {
		expand: ["line_items.data.price.product", "payment_intent", "shipping"],
	}) 

	const {
		status,
		amount_total,
		currency,
		customer_details,
		payment_status,
		payment_intent,
		line_items,
		shipping
	} = session;

	if (status === "open") {
		return redirect("/");
	}

	if (status === "complete") {
		const {
			data: { user },
		} = await supabase.auth.getUser();

		// Helper to convert Stripe Address to a plain JSON object
		const addressToJson = (address: Stripe.Address | null | undefined) => {
			if (!address) return null;
			return JSON.parse(JSON.stringify(address));
		};
		


		const orderData = {
			customer_id: user?.id || null, // Link to Supabase user if logged in
			total_amount: amount_total ? amount_total / 100 : 0,
			currency: currency,
			payment_status: payment_status,
			billing_address: addressToJson(customer_details?.address),
			shipping_address: addressToJson(shipping?.address),
			payment_method:
				(payment_intent as Stripe.PaymentIntent)?.payment_method_types?.[0] ||
				null,
			status: "completed", // Use "completed" for our internal order status
		};

		const { data: order, error: orderError } = await supabase
			.from("orders")
			.insert(orderData)
			.select()
			.single();

		if (orderError) {
			console.error("Error inserting order:", orderError);
			// Handle error, maybe redirect to an error page
			throw new Error("Failed to save order details.");
		}

		if (order && line_items?.data) {
			const orderItemsData = line_items.data.map((item) => {
				const product = item.price?.product as Stripe.Product;
				return {
					order_id: order.id,
					product_id: product?.metadata?.supabase_product_id
						? Number.parseInt(product.metadata.supabase_product_id)
						: null, // Assuming product_id is in metadata
					quantity: item.quantity,
					unit_price: item.price?.unit_amount
						? item.price.unit_amount / 100
						: 0,
					total_price: item.amount_total ? item.amount_total / 100 : 0,
				};
			});

			const { error: orderItemsError } = await supabase
				.from("order_items")
				.insert(orderItemsData);

			if (orderItemsError) {
				console.error("Error inserting order items:", orderItemsError);
				// Handle error
				throw new Error("Failed to save order item details.");
			}
		}

		const customerEmail = customer_details?.email;

		return (
			<section id="success">
				<p>
					We appreciate your business! A confirmation email will be sent to{" "}
					{customerEmail}. If you have any questions, please email{" "}
				</p>
				<a href="mailto:orders@example.com">orders@example.com</a>.
			</section>
		);
	}
}
