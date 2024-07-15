import { useEffect, useRef } from "react";

export const UserFeedPlayer: React.FC<{ stream: MediaStream }> = ({ stream }) => {
	const videoRef = useRef<HTMLVideoElement>(null);

	useEffect(() => {
		if (videoRef.current && stream) {
			videoRef.current.srcObject = stream;
		}
	}, [stream]);

	return (
		<video
			className="-scale-x-100 rounded-2xl forced-color-adjust-none"
			width={400}
			height={400}
			ref={videoRef}
			muted={true}
			autoPlay
		/>
	);
};
