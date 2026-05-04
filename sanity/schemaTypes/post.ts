import { slugify } from "./utils/slugify";

// POST SCHEMA
export default {
	name: "post",
	type: "document",
	title: "Inlägg",
	fields: [
		{
			name: "title",
			type: "string",
			title: "Titel",
			options: {
				search: { weight: 10 },
			},
		},
		{
			name: "slug",
			type: "slug",
			title: "Slug",
			readOnly: true,
			options: { source: "title", slugify },
		},
		{
			name: "publishedAt",
			type: "datetime",
			title: "Publicerad",
			initialValue: () => new Date().toISOString(),
		},

		// CATEGORY
		{
			name: "category",
			type: "reference",
			title: "Kategori",
			to: [{ type: "category" }],
			validation: (Rule: any) => Rule.required(),
		},

		{
			name: "content",
			type: "array",
			title: "Innehåll",
			of: [
				{ type: "block" },
				{
					type: "image",
					options: { hotspot: true },
					fields: [
						{
							name: "alt",
							type: "string",
							title: "Alternativ text",
							description: "Beskriv bilden för besökare som använder skärmläsare.",
						},
						{
							name: "caption",
							type: "string",
							title: "Bildtext",
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
