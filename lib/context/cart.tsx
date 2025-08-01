import type { StaticImport } from "next/dist/shared/lib/get-img-props";
import { createContext, useContext, useEffect, useState } from "react";

type CartItem = {
	id: string;
	name: string;
	price: number;
	quantity: number;
	imgSrc?: string | StaticImport;
};

type CartContextType = {
	items: CartItem[];
	addToCart: (item: CartItem) => void;
	removeFromCart: (id: string) => void;
	clearCart: () => void;
};

const CartContext = createContext<CartContextType | null>(null);

export function CartProvider({ children }: { children: React.ReactNode }) {
	const [items, setItems] = useState<CartItem[]>([]);

	useEffect(() => {
		const stored = typeof window !== "undefined" ? localStorage.getItem("cart") : null;
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
					i.id === item.id ? { ...i, quantity: i.quantity + item.quantity } : i
				);
			}
			return [...prev, item];
		});
	};

	const removeFromCart = (id: string) => {
		setItems((prev) => prev.filter((item) => item.id !== id));
	};

	const clearCart = () => setItems([]);

	return (
		<CartContext.Provider value={{ items, addToCart, removeFromCart, clearCart }}>
			{children}
		</CartContext.Provider>
	);
}

export function useCart() {
	const context = useContext(CartContext);
	if (!context) throw new Error("useCart must be used within a CartProvider");
	return context;
}