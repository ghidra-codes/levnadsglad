import type { PostBlock, PostContent } from "@/types/post.types";

// DATE FORMATTING
export const formatDate = (value?: string | null): string => {
	if (!value) return "";

	const date = new Date(value);
	if (Number.isNaN(date.getTime())) return "";

	return new Intl.DateTimeFormat("sv-SE", {
		year: "numeric",
		month: "short",
		day: "2-digit",
	}).format(date);
};

// CONTENT → PARAGRAPHS
export const extractParagraphs = (content?: PostContent[] | null): string[] => {
	if (!Array.isArray(content)) return [];

	return content
		.filter(
			(
				block,
			): block is PostBlock & {
				children: NonNullable<PostBlock["children"]>;
			} => block._type === "block" && Array.isArray(block.children),
		)
		.map((block) =>
			block.children
				.map((child) => (typeof child.text === "string" ? child.text : ""))
				.join("")
				.trim(),
		)
		.filter(Boolean);
};

// ROUTING
export const buildDiaryPath = (slug: string): string =>
	`/diary/${encodeURIComponent(slug)}`;

export const buildPostPath = (slug?: string): string =>
	slug ? `/post/${slug}` : "";

// TEXT UTIL
export const buildExcerpt = (paragraphs: string[], maxLength = 140): string => {
	if (!Array.isArray(paragraphs) || paragraphs.length === 0) return "";

	const text = paragraphs.join(" ").replace(/\s+/g, " ").trim();
	if (!text) return "";

	if (text.length <= maxLength) return text;

	return `${text.slice(0, maxLength).trim()}...`;
};
