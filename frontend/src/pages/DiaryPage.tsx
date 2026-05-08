import { useEffect, useMemo, useRef } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import PageState from "@/components/PageState";
import Pagination from "@/components/Pagination";
import Post from "@/components/Post";
import useCategoryBySlug from "@/hooks/data/useCategoryBySlug";
import usePostsByCategory from "@/hooks/data/usePostsByCategory";
import usePagination from "@/hooks/usePagination";
import { buildPostPath, formatDate } from "@/lib/utils/helpers";
import type { PostListItem } from "@/types/post.types";
import NotFoundPage from "./NotFoundPage";

const getPostAnchor = (post: PostListItem): string => `post-${post.slug ?? post._id}`;

const DiaryPage = () => {
	const { categorySlug } = useParams();
	const navigate = useNavigate();

	const pageRef = useRef<HTMLElement | null>(null);

	const slug = categorySlug ? decodeURIComponent(categorySlug) : "";

	const { data: posts, isLoading, isError, isFetched } = usePostsByCategory(slug);
	const categoryFromCache = useCategoryBySlug(slug);

	const items = useMemo<PostListItem[]>(() => {
		if (!posts) return [];

		return posts.map((post) => ({
			...post,
			publishedLabel: post.publishedAt ? formatDate(post.publishedAt) : "",
			paragraphs: [],
		}));
	}, [posts]);

	const { page, pageCount, pageItems, pageLabel, setPage } = usePagination(items);
	const postCountLabel = isLoading ? "Laddar..." : `${items.length} inlägg`;

	const handlePostSelect = (slug: string) => {
		if (slug) navigate(buildPostPath(slug));
	};

	// biome-ignore lint/correctness/useExhaustiveDependencies: scrolling on category change
	useEffect(() => {
		if (isLoading) return;

		const isMobile = window.innerWidth <= 900;

		if (isMobile) {
			pageRef.current?.scrollIntoView({
				behavior: "smooth",
				block: "start",
			});
		} else {
			window.scrollTo({ top: 0 });
		}
	}, [slug, isLoading]);

	if (isFetched && !isLoading && !isError && categoryFromCache === null) return <NotFoundPage />;

	return (
		<section ref={pageRef} className="page page--diary">
			<Link className="page__back" to="/">
				Tillbaka till startsidan
			</Link>
			<header className="page__header diary-header">
				<div>
					<h2>{categoryFromCache?.title ?? "\u00A0"}</h2>
					<p>{postCountLabel}</p>
				</div>
			</header>

			<PageState isLoading={isLoading} isError={isError}>
				{items.length === 0 ? (
					<p className="page__status">Inga inlägg hittades...</p>
				) : (
					<>
						<nav className="diary-nav" aria-label="Inlägg i dagboken">
							<div className="diary-nav__select">
								<label className="visually-hidden" htmlFor="diary-post-select">
									Välj inlägg
								</label>
								<select
									id="diary-post-select"
									defaultValue=""
									onChange={(event) => handlePostSelect(event.target.value)}
								>
									<option value="" disabled>
										Öppna ett enskilt inlägg
									</option>
									{items.map((post) =>
										post.slug ? (
											<option key={post._id} value={post.slug}>
												{post.title}
											</option>
										) : null,
									)}
								</select>
							</div>
							<div className="diary-nav__current">
								<p>
									Visar {pageLabel} av {items.length}
								</p>
								<ul>
									{pageItems.map((post) => (
										<li key={`nav-${post._id}`}>
											<a href={`#${getPostAnchor(post)}`}>{post.title}</a>
										</li>
									))}
								</ul>
							</div>
						</nav>

						<Pagination currentPage={page} pageCount={pageCount} onPageChange={setPage} />

						<div className="diary-flow">
							{pageItems.map((post) => (
								<section key={post._id} id={getPostAnchor(post)} className="diary-flow__post">
									<Post post={post} />
								</section>
							))}
						</div>

						<Pagination currentPage={page} pageCount={pageCount} onPageChange={setPage} bottom />
					</>
				)}
			</PageState>
		</section>
	);
};

export default DiaryPage;
