import { useEffect, useMemo } from "react";
import { PiArrowFatLeft, PiArrowFatRight } from "react-icons/pi";
import { Link, useNavigate, useParams, useSearchParams } from "react-router-dom";
import Post from "@/components/Post";
import usePostsByCategory from "@/hooks/data/usePostsByCategory";
import { buildPostPath, formatDate } from "@/lib/utils/helpers";
import type { PostListItem } from "@/types/post.types";

const POSTS_PER_PAGE = 20;

const getPostAnchor = (post: PostListItem): string => `post-${post.slug ?? post._id}`;

const DiaryPage = () => {
	const { categorySlug } = useParams();
	const [searchParams, setSearchParams] = useSearchParams();
	const navigate = useNavigate();
	const slug = categorySlug ? decodeURIComponent(categorySlug) : "";
	const { data: posts = [], isLoading, isError } = usePostsByCategory(slug);

	const items = useMemo<PostListItem[]>(() => {
		return posts.map((post) => ({
			...post,
			publishedLabel: post.publishedAt ? formatDate(post.publishedAt) : "",
			paragraphs: [],
		}));
	}, [posts]);

	const category = useMemo(() => {
		return items.length > 0 ? items[0].category : undefined;
	}, [items]);

	const pageFromUrl = Number(searchParams.get("page") ?? "1");
	const currentPage = Number.isInteger(pageFromUrl) && pageFromUrl > 0 ? pageFromUrl : 1;
	const pageCount = Math.max(1, Math.ceil(items.length / POSTS_PER_PAGE));
	const safePage = Math.min(currentPage, pageCount);
	const pageStart = (safePage - 1) * POSTS_PER_PAGE;
	const pageItems = items.slice(pageStart, pageStart + POSTS_PER_PAGE);
	const pageLabel =
		items.length > POSTS_PER_PAGE
			? `${pageStart + 1}-${pageStart + pageItems.length}`
			: `${items.length}`;

	useEffect(() => {
		if (currentPage === safePage) {
			return;
		}

		setSearchParams(safePage > 1 ? { page: String(safePage) } : {}, {
			replace: true,
		});
	}, [currentPage, safePage, setSearchParams]);

	if (!slug) {
		return (
			<section className="page page--diary">
				<p>Ingen dagbok vald.</p>
				<Link className="page__back" to="/">
					Tillbaka till startsidan
				</Link>
			</section>
		);
	}

	const handlePageChange = (nextPage: number) => {
		setSearchParams(nextPage > 1 ? { page: String(nextPage) } : {});
		window.scrollTo({ top: 0, behavior: "smooth" });
	};

	const handlePostSelect = (slug: string) => {
		if (slug) {
			navigate(buildPostPath(slug));
		}
	};

	return (
		<section className="page page--diary">
			<Link className="page__back" to="/">
				Tillbaka till startsidan
			</Link>
			<header className="page__header diary-header">
				<div>
					<h2>{category?.title ?? "Dagbok"}</h2>
					<p>
						{items.length} {items.length === 1 ? "inlägg" : "inlägg"}
					</p>
				</div>
			</header>
			{isLoading ? <p className="post-list__status">Laddar inlägg...</p> : null}
			{isError ? <p className="post-list__status">Kunde inte hämta inlägg.</p> : null}
			{!isLoading && !isError && items.length === 0 ? (
				<p className="post-list__status">Inga inlägg hittades.</p>
			) : null}
			{items.length > 0 ? (
				<>
					<nav className="diary-nav" aria-label="Inlägg i dagboken">
						<div className="diary-nav__select">
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
					{pageCount > 1 ? (
						<div className="diary-pagination" aria-label="Sidnavigering">
							<button
								type="button"
								disabled={safePage === 1}
								onClick={() => handlePageChange(safePage - 1)}
							>
								<PiArrowFatLeft />
							</button>
							<span>
								Sida {safePage} av {pageCount}
							</span>
							<button
								type="button"
								disabled={safePage === pageCount}
								onClick={() => handlePageChange(safePage + 1)}
							>
								<PiArrowFatRight />
							</button>
						</div>
					) : null}
					<div className="diary-flow">
						{pageItems.map((post) => (
							<section key={post._id} id={getPostAnchor(post)} className="diary-flow__post">
								<Post post={post} />
							</section>
						))}
					</div>
					{pageCount > 1 ? (
						<div className="diary-pagination diary-pagination--bottom" aria-label="Sidnavigering">
							<button
								type="button"
								disabled={safePage === 1}
								onClick={() => handlePageChange(safePage - 1)}
							>
								<PiArrowFatLeft />
							</button>
							<span>
								Sida {safePage} av {pageCount}
							</span>
							<button
								type="button"
								disabled={safePage === pageCount}
								onClick={() => handlePageChange(safePage + 1)}
							>
								<PiArrowFatRight />
							</button>
						</div>
					) : null}
				</>
			) : null}
		</section>
	);
};

export default DiaryPage;
