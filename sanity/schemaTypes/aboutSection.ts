import type { Rule } from "sanity";

export default {
	name: "aboutSection",
	type: "document",
	title: "Om mig",

	fields: [
		{
			name: "title",
			type: "string",
			title: "Rubrik",
			initialValue: "Lite om mig",
			validation: (Rule: Rule) => Rule.required(),
		},

		{
			name: "content",
			type: "array",
			title: "Innehåll",
			of: [{ type: "block" }],
			validation: (Rule: Rule) => Rule.required(),
		},

		// ABOUT IMAGE
		{
			name: "aboutImage",
			type: "image",
			title: "Bild",
			options: {
				hotspot: true,
			},
			fields: [
				{
					name: "alt",
					type: "string",
					title: "Alt-text",
					validation: (Rule: Rule) => Rule.required(),
				},
			],
		},
	],

	preview: {
		select: {
			title: "title",
			media: "aboutImage",
		},
	},
};
