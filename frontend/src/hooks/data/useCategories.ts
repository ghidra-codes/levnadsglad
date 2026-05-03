import { useSanityQuery } from "@/hooks/useSanityQuery";
import { categoriesQuery } from "@/lib/sanity/queries";
import type { Category } from "@/types/category.types";

const useCategories = () => {
	return useSanityQuery<Category[]>(["categories"], categoriesQuery);
};

export default useCategories;
