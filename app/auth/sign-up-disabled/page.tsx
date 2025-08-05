import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";

export default function Page() {
	return (
		<div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
			<div className="w-full max-w-sm">
				<div className="flex flex-col gap-6">
					<Card>
						<CardHeader>
							<CardTitle className="text-2xl">
								Unfortunately, you can't sign up with password
							</CardTitle>
							<CardDescription>Please use Slack</CardDescription>
						</CardHeader>
						<CardContent>
							<p className="text-sm text-muted-foreground">
								To verify you are a hack clubber, please login with slack
							</p>
						</CardContent>
					</Card>
				</div>
			</div>
		</div>
	);
}
