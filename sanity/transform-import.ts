// scripts/transform-import.ts

import fs from "fs";

// HELPERS
const formatTitle = (slug: string): string => {
	return slug.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
};

const input = fs.readFileSync("data/sanity-import.ndjson", "utf-8");
const lines = input
	.trim()
	.split("\n")
	.map((line) => JSON.parse(line));

// STEP 1 — collect categories
const categoryMap = new Map<string, number>();

lines.forEach((doc) => {
	if (doc._type === "post" && doc.section) {
		if (!categoryMap.has(doc.section)) {
			categoryMap.set(doc.section, categoryMap.size + 1);
		}
	}
});

// STEP 2 — create category docs
const categoryDocs = Array.from(categoryMap.entries()).map(([slug, order]) => ({
	_id: `category-${slug}`,
	_type: "category",
	title: formatTitle(slug),
	slug: {
		_type: "slug",
		current: slug,
	},
	order,
}));

// STEP 3 — transform posts
const transformedPosts = lines.map((doc) => {
	if (doc._type !== "post") return doc;

	const { section, ...rest } = doc;

	return {
		...rest,
		category: {
			_type: "reference",
			_ref: `category-${section}`,
		},
	};
});

// STEP 4 — output
const output = [...categoryDocs, ...transformedPosts].map((doc) => JSON.stringify(doc)).join("\n");

fs.writeFileSync("sanity-import-transformed.ndjson", output);

console.log("done");
