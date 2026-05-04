import type { Rule } from "sanity";
import { slugify } from "./utils/slugify";

export default {
	name: "categoryGroup",
	type: "document",
	title: "Kategorigrupp",
	fields: [
		{
			name: "title",
			type: "string",
			title: "Titel",
			validation: (Rule: Rule) => Rule.required(),
		},
		{
			name: "slug",
			type: "slug",
			title: "Slug",
			readOnly: true,
			options: { source: "title", slugify },
			validation: (Rule: Rule) => Rule.required(),
		},
		{
			name: "order",
			type: "number",
			title: "Ordning",
		},
	],
};
