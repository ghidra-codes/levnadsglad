import ErrorMessage from "./ErrorMessage";
import Loader from "./Loader";

type PageStateProps = {
	isLoading: boolean;
	isError: boolean;
	children: React.ReactNode;
};

const PageState = ({ isLoading, isError, children }: PageStateProps) => {
	if (isLoading) return <Loader size={"regular"} />;
	if (isError) return <ErrorMessage />;

	return <>{children}</>;
};

export default PageState;
