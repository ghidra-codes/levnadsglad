import type { PortableTextComponents, PortableTextTypeComponentProps } from "@portabletext/react";
import { PortableText } from "@portabletext/react";
import { imageUrlFor } from "@/lib/sanity/image";
import { extractParagraphs, formatDate } from "@/lib/utils/helpers";
import type { PostImage } from "@/types/post.types";
import type { PostProps } from "@/types/props.types";

const portableTextComponents: PortableTextComponents = {
	types: {
		image: ({ value }: PortableTextTypeComponentProps<PostImage>) => {
			const image = value;
			if (!image.asset?._ref) {
				return null;
			}

			const imageUrl = imageUrlFor(image).width(1200).fit("max").auto("format").url();
			const caption = image.caption?.trim();

			return (
				<figure className="post__figure">
					<img className="post__image" src={imageUrl} alt={image.alt ?? ""} loading="lazy" />
					{caption ? <figcaption className="post__caption">{caption}</figcaption> : null}
				</figure>
			);
		},
	},
	block: {
		normal: ({ children }) => <p className="post__paragraph">{children}</p>,
		h2: ({ children }) => <h3 className="post__subheading">{children}</h3>,
		h3: ({ children }) => <h4 className="post__subheading">{children}</h4>,
		blockquote: ({ children }) => <blockquote className="post__quote">{children}</blockquote>,
	},
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
