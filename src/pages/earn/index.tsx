/* eslint-disable react/jsx-pascal-case */
/* eslint-disable id-length */
/* eslint-disable react-hooks/rules-of-hooks */
/* eslint-disable import/no-unassigned-import */
import "swiper/css"
import "swiper/css/effect-coverflow"
import "swiper/css/pagination"
import { useRuaList } from "../../hooks/pool/query/useRuaList"
import { PoolCard } from "./components/PoolCard"
import { PoolCardSkeleton } from "./components/PoolCardSkeleton"
import { PoolIcons } from "./components/PoolIcons"
import { PoolTable } from "./components/PoolTable"
import { PoolTags } from "./components/PoolTags"
import TVL from "./components/TVL"
import {
	AvatarGroup,
	Button,
	Center,
	chakra,
	Flex,
	HStack,
	Text,
	useBreakpoint,
	useBreakpointValue,
	VStack
} from "@chakra-ui/react"
import { MemoizedAvatar } from "@components/MemoizedAvatar"
import { useChain } from "@cosmos-kit/react"
import { usePoolList } from "@hooks/pool/query/usePoolList"
import { createColumnHelper } from "@tanstack/react-table"
import shortenNumber from "@utils/ui/shortenNumber"
import { BigNumber } from "bignumber.js"
import { BadgesIconPool } from "components/Assets/BadgesIconPool"
import { CelebrationIcon } from "components/Assets/earn/CelebrationIcon"
import { APRIcon } from "components/Assets/earn/ExclusiveIcon"
import { FlameIcon } from "components/Assets/earn/FlameIcon"
import { motion } from "framer-motion"
import { getTokenInfoFromTokenList } from "hooks/tokens/query/useTokenInfo"
import { useTokenList } from "hooks/tokens/query/useTokenList"
import { useEffect, useMemo, useRef, useState } from "react"
import { Helmet } from "react-helmet"
import { HiExternalLink } from "react-icons/hi"
import { Link, useNavigate } from "react-router-dom"
import { useRecoilValue } from "recoil"
import { showLowLiqPoolsState } from "state/UIState"
import { Navigation, Pagination } from "swiper"
import { type Swiper as SwiperRef } from "swiper"
import { Swiper, SwiperSlide } from "swiper/react"
import { type TPool } from "utils/tokens/pools"

