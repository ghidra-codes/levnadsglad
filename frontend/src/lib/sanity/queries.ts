export const categoryGroupsQuery = `*[_type == "categoryGroup"]
| order(order asc) {
  _id,
  title,
  "slug": slug.current,
  order,

  "categories": *[
	_type == "category" &&
	defined(group) &&
	group._ref == ^._id
  ] | order(order asc) {
	_id,
	title,
	subtitle,
	"slug": slug.current,
	order
  }
}`;

export const categoriesQuery = `*[_type == "category"]
| order(order asc) {
	_id,
	title,
	subtitle,
	"slug": slug.current,
	order
}`;

export const postListQuery = `*[_type == "post"] | order(publishedAt desc) {
	_id,
	title,
	"slug": slug.current,
	publishedAt,
	"category": category->{
		_id,
		title,
		subtitle,
		"slug": slug.current,
		order
	},
	sourceUrl,
	content
}`;

export const postBySlugQuery = `*[_type == "post" && slug.current == $slug][0] {
	_id,
	title,
	"slug": slug.current,
	publishedAt,
	"category": category->{
		_id,
		title,
		subtitle,
		"slug": slug.current,
		order
	},
	sourceUrl,
	content
}`;

export const postsByCategoryQuery = `*[
	_type == "post" &&
	category->slug.current == $slug
] | order(publishedAt desc) {
	_id,
	title,
	"slug": slug.current,
	publishedAt,
	"category": category->{
		_id,
		title,
		subtitle,
		"slug": slug.current,
		order
	},
	sourceUrl,
	content
}`;

export const diaryNavQuery = `*[_type == "post" && defined(category)]
| order(category->order asc, publishedAt desc) {
	_id,
	title,
	"slug": slug.current,
	publishedAt,
	"category": category->{
		_id,
		title,
	    subtitle,
		"slug": slug.current,
		order
	}
}`;
