import { extractParagraphs, formatDate } from "@/lib/utils/helpers";
import type { Post } from "@/types/post.types";

type PostProps = {
	post: Post;
};

const Post = ({ post }: PostProps) => {
	const paragraphs = extractParagraphs(post.content);
	const publishedLabel = formatDate(post.publishedAt);

	return (
		<article className="post">
			<header className="post__header">
				{post.section ? <span className="post__section">{post.section}</span> : null}
				<h2>{post.title}</h2>
				{publishedLabel ? <p className="post__date">{publishedLabel}</p> : null}
			</header>
			{paragraphs.length > 0
				? paragraphs.map((paragraph, index) => (
						<p key={`${post._id}-paragraph-${index}`} className="post__paragraph">
							{paragraph}
						</p>
					))
				: null}
			{post.sourceUrl ? (
				<a className="post__source" href={post.sourceUrl} target="_blank" rel="noreferrer">
					Läs originalet
				</a>
			) : null}
		</article>
	);
};

export default Post;
