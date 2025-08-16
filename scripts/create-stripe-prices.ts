// import { stripe } from "../lib/stripe";
import Stripe from "stripe";
import { createClient } from "@supabase/supabase-js";

async function main() {
	const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);
	const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
	const supabaseAnonKey =
		process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_OR_ANON_KEY;

	if (!supabaseUrl || !supabaseAnonKey) {
		throw new Error("Missing Supabase environment variables.");
	}
	const supabase = createClient(supabaseUrl, supabaseAnonKey);

	const { data, error } = await supabase
		.from("products")
		.select("*")
		.is("stripe_price", null); // or whatever your column is
	console.log(data, error);
	if (!data) {
		console.log("No products provided, exiting.");
		return; // exits function immediately
	}
	for (const product of data) {
		const stripe_product = await stripe.products.create({
			name: product.name ? product.name : "Unknown Product",
			description: product.description
				? product.description
				: "Unknown Product",
			id: product.id.toString(),
		});
		const stripe_price = await stripe.prices.create({
			currency: "usd",
			unit_amount: Math.round(
				(product.unit_price ? product.unit_price : 0) * 100,
			),
			product: stripe_product.id,
		});

		await supabase
			.from("products")
			.update({ stripe_price: stripe_price.id })
			.eq("id", product.id);
		console.log(
			`Updated product ${product.id} with stripe_price_id ${stripe_price.id}`,
		);
	}
}

main().catch((err) => {
	console.error(err);
	process.exit(1);
});
