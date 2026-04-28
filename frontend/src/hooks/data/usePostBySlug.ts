import { useEffect, useState } from "react";
import { sanity } from "@/lib/sanity/client";
import { postBySlugQuery } from "@/lib/sanity/queries";
import type { Post } from "@/types/post.types";

const usePostBySlug = (slug: string) => {
	const [post, setPost] = useState<Post | null>(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<Error | null>(null);

	useEffect(() => {
		let isMounted = true;

		if (!slug) {
			setPost(null);
			setLoading(false);
			return () => {
				isMounted = false;
			};
		}

		sanity
			.fetch<Post | null>(postBySlugQuery, { slug })
			.then((data) => {
				if (!isMounted) {
					return;
				}
				setPost(data ?? null);
				setLoading(false);
			})
			.catch((fetchError: unknown) => {
				if (!isMounted) {
					return;
				}
				setError(fetchError instanceof Error ? fetchError : new Error("Failed to load post"));
				setLoading(false);
			});

		return () => {
			isMounted = false;
		};
	}, [slug]);

	return { post, loading, error };
};

export default usePostBySlug;
