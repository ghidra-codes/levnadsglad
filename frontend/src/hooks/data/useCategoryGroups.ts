import { useSanityQuery } from "@/hooks/useSanityQuery";
import { categoryGroupsQuery } from "@/lib/sanity/queries";
import type { CategoryGroup } from "@/types/category.types";

const EMPTY: CategoryGroup[] = [];

const useCategoryGroups = () => {
	return useSanityQuery<CategoryGroup[]>(["category-groups"], categoryGroupsQuery, {
		placeholderData: EMPTY,
	});
};

export default useCategoryGroups;
