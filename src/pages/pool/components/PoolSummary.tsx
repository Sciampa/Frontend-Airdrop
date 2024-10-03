/* eslint-disable complexity */
import { PoolIcons } from "../../earn/components/PoolIcons"
import { PoolTags } from "../../earn/components/PoolTags"
import {
	Avatar,
	AvatarGroup,
	Box,
	Button,
	Center,
	chakra,
	Flex,
	HStack,
	Icon,
	Popover,
	PopoverArrow,
	PopoverContent,
	PopoverTrigger,
	Spacer,
	Stat,
	StatHelpText,
	StatLabel,
	StatNumber,
	Text,
	useBreakpoint,
	VStack
} from "@chakra-ui/react"
import { useTokenInfo } from "hooks/tokens/query/useTokenInfo"
import { FaFileContract, FaQuestionCircle } from "react-icons/fa"
import { usePalette } from "react-palette"
import { convertMicroDenomToDenom } from "utils/tokens/helpers"
import { type TPool } from "utils/tokens/pools"
import shortenNumber from "utils/ui/shortenNumber"

export const PoolSummary = ({ pool }: { pool: TPool }) => {
	const tokenA = useTokenInfo(pool.liquidity.token1.denom)
	const tokenB = useTokenInfo(pool.liquidity.token2.denom)
	const { data: tokenAColors } = usePalette(tokenA?.logoURI ?? "/assets/unknownToken.svg")
	const { data: tokenBColors } = usePalette(tokenB?.logoURI ?? "/assets/unknownToken.svg")

	const breakpoint = useBreakpoint({ ssr: false })

	return (
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
			bg="rgb(255, 255, 255)"
			// _dark={{
			//   bg: "gray.700",
			//   bgGradient: "linear(to-br, gray.600 1%, gray.800 80%)"
			// }}
			flexDirection="column"
			gap={6}
			maxW="5xl"
			px={{ base: 3, md: 4 }}
			py={{ base: 2, md: 4 }}
			rounded="1.25em"
			shadow="md"
			w="full"
		>
			<Flex direction={{ base: "column", md: "row" }} w="full">
				<HStack spacing={{ base: 0, md: 2 }}>
					<AvatarGroup>
						<Avatar border="none" src={tokenA?.logoURI ?? "/assets/unknownToken.svg"} />
						<Avatar border="none" right="2" src={tokenB?.logoURI ?? "/assets/unknownToken.svg"} />
					</AvatarGroup>
					<Flex flexDir="column" fontSize={{ base: "lg", md: "2xl" }} gap="3px">
						<Text
							_dark={{ color: "white" }}
							color="black"
							fontFamily="heading"
							lineHeight="0.8"
							overflow="hidden"
						>
							{tokenA?.symbol ?? "UNKNOWN"}
							<chakra.span
								color="gray.400"
								fontFamily="heading"
								fontSize="24"
								fontWeight="400"
								px="2px"
							>
								|
							</chakra.span>
							{tokenB?.symbol ?? "UNKNOWN"}
						</Text>
						<HStack mt={{ base: "-0.2rem", md: "-0.5rem" }}>
							<Text lineHeight="1.2">
								<chakra.span
									_dark={{ color: "gray.400" }}
									color="gray.800"
									fontSize={{ base: "sm", md: "lg" }}
									fontWeight="100"
									px="2px"
								>
									Pool #{pool.poolId}
								</chakra.span>
							</Text>
							<HStack
								gap={-2}
								mt={{ base: "0.1rem", md: "00.5rem" }}
								ml={{ base: "-0.4rem", md: "-0.5rem" }}
							>
								<PoolIcons
									isVerified={pool.isVerified}
									isParticles={pool.isParticles}
									isExternal={pool.isExternal}
								/>
							</HStack>
						</HStack>
						<HStack mt={{ base: "-0.4rem", md: "-0.4rem" }}>
							<PoolTags
								isVerified={pool.isVerified}
								isParticles={pool.isParticles}
								isExternal={pool.isExternal}
							/>
						</HStack>
					</Flex>
					<Box
						display={{ base: "flex", md: "none" }}
						justifyContent="center"
						position="relative"
						ml={{ base: "1.5rem", md: "6rem" }}
					>
						<Button
							_disabled={{
								_active: {
									_dark: { bg: "whiteAlpha.200" },
									bg: "blackAlpha.300",
									color: "whiteAlpha.500",
									cursor: "not-allowed",
									filter: ""
								},
								_dark: { bg: "whiteAlpha.200" },
								_focus: {
									_dark: { bg: "whiteAlpha.200" },
									bg: "blackAlpha.300",
									color: "whiteAlpha.500",
									cursor: "not-allowed",
									filter: ""
								},
								_hover: {},
								bg: "blackAlpha.300",
								bgGradient: "",
								color: "whiteAlpha.500",
								cursor: "not-allowed"
							}}
							_dark={{
								backgroundSize: "200 auto",
								bgGradient:
									"linear(linear-gradient(to right, #4b6cb7 0%, #182848  51%, #4b6cb7  100%)",
								color: "white",
								transition: "0.5s"
							}}
							shadow="md"
							display={{ base: "block", md: "none" }}
							bgGradient="linear(45deg, #4b6cb7, brand.2)"
							color="white"
							fontSize="16"
							leftIcon={<FaFileContract />}
							rounded="0.9em"
							transition="all 0.3s"
							w="6em"
							onClick={() =>
								window.open(
									`https://www.mintscan.io/neutron/wasm/contract/${pool.swapAddress}`,
									"_blank"
								)
							}
						>
							Mintscan
						</Button>
					</Box>
				</HStack>
				<Spacer />
				<HStack gap={6} ml={{ base: "4.5rem", md: "0" }}>
					<Stat pt={{ base: 6, md: 0 }}>
						<Flex
							_dark={{ color: "white" }}
							color="black"
							w="full"
							align="center"
							direction="row"
							fontSize="sm"
							ml={{ base: "0rem", md: "0.8rem" }}
						>
							Liquidity
						</Flex>
						<StatNumber
							_dark={{ color: "white" }}
							color="black"
							fontFamily="heading"
							fontSize={{ base: "2xl", md: "3xl" }}
							lineHeight="1"
						>
							{`$${Number(pool.liquidity.usd ?? 0).toLocaleString("en-us", {
								currency: "usd",
								maximumFractionDigits: 2
							})}`}
						</StatNumber>
					</Stat>
					<Stat pt={{ base: 3, md: 0 }}>
						<Flex
							_dark={{ color: "white" }}
							color="black"
							align="center"
							direction="row"
							fontSize="sm"
							gap={1}
							ml={{ base: "0rem", md: "0.2rem" }}
							mt={{ base: "0.75rem", md: "0" }}
						>
							Swap Fee
							<Popover arrowShadowColor="none" placement="top-end" trigger="hover">
								<PopoverTrigger>
									<Center justifyContent="start" w="fit-content">
										<Icon as={FaQuestionCircle} h="1rem" />
									</Center>
								</PopoverTrigger>
								<PopoverContent
									_dark={{ bg: "gray.800", color: "white" }}
									_focus={{ shadow: "md" }}
									alignItems="center"
									bg="gray.200"
									border="none"
									color="black"
									display="flex"
									flexDirection="row"
									gap={2}
									maxW="15rem"
									px={2}
									py={1}
									rounded="1em"
									shadow="md"
								>
									<PopoverArrow bg="gray.800" />
									<Stat _dark={{ color: "white" }} color="black">
										<StatLabel fontSize="xs">Protocol Fees</StatLabel>
										<StatNumber fontSize="md">0.25%</StatNumber>
										<StatHelpText>
											<VStack align="start" spacing={0}>
												<Text fontSize="xs">Guarantee Fund - Token Burn - Revenue</Text>
												<Text fontSize="sm">0.025% + 0.025% + 0.2%</Text>
											</VStack>
										</StatHelpText>
									</Stat>
								</PopoverContent>
							</Popover>
						</Flex>
						<StatNumber
							_dark={{ color: "white" }}
							color="black"
							fontFamily="heading"
							fontSize={{ base: "2xl", md: "3xl" }}
							lineHeight="1"
						>
							0.25%
						</StatNumber>
					</Stat>
				</HStack>
			</Flex>
			<Box display={{ base: "none", md: "block" }}>
				<Flex mb="-4rem" ml="5.5rem" justify="end">
					<Button
						_disabled={{
							_active: {
								_dark: { bg: "whiteAlpha.200" },
								bg: "blackAlpha.300",
								color: "whiteAlpha.500",
								cursor: "not-allowed",
								filter: ""
							},
							_dark: { bg: "whiteAlpha.200" },
							_focus: {
								_dark: { bg: "whiteAlpha.200" },
								bg: "blackAlpha.300",
								color: "whiteAlpha.500",
								cursor: "not-allowed",
								filter: ""
							},
							_hover: {},
							bg: "blackAlpha.300",
							bgGradient: "",
							color: "whiteAlpha.500",
							cursor: "not-allowed"
						}}
						_dark={{
							backgroundSize: "200 auto",
							bgGradient:
								"linear(linear-gradient(to right, #4b6cb7 0%, #182848  51%, #4b6cb7  100%)",
							color: "white",
							transition: "0.5s"
						}}
						shadow="md"
						bgGradient="linear(45deg, #4b6cb7, brand.2)"
						color="white"
						fontSize="16"
						leftIcon={<FaFileContract />}
						rounded="0.9em"
						transition="all 0.3s"
						w="6em"
						onClick={() =>
							window.open(
								`https://www.mintscan.io/neutron/wasm/contract/${pool.swapAddress}`,
								"_blank"
							)
						}
					>
						Mintscan
					</Button>
				</Flex>
			</Box>
			<Flex direction="column" gap={1} w="full">
				{pool && (
					<Flex gap={3} w="full">
						<Flex align="end" direction="column" justify="center" pb={2} w="full">
							<Text color={tokenAColors.vibrant} fontSize="md" fontWeight="600">
								{tokenA?.tokenPrettyName ?? "Unknown"}
								<chakra.span _dark={{ color: "white" }} color="offwhite.3" fontWeight="600" ps={1}>
									50%
								</chakra.span>
							</Text>
							<Flex
								_dark={{ color: "white" }}
								align="center"
								color="black"
								fontFamily="heading"
								fontSize="xl"
								fontWeight="900"
								gap={1}
								lineHeight="1.2"
							>
								{breakpoint === "base" || breakpoint === "sm"
									? shortenNumber(
											convertMicroDenomToDenom(
												pool.liquidity.token1.amount ?? 0,
												tokenA?.decimal ?? 6
											),
											2
									  )
									: convertMicroDenomToDenom(
											pool.liquidity.token1.amount ?? 0,
											tokenA?.decimal ?? 6
									  )
											.toNumber()
											.toLocaleString("en-us", { maximumFractionDigits: 2 })}
								<Avatar h="1.3rem" src={tokenA?.logoURI ?? "/assets/unknownToken.svg"} w="1.3rem" />
							</Flex>
						</Flex>
						<Flex direction="column" w="full">
							<Text color={tokenBColors.vibrant} fontSize="md" fontWeight="600">
								<chakra.span _dark={{ color: "white" }} color="offwhite.3" fontWeight="600" pe={1}>
									50%
								</chakra.span>
								{tokenB?.tokenPrettyName ?? "Unknown"}
							</Text>
							<Flex
								_dark={{ color: "white" }}
								align="center"
								color="black"
								fontFamily="heading"
								fontSize="xl"
								fontWeight="900"
								gap={1}
								lineHeight="1.2"
							>
								<Avatar h="1.3rem" src={tokenB?.logoURI ?? "/assets/unknownToken.svg"} w="1.3rem" />
								{breakpoint === "base" || breakpoint === "sm"
									? shortenNumber(
											convertMicroDenomToDenom(
												pool.liquidity.token2.amount ?? 0,
												tokenB?.decimal ?? 6
											),
											2
									  )
									: convertMicroDenomToDenom(pool.liquidity.token2.amount, tokenB?.decimal ?? 6)
											.toNumber()
											.toLocaleString("en-us", { maximumFractionDigits: 2 })}
							</Flex>
						</Flex>
					</Flex>
				)}
				<Flex
					_dark={{ bg: "gray.800" }}
					bg="offwhite.2"
					h="1.5rem"
					overflow="hidden"
					rounded="0.9em"
					w="full"
				>
					<Flex
						bg={tokenAColors.vibrant}
						shadow={`rgba(255, 255, 255, 0.2) 0px 1px 0px inset, rgba(0, 0, 0, 0.15) 0px -3px 0px inset, ${tokenAColors.darkVibrant} 0px 0px 15px inset`}
						h="1.5rem"
						w="full"
					/>
					<Flex
						bg={tokenBColors.vibrant}
						shadow={`rgba(255, 255, 255, 0.2) 0px 1px 0px inset, rgba(0, 0, 0, 0.15) 0px -3px 0px inset, ${tokenBColors.darkVibrant} 0px 0px 15px inset`}
						h="1.5rem"
						w="full"
					/>
				</Flex>
			</Flex>
		</Flex>
	)
}
