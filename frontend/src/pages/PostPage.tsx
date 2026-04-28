import { Link, useParams } from "react-router-dom";
import Post from "@/components/Post";
import usePostBySlug from "@/hooks/data/usePostBySlug";

const PostPage = () => {
	const { slug } = useParams();
	const resolvedSlug = slug ?? "";
	const { post, loading, error } = usePostBySlug(resolvedSlug);

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
			{loading ? <p>Laddar inlägg...</p> : null}
			{error ? <p>Kunde inte hämta inlägget.</p> : null}
			{!loading && !error && post ? <Post post={post} /> : null}
			{!loading && !error && !post ? <p>Inget inlägg hittades.</p> : null}
		</section>
	);
};

export default PostPage;
