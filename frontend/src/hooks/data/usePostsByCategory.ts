import { useSanityQuery } from "@/hooks/useSanityQuery";
import { postsByCategoryQuery } from "@/lib/sanity/queries";
import type { Post } from "@/types/post.types";

const usePostsByCategory = (slug: string) => {
	return useSanityQuery<Post[]>(
		["posts", "category", slug],
		postsByCategoryQuery,
		{
			enabled: Boolean(slug),
		},
		{
			slug,
		},
	);
};

export default usePostsByCategory;