const Earn = () => {
	const [poolsList] = usePoolList()
	const [tokenList] = useTokenList()
	const [RuaList] = useRuaList()

	const { isWalletConnected } = useChain(import.meta.env.VITE_NEUTRONNETWORK)

	const showLowLiqPools = useRecoilValue(showLowLiqPoolsState)

	const poolsToShow = useMemo(() => {
		if (showLowLiqPools) {
			return poolsList?.poolsWithAPR
		} else {
			return poolsList?.poolsWithAPR?.filter((pool) => pool.pool.liquidity.usd >= 100)
		}
	}, [poolsList, showLowLiqPools])

	const [swiper, setSwiper] = useState<SwiperRef>()
	const previousRef = useRef()
	const nextRef = useRef()

	const breakpoint = useBreakpoint({ ssr: false })

	const columnHelper = createColumnHelper<{
		apr: number
		pool: TPool
	}>()

	const columns = useMemo(() => {
		return [
			columnHelper.accessor("pool.poolId", {
				// eslint-disable-next-line react/no-unstable-nested-components
				cell: (info) => {
					const tokenA = getTokenInfoFromTokenList(
						info.row.original.pool.liquidity.token1.denom,
						tokenList ?? []
					)
					const tokenB = getTokenInfoFromTokenList(
						info.row.original.pool.liquidity.token2.denom,
						tokenList ?? []
					)

					return (
						<Link to={`/pool/${info.row.original.pool.poolId}`}>
							<HStack>
								<Text
									_dark={{ color: "white" }}
									ml={{ base: "0rem", md: "-0.3rem" }}
									fontSize={{ base: 18, md: "md" }}
									color="black"
									lineHeight={{ base: 1.4, md: 1.4 }}
								>
									<chakra.span color="gray.400" fontWeight="100" px="2px">
										#
									</chakra.span>
									{info.getValue()}
								</Text>
								<AvatarGroup>
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
										position="relative"
										right={{ base: 1, md: 3 }}
										src={tokenB?.logoURI ?? "/assets/unknownToken.svg"}
										blurHash={tokenB?.logoHash!}
										w="3rem"
										h="3rem"
									/>
								</AvatarGroup>
								<Flex flexDir="column" gap={{ base: 1, md: 0 }} align="start">
									<HStack spacing={0}>
										<Text
											_dark={{ color: "white" }}
											color="black"
											fontFamily="heading"
											fontSize={{ base: 18, md: "md" }}
											lineHeight={{ base: 1, md: 1.4 }}
										>
											{tokenA?.symbol ?? "UNKNOWN"}
											<chakra.span color="gray.400" fontWeight="100" px="2px">
												/
											</chakra.span>
											{tokenB?.symbol ?? "UNKNOWN"}
										</Text>
										<PoolIcons
											isVerified={info.row.original.pool.isVerified}
											isParticles={info.row.original.pool.isParticles}
											isExternal={info.row.original.pool.isExternal}
										/>
									</HStack>
									<Text
										_dark={{ color: "gray.300" }}
										color="black"
										fontSize={{ base: "xs", md: "2xs" }}
										lineHeight={{ base: 1, md: 1.4 }}
									>
										Swap fees: 0.02%
									</Text>
									<PoolTags
										isVerified={info.row.original.pool.isVerified}
										isParticles={info.row.original.pool.isParticles}
										isExternal={info.row.original.pool.isExternal}
									/>
								</Flex>
							</HStack>
						</Link>
					)
				},
				header: "Pool",
				id: "pools"
			}),
			columnHelper.accessor("pool.volume24h", {
				// eslint-disable-next-line react/no-unstable-nested-components
				cell: (info) => {
					// eslint-disable-next-line canonical/id-match
					const volume24h = BigNumber(info.row.original.pool.volume24h) ?? BigNumber(0)

					return (
						<Link to={`/pool/${info.row.original.pool.poolId}`}>
							<Flex
								direction="column"
								align={{ base: "center", md: "start" }}
								ml={{ base: "1rem", md: "0rem" }}
							>
								<Text fontSize={{ base: "0.8rem", md: "0.7rem" }}>Pool 24 hours</Text>
								<TVL usd={volume24h} />
								<Text mt="0.7rem" fontSize={{ base: "0.8rem", md: "0.7rem" }}>
									RUA 7 days
								</Text>
								<Text
									fontWeight="bold"
									color="gray.600"
									fontSize={{ base: "0.8rem", md: "0.7rem" }}
									mt={{ base: "-0.2rem", md: "-0.2rem" }}
								>
									None
								</Text>
							</Flex>
						</Link>
					)
				},
				header: "Volume",
				id: "Volume",
				meta: {
					isNumeric: true
				}
			}),
			columnHelper.accessor("pool.liquidity.usd", {
				// eslint-disable-next-line react/no-unstable-nested-components
				cell: (info) => {
					const liquidity = BigNumber(info.row.original.pool.liquidity.usd) ?? BigNumber(0)
					const matchingRua = RuaList?.find(
						(rua) => String(rua.ruaId) === String(info.row.original.pool.poolId)
					)
					const shareRanking = matchingRua?.shareRanking ?? "Not Ranked"

					// eslint-disable-next-line unicorn/consistent-function-scoping
					const calculateRating = (value: number) => {
						if (value >= 9) return "AAA"
						if (value >= 8) return "AA"
						if (value >= 7) return "A"
						if (value >= 6) return "BBB"
						if (value >= 5) return "BB"
						if (value >= 4) return "B"
						if (value >= 3) return "CCC"
						if (value >= 2) return "CC"
						if (value >= 1) return "C"
						return "Not Ranked"
					}

					const ratingColors = {
						A: "#66FF00",
						AA: "#33FF00",
						AAA: "#00FF00",
						B: "#FFCC00",
						BB: "#FFFF00",
						BBB: "#CCFF00",
						C: "#FF0000",
						CC: "#FF3300",
						CCC: "#FF6600",
						"Not Ranked": "#999999"
					}

					// eslint-disable-next-line @typescript-eslint/no-shadow
					const rating = calculateRating(shareRanking as number)

					// Get the color for the rating, or default to black if not found
					const ratingColor = ratingColors[rating] || "#000"

					return (
						<Link to={`/pool/${info.row.original.pool.poolId}`}>
							<HStack>
								{/* First Flex container */}
								<Flex
									direction="column"
									align={{ base: "center", md: "start" }}
									pr="2rem"
									ml={{ base: "8rem", md: "0rem" }}
									mt={{ base: "-8rem", md: "0.6rem" }}
								>
									<Text
										mt={{ base: "1.2rem", md: "-0.5rem" }}
										fontSize={{ base: "0.8rem", md: "0.7rem" }}
									>
										Total
									</Text>
									<TVL usd={liquidity} />
									<Text
										mt={{ base: "0.7rem", md: "0.7rem" }}
										fontSize={{ base: "0.8rem", md: "0.7rem" }}
									>
										Rating
									</Text>
									<Text
										mt={{ base: "-0.2rem", md: "-0.2rem" }}
										fontSize={{ base: "0.9rem", md: "0.7rem" }}
										fontWeight="bold"
										color={ratingColor}
										mb={{ base: "0rem", md: "0rem" }}
									>
										{rating}
									</Text>
								</Flex>

								<Flex
									direction="column"
									gap={0}
									align="center"
									pr="2rem"
									ml={{ base: "1rem", md: "0rem" }}
									mt={{ base: "-8.2rem", md: "0rem" }}
									top={5}
									display={{ base: "relative", md: "none" }}
								>
									<Text
										fontSize={{ base: "0.8rem", md: "0.7rem" }}
										mt={{ base: "1.5rem", md: "0rem" }}
									>
										APR#1
									</Text>
									<Text
										_dark={{ color: "white" }}
										color="black"
										fontFamily="heading"
										fontSize={{ base: "0.9rem", md: "0.7rem" }}
										align="center"
										fontWeight="bold"
										mt={{ base: "-0.25rem", md: "0rem" }}
									>
										{info.getValue() === 0
											? "None"
											: `${shortenNumber(BigNumber(info.getValue()), 2)}%`}
									</Text>
									<Text
										fontSize={{ base: "0.8rem", md: "0.7rem" }}
										mt={{ base: "0.8rem", md: "0rem" }}
									>
										APR#2
									</Text>
									<Text
										_dark={{ color: "white" }}
										color="black"
										fontFamily="heading"
										fontSize={{ base: "0.9rem", md: "0.7rem" }}
										align="center"
										fontWeight="bold"
										mt={{ base: "0rem", md: "0rem" }}
									>
										{info.getValue() === 0
											? "None"
											: `${shortenNumber(BigNumber(info.getValue()), 2)}%`}
									</Text>
								</Flex>
							</HStack>
						</Link>
					)
				},
				header: "Liquidity",
				id: "liquidity",
				meta: {
					isNumeric: true
				}
			}),
			columnHelper.accessor("pool.highestApr.highestAprValue", {
				// eslint-disable-next-line react/no-unstable-nested-components
				cell: (info) => {
					return (
						<Link to={`/pool/${info.row.original.pool.poolId}`}>
							<Flex
								direction="column"
								gap={7}
								align="start"
								pr="0rem"
								ml={{ base: "12rem", md: "0rem" }}
								mt={{ base: "-12rem", md: "0rem" }}
								display={{ base: "none", md: "flex" }}
							>
								<Text
									_dark={{ color: "white" }}
									color="black"
									fontFamily="heading"
									fontSize={{ base: 18, md: "xs" }}
									align="start"
									fontWeight="bold"
								>
									{info.getValue() === 0
										? "None"
										: `${shortenNumber(BigNumber(info.getValue()), 2)}%`}
								</Text>
								<Text
									_dark={{ color: "white" }}
									color="black"
									fontFamily="heading"
									fontSize={{ base: 18, md: "xs" }}
									align="start"
									fontWeight="bold"
								>
									{info.getValue() === 0
										? "None"
										: `${shortenNumber(BigNumber(info.getValue()), 2)}%`}
								</Text>
							</Flex>
						</Link>
					)
				},
				header: "APR",
				id: "apr",
				meta: {
					isNumeric: true
				}
			}),
			columnHelper.display({
				// eslint-disable-next-line react/no-unstable-nested-components
				cell: (info) => {
					const navigate = useNavigate()

					const iconSize = useBreakpointValue({ base: "14", md: "20" })

					if (breakpoint === "base" || breakpoint === "sm") {
						return (
							<HStack ml="0rem" justifyContent="center" spacing={9}>
								<Button
									_dark={{
										_disabled: {
											_hover: { bg: "rgba(33, 33, 33, 0.5)" },
											cursor: "not-allowed",
											opacity: 0.5
										},
										_hover: {
											backgroundPosition: "right center",
											filter: "brightness(120%)"
										},
										bgGradient: "linear-gradient(to right, #4b6cb7 0%, #182848 51%, #4b6cb7 100%)",
										color: "white"
									}}
									_hover={{ filter: "brightness(120%)" }}
									aria-label="Go to pools page"
									bg="white"
									bgGradient="linear-gradient(to right, #4b6cb7 0%, #182848 51%, #4b6cb7 100%)"
									color="white"
									leftIcon={<HiExternalLink size={iconSize} />}
									onClick={() => {
										navigate(`/pool/${info.row.original.pool.poolId}`)
									}}
									backgroundSize="200% auto"
									transition="0.5s"
									rounded="0.9em"
									shadow="glowMd"
									size="sm"
								>
									Liquidity pool
								</Button>
								<Button
									_dark={{
										_disabled: {
											_hover: { bg: "rgba(33, 33, 33, 0.5)" },
											cursor: "not-allowed",
											opacity: 0.5
										},
										_hover: {
											backgroundPosition: "right center",
											filter: "brightness(120%)"
										},
										bgGradient: "linear-gradient(to right, #4b6cb7 0%, #182848 51%, #4b6cb7 100%)",
										color: "white"
									}}
									_hover={{ filter: "brightness(120%)" }}
									aria-label="Go to RUA mint page"
									bg="white"
									bgGradient="linear-gradient(to right, #4b6cb7 0%, #182848 51%, #4b6cb7 100%)"
									color="white"
									leftIcon={<BadgesIconPool />}
									onClick={() => {
										navigate(`/rua/${info.row.original.pool.shareId}`)
									}}
									backgroundSize="200% auto"
									transition="0.5s"
									rounded="0.9em"
									shadow="glowMd"
									size="sm"
									px="1.05rem"
								>
									RUA market
								</Button>
							</HStack>
						)
					}

					return (
						<HStack>
							<VStack align="center" gap={2}>
								<Button
									_dark={{
										_disabled: {
											_hover: { bg: "rgba(33, 33, 33, 0.5)" },
											cursor: "not-allowed",
											opacity: 0.5
										},
										_hover: {
											backgroundPosition: "right center",
											filter: "brightness(120%)"
										},
										bgGradient:
											"linear-gradient(to right, #4b6cb7 0%, #182848  51%, #4b6cb7  100%)",
										color: "white"
									}}
									_hover={{ filter: "brightness(120%)" }}
									aria-label="Go to pools page"
									bg="white"
									bgGradient="linear-gradient(to right, #4b6cb7 0%, #182848  51%, #4b6cb7  100%)"
									color="white"
									leftIcon={<HiExternalLink size={iconSize} />}
									onClick={() => {
										navigate(`/pool/${info.row.original.pool.poolId}`)
									}}
									backgroundSize="200% auto"
									transition="0.5s"
									rounded="0.6em"
									shadow="glowMd"
									size="xs"
									minW="9rem"
								>
									Liquidity pool
								</Button>
								<Button
									_dark={{
										_disabled: {
											_hover: { bg: "rgba(33, 33, 33, 0.5)" },
											cursor: "not-allowed",
											opacity: 0.5
										},
										_hover: {
											backgroundPosition: "right center",
											filter: "brightness(120%)"
										},
										bgGradient:
											"linear-gradient(to right, #4b6cb7 0%, #182848  51%, #4b6cb7  100%)",
										color: "white"
									}}
									_hover={{ filter: "brightness(120%)" }}
									aria-label="Go to pools page"
									bg="white"
									bgGradient="linear-gradient(to right, #4b6cb7 0%, #182848  51%, #4b6cb7  100%)"
									color="white"
									leftIcon={<BadgesIconPool />}
									onClick={() => {
										navigate(`/rua/${info.row.original.pool.ruaId}`)
									}}
									backgroundSize="200% auto"
									transition="0.5s"
									rounded="0.6em"
									shadow="glowMd"
									size="xs"
									px="1.05rem"
									minW="9rem"
								>
									RUA Market
								</Button>
							</VStack>
						</HStack>
					)
				},
				header: "Actions",
				id: "actions"
			})
		]
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [poolsToShow, breakpoint, isWalletConnected, showLowLiqPools])

	useEffect(() => {
		if (swiper) {
			// @ts-expect-error types
			swiper.params.navigation.prevEl = previousRef.current
			// @ts-expect-error types
			swiper.params.navigation.nextEl = nextRef.current
			swiper.navigation.init()
			swiper.navigation.update()
		}
	}, [swiper])

	return (
		<Flex
			animate={{ opacity: 1 }}
			as={motion.main}
			exit={{ opacity: 0 }}
			flexDirection="column"
			gap={{ base: 3, md: 3 }}
			initial={{ opacity: 0 }}
			pos="relative"
			w="full"
			p={3}
			align="center"
			justify="start"
		>
			<Helmet>
				<title>Pools | Electron</title>
			</Helmet>
			{!poolsList &&
				(breakpoint === "base" || breakpoint === "sm" ? (
					<Center h="22rem" w="full">
						<Swiper
							centeredSlides
							grabCursor={false}
							initialSlide={0}
							modules={[Pagination, Navigation]}
							navigation
							onSwiper={(currentSwiper) => setSwiper(currentSwiper)}
							pagination
							slidesPerView={1}
							spaceBetween={40}
							style={{
								justifyContent: "center",
								minHeight: "20rem",
								overflow: "visible",
								width: "100%"
							}}
						>
							<SwiperSlide>
								{({ isActive }) => (
									<div style={{ display: isActive ? "flex" : "none", justifyContent: "center" }}>
										<PoolCardSkeleton bannerColor="#00E296" icon={<CelebrationIcon />} />
									</div>
								)}
							</SwiperSlide>
							<SwiperSlide>
								{({ isActive }) => (
									<div style={{ display: isActive ? "flex" : "none", justifyContent: "center" }}>
										<PoolCardSkeleton bannerColor="#FC4361" icon={<FlameIcon />} />
									</div>
								)}
							</SwiperSlide>
							<SwiperSlide>
								{({ isActive }) => (
									<div style={{ display: isActive ? "flex" : "none", justifyContent: "center" }}>
										<PoolCardSkeleton bannerColor="#FFA530" icon={<APRIcon />} />
									</div>
								)}
							</SwiperSlide>
						</Swiper>
					</Center>
				) : (
					<HStack gap={5} w="full">
						<PoolCardSkeleton bannerColor="#00E296" icon={<CelebrationIcon />} />
						<PoolCardSkeleton bannerColor="#FC4361" icon={<FlameIcon />} />
						<PoolCardSkeleton bannerColor="#FFA530" icon={<APRIcon />} />
					</HStack>
				))}
			{poolsList &&
				poolsList.poolsWithAPR.length > 0 &&
				poolsList.highestTVLPool &&
				poolsList.highestAPRPool &&
				(breakpoint === "base" || breakpoint === "sm" ? (
					<Center maxW="6xl" h="22rem" w="full">
						<Swiper
							centeredSlides
							grabCursor={false}
							modules={[Pagination, Navigation]}
							navigation
							onSwiper={(currentSwiper) => setSwiper(currentSwiper)}
							pagination
							slidesPerView={1}
							spaceBetween={40}
							style={{
								justifyContent: "center",
								minHeight: "20rem",
								overflow: "visible",
								width: "100%"
							}}
							initialSlide={0}
						>
							<SwiperSlide>
								{({ isActive }) => (
									<div style={{ display: isActive ? "flex" : "none", justifyContent: "center" }}>
										<PoolCard
											bannerColor="#00E296"
											icon={<CelebrationIcon />}
											pool={poolsList.newestPool}
										/>
									</div>
								)}
							</SwiperSlide>
							<SwiperSlide>
								{({ isActive }) => (
									<div style={{ display: isActive ? "flex" : "none", justifyContent: "center" }}>
										<PoolCard
											bannerColor="#FC4361"
											icon={<FlameIcon />}
											pool={poolsList.highestTVLPool}
										/>
									</div>
								)}
							</SwiperSlide>
							<SwiperSlide>
								{({ isActive }) => (
									<div style={{ display: isActive ? "flex" : "none", justifyContent: "center" }}>
										<PoolCard
											bannerColor="#FFA530"
											icon={<APRIcon />}
											pool={poolsList.highestAPRPool}
										/>
									</div>
								)}
							</SwiperSlide>
						</Swiper>
					</Center>
				) : (
					<HStack gap={3} w="full" maxW="6xl">
						<PoolCard
							bannerColor="#00E296"
							icon={<CelebrationIcon />}
							pool={poolsList.newestPool}
						/>
						<PoolCard bannerColor="#FC4361" icon={<FlameIcon />} pool={poolsList.highestTVLPool} />
						<PoolCard bannerColor="#FFA530" icon={<APRIcon />} pool={poolsList.highestAPRPool} />
					</HStack>
				))}
			<PoolTable columns={columns} data={poolsToShow ?? []} />
		</Flex>
	)
}

export default Earn
