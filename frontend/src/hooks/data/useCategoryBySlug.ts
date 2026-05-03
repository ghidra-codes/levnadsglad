import { useQueryClient } from "@tanstack/react-query";
import { useMemo } from "react";
import type { Category, CategoryGroup } from "@/types/category.types";
import useCategoryGroups from "./useCategoryGroups";

const useCategoryBySlug = (slug: string): Category | undefined => {
	const queryClient = useQueryClient();

	const cached = queryClient.getQueryData<CategoryGroup[]>(["category-groups"]);

	const { data } = useCategoryGroups({
		enabled: !cached,
	});

	const groups = cached ?? data;

	return useMemo(
		() => groups?.flatMap((group) => group.categories).find((cat) => cat.slug === slug),
		[groups, slug],
	);
};

export default useCategoryBySlug;
