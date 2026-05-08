type ErrorMessageProps = {
	message?: string;
};

const ErrorMessage = ({ message = "Vi kunde inte hämta innehållet. Försök igen." }: ErrorMessageProps) => {
	return (
		<div className="error" role="alert">
			<div className="error__content">
				<h3 className="error__title">Något gick fel</h3>
				<p className="error__message">{message}</p>
			</div>
		</div>
	);
};

export default ErrorMessage;
