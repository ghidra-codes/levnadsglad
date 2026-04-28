import { useEffect, useState } from "react";
import { sanity } from "@/lib/sanity/client";
import { postListQuery } from "@/lib/sanity/queries";
import type { Post } from "@/types/post.types";

const EMPTY_LIST: Post[] = [];

const usePostList = () => {
	const [posts, setPosts] = useState<Post[]>(EMPTY_LIST);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<Error | null>(null);

	useEffect(() => {
		let isMounted = true;

		sanity
			.fetch<Post[]>(postListQuery)
			.then((data) => {
				if (!isMounted) {
					return;
				}
				setPosts(Array.isArray(data) ? data : EMPTY_LIST);
				setLoading(false);
			})
			.catch((fetchError: unknown) => {
				if (!isMounted) {
					return;
				}
				setError(fetchError instanceof Error ? fetchError : new Error("Failed to load posts"));
				setLoading(false);
			});

		return () => {
			isMounted = false;
		};
	}, []);

	return { posts, loading, error };
};

export default usePostList;
