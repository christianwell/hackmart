import { Navbar } from "@/components/navbar";
import { ThemeSwitcher } from "@/components/theme-switcher";

export default function ShopLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<main className="min-h-screen flex flex-col items-center">
			<div className="flex-1 w-full flex flex-col gap-20 items-center">
				<Navbar />
				<div className="fix flex-1 flex flex-col gap-20 max-w-5xl p-5">
					{children}
				</div>

				<footer className="w-full flex flex-col items-center justify-center border-t mx-auto text-center text-xs gap-4 py-8">
					<p>
						A (Maybe){" "}
						<a
							href="https://hackclub.com"
							target="_blank"
							className="font-bold hover:underline"
							rel="noreferrer"
						>
							Hack Club
						</a>
                        {" "}Project
					</p>
					<ThemeSwitcher />
				</footer>
			</div>
		</main>
	);
}
