interface LoaderProps {
	size: "small" | "regular";
}

const Loader = ({ size }: LoaderProps) => {
	const sizeValue = size === "small" ? 48 : 62;

	return (
		<div className="loader-wrapper" role="status" aria-live="polite" aria-busy="true">
			<div
				className="loader"
				style={{
					width: `${sizeValue}px`,
					height: `${sizeValue}px`,
				}}
				aria-label="Laddar"
			/>
		</div>
	);
};

export default Loader;
