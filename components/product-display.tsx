"use client";
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import type { StaticImport } from "next/dist/shared/lib/get-img-props";
import { useCart } from "@/lib/context/cart";

export function ProductDisplay({
	id,
	name,
	description,
	price,
	imgSrc,
	tags,
}: {
	id: string;
	name: string;
	description: string;
	price: number;
	imgSrc: string | StaticImport | null;
	tags:
		| {
				name: string;
				color: string;
		  }[]
		| null;
}) {
	const { addToCart, getItemQuantity, removeFromCart } = useCart();
	tags = tags ?? [];

	return (
		<Card className="w-full max-w-sm">
			<CardHeader className="p-4 pb-2">
				<div className="flex items-center justify-between">
					<CardTitle className="text-lg">{name}</CardTitle>
					<Badge variant="secondary">New</Badge>
					{tags.map((tag) => (
						<Badge variant="secondary" key={tag.name}>
							{tag.name}
						</Badge>
					))}
				</div>
				<CardDescription className="text-muted-foreground">
					{description}
				</CardDescription>
			</CardHeader>

			<CardContent className="p-4">
				<AspectRatio
					ratio={4 / 3}
					className="bg-muted rounded-md overflow-hidden"
				>
					<Image
						src={imgSrc || "https://placecats.com/300/225"}
						alt={name}
						fill
						className="object-cover w-full h-full"
					/>
				</AspectRatio>
				<p className="mt-4 text-xl font-semibold">{price}</p>
			</CardContent>

			<CardFooter className="p-4 pt-2">
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
								addToCart({
									id,
									name,
									price,
									quantity: 1,
									imgSrc: imgSrc || "https://placecats.com/300/225",
								})
							}
						>
							+
						</Button>
					</div>
				) : (
					<Button
						className="w-full"
						onClick={() =>
							addToCart({
								id,
								name,
								price,
								quantity: 1,
								imgSrc: imgSrc || "https://placecats.com/300/225",
							})
						}
					>
						Add to Cart
					</Button>
				)}
			</CardFooter>
		</Card>
	);
}
