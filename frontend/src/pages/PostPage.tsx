import { useNavigate, useParams } from "react-router-dom";
import Post from "@/components/Post";
import usePostBySlug from "@/hooks/data/usePostBySlug";

const PostPage = () => {
	const { slug } = useParams();
	const navigate = useNavigate();

	const resolvedSlug = slug ?? "";
	const { data: post = null, isLoading, isError } = usePostBySlug(resolvedSlug);

	const handleBack = () => {
		if (window.history.length > 1) navigate(-1);
		else navigate("/");
	};

	if (!resolvedSlug) {
		return (
			<section className="page page--post">
				<p>Inget inlägg hittades.</p>
				<button className="page__back" onClick={handleBack}>
					Tillbaka till föregående sida
				</button>
			</section>
		);
	}

	return (
		<section className="page page--post">
			<button className="page__back" onClick={handleBack}>
				Tillbaka till föregående sida
			</button>

			{isLoading && <p>Laddar inlägg...</p>}
			{isError && <p>Kunde inte hämta inlägget.</p>}
			{!isLoading && !isError && post && <Post post={post} />}
			{!isLoading && !isError && !post && <p>Inget inlägg hittades.</p>}
		</section>
	);
};

export default PostPage;
