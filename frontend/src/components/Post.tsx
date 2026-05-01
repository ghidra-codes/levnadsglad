import { PortableText } from "@portabletext/react";
import toast from "react-hot-toast";
import { PiLink } from "react-icons/pi";
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
			icon: <PiLink />,
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
				<div className="post__header-content">
					<span className="post__category">{post.category.title}</span>
					<h2>{post.title}</h2>
					{publishedLabel ? <p className="post__date">{publishedLabel}</p> : null}
				</div>

				<button className="post__share" onClick={handleShare}>
					Kopiera länk <PiLink />
				</button>
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

				<a href={buildMailtoLink()} className="post__mail">
					Dela en tanke
				</a>
			</footer>
		</article>
	);
};

export default Post;
