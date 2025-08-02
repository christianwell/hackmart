"use client";

import Image from "next/image";
import Link from "next/link";
import { useCart } from "@/lib/context/cart";

export default function CartReviewPage() {
	const { items, removeFromCart, clearCart } = useCart();

	const total = items.reduce(
		(acc, item) => acc + item.price * item.quantity,
		0,
	);

	if (items.length === 0) {
		return (
			<div className="p-6">
				<h1 className="text-xl font-semibold">Your cart is empty</h1>
				<Link href="/" className="text-blue-500 underline">
					Continue shopping
				</Link>
			</div>
		);
	}

	return (
		<div className="p-6 space-y-6">
			<h1 className="text-2xl font-bold">Review Your Cart</h1>
			<ul className="space-y-4">
				{items.map((item) => (
					<li
						key={item.id}
						className="flex items-center gap-4 border p-4 rounded-md"
					>
						{item.imgSrc && (
							<Image
								src={item.imgSrc}
								alt={item.name}
								width={80}
								height={80}
								className="rounded-md"
							/>
						)}
						<div className="flex-1">
							<h2 className="text-lg font-semibold">{item.name}</h2>
							<p>
								${item.price} × {item.quantity}
							</p>
						</div>
						<button
							className="text-red-600 hover:underline"
							onClick={() => removeFromCart(item.id)}
							type="button"
						>
							Remove
						</button>
					</li>
				))}
			</ul>

			<div className="flex justify-between items-center border-t pt-4">
				<span className="text-xl font-bold">Total: ${total.toFixed(2)}</span>
				<div className="space-x-4">
					<button
						onClick={clearCart}
						className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
						type="button"
					>
						Clear Cart
					</button>
					<button
						className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
						type="submit"
					>
						Checkout
					</button>
				</div>
			</div>
		</div>
	);
}
