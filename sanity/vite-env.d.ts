/// <reference types="vite/client" />

export {};

declare global {
	interface ImportMetaEnv {
		readonly SANITY_STUDIO_SUPABASE_URL: string;

		readonly SANITY_STUDIO_SUPABASE_ANON_KEY: string;
	}
}
