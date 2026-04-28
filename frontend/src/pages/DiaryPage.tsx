import { useMemo } from "react";
import { Link, useParams } from "react-router-dom";
import usePostsBySection from "@/hooks/data/usePostsBySection";
import { extractParagraphs, formatDate } from "@/lib/utils/helpers";
import type { PostListItem } from "@/types/post.types";

const DiaryPage = () => {
	const { section } = useParams();
	const decodedSection = section ? decodeURIComponent(section) : "";
	const { posts, loading, error } = usePostsBySection(decodedSection);

	const items = useMemo<PostListItem[]>(() => {
		return posts.map((post) => ({
			...post,
			publishedLabel: formatDate(post.publishedAt),
			paragraphs: extractParagraphs(post.content),
		}));
	}, [posts]);

	const buildPostPath = (slug?: string): string => (slug ? `/post/${slug}` : "");

	if (!decodedSection) {
		return (
			<section className="page page--diary">
				<p>Ingen dagbok vald.</p>
				<Link className="page__back" to="/">
					Tillbaka till startsidan
				</Link>
			</section>
		);
	}

	return (
		<section className="page page--diary">
			<Link className="page__back" to="/">
				Tillbaka till startsidan
			</Link>
			<header className="page__header">
				<h2>{decodedSection}</h2>
				<p>Dagboksinlägg i denna serie.</p>
			</header>
			{loading ? <p className="post-list__status">Laddar inlägg...</p> : null}
			{error ? <p className="post-list__status">Kunde inte hämta inlägg.</p> : null}
			{!loading && !error && items.length === 0 ? (
				<p className="post-list__status">Inga inlägg hittades.</p>
			) : null}
			{items.length > 0 ? (
				<ul className="post-list__list">
					{items.map((post) => (
						<li key={post._id} className="post-list__item">
							<div className="post-list__meta">
								{post.section ? <span>{post.section}</span> : null}
								{post.publishedLabel ? <span>{post.publishedLabel}</span> : null}
							</div>
							{post.slug ? (
								<Link className="post-list__title-link" to={buildPostPath(post.slug)}>
									<h3>{post.title}</h3>
								</Link>
							) : (
								<h3>{post.title}</h3>
							)}
							{post.paragraphs.length > 0
								? post.paragraphs.map((paragraph, index) => (
										<p key={`${post._id}-p-${index}`}>{paragraph}</p>
									))
								: null}
							{post.sourceUrl ? (
								<a href={post.sourceUrl} target="_blank" rel="noreferrer">
									Läs originalet
								</a>
							) : null}
						</li>
					))}
				</ul>
			) : null}
		</section>
	);
};

export default DiaryPage;
