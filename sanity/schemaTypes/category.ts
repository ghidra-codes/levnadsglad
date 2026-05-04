import { slugify } from "./utils/slugify";

export default {
	name: "category",
	type: "document",
	title: "Kategori",
	fields: [
		{
			name: "title",
			type: "string",
			title: "Titel",
			validation: (Rule: any) => Rule.required(),
		},
		{
			name: "subtitle",
			type: "string",
			title: "Underrubrik",
		},
		{
			name: "slug",
			type: "slug",
			title: "Slug",
			readOnly: true,
			options: { source: "title", slugify },
			validation: (Rule: any) => Rule.required(),
		},
		{
			name: "order",
			type: "number",
			title: "Ordning",
			validation: (Rule: any) => Rule.required(),
		},
		{
			name: "group",
			type: "reference",
			title: "Grupp",
			to: [{ type: "categoryGroup" }],
		},
	],
};
