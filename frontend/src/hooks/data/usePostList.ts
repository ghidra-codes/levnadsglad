import { useSanityQuery } from "@/hooks/useSanityQuery";
import { postListQuery } from "@/lib/sanity/queries";
import type { Post } from "@/types/post.types";

const EMPTY_LIST: Post[] = [];

const usePostList = () => {
	return useSanityQuery<Post[]>(["posts"], postListQuery, {
		placeholderData: EMPTY_LIST,
	});
};

export default usePostList;
