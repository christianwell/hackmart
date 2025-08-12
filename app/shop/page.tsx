"use client";
import { useEffect, useState } from "react";
import { ProductDisplay } from "@/components/product-display";
// import { createProducts } from "@/lib/faker";
import { createClient } from "@/lib/supabase/client";
import type { Tables } from "@/lib/types/supabase";

export default function Shop() {
	// const products = createProducts(12);
	const supabase = createClient();

	const [products, setProducts] = useState<Tables<"products">[]>([]);

	useEffect(() => {
		async function fetchProducts() {
			const { data, error } = await supabase.from("products").select("*");
			if (error) {
				console.error("Error fetching products:", error);
			} else {
				setProducts(data || []);
			}
		}

		fetchProducts();
	}, [supabase]);

	return (
		<main className="p-4">
			<h1 className="text-3xl font-bold mb-8">Shop</h1>
			<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
				{products.map(({ id, img_src, unit_price, name, description }) => (
					<ProductDisplay
						key={id}
						id={id.toString()}
						imgSrc={img_src}
						price={unit_price ?? 0}
						tags={[{ name: "new", color: "blue" }]}
						name={name? name: "Unkown Product"}
						description={description? description:"Something only we know"}
					/>
				))}
			</div>
		</main>
	);
}
