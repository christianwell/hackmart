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

				<footer className="w-full flex items-centerjustify-center border-t mx-auto text-center text-xs gap-8 py-16">
					<p>
						Powered by{" "}
						<a
							href="https://supabase.com/?utm_source=create-next-app&utm_medium=template&utm_term=nextjs"
							target="_blank"
							className="font-bold hover:underline"
							rel="noreferrer"
						>
							Supabase
						</a>
					</p>
					<p>A Hack Club Project</p>
					<ThemeSwitcher />
				</footer>
			</div>
		</main>
	);
}
