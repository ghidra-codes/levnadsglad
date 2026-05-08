import { type UseQueryOptions, useQuery } from "@tanstack/react-query";
import { sanity } from "@/lib/sanity/client";

export const useSanityQuery = <T>(
	queryKey: unknown[],
	query: string,
	options?: Omit<UseQueryOptions<T | null>, "queryKey" | "queryFn">,
	params?: Record<string, unknown>,
) => {
	return useQuery<T | null>({
		queryKey,
		queryFn: async () => {
			if (params) {
				const result = await sanity.fetch<T | null>(query, params);

				return result ?? null;
			}

			const result = await sanity.fetch<T | null>(query);

			return result ?? null;
		},
		...options,
	});
};
