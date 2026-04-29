export interface DiaryNavPost {
	_id: string;
	title: string;
	slug?: string;
	publishedAt?: string;
	category: {
		title: string;
		slug: string;
		order: number;
	};
}
