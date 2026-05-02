import { useCallback, useEffect, useRef, useState } from "react";

export const useScrollDirection = () => {
	const [show, setShow] = useState(false);
	const [threshold, setThreshold] = useState(1200);

	// REFS
	const lastScrollY = useRef(0);

	// HELPERS
	const getThreshold = useCallback(() => {
		return window.innerWidth < 900 ? 1800 : 1200;
	}, []);

	// EFFECT: SET INITIAL THRESHOLD + HANDLE RESIZE
	useEffect(() => {
		const handleResize = () => setThreshold(getThreshold());

		handleResize();

		window.addEventListener("resize", handleResize);
		return () => window.removeEventListener("resize", handleResize);
	}, [getThreshold]);

	// EFFECT: SCROLL LOGIC
	useEffect(() => {
		const handleScroll = () => {
			const currentY = window.scrollY;

			const isScrollingUp = currentY < lastScrollY.current;
			const passedThreshold = currentY > threshold;

			setShow(isScrollingUp && passedThreshold);

			lastScrollY.current = currentY;
		};

		window.addEventListener("scroll", handleScroll, { passive: true });

		return () => window.removeEventListener("scroll", handleScroll);
	}, [threshold]);

	return show;
};
