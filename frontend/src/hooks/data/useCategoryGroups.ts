import type { UseQueryOptions } from "@tanstack/react-query";
import { useSanityQuery } from "@/hooks/useSanityQuery";
import { categoryGroupsQuery } from "@/lib/sanity/queries";
import type { CategoryGroup } from "@/types/category.types";

const useCategoryGroups = (
	options?: Omit<UseQueryOptions<CategoryGroup[] | null>, "queryKey" | "queryFn">,
) => {
	return useSanityQuery<CategoryGroup[]>(["category-groups"], categoryGroupsQuery, options);
};

export default useCategoryGroups;
