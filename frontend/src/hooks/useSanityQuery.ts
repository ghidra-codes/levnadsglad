import { type UseQueryOptions, useQuery } from "@tanstack/react-query";
import { sanity } from "@/lib/sanity/client";

export const useSanityQuery = <T>(
	queryKey: unknown[],
	query: string,
	options?: Omit<UseQueryOptions<T>, "queryKey" | "queryFn">,
	params?: Record<string, unknown>,
) => {
	return useQuery<T>({
		queryKey,
		queryFn: () => sanity.fetch(query, params),
		...options,
	});
};
