import { Link } from "react-router-dom";
import useDiaryNavigation from "@/hooks/data/useDiaryNavigation";

const SideNav = () => {
	const { sections, loading, error } = useDiaryNavigation();

	const buildDiaryPath = (section: string): string => `/diary/${encodeURIComponent(section)}`;
	const buildPostPath = (slug?: string): string => (slug ? `/post/${slug}` : "");

	return (
		<aside className="side-nav">
			<nav className="side-nav__inner" aria-label="Dagböcker">
				<h2>Dagböcker</h2>
				{loading ? <p className="side-nav__status">Laddar dagböcker...</p> : null}
				{error ? <p className="side-nav__status">Kunde inte hämta dagböcker.</p> : null}
				{!loading && !error && sections.length === 0 ? (
					<p className="side-nav__status">Inga dagböcker hittades.</p>
				) : null}
				{sections.length > 0 ? (
					<ul className="side-nav__list">
						{sections.map((section) => (
							<li key={section.name} className="side-nav__item">
								<Link className="side-nav__section" to={buildDiaryPath(section.name)}>
									{section.name}
								</Link>
								{section.posts.length > 0 ? (
									<ul className="side-nav__posts">
										{section.posts.map((post) => (
											<li key={post._id}>
												{post.slug ? (
													<Link
														className="side-nav__post"
														to={buildPostPath(post.slug)}
													>
														{post.title}
													</Link>
												) : (
													<span className="side-nav__post">{post.title}</span>
												)}
											</li>
										))}
									</ul>
								) : null}
							</li>
						))}
					</ul>
				) : null}
			</nav>
		</aside>
	);
};

export default SideNav;
