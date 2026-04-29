import { useMemo } from "react";
import { Link } from "react-router-dom";
import usePostList from "@/hooks/data/usePostList";
import {
	buildDiaryPath,
	buildExcerpt,
	buildPostPath,
	extractParagraphs,
	formatDate,
} from "@/lib/utils/helpers";
import type { PostListItem } from "@/types/post.types";

const LatestDiary = () => {
	const { data: posts = [], isLoading, isError, error } = usePostList();

	// DERIVE ITEMS
	const items = useMemo<PostListItem[]>(() => {
		return posts.map((post) => ({
			...post,
			publishedLabel: post.publishedAt ? formatDate(post.publishedAt) : "",
			paragraphs: extractParagraphs(post.content),
		}));
	}, [posts]);

	// GET LATEST CATEGORY (from latest post)
	const latestCategory = items[0]?.category;

	// FILTER POSTS BY THAT CATEGORY
	const thumbnailItems = useMemo(() => {
		if (!latestCategory?.slug) return [];

		return items.filter((post) => post.category?.slug === latestCategory.slug).slice(0, 6);
	}, [items, latestCategory]);

	if (isLoading) {
		return (
			<section className="post-list">
				<p>Laddar senaste dagboken...</p>
			</section>
		);
	}

	if (isError) {
		console.error(error);
		return (
			<section className="post-list">
				<p>Kunde inte hämta senaste dagboken.</p>
			</section>
		);
	}

	return (
		<section className="post-list">
			{thumbnailItems.length > 0 && latestCategory ? (
				<div className="post-list__thumbnails">
					<div className="post-list__thumbnails-header">
						<div>
							<h2>Senaste dagboken</h2>
							<p>{latestCategory.title}</p>
						</div>

						<Link className="post-list__thumbnails-link" to={buildDiaryPath(latestCategory.slug)}>
							Visa hela dagboken
						</Link>
					</div>

					<div className="post-list__thumbnails-grid">
						{thumbnailItems.map((post) => (
							<article key={`thumb-${post._id}`} className="post-list__thumbnail">
								{post.publishedLabel && (
									<span className="post-list__thumbnail-date">{post.publishedLabel}</span>
								)}

								{post.slug ? (
									<Link className="post-list__thumbnail-link" to={buildPostPath(post.slug)}>
										<h3>{post.title}</h3>
									</Link>
								) : (
									<h3>{post.title}</h3>
								)}

								{post.paragraphs.length > 0 && <p>{buildExcerpt(post.paragraphs)}</p>}
							</article>
						))}
					</div>
				</div>
			) : null}
		</section>
	);
};

export default LatestDiary;
