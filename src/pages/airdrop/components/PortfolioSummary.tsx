import { Flex, Heading, Skeleton, useColorModeValue, VStack } from "@chakra-ui/react"
import { useTotalBondedValue } from "@hooks/portfolio/query/useTotalBondedValue"
import { useTotalUnbondedValue } from "@hooks/portfolio/query/useTotalUnbondedValue"
import { useTokenList } from "hooks/tokens/query/useTokenList"
import { convertMicroDenomToDenom } from "utils/tokens/helpers"

export const PortfolioSummary = () => {
	const [tokenList] = useTokenList()
	const [totalBondedValue, isLoadingTotalBondedValue] = useTotalBondedValue()
	const [totalUnbondedValue, isLoadingTotalUnbondedValue] = useTotalUnbondedValue({
		tokenList: tokenList ?? []
	})

	return (
		<Flex
			_dark={{ bg: "rgba(33, 33, 33, 0.1)" }}
			align="center"
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
				<Heading as="h2" fontSize="22" fontWeight="500" mb={1}>
					Total
				</Heading>
				<Flex align="center" flex={1} w="full">
					<Skeleton
						isLoaded={Boolean(!isLoadingTotalBondedValue && !isLoadingTotalUnbondedValue)}
						rounded="1em"
						w="full"
					>
						<Heading
							as="h1"
							bgClip="text"
							color={useColorModeValue("black", "white")}
							fontSize={{ base: "30", lg: "36" }}
							fontWeight="500"
							noOfLines={1}
							textAlign="center"
						>
							{convertMicroDenomToDenom(totalBondedValue, 6)
								.plus(totalUnbondedValue)
								.toNumber()
								.toLocaleString("en-US", {
									currency: "USD",
									minimumFractionDigits: 2,
									style: "currency"
								})}
						</Heading>
					</Skeleton>
				</Flex>
			</VStack>
		</Flex>
	)
}
