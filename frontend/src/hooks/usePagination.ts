import { useEffect, useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import type { PostListItem } from "@/types/post.types";

const POSTS_PER_PAGE = 20;

const usePagination = (items: PostListItem[]) => {
	const [searchParams, setSearchParams] = useSearchParams();

	// CURRENT PAGE
	const pageFromUrl = Number(searchParams.get("page") ?? "1");

	const currentPage = Number.isInteger(pageFromUrl) && pageFromUrl > 0 ? pageFromUrl : 1;

	const pageCount = Math.max(1, Math.ceil(items.length / POSTS_PER_PAGE));
	const safePage = Math.min(currentPage, pageCount);

	const pageStart = (safePage - 1) * POSTS_PER_PAGE;

	const pageItems = useMemo(() => items.slice(pageStart, pageStart + POSTS_PER_PAGE), [items, pageStart]);

	// LABEL
	const isMultiplePages = items.length > POSTS_PER_PAGE;
	const pageLabel = isMultiplePages
		? `${pageStart + 1}-${pageStart + pageItems.length}`
		: `${items.length}`;

	// SYNC URL
	useEffect(() => {
		if (currentPage === safePage) return;

		setSearchParams(safePage > 1 ? { page: String(safePage) } : {}, { replace: true });
	}, [currentPage, safePage, setSearchParams]);

	// HANDLER
	const setPage = (nextPage: number) => setSearchParams(nextPage > 1 ? { page: String(nextPage) } : {});

	// biome-ignore lint/correctness/useExhaustiveDependencies: scrolling on page change
	useEffect(() => {
		window.scrollTo({ top: 0, behavior: "smooth" });
	}, [currentPage]);

	return {
		page: safePage,
		pageCount,
		pageItems,
		pageLabel,
		setPage,
	};
};

export default usePagination;
