import type { PortableTextComponents, PortableTextTypeComponentProps } from "@portabletext/react";
import { imageUrlFor } from "@/lib/sanity/image";
import type { PostImage } from "@/types/post.types";

const portableTextComponents: PortableTextComponents = {
	types: {
		image: ({ value }: PortableTextTypeComponentProps<PostImage>) => {
			const image = value;
			if (!image.asset?._ref) return null;

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

export default portableTextComponents;
