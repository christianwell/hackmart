"use client";

import { Badge } from "@/components/ui/badge";
// import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Button } from "@/components/ui/button";
import Image from "next/image";
// import type { StaticImport } from "next/dist/shared/lib/get-img-props";
import { useCart } from "@/lib/context/cart";

export default function ProductPage() {
	const { addToCart, getItemQuantity, removeFromCart } = useCart();

	const id = "product-1";
	const name = "Sample Product";
	const description = "This is a sample product description.";
	const price = 19.99;
	const imgSrc = "https://placecats.com/300/225";
	const tags = [
		{ name: "Featured", color: "blue" },
		{ name: "Limited", color: "red" },
	];

	return (
		<div className="min-h-screen w-full">
			<div className="flex flex-col md:flex-row w-full h-screen">
				<div className="md:w-3/5 w-full h-full relative">
					<Image
						src={imgSrc}
						alt={name}
						fill
						className="object-cover w-full h-full"
					/>
				</div>
				<div className="md:w-2/5 w-full p-6 flex flex-col justify-between">
					<div>
						<div className="flex items-center justify-between flex-wrap gap-2">
							<h1 className="text-2xl font-bold">{name}</h1>
							<div className="flex gap-1 flex-wrap">
								<Badge variant="secondary">New</Badge>
								{tags.map((tag) => (
									<Badge variant="secondary" key={tag.name}>
										{tag.name}
									</Badge>
								))}
							</div>
						</div>
						<p className="text-sm text-gray-500 mt-2">{description}</p>
						<p className="mt-4 text-2xl font-semibold">${price}</p>
					</div>
					<div className="mt-6">
						{getItemQuantity(id) > 0 ? (
							<div className="flex items-center justify-between w-full space-x-2">
								<Button variant="outline" onClick={() => removeFromCart(id)}>
									-
								</Button>
								<span className="text-sm font-medium">
									{getItemQuantity(id)} in cart
								</span>
								<Button
									variant="outline"
									onClick={() =>
										addToCart({ id, name, price, quantity: 1, imgSrc })
									}
								>
									+
								</Button>
							</div>
						) : (
							<Button
								className="w-full"
								onClick={() =>
									addToCart({ id, name, price, quantity: 1, imgSrc })
								}
							>
								Add to Cart
							</Button>
						)}
					</div>
				</div>
			</div>
		</div>
	);
}
