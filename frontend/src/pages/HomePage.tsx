import AboutSection from "@/components/AboutSection";
import LatestDiary from "@/components/LatestDiary";
import PageState from "@/components/PageState";
import { useAboutSection } from "@/hooks/data/useAboutSection";
import usePostList from "@/hooks/data/usePostList";

const HomePage = () => {
	const about = useAboutSection();
	const posts = usePostList();

	const isLoading = about.isLoading || posts.isLoading;
	const isError = about.isError || posts.isError;

	return (
		<section className="page page--home">
			<PageState isLoading={isLoading} isError={isError}>
				{about.data && <AboutSection data={about.data} />}

				{posts.data && <LatestDiary posts={posts.data} />}
			</PageState>
		</section>
	);
};

export default HomePage;
