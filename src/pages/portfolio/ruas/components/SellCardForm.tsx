/* eslint-disable unicorn/prevent-abbreviations */
/* eslint-disable id-length */
import { Flex, Text, VStack } from "@chakra-ui/react"

const SellCardForm = () => {
	return (
		<Flex
			align="center"
			mb="0.4rem"
			justify="center"
			flexDirection="column"
			w="8rem"
			h="2.5rem"
			bg="rgb(255, 255, 255)"
			color="black"
			rounded="0.8em"
			shadow="md"
			_dark={{
				backdropFilter: "blur(32px)",
				background:
					"linear-gradient(137deg, rgba(143, 143, 143, 0.00) 41.48%, rgba(133, 133, 133, 0.28) 134.85%)",
				border: "1px solid rgba(224, 230, 255, 0.10)",
				color: "white"
			}}
		>
			<VStack align="center" justify="center" h="100%" gap={1}>
				<Text align="center" fontSize="0.7rem" w="full">
					Actual floor price
				</Text>
				<Text mt="-0.2rem" align="center" fontSize="0.7rem" fontWeight="bold" w="full">
					2.25 NTRN
				</Text>
			</VStack>
		</Flex>
	)
}

export default SellCardForm
