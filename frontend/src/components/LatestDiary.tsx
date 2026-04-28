import { useMemo } from "react";
import { Link } from "react-router-dom";
import usePostList from "@/hooks/data/usePostList";
import { extractParagraphs, formatDate } from "@/lib/utils/helpers";
import type { PostListItem } from "@/types/post.types";

const LatestDiary = () => {
	const { posts, loading, error } = usePostList();

	const items = useMemo<PostListItem[]>(() => {
		return posts.map((post) => ({
			...post,
			publishedLabel: formatDate(post.publishedAt),
			paragraphs: extractParagraphs(post.content),
		}));
	}, [posts]);

	const latestSection = useMemo(() => {
		const firstWithSection = items.find((post) => post.section);
		return firstWithSection?.section ?? "";
	}, [items]);

	const thumbnailItems = useMemo(() => {
		if (!latestSection) {
			return [] as PostListItem[];
		}

		return items.filter((post) => post.section === latestSection).slice(0, 6);
	}, [items, latestSection]);

	const buildExcerpt = (paragraphs: string[], maxLength = 140): string => {
		const text = paragraphs.join(" ").replace(/\s+/g, " ").trim();
		if (!text) {
			return "";
		}

		return text.length <= maxLength ? text : `${text.slice(0, maxLength).trim()}...`;
	};

	const buildPostPath = (slug?: string): string => (slug ? `/post/${slug}` : "");
	const buildDiaryPath = (section: string): string => `/diary/${encodeURIComponent(section)}`;

	if (loading) {
		return (
			<section className="post-list">
				<p>Laddar senaste dagboken...</p>
			</section>
		);
	}

	if (error) {
		return (
			<section className="post-list">
				<p>Kunde inte hämta senaste dagboken.</p>
			</section>
		);
	}

	return (
		<section className="post-list">
			{thumbnailItems.length > 0 ? (
				<div className="post-list__thumbnails">
					<div className="post-list__thumbnails-header">
						<div>
							<h2>Senaste dagboken</h2>
							<p>{latestSection}</p>
						</div>
						{latestSection ? (
							<Link className="post-list__thumbnails-link" to={buildDiaryPath(latestSection)}>
								Visa hela dagboken
							</Link>
						) : null}
					</div>
					<div className="post-list__thumbnails-grid">
						{thumbnailItems.map((post) => (
							<article key={`thumb-${post._id}`} className="post-list__thumbnail">
								{post.publishedLabel ? (
									<span className="post-list__thumbnail-date">{post.publishedLabel}</span>
								) : null}
								{post.slug ? (
									<Link className="post-list__thumbnail-link" to={buildPostPath(post.slug)}>
										<h3>{post.title}</h3>
									</Link>
								) : (
									<h3>{post.title}</h3>
								)}
								{post.paragraphs.length > 0 ? <p>{buildExcerpt(post.paragraphs)}</p> : null}
							</article>
						))}
					</div>
				</div>
			) : null}
		</section>
	);
};

export default LatestDiary;
