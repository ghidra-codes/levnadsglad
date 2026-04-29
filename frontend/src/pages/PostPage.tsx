import { Link, useParams } from "react-router-dom";
import Post from "@/components/Post";
import usePostBySlug from "@/hooks/data/usePostBySlug";

const PostPage = () => {
	const { slug } = useParams();
	const resolvedSlug = slug ?? "";
	const { data: post = null, isLoading, isError } = usePostBySlug(resolvedSlug);

	if (!resolvedSlug) {
		return (
			<section className="page page--post">
				<p>Inget inlägg hittades.</p>
				<Link className="page__back" to="/">
					Tillbaka till startsidan
				</Link>
			</section>
		);
	}

	return (
		<section className="page page--post">
			<Link className="page__back" to="/">
				Tillbaka till startsidan
			</Link>
			{isLoading ? <p>Laddar inlägg...</p> : null}
			{isError ? <p>Kunde inte hämta inlägget.</p> : null}
			{!isLoading && !isError && post ? <Post post={post} /> : null}
			{!isLoading && !isError && !post ? <p>Inget inlägg hittades.</p> : null}
		</section>
	);
};

export default PostPage;
