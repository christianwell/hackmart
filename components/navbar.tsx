import { AuthButton } from "@/components/auth-button";
import { CartBadgeWrapper } from "@/components/cart-badge-wrapper";
import { EnvVarWarning } from "@/components/env-var-warning";
import { hasEnvVars } from "@/lib/utils";
import Link from "next/link";
import Image from 'next/image'


export function Navbar() {
	return (
		<nav className="w-full flex justify-center border-b border-b-foreground/10 h-16">
			<div className="w-full max-w-5xl flex justify-between items-center p-3 px-5 text-sm">
				<div className="flex gap-5 items-center font-semibold">
					<Image src="flag-orpheus-top.svg" alt="Orpheus Flag – Top" height="158" width="140"/>
				</div>
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
