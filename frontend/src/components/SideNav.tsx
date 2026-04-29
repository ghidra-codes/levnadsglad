import { NavLink } from "react-router-dom";
import useCategoryGroups from "@/hooks/data/useCategoryGroups";
import { buildDiaryPath } from "@/lib/utils/helpers";

const SideNav = () => {
	const { data: groups = [], isLoading, isError } = useCategoryGroups();

	return (
		<aside className="side-nav">
			<nav className="side-nav__inner" aria-label="Dagböcker">
				<h2>Dagböcker</h2>

				{/* STATUS */}
				{isLoading && <p className="side-nav__status">Laddar dagböcker...</p>}
				{isError && <p className="side-nav__status">Kunde inte hämta dagböcker.</p>}

				{/* EMPTY */}
				{!isLoading && !isError && groups.length === 0 && (
					<p className="side-nav__status">Inga dagböcker hittades.</p>
				)}

				{/* GROUPS */}
				{groups.length > 0 && (
					<ul className="side-nav__groups">
						{groups.map((group) => (
							<li key={group._id} className="side-nav__group">
								<h3 className="side-nav__group-title">{group.title}</h3>

								<ul className="side-nav__list">
									{group.categories.map((category) => (
										<li key={category._id} className="side-nav__item">
											<NavLink
												className={({ isActive }) =>
													isActive
														? "side-nav__category side-nav__category--active"
														: "side-nav__category"
												}
												to={buildDiaryPath(category.slug)}
												onClick={() => window.scrollTo({ top: 0 })}
											>
												<span className="side-nav__title">{category.title}</span>
												{category.subtitle && (
													<span className="side-nav__subtitle">
														{category.subtitle}
													</span>
												)}
											</NavLink>
										</li>
									))}
								</ul>
							</li>
						))}
					</ul>
				)}
			</nav>
		</aside>
	);
};

export default SideNav;
