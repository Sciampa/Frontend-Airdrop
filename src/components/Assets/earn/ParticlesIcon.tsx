import { Image, type ImageProps } from "@chakra-ui/react"

export const ParticlesIcon = ({ ...props }: ImageProps) => (
	<Image
		h={{ base: "0.8rem", md: "1.1rem" }}
		w={{ base: "0.8rem", md: "1.1rem" }}
		src="/assets/tokens/particleG.png"
		alt="Particles Icon"
		objectFit="contain" // Ensure the image fits within the defined size
		pos="relative"
		right={0}
		{...props}
	/>
)
