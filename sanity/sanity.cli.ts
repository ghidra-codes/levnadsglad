import { defineCliConfig } from "sanity/cli";

export default defineCliConfig({
	api: {
		projectId: "4llqfgmg",
		dataset: "production",
	},
	deployment: {
		appId: "gkx9gi2klv762z7d0q9vihfc",
		autoUpdates: true,
	},
});
