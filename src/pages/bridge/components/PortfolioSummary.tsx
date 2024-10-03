import { Flex, Heading, SimpleGrid, Skeleton, VStack } from "@chakra-ui/react"
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
		<SimpleGrid
			_dark={{
				bgGradient: "linear(to-b, #0a2b33, #1a001e)"
			}}
			bg="gray.700"
			bgGradient="linear(to-b, #0a2b33, #1a001e)"
			columns={{ base: 1, md: 4, sm: 2 }}
			px={4}
			py={{ base: "1rem", md: "1rem" }}
			rounded="1.25em"
			shadow="md"
			maxW="6xl"
			spacing={{ base: 2, lg: 10, md: 6, sm: 4 }}
			w="full"
		>
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
				align="start"
				bg="gray.700"
				h="full"
				maxH={{ base: "full", md: "full" }}
				pos="relative"
				px={3}
				py={{ base: 0, md: 3 }}
				rounded="1.25em"
				shadow="md"
				w={{ base: "full", md: "full" }}
			>
				<VStack align="start" h="full" spacing={0} w="full">
					<Heading
						as="h2"
						fontSize={{ base: 18, md: 22 }}
						fontWeight="400"
						mb={1}
						mt={{ base: 1, md: 0 }}
					>
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
								bgGradient="linear(45deg, #4b6cb7, brand.2)"
								fontSize={{ base: "24", lg: "36" }}
								fontWeight="900"
								noOfLines={1}
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
				align="start"
				bg="gray.700"
				h="full"
				pos="relative"
				px={3}
				py={{ base: 0, md: 3 }}
				rounded="1.25em"
				shadow="md"
				w={{ base: "full", md: "full" }}
			>
				<VStack align="start" h="full" spacing={0} w="full">
					<Heading
						as="h2"
						fontSize={{ base: 18, md: 22 }}
						fontWeight="400"
						mb={1}
						mt={{ base: 1, md: 0 }}
					>
						Bonded
					</Heading>
					<Flex align="center" flex={1} w="full">
						<Skeleton isLoaded={Boolean(!isLoadingTotalBondedValue)} rounded="1em" w="full">
							<Heading
								as="h1"
								bgClip="text"
								bgGradient="linear(45deg, #4b6cb7, brand.2)"
								fontSize={{ base: "24", lg: "36" }}
								fontWeight="900"
								noOfLines={1}
							>
								{`${convertMicroDenomToDenom(totalBondedValue, 6)
									.toNumber()
									.toLocaleString("en-US", {
										currency: "USD",
										minimumFractionDigits: 2,
										style: "currency"
									})}`}
							</Heading>
						</Skeleton>
					</Flex>
				</VStack>
			</Flex>
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
				align="start"
				bg="gray.700"
				h="full"
				pos="relative"
				px={3}
				py={{ base: 0, md: 3 }}
				rounded="1.25em"
				shadow="md"
				w={{ base: "full", md: "full" }}
			>
				<VStack align="start" h="full" spacing={0} w="full">
					<Heading
						as="h2"
						fontSize={{ base: 18, md: 22 }}
						fontWeight="400"
						mb={1}
						mt={{ base: 1, md: 0 }}
					>
						Unbonded
					</Heading>
					<Flex align="center" flex={1} w="full">
						<Skeleton isLoaded={Boolean(!isLoadingTotalUnbondedValue)} rounded="1em" w="full">
							<Heading
								as="h1"
								bgClip="text"
								bgGradient="linear(45deg, #4b6cb7, brand.2)"
								fontSize={{ base: "24", lg: "36" }}
								fontWeight="900"
								noOfLines={1}
							>
								{totalUnbondedValue.toLocaleString("en-US", {
									currency: "USD",
									minimumFractionDigits: 2,
									style: "currency"
								})}
							</Heading>
						</Skeleton>
					</Flex>
				</VStack>
			</Flex>
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
				align="start"
				bg="gray.700"
				h="full"
				pos="relative"
				px={3}
				py={{ base: 0, md: 3 }}
				rounded="1.25em"
				shadow="md"
				w={{ base: "full", md: "full" }}
			>
				<VStack align="start" h="full" spacing={0} w="full">
					<Heading
						as="h2"
						fontSize={{ base: 18, md: 22 }}
						fontWeight="400"
						mb={1}
						mt={{ base: 1, md: 0 }}
					>
						Staked
					</Heading>
					<Flex align="center" flex={1}>
						<Heading
							as="h1"
							bgClip="text"
							bgGradient="linear(45deg, #4b6cb7, brand.2)"
							fontSize={{ base: 18, md: 22 }}
							fontWeight="900"
						>
							Coming Soon
						</Heading>
					</Flex>
				</VStack>
			</Flex>
		</SimpleGrid>
	)
}
