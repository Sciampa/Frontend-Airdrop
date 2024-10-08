import { useImage } from "@chakra-ui/react"
import { motion } from "framer-motion"
import { useEffect, useRef } from "react"
import { Blurhash } from "react-blurhash"

export const BlurImage = ({
	src,
	blurHash,
	isHovering
}: {
	blurHash: string
	isHovering: boolean
	src: string
}) => {
	const isVideo = src.endsWith(".mp4")
	const videoRef = useRef<HTMLVideoElement>(null)

	useEffect(() => {
		if (isVideo && videoRef.current) {
			// Check if it's a mobile device
			const isMobileDevice = /mobi|android/iu.test(navigator.userAgent)
			// Set the playback rate accordingly
			videoRef.current.playbackRate = isMobileDevice ? 0.7 : 0.4
		}
	}, [isVideo])

	if (isVideo) {
		return (
			<video
				autoPlay
				loop
				muted
				controls={false}
				playsInline
				ref={videoRef}
				src={src}
				style={{
					filter: isHovering ? "blur(8px)" : "blur(0px)",
					height: "100%",
					objectFit: "fill",
					position: "absolute",
					transition: "filter 0.5s ease-in-out",
					width: "100%"
				}}
			/>
		)
	} else {
		// eslint-disable-next-line react-hooks/rules-of-hooks
		const imageStatus = useImage({ src })
		return imageStatus === "loaded" ? (
			<motion.img
				animate={isHovering ? { scale: 1.1 } : { scale: 1 }}
				src={src}
				style={{
					height: "100%",
					objectFit: "cover",
					position: "absolute",
					width: "100%"
				}}
				transition={{ type: "tween" }}
			/>
		) : (
			<Blurhash
				hash={blurHash}
				width="100%"
				height="100%"
				resolutionX={3}
				resolutionY={4}
				punch={1}
				style={{ position: "absolute" }}
			/>
		)
	}
}
