import { useSanityQuery } from "@/hooks/useSanityQuery";
import { postsByCategoryQuery } from "@/lib/sanity/queries";
import type { Post } from "@/types/post.types";

const EMPTY_LIST: Post[] = [];

const usePostsByCategory = (slug: string) => {
	return useSanityQuery<Post[]>(
		["posts", "category", slug],
		postsByCategoryQuery,
		{
			placeholderData: EMPTY_LIST,
			enabled: Boolean(slug),
		},
		{
			slug,
		},
	);
};

export default usePostsByCategory;
