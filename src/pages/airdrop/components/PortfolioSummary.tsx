import CosmosTotalParticles from "./getCosmos/getTotalParticles"
import { Flex, Heading, useColorModeValue, VStack } from "@chakra-ui/react"

export const PortfolioSummary = () => {
	return (
		<Flex
			_dark={{ bg: "rgba(33, 33, 33, 0.1)" }}
			align="center"
			justify="center" // Center content horizontally
			bg="rgb(255, 255, 255)"
			h="full"
			pos="relative"
			px={3}
			py={3}
			rounded="1.25em"
			shadow="md"
			w={{ base: "full", md: "50%" }}
		>
			<VStack align="center" h="full" spacing={0} w="full">
				<Heading as="h2" fontSize={{ base: "22", md: "22" }} fontWeight="500" mb={1}>
					Total
				</Heading>
				<Flex align="center" justify="center" flex={1} w="full">
					{" "}
					{/* Centered content in this Flex */}
					<Heading
						as="h1"
						bgClip="text"
						color={useColorModeValue("black", "white")}
						fontSize={{ base: "30", lg: "36" }}
						fontWeight="500"
						noOfLines={1}
						textAlign="center"
					>
						<CosmosTotalParticles />
					</Heading>
				</Flex>
			</VStack>
		</Flex>
	)
}
