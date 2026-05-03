interface LoaderProps {
	size: "small" | "regular";
}

const Loader = ({ size }: LoaderProps) => {
	const sizeValue = size === "small" ? 48 : 62;

	return (
		<div className="loader-wrapper">
			<div
				className="loader"
				style={{
					width: `${sizeValue}px`,
					height: `${sizeValue}px`,
				}}
				aria-label="loading"
			/>
		</div>
	);
};

export default Loader;
