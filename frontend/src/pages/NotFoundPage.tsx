import { Link } from "react-router-dom";

const NotFoundPage = () => {
	return (
		<section className="page page--not-found">
			<Link className="page__back" to="/">
				Tillbaka till startsidan
			</Link>

			<div className="page__header">
				<h2>Hittades inte</h2>
				<p>Sidan kunde inte hittas.</p>
			</div>
		</section>
	);
};

export default NotFoundPage;
