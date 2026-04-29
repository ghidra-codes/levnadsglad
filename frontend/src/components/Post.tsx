import { PortableText } from "@portabletext/react";
import { extractParagraphs, formatDate } from "@/lib/utils/helpers";
import type { PostProps } from "@/types/props.types";
import portableTextComponents from "./utils/portableTextComponents";

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
			{post.content?.length ? (
				<div className="post__content">
					<PortableText value={post.content} components={portableTextComponents} />
				</div>
			) : null}
			{!post.content?.length && paragraphs.length > 0
				? paragraphs.map((paragraph, index) => (
						<p key={`${post._id}-paragraph-${index}`} className="post__paragraph">
							{paragraph}
						</p>
					))
				: null}
		</article>
	);
};

export default Post;
