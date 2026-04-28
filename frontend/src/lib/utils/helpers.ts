import type { PostBlock } from "@/types/post.types";

export const formatDate = (value?: string | null): string => {
	if (!value) {
		return "";
	}

	const date = new Date(value);
	if (Number.isNaN(date.getTime())) {
		return "";
	}

	return new Intl.DateTimeFormat("sv-SE", {
		year: "numeric",
		month: "short",
		day: "2-digit",
	}).format(date);
};

export const extractParagraphs = (content?: PostBlock[] | null): string[] => {
	if (!Array.isArray(content)) {
		return [];
	}

	return content
		.filter((block) => Array.isArray(block.children) && block.children.length)
		.map((block) =>
			(block.children ?? [])
				.map((child) => (typeof child.text === "string" ? child.text : ""))
				.join("")
				.trim(),
		)
		.filter(Boolean);
};
