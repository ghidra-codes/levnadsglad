import { PiArrowFatLeft, PiArrowFatRight } from "react-icons/pi";

type PaginationProps = {
	currentPage: number;
	pageCount: number;
	onPageChange: (page: number) => void;
	bottom?: boolean;
};

const Pagination = ({ currentPage, pageCount, onPageChange, bottom }: PaginationProps) => {
	if (pageCount <= 1) return null;

	return (
		<div className={`diary-pagination ${bottom ? "bottom" : ""}`} aria-label="Sidnavigering">
			<button
				type="button"
				disabled={currentPage === 1}
				onClick={() => onPageChange(currentPage - 1)}
				aria-label="Föregående sida"
			>
				<PiArrowFatLeft />
			</button>

			<span>
				Sida {currentPage} av {pageCount}
			</span>

			<button
				type="button"
				disabled={currentPage === pageCount}
				onClick={() => onPageChange(currentPage + 1)}
				aria-label="Nästa sida"
			>
				<PiArrowFatRight />
			</button>
		</div>
	);
};

export default Pagination;
