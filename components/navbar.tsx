import { AuthButton } from "@/components/auth-button";
import { CartBadgeWrapper } from "@/components/cart-badge-wrapper";
import { EnvVarWarning } from "@/components/env-var-warning";
import { ThemeSwitcher } from "@/components/theme-switcher";
import { hasEnvVars } from "@/lib/utils";
import Link from "next/link";

export function Navbar() {
	return (
		<nav className="w-full flex justify-center border-b border-b-foreground/10 h-16">
			<div className="w-full max-w-5xl flex justify-between items-center p-3 px-5 text-sm">
				<div className="flex gap-5 items-center font-semibold">
					<Link href={"/"}>HackMart</Link>
				</div>
				<div className="flex items-center gap-4">
					<CartBadgeWrapper />
					{!hasEnvVars ? <EnvVarWarning /> : <AuthButton />}
				</div>
			</div>
		</nav>
	);
}
