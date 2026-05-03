import { useNavigate, useParams } from "react-router-dom";
import PageState from "@/components/PageState";
import Post from "@/components/Post";
import usePostBySlug from "@/hooks/data/usePostBySlug";
import NotFoundPage from "@/pages/NotFoundPage";

const PostPage = () => {
	const { slug } = useParams();
	const navigate = useNavigate();

	const resolvedSlug = slug ?? "";

	const { data: post = null, isLoading, isError } = usePostBySlug(resolvedSlug);

	const handleBack = () => {
		if (window.history.length > 1) navigate(-1);
		else navigate("/");
	};

	if (!isLoading && !isError && !post) {
		return <NotFoundPage />;
	}

	return (
		<section className="page page--post">
			<button className="page__back" onClick={handleBack}>
				Tillbaka till föregående sida
			</button>

			<PageState isLoading={isLoading} isError={isError}>
				{post && <Post post={post} />}
			</PageState>
		</section>
	);
};

export default PostPage;
