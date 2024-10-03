import { Flex, Image, VStack } from "@chakra-ui/react"
import React from "react"

type CollectionDescriptionProps = {
	// eslint-disable-next-line react/no-unused-prop-types
	collection: {
		Author: string
		Tquantity: string
		contractAddress: string
		image: string
		imageA: string
		imageB: string
		name: string
	}
}

const CollectionImage: React.FC<CollectionDescriptionProps> = ({ collection }) => {
	return (
		<VStack>
			<Flex
				_dark={{
					backdropFilter: "blur(32px)",
					background:
						"linear-gradient(137deg, rgba(143, 143, 143, 0.00) 41.48%, rgba(133, 133, 133, 0.28) 134.85%)",
					border: "1px solid rgba(224, 230, 255, 0.10)",
					color: "white",
					MozBackdropFilter: "blur(10px)",
					msBackdropFilter: "blur(32px)",
					transition: "border-color 0.3s ease",
					WebkitBackdropFilter: "blur(32px)"
				}}
				bg="rgba(255, 255, 255)"
				rounded="1.25em"
				shadow="md"
				width={{ base: "22rem", md: "25rem" }}
				height={{ base: "22rem", md: "25rem" }}
				align="center"
			>
				<Image
					src={collection.image}
					alt={collection.name}
					boxSize={{ base: "22rem", md: "25rem" }}
					objectFit="cover"
					borderRadius="lg"
					p={5}
				/>
			</Flex>
		</VStack>
	)
}

export default CollectionImage
