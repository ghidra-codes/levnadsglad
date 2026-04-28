import { useEffect, useMemo, useState } from "react";
import { sanity } from "@/lib/sanity/client";
import { diaryNavQuery } from "@/lib/sanity/queries";

type DiaryNavPost = {
	_id: string;
	title: string;
	slug?: string;
	publishedAt?: string;
	section: string;
};

type DiarySection = {
	name: string;
	posts: DiaryNavPost[];
};

const EMPTY_LIST: DiaryNavPost[] = [];

const useDiaryNavigation = () => {
	const [posts, setPosts] = useState<DiaryNavPost[]>(EMPTY_LIST);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<Error | null>(null);

	useEffect(() => {
		let isMounted = true;

		sanity
			.fetch<DiaryNavPost[]>(diaryNavQuery)
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
				setError(fetchError instanceof Error ? fetchError : new Error("Failed to load diaries"));
				setLoading(false);
			});

		return () => {
			isMounted = false;
		};
	}, []);

	const sections = useMemo<DiarySection[]>(() => {
		const grouped = new Map<string, DiarySection>();

		posts.forEach((post) => {
			if (!post.section) {
				return;
			}
			const existing = grouped.get(post.section);
			if (existing) {
				existing.posts.push(post);
				return;
			}
			grouped.set(post.section, { name: post.section, posts: [post] });
		});

		return Array.from(grouped.values());
	}, [posts]);

	return { sections, loading, error };
};

export default useDiaryNavigation;
