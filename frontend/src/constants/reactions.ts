import type { IconType } from "react-icons";
import { PiHandsPraying, PiHeart, PiThumbsUp } from "react-icons/pi";

type Reaction = {
	key: string;
	label: IconType;
};

export const REACTION_TYPES = ["like", "love", "thanks"] as const;

export const REACTIONS: readonly Reaction[] = [
	{ key: "like", label: PiThumbsUp },
	{ key: "love", label: PiHeart },
	{ key: "thanks", label: PiHandsPraying },
];
