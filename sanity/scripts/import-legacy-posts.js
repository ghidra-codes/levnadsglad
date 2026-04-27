// @ts-check

// IMPORT LEGACY POSTS -> SANITY
// run with: node scripts/import-legacy-posts.js

import fs from "fs";
import path from "path";

// PATHS
const INPUT_PATH = path.resolve("./data/extraction/legacy-posts-clean.json");
const OUTPUT_PATH = path.resolve("./data/sanity-import.ndjson");

// HELPERS

// TEXT -> PORTABLE TEXT BLOCKS
const text_to_blocks = (text, title) => {
	const paragraphs = text
		.split("\n\n")
		.map((p) => p.trim())
		.filter(Boolean);

	if (paragraphs[0] === title) {
		paragraphs.shift();
	}

	return paragraphs.map((paragraph) => ({
		_type: "block",
		style: "normal",
		children: [
			{
				_type: "span",
				text: paragraph,
				marks: [],
			},
		],
	}));
};
// MAIN TRANSFORM
const transform_posts = (posts) => {
	return posts.map((post) => ({
		_id: `post-${post.id}`, // Stable id for safe re-imports.
		_type: "post",

		title: post.title,

		slug: {
			_type: "slug",
			current: post.slugCandidate,
		},

		section: post.sectionSlug,
		sourceUrl: post.sourceUrl,

		// fallback date (you can improve later if you have real dates)
		publishedAt: new Date().toISOString(),

		content: text_to_blocks(post.body, post.title),
	}));
};

// RUN
const run = () => {
	if (!fs.existsSync(INPUT_PATH)) {
		console.error("input file not found:", INPUT_PATH);
		process.exit(1);
	}

	const raw = JSON.parse(fs.readFileSync(INPUT_PATH, "utf-8"));

	const transformed = transform_posts(raw);

	// Write NDJSON, one document per line.
	const ndjson = transformed.map((doc) => JSON.stringify(doc)).join("\n");

	fs.writeFileSync(OUTPUT_PATH, ndjson);

	console.log(`done. wrote ${transformed.length} posts -> ${OUTPUT_PATH}`);
};

run();
