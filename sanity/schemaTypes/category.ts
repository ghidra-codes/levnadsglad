export default {
	name: "category",
	type: "document",
	title: "Category",
	fields: [
		{
			name: "title",
			type: "string",
			validation: (Rule: any) => Rule.required(),
		},
		{
			name: "subtitle",
			type: "string",
			title: "Subtitle",
		},
		{
			name: "slug",
			type: "slug",
			options: { source: "title" },
			validation: (Rule: any) => Rule.required(),
		},
		{
			name: "order",
			type: "number",
			validation: (Rule: any) => Rule.required(),
		},
		{
			name: "group",
			type: "reference",
			to: [{ type: "categoryGroup" }],
		},
	],
};
