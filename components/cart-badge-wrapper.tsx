"use client";

import { CartBadge } from "@/components/cart-badge";
import { usePathname } from "next/navigation";

export function CartBadgeWrapper() {
	const pathname = usePathname();

	// Don't show the cart badge on the cart page
	if (pathname === "/cart") {
		return null;
	}

	return <CartBadge />;
}
