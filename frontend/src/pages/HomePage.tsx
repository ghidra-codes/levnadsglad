import AboutSection from "@/components/AboutSection";
import LatestDiary from "@/components/LatestDiary";
import { useAboutSection } from "@/hooks/data/useAboutSection";

const HomePage = () => {
	const { data, isLoading, isError } = useAboutSection();

	return (
		<section className="page page--home">
			{isLoading && <p>Laddar...</p>}
			{isError && <p>Det gick inte att ladda informationen.</p>}
			{data && !isLoading && !isError && <AboutSection data={data} />}
			<LatestDiary />
		</section>
	);
};

export default HomePage;
