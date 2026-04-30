import type { Category } from "./category.types";

// BASIC STRUCTURES
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

// IMAGE
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

// CONTENT UNION
export type PostContent = PostBlock | PostImage;

// MAIN POST
export interface Post {
	_id: string;
	title: string;
	slug: string;
	category: Category;
	section?: string;
	publishedAt?: string;
	content?: PostContent[];
}

// DERIVED TYPE
export interface PostListItem extends Post {
	publishedLabel: string;
	paragraphs: string[];
}
