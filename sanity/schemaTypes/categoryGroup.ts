import type { Rule } from "sanity";

export default {
	name: "categoryGroup",
	type: "document",
	title: "Category Group",
	fields: [
		{
			name: "title",
			type: "string",
			validation: (Rule: Rule) => Rule.required(),
		},
		{
			name: "slug",
			type: "slug",
			options: { source: "title" },
			validation: (Rule: Rule) => Rule.required(),
		},
		{
			name: "order",
			type: "number",
			title: "Order",
		},
	],
};
