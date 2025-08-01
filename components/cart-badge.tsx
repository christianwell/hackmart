// components/CartBadge.tsx
import { useCart } from "@/lib/context/cart";
import Link from "next/link";

export function CartBadge() {
  const { items } = useCart();
  const totalQuantity = items.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <Link href="/cart" className="relative inline-block">
      🛒
      {totalQuantity > 0 && (
        <span className="absolute -top-2 -right-2 bg-red-600 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
          {totalQuantity}
        </span>
      )}
    </Link>
  );
}