import { Link } from "react-router-dom";
import witheredPlant from "@/assets/images/withered-plant.png";

const NotFoundPage = () => {
	return (
		<section className="page page--not-found">
			<Link className="page__back" to="/">
				Tillbaka till startsidan
			</Link>

			<div className="page__header">
				<h2>Hittades inte</h2>
				<p>Sidan kunde inte hittas.</p>
				<img src={witheredPlant} alt="Illustration av en vissen växt" className="not-found-image" />
			</div>
		</section>
	);
};

export default NotFoundPage;
