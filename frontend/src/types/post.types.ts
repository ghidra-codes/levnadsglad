export type PostSpan = {
	text?: string;
};

export type PostBlock = {
	children?: PostSpan[];
};

export type Post = {
	_id: string;
	title: string;
	slug?: string;
	section?: string;
	publishedAt?: string;
	sourceUrl?: string;
	content?: PostBlock[];
};

export type PostListItem = Post & {
	publishedLabel: string;
	paragraphs: string[];
};
