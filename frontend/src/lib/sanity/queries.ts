// Post list used on the landing page.
export const postListQuery = `*[_type == "post"] | order(publishedAt desc) {
	_id,
	title,
	"slug": slug.current,
	publishedAt,
	section,
	sourceUrl,
	content
}`;

export const postBySlugQuery = `*[_type == "post" && slug.current == $slug][0] {
	_id,
	title,
	"slug": slug.current,
	publishedAt,
	section,
	sourceUrl,
	content
}`;

export const postsBySectionQuery = `*[_type == "post" && section == $section] | order(publishedAt desc) {
	_id,
	title,
	"slug": slug.current,
	publishedAt,
	section,
	sourceUrl,
	content
}`;

export const diaryNavQuery = `*[_type == "post" && defined(section)] | order(section asc, publishedAt desc) {
	_id,
	title,
	"slug": slug.current,
	publishedAt,
	section
}`;
