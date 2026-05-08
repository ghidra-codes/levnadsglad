import { useState } from "react";
import { NavLink } from "react-router-dom";
import useCategoryGroups from "@/hooks/data/useCategoryGroups";
import { buildDiaryPath } from "@/lib/utils/helpers";
import ErrorMessage from "./ErrorMessage";
import Loader from "./Loader";

// CONFIG
const INITIAL_VISIBLE = 10;

const SideNav = () => {
	const { data: groups, isLoading, isError } = useCategoryGroups();

	// STATE: track expanded groups
	const [expandedGroups, setExpandedGroups] = useState<Record<string, boolean>>({});

	// HELPERS
	const toggleGroup = (groupId: string) => {
		setExpandedGroups((prev) => ({
			...prev,
			[groupId]: !prev[groupId],
		}));
	};

	if (groups === null) return null;

	const isLoadingGroups = isLoading || groups === undefined;

	return (
		<aside className="side-nav">
			<nav className="side-nav__inner" aria-label="Dagböcker">
				{/* STATUS */}
				{isLoadingGroups && <Loader size={"small"} />}
				{isError && <ErrorMessage message="Kunde inte ladda dagböckerna. Försök igen." />}

				{/* EMPTY */}
				{!isLoadingGroups && !isError && groups.length === 0 && (
					<p className="side-nav__status">Inga dagböcker hittades...</p>
				)}

				{/* GROUPS */}
				{Array.isArray(groups) && groups.length > 0 && (
					<ul className="side-nav__groups">
						{groups.map((group) => {
							const isExpanded = expandedGroups[group._id];
							const categories = group.categories || [];
							const listId = `side-nav-group-${group._id}`;

							const visibleCategories = isExpanded
								? categories
								: categories.slice(0, INITIAL_VISIBLE);

							const hasOverflow = categories.length > INITIAL_VISIBLE;

							return (
								<li key={group._id} className="side-nav__group">
									<h2 className="side-nav__group-title">{group.title}</h2>

									<ul className="side-nav__list" id={listId}>
										{visibleCategories.map((category) => (
											<li key={category._id}>
												<NavLink
													className={({ isActive }) =>
														isActive
															? "side-nav__category side-nav__category--active"
															: "side-nav__category"
													}
													to={buildDiaryPath(category.slug)}
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

									{/* SHOW MORE / LESS */}
									{hasOverflow && (
										<button
											className="side-nav__toggle"
											type="button"
											aria-expanded={isExpanded}
											aria-controls={listId}
											onClick={() => toggleGroup(group._id)}
										>
											{isExpanded ? "Visa färre" : "Visa fler"}
										</button>
									)}
								</li>
							);
						})}
					</ul>
				)}
			</nav>
		</aside>
	);
};

export default SideNav;
