import { AddLiquidityButton } from "./components/AddLiquidityButton"
import { PoolBonding } from "./components/PoolBonding"
import { PoolDetails } from "./components/PoolDetails"
import { PoolLiquidity } from "./components/PoolLiquidity"
import { PoolSummary } from "./components/PoolSummary"
import { RuaBonding } from "./components/RuaBonding"
import { Button, Center, Flex, HStack, Icon, Stack, useBreakpoint } from "@chakra-ui/react"
import { useChain } from "@cosmos-kit/react"
import { usePoolFromListQueryById } from "@hooks/pool/query/usePoolList"
import { TradeIcon } from "components/Assets/TradeIconMobile"
import { motion } from "framer-motion"
import { useTokenInfo } from "hooks/tokens/query/useTokenInfo"
import { useEffect } from "react"
import { Helmet } from "react-helmet"
import { FaAngleLeft, FaArrowDown, FaArrowRight } from "react-icons/fa"
import { usePalette } from "react-palette"
import { useNavigate, useParams } from "react-router-dom"

const Pool = () => {
	const parameters = useParams()
	const [pool] = usePoolFromListQueryById({
		poolId: Number(parameters.slug!)
	})

	const { isWalletConnected } = useChain(import.meta.env.VITE_NEUTRONNETWORK)

	const tokenA = useTokenInfo(pool?.pool.liquidity.token1.denom!)
	const tokenB = useTokenInfo(pool?.pool.liquidity.token2.denom!)

	const { data: tokenAColors } = usePalette(tokenA?.logoURI ?? "/assets/electron.png")
	const { data: tokenBColors } = usePalette(tokenB?.logoURI ?? "/assets/electron.png")

	const breakpoint = useBreakpoint({ ssr: false })
	useEffect(() => {}, [breakpoint])

	const navigate = useNavigate()

	return (
		<Flex
			as={motion.main}
			exit={{ opacity: 0 }}
			flexDirection="column"
			gap={3}
			initial={{ opacity: 0 }}
			pos="relative"
			w="full"
			p={3}
			animate={{ opacity: 1 }}
			bg="transparent"
			align="center"
			overflowX="hidden" // Prevent horizontal overflow
			bgGradient={`radial-gradient(ellipse at ${
				breakpoint === "base" || breakpoint === "sm" ? "top" : "top left"
			}, ${tokenAColors.vibrant}, transparent ${
				breakpoint === "base" || breakpoint === "sm" ? "80%" : "60%"
			}), radial-gradient(ellipse at ${
				breakpoint === "base" || breakpoint === "sm" ? "bottom" : "bottom right"
			}, ${tokenBColors.vibrant}, transparent ${
				breakpoint === "base" || breakpoint === "sm" ? "80%" : "60%"
			})`}
		>
			<Helmet>
				<title>Pool #{parameters.slug!} | Electron</title>
			</Helmet>
			<HStack maxW="5xl" align="start" w="full">
				<Button
					_dark={{
						backgroundSize: "200 auto",
						bgGradient: "linear(linear-gradient(to right, #4b6cb7 0%, #182848  51%, #4b6cb7  100%)",
						color: "white",
						transition: "0.5s"
					}}
					_disabled={{
						_hover: { bg: "gray.600" },
						cursor: "not-allowed",
						opacity: 0.5
					}}
					_hover={{ filter: "brightness(120%)" }}
					bgGradient="linear(linear-gradient(to right, #4b6cb7 0%, #182848  51%, #4b6cb7  100%)"
					color="black"
					leftIcon={<FaAngleLeft />}
					onClick={() => {
						navigate("/pools")
					}}
					rounded="1em"
					shadow="md"
				>
					Back
				</Button>
				<Button
					_dark={{ bg: "rgb(30, 41, 59)", color: "white" }}
					_disabled={{
						_hover: { bg: "gray.600" },
						cursor: "not-allowed",
						opacity: 0.5
					}}
					_hover={{ filter: "brightness(120%)" }}
					bg="rgb(245, 245, 245)"
					color="black"
					leftIcon={<TradeIcon />}
					onClick={() => {
						navigate(`/swap?from=${tokenA?.symbol!}&to=${tokenB?.symbol!}`)
					}}
					rounded="1em"
					shadow="md"
				>
					Swap
				</Button>
				{pool && <AddLiquidityButton pool={pool.pool} />}
			</HStack>
			{pool && <PoolSummary pool={pool.pool} />}
			{pool && <PoolDetails apr={pool.pool.highestApr.highestAprValue} pool={pool.pool} />}
			{isWalletConnected && pool && (
				<Stack
					direction={{ base: "column", md: "row" }}
					h={{ base: "fit-content", md: "15rem" }}
					maxW="5xl"
					pos="relative"
					spacing={3}
					w="full"
					mb={{ base: "3em", md: "0em" }}
				>
					<PoolLiquidity pool={pool.pool} />
					<Center
						bg="rgba(33, 33, 33, 0.5)"
						shadow="glowMd"
						h={{ base: "2.5rem", md: "3rem" }}
						left={{ base: "calc(50% - 1.5rem)", md: "calc(50% - 12.2rem)" }}
						pos="absolute"
						rounded="full"
						top={{ base: "calc(50% - 8.2rem)", md: "calc(50% - 1.5rem)" }}
						w={{ base: "2.5rem", md: "3rem" }}
						zIndex={2}
					>
						<Icon
							as={breakpoint === "base" || breakpoint === "sm" ? FaArrowDown : FaArrowRight}
							h={{ base: "1.5rem", md: "2rem" }}
							w={{ base: "1.5rem", md: "2rem" }}
						/>
					</Center>
					<Center
						bg="rgba(33, 33, 33, 0.5)"
						shadow="glowMd"
						h={{ base: "2.5rem", md: "3rem" }}
						left={{ base: "calc(50% - 1.5rem)", md: "calc(50% - -9.3rem)" }}
						pos="absolute"
						rounded="full"
						top={{ base: "calc(50% - -4.5rem)", md: "calc(50% - 1.5rem)" }}
						w={{ base: "2.5rem", md: "3rem" }}
						zIndex={2}
					>
						<Icon
							as={breakpoint === "base" || breakpoint === "sm" ? FaArrowDown : FaArrowRight}
							h={{ base: "1.5rem", md: "2rem" }}
							w={{ base: "1.5rem", md: "2rem" }}
						/>
					</Center>
					<PoolBonding pool={pool.pool} />
					<RuaBonding pool={pool.pool} />
				</Stack>
			)}
		</Flex>
	)
}

export default Pool
