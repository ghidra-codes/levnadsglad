import type { PortableTextBlock } from "@portabletext/types";

export interface AboutSection {
	title: string;
	content: PortableTextBlock[];
	aboutImage?: {
		asset?: {
			url: string;
		};
		alt?: string;
	};
}
