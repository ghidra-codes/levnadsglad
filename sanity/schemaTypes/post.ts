// POST SCHEMA
export default {
	name: "post",
	type: "document",
	title: "Post",
	fields: [
		{
			name: "title",
			type: "string",
			options: {
				search: { weight: 10 },
			},
		},
		{
			name: "slug",
			type: "slug",
			options: { source: "title" },
		},
		{ name: "publishedAt", type: "datetime" },

		// CATEGORY
		{
			name: "category",
			type: "reference",
			to: [{ type: "category" }],
			validation: (Rule: any) => Rule.required(),
		},

		{
			name: "content",
			type: "array",
			of: [
				{ type: "block" },
				{
					type: "image",
					options: { hotspot: true },
					fields: [
						{
							name: "alt",
							type: "string",
							title: "Alternative text",
							description: "Describe the image for visitors using screen readers.",
						},
						{
							name: "caption",
							type: "string",
							title: "Caption",
						},
					],
				},
			],
		},
	],

	preview: {
		select: {
			title: "title",
			subtitle: "category.title",
		},
	},
};
