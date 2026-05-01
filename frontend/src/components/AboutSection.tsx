import { PortableText } from "@portabletext/react";
import defaultImage from "@/assets/images/ninna.jpg";
import type { AboutSection } from "@/types/about.types";
import portableTextComponents from "./utils/portableTextComponents";

interface AboutSectionProps {
	data: AboutSection;
}

const AboutSection = ({ data }: AboutSectionProps) => {
	const imageUrl = data.aboutImage?.asset?.url || defaultImage;
	const alt = data.aboutImage?.alt || "";

	return (
		<section className="about">
			<div className="about__content">
				{imageUrl && <img src={imageUrl} alt={alt} className="about__image" />}

				<h2>{data.title}</h2>

				<PortableText value={data.content} components={portableTextComponents} />
			</div>
		</section>
	);
};

export default AboutSection;
