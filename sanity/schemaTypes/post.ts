// POST SCHEMA
export default {
	name: "post",
	type: "document",
	title: "Post",
	fields: [
		{ name: "title", type: "string" },
		{
			name: "slug",
			type: "slug",
			options: { source: "title" },
		},
		{ name: "publishedAt", type: "datetime" },

		// CATEGORY
		{
			name: "section",
			type: "string",
			title: "Section",
		},

		// ORIGINAL SOURCE
		{
			name: "sourceUrl",
			type: "url",
		},

		{
			name: "content",
			type: "array",
			of: [{ type: "block" }],
		},
	],
};
