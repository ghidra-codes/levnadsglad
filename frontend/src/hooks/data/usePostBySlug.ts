import { useSanityQuery } from "@/hooks/useSanityQuery";
import { postBySlugQuery } from "@/lib/sanity/queries";
import type { Post } from "@/types/post.types";

const usePostBySlug = (slug: string) => {
	return useSanityQuery<Post>(
		["post", slug],
		postBySlugQuery,
		{
			enabled: Boolean(slug),
		},
		{
			slug,
		},
	);
};

export default usePostBySlug;
