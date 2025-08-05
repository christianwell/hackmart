import { Hero } from "@/components/hero";
import { ConnectSupabaseSteps } from "@/components/tutorial/connect-supabase-steps";
import { SignUpUserSteps } from "@/components/tutorial/sign-up-user-steps";
import { hasEnvVars } from "@/lib/utils";
import { createClient } from "@/lib/supabase/server";
import { Navbar } from "@/components/navbar";
import { ThemeSwitcher } from "@/components/theme-switcher";
import { redirect } from "next/navigation";

export default async function Home() {
	const supabase = await createClient();
	const user = await supabase.auth.getClaims();
	// return (
	// 	<main className="min-h-screen flex flex-col items-center">
	// 		<div className="flex-1 w-full flex flex-col gap-20 items-center">
	// 			<Navbar />
	// 			<div className="flex-1 flex flex-col gap-20 max-w-5xl p-5">
	// 				<Hero />
	// 				<main className="flex-1 flex flex-col gap-6 px-4">
	// 					<h2 className="font-medium text-xl mb-4">Next steps</h2>
	// 					{hasEnvVars ? <SignUpUserSteps /> : <ConnectSupabaseSteps />}
	// 				</main>
	// 				<pre>{JSON.stringify(user.data?.claims, null, 2)}</pre>
	// 			</div>

	// 			<footer className="w-full flex flex-col items-center justify-center border-t mx-auto text-center text-xs gap-4 py-8">
	// 	<p>
	// 		A (Maybe){" "}
	// 		<a
	// 			href="https://hackclub.com"
	// 			target="_blank"
	// 			className="font-bold hover:underline"
	// 			rel="noreferrer"
	// 		>
	// 			Hack Club
	// 		</a>
	//         {" "}Project
	// 	</p>
	// 	<ThemeSwitcher />
	// </footer>
	// 		</div>
	// 	</main>
	// );
	return redirect("/shop");
}
