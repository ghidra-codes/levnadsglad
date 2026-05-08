import { useQueryClient } from "@tanstack/react-query";
import { useMemo } from "react";
import type { Category, CategoryGroup } from "@/types/category.types";
import useCategoryGroups from "./useCategoryGroups";

const useCategoryBySlug = (slug: string): Category | null | undefined => {
	const queryClient = useQueryClient();

	const cached = queryClient.getQueryData<CategoryGroup[]>(["category-groups"]);

	const { data } = useCategoryGroups({
		enabled: !cached,
	});

	const groups = cached ?? data;

	return useMemo(() => {
		if (groups === undefined) return undefined;

		return groups?.flatMap((group) => group.categories).find((cat) => cat.slug === slug) ?? null;
	}, [groups, slug]);
};

export default useCategoryBySlug;
