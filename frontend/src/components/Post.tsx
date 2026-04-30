import { PortableText } from "@portabletext/react";
import toast from "react-hot-toast";
import { extractParagraphs, formatDate } from "@/lib/utils/helpers";
import type { PostProps } from "@/types/props.types";
import PostReactions from "./PostReactions";
import portableTextComponents from "./utils/portableTextComponents";

const Post = ({ post }: PostProps) => {
	const paragraphs = extractParagraphs(post.content);
	const publishedLabel = formatDate(post.publishedAt);

	const postUrl = `${window.location.origin}/post/${post.slug}`;

	const handleShare = async () => {
		await navigator.clipboard.writeText(postUrl);
		toast.success("Länk kopierad", {
			icon: "🔗",
		});
	};

	const buildMailtoLink = () => {
		const to = "ninna@levnadsglad.se";
		const subject = encodeURIComponent(`Om: ${post.category.title} - ${post.title}`);

		return `mailto:${to}?subject=${subject}`;
	};

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
			<footer className="post__footer">
				<PostReactions postId={post._id} />

				<button className="post__share" onClick={handleShare}>
					Dela
				</button>

				<a href={buildMailtoLink()} className="post__mail">
					Dela en tanke
				</a>
			</footer>
		</article>
	);
};

export default Post;
