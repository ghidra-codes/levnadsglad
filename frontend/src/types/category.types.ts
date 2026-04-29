export interface CategoryGroup {
	_id: string;
	title: string;
	slug: string;
	order: number;
	categories: {
		_id: string;
		title: string;
		subtitle?: string;
		slug: string;
		order: number;
	}[];
}

export interface Category {
	_id: string;
	title: string;
	subtitle?: string;
	slug: string;
	order: number;
	group?: {
		_id: string;
		title: string;
		slug: string;
		order: number;
	};
}
