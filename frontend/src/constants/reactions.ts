export const REACTION_TYPES = ["like", "love", "thanks"] as const;

export const REACTIONS = [
	{ key: "like", label: "👍" },
	{ key: "love", label: "❤️" },
	{ key: "thanks", label: "🙏" },
] as const;
