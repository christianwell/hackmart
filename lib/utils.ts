import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}

// This check can be removed, it is just for tutorial purposes
export const hasEnvVars =
	process.env.NEXT_PUBLIC_SUPABASE_URL &&
	process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_OR_ANON_KEY;

export const getURL = () => {
	let url =
		process?.env?.NEXT_PUBLIC_SITE_URL ?? // Set this to your site URL in production
		process?.env?.VERCEL_URL ?? // Automatically set by Vercel
		"http://localhost:3000/";
	// Make sure to include `https` in production
	url = url.includes("http") ? url : `https://${url}`;
	// Make sure to include a trailing `/`
	url = url.charAt(url.length - 1) === "/" ? url.slice(0, -1) : url;
	return url;
};
