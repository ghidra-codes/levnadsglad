import { visionTool } from "@sanity/vision";
import { defineConfig } from "sanity";
import { structureTool } from "sanity/structure";
import { schemaTypes } from "./schemaTypes";
import { structure } from "./structure";

export default defineConfig({
	name: "default",
	title: "Levnadsglad",

	projectId: "4llqfgmg",
	dataset: "production",

	plugins: [structureTool({ structure }), visionTool()],

	i18n: {
		locales: [
			{
				id: "sv-SE",
				title: "Svenska",
				weekInfo: {
					firstDay: 1,
					weekend: [6, 7],
				},
			},
		],
		defaultLocale: "sv-SE",
	},

	schema: {
		types: schemaTypes,
	},
});
