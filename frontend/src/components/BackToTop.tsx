import { useState } from "react";
import { PiArrowFatUp } from "react-icons/pi";
import { useScrollDirection } from "@/hooks/useScrollDirection";

const BackToTop = () => {
	const [isScrolling, setIsScrolling] = useState(false);

	const isVisible = useScrollDirection();

	const handleClick = () => {
		setIsScrolling(true);

		window.scrollTo({
			top: 0,
			behavior: "smooth",
		});

		// detect when scroll finishes
		const checkIfDone = () => {
			if (window.scrollY === 0) {
				setIsScrolling(false);
				window.removeEventListener("scroll", checkIfDone);
			}
		};

		window.addEventListener("scroll", checkIfDone);
	};

	return (
		<button
			className={`back-to-top
				${isVisible ? "is-visible" : ""}
				${isScrolling ? "is-scrolling" : ""}
			`}
			onClick={handleClick}
			type="button"
			aria-label="Tillbaka till toppen"
		>
			<PiArrowFatUp /> Till toppen
		</button>
	);
};

export default BackToTop;
