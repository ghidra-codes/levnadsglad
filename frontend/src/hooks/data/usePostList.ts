import { useSanityQuery } from "@/hooks/useSanityQuery";
import { postListQuery } from "@/lib/sanity/queries";
import type { Post } from "@/types/post.types";

const usePostList = () => {
	return useSanityQuery<Post[]>(["posts"], postListQuery);
};

export default usePostList;
