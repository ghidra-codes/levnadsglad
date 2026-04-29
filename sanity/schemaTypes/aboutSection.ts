import type { Rule } from "sanity";

export default {
	name: "aboutSection",
	type: "document",
	title: "About Section",

	fields: [
		{
			name: "title",
			type: "string",
			title: "Title",
			initialValue: "Lite om mig",
			validation: (Rule: Rule) => Rule.required(),
		},

		{
			name: "content",
			type: "array",
			title: "Content",
			of: [{ type: "block" }],
			validation: (Rule: Rule) => Rule.required(),
		},

		// ABOUT IMAGE
		{
			name: "aboutImage",
			type: "image",
			title: "About Image",
			options: {
				hotspot: true,
			},
			fields: [
				{
					name: "alt",
					type: "string",
					title: "Alt text",
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
