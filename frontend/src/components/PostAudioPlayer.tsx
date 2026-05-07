import { useEffect, useState } from "react";
import AudioPlayer from "react-h5-audio-player";

interface PostAudioPlayerProps {
	src: string;
}

const MOBILE_BREAKPOINT = 600;

const PostAudioPlayer = ({ src }: PostAudioPlayerProps) => {
	const [isMobile, setIsMobile] = useState(window.innerWidth <= MOBILE_BREAKPOINT);

	// EFFECTS

	useEffect(() => {
		const mediaQuery = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT}px)`);

		const handleChange = (event: MediaQueryListEvent) => {
			setIsMobile(event.matches);
		};

		setIsMobile(mediaQuery.matches);

		mediaQuery.addEventListener("change", handleChange);

		return () => {
			mediaQuery.removeEventListener("change", handleChange);
		};
	}, []);

	// RENDER

	return (
		<div className="post-audio-player">
			<AudioPlayer
				src={src}
				preload="metadata"
				showJumpControls={false}
				customAdditionalControls={[]}
				layout={isMobile ? "stacked-reverse" : "horizontal-reverse"}
			/>
		</div>
	);
};

export default PostAudioPlayer;
