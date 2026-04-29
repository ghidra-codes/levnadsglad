import type { Category } from "./category.types";

export interface PostSpan {
	_type?: "span";
	text?: string;
	marks?: string[];
}

export interface PostBlock {
	_type: "block";
	_key?: string;
	style?: string;
	children?: PostSpan[];
	markDefs?: [];
}

export interface SanityImageReference {
	_type?: "reference";
	_ref: string;
}

export interface PostImage {
	_type: "image";
	_key?: string;
	asset?: SanityImageReference;
	alt?: string;
	caption?: string;
}

export type PostContent = PostBlock | PostImage;

export interface Post {
	_id: string;
	title: string;
	slug?: string;
	section?: string;
	publishedAt?: string;
	content?: PostContent[];
	category?: Category;
}

export interface PostListItem extends Post {
	publishedLabel: string;
	paragraphs: string[];
}
