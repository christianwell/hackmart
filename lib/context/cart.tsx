"use client";
import { createContext, useContext, useEffect, useState } from "react";
import type { Tables } from "@/types/supabase";

export type CartItem = {
	img_src: string;
	quantity: number;
	unit_price: number;
	id: number;
	name: string | null;
};

type CartContextType = {
	items: CartItem[];
	addToCart: (item: CartItem) => void;
	removeFromCart: (id: number) => void;
	clearCart: () => void;
	getItemQuantity: (id: number) => number;
};

const CartContext = createContext<CartContextType | null>(null);

export function CartProvider({ children }: { children: React.ReactNode }) {
	const [items, setItems] = useState<CartItem[]>([]);

	useEffect(() => {
		const stored =
			typeof window !== "undefined" ? localStorage.getItem("cart") : null;
		if (stored) setItems(JSON.parse(stored));
	}, []);

	useEffect(() => {
		if (typeof window !== "undefined") {
			localStorage.setItem("cart", JSON.stringify(items));
		}
	}, [items]);

	const addToCart = (item: CartItem) => {
		setItems((prev) => {
			const existing = prev.find((i) => i.id === item.id);
			if (existing) {
				return prev.map((i) =>
					i.id === item.id ? { ...i, quantity: i.quantity + item.quantity } : i,
				);
			}
			return [...prev, item];
		});
	};

	const removeFromCart = (id: number) => {
		setItems((prev) => {
			return prev
				.map((item) =>
					item.id === id ? { ...item, quantity: item.quantity - 1 } : item,
				)
				.filter((item) => item.quantity > 0);
		});
	};

	const clearCart = () => setItems([]);

	const getItemQuantity = (id: number): number => {
		const item = items.find((i) => i.id === id);
		return item ? item.quantity : 0;
	};

	return (
		<CartContext.Provider
			value={{ items, addToCart, removeFromCart, clearCart, getItemQuantity }}
		>
			{children}
		</CartContext.Provider>
	);
}

export function useCart() {
	const context = useContext(CartContext);
	if (!context) throw new Error("useCart must be used within a CartProvider");
	return context;
}
