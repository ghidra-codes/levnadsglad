import { Link } from "react-router-dom";

const NotFoundPage = () => {
	return (
		<section className="page page--not-found">
			<h2>Hittades inte</h2>
			<p>Sidan kunde inte hittas.</p>
			<Link className="page__back" to="/">
				Tillbaka till startsidan
			</Link>
		</section>
	);
};

export default NotFoundPage;
