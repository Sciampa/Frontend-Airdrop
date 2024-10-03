import {
	Avatar,
	Button,
	chakra,
	Flex,
	Heading,
	HStack,
	keyframes,
	Skeleton,
	Text,
	VStack
} from "@chakra-ui/react"
import { MemoizedAvatar } from "@components/MemoizedAvatar"
import shortenNumber from "@utils/ui/shortenNumber"
import { BigNumber } from "bignumber.js"
import { BannerIcon } from "components/Assets/earn/BannerIcon"
import { FarmIconTopAPR } from "components/Assets/FarmIconTopAPR"
import { useTokenInfo } from "hooks/tokens/query/useTokenInfo"
import { useNavigate } from "react-router-dom"
import { type TPool } from "utils/tokens/pools"

const glowingAnimation = keyframes`
  0% {
    box-shadow: 0 0 4px rgba(255, 255, 255, 0.5);
  }
  50% {
    box-shadow: 0 0 6px rgba(255, 255, 255, 0.8);
  }
  100% {
    box-shadow: 0 0 4px rgba(255, 255, 255, 0.5);
  }
`
export const PoolCard = ({
	icon,
	bannerColor,
	pool
}: {
	bannerColor: string
	icon: React.ReactNode
	pool: TPool
}) => {
	const tokenA = useTokenInfo(pool.liquidity.token1.denom)
	const tokenB = useTokenInfo(pool.liquidity.token2.denom)
	const rewardToken = useTokenInfo(Object.values(pool.highestApr.highestAprToken ?? {})[0])

	const navigate = useNavigate()

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
			align="start"
			pb={{ base: 9, md: 3 }}
			bg="rgb(255, 255, 255)"
			pos="relative"
			pt={3}
			px={3}
			rounded="1.25em"
			shadow="md"
			w={{ base: "full", md: "full" }}
		>
			<Flex direction="column" gap={2} w="full">
				<HStack pos="relative">
					<MemoizedAvatar
						border="none"
						size={{ base: "sm", md: "md" }}
						src={tokenA?.logoURI ?? "/assets/unknownToken.svg"}
						blurHash={tokenA?.logoHash!}
						w="3rem"
						h="3rem"
					/>
					<MemoizedAvatar
						border="none"
						size={{ base: "sm", md: "md" }}
						// right={3}
						position="absolute"
						left="1.5rem"
						src={tokenB?.logoURI ?? "/assets/unknownToken.svg"}
						blurHash={tokenB?.logoHash!}
						w="3rem"
						h="3rem"
					/>
				</HStack>
				<VStack align="start" h="full" spacing={0}>
					<Heading fontSize="2xl" fontWeight="400" _dark={{ color: "gray.400" }} color="black">
						{tokenA?.symbol ?? "UNKNOWN"}
						<chakra.span _dark={{ color: "gray.400" }} color="gray.800" fontWeight="900" px="4px">
							/
						</chakra.span>
						{tokenB?.symbol ?? "UNKNOWN"}
					</Heading>
					<Text fontSize="lg" _dark={{ color: "gray.400" }} color="gray.800">
						<chakra.span
							_dark={{ color: "gray.400" }}
							color="gray.800"
							fontSize="sm"
							fontWeight="900"
							pe="2px"
						>
							#
						</chakra.span>
						{pool.poolId}
					</Text>
				</VStack>
				<Flex direction="column" flex={1} gap={2}>
					<HStack
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
						bg="offwhite.2"
						color="gray.800"
						h="3rem"
						justify="space-between"
						px={3}
						py={1}
						rounded="0.8em"
						shadow="md"
						w="full"
					>
						<Text fontFamily="heading">APR</Text>
						<Skeleton isLoaded={Boolean(pool.highestApr)}>
							<HStack>
								<Text fontSize="15">
									{pool.highestApr.highestAprValue === 0 ? "No Rewards" : "Up to"}
									{pool.highestApr.highestAprValue !== 0 && (
										<chakra.span
											bgClip="text"
											bgGradient="linear(45deg, #4b6cb7, brand.2)"
											fontFamily="heading"
											fontSize="20"
											ps={1}
										>
											{shortenNumber(BigNumber(pool.highestApr.highestAprValue), 2) ?? 0}%
										</chakra.span>
									)}
								</Text>
								{pool.highestApr.highestAprValue !== 0 && pool.highestApr.highestAprToken && (
									<Avatar h="1.75rem" src={rewardToken?.logoURI} w="1.75rem" />
								)}
							</HStack>
						</Skeleton>
					</HStack>
					<HStack
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
						bg="offwhite.2"
						color="gray.800"
						h="3rem"
						justify="space-between"
						px={3}
						py={1}
						rounded="0.8em"
						shadow="md"
						w="full"
					>
						<Text fontFamily="heading">TVL</Text>
						<Text fontFamily="heading">{`$${Number(pool.liquidity.usd ?? 0).toLocaleString(
							"en-us",
							{
								currency: "USD",
								maximumFractionDigits: 2
							}
						)}`}</Text>
					</HStack>
				</Flex>
				<Button
					_dark={{
						bgGradient: "linear-gradient(to right, #4b6cb7 0%, #182848  51%, #4b6cb7  100%)",
						color: "white"
					}}
					_active={{
						filter: "brightness(80%) drop-shadow(0px 1px 3px rgba(2,226,150, 1))"
					}}
					_hover={{
						filter: "brightness(110%) drop-shadow(0px 1px 3px rgba(255,255,255,255))"
					}}
					alignSelf="center"
					backgroundSize="200% auto"
					bgGradient="linear-gradient(to right, #4b6cb7 0%, #182848  51%, #4b6cb7  100%)"
					boxShadow="0 0 4px #eee"
					color="white"
					fontSize="16"
					leftIcon={<FarmIconTopAPR h="1.5rem" w="1.5rem" />}
					maxW="6rem"
					mt={2}
					onClick={() => {
						navigate(`/pool/${pool?.poolId}`)
					}}
					rounded="0.9em"
					transition="all 0.5s"
					animation={`${glowingAnimation} 1.5s infinite`}
				>
					View
				</Button>
			</Flex>
			<BannerIcon bannerColor={bannerColor} icon={icon} right={3} top={-3} />
		</Flex>
	)
}
