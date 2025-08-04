"use client";
import { ProductDisplay } from "@/components/product-display";
import { createProducts } from "@/lib/faker";

export default function Shop() {
	const products = createProducts(12);

	return (
		<main className="p-4">
			<h1 className="text-3xl font-bold mb-8">Shop</h1>
			<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
				{products.map((product) => (
					<ProductDisplay key={product.id} {...product} tags={[{name:"new", color: "blue"}]}/>
				))}
			</div>
		</main>
	);
}
