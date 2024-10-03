/* eslint-disable no-negated-condition */
import { LiquidityModal } from "./LiquidityModal"
import {
	Button,
	Divider,
	Flex,
	Heading,
	Portal,
	Tag,
	Text,
	Tooltip,
	useBreakpointValue,
	useColorModeValue,
	useDisclosure
} from "@chakra-ui/react"
import { useChain } from "@cosmos-kit/react"
import { usePoolDollarValues } from "@hooks/pool/query/usePoolDollarValues"
import { addLiquidityState } from "@state/poolState"
import { useMount } from "ahooks"
import { AddIcon } from "components/Assets/AddIconPool"
import { useTokenInfo } from "hooks/tokens/query/useTokenInfo"
import { usePalette } from "react-palette"
import { useRecoilState } from "recoil"
import { type TPool } from "utils/tokens/pools"

export const PoolLiquidity = ({ pool }: { pool: TPool }) => {
	const [myPoolValues] = usePoolDollarValues({ pool })
	const tokenA = useTokenInfo(pool.liquidity.token1.denom)
	const tokenB = useTokenInfo(pool.liquidity.token2.denom)
	const { data: tokenAColors } = usePalette(tokenA?.logoURI ?? "/assets/electron.png")
	const { data: tokenBColors } = usePalette(tokenB?.logoURI ?? "/assets/electron.png")
	const shouldHideTvl = useBreakpointValue({ base: false, md: true })
	const { isWalletConnected } = useChain(import.meta.env.VITE_NEUTRONNETWORK)
	const { isOpen, onOpen, onClose } = useDisclosure()

	const [, setLiquidityAmount] = useRecoilState(addLiquidityState)

	useMount(() => {
		setLiquidityAmount(() => {
			return {
				tokenA: {
					amount: "0",
					token: tokenA!
				},
				tokenB: {
					amount: "0",
					token: tokenB!
				}
			}
		})
	})

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
			gap={4}
			ps={3}
			py={4}
			rounded="1.25em"
			shadow="md"
			w="full"
		>
			<Flex align="center" gap={2} w="full">
				<Tag
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
					fontSize="18"
					fontWeight="600"
					px={3}
					py={2}
					bg="rgba(245, 245, 245)"
					shadow="md"
					// _dark={{ bg: "gray.800" }}
					rounded="0.8em"
				>
					<Text bgClip="text" bgGradient="linear(45deg, #4b6cb7, brand.2)">
						Step 1
					</Text>
				</Tag>
				<Heading _dark={{ color: "white" }} color="black" fontSize="22" fontWeight="800">
					Manage Liquidity
				</Heading>
			</Flex>
			<Flex align="start" flex={1} gap={1} pe={{ base: 3, md: 7 }} w="full">
				<Text _dark={{ color: "white" }} color="black" fontSize="16">
					{`Add your ${
						(tokenA?.fullName ?? "Unknown Token").toLowerCase().charAt(0).toUpperCase() +
						(tokenA?.fullName ?? "Unknown Token").slice(1).toLowerCase()
					} and ${
						(tokenB?.fullName ?? "Unknown Token").toLowerCase().charAt(0).toUpperCase() +
						(tokenB?.fullName ?? "Unknown Token").slice(1).toLowerCase()
					} to this pool to be able to bond them to earn pool rewards`}
					.
				</Text>
			</Flex>
			<Flex justify="space-between" w="full" px={0} py={0} direction="row">
				{!shouldHideTvl && (
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
						bg="rgba(245, 245, 245)"
						px={3}
						py={1}
						direction="column"
						rounded="1rem"
						shadow="md"
						w="100%"
						mt="-0.8rem"
					>
						<Text
							_dark={{ color: "white" }}
							color="black"
							fontFamily="heading"
							fontSize="12"
							w="full"
							textAlign="start"
						>
							TVL
						</Text>
						<Divider _dark={{ color: "white" }} color="black" />
						<Heading
							pt={0.5}
							_hover={{ cursor: "default" }}
							bgClip="text"
							bgGradient="linear(45deg, #4b6cb7, brand.2)"
							fontSize="16"
						>
							$
							{(myPoolValues.totalBondedDollarValue + myPoolValues?.unbondedDollarValue > 0
								? myPoolValues.totalBondedDollarValue + myPoolValues?.unbondedDollarValue
								: 0
							).toFixed(2)}
						</Heading>
					</Flex>
				)}
				<Flex align="center" gap={0} justifyContent="flex-end" pe={4} w="full">
					<Tooltip
						bg={useColorModeValue("gray.100)", "rgba(33, 33, 33, 0.5)")}
						border="none"
						color={useColorModeValue("black", "white")}
						hasArrow
						label={!isWalletConnected ? "Connect your wallet to continue" : ""}
						rounded="1em"
						shadow="md"
					>
						<Button
							_dark={{
								backgroundSize: "200 auto",
								bgGradient:
									"linear(linear-gradient(to right, #4b6cb7 0%, #182848  51%, #4b6cb7  100%)",
								color: "white",
								transition: "0.5s"
							}}
							_active={{
								filter: isWalletConnected ? "brightness(80%)" : "",
								shadow: isWalletConnected ? "glowMd" : "md"
							}}
							_hover={{
								backgroundPosition: "right center",
								filter: isWalletConnected ? "brightness(110%)" : "",
								shadow: isWalletConnected ? "glowMd" : "md"
							}}
							shadow="md"
							bgGradient="linear(linear-gradient(to right, #4b6cb7 0%, #182848  51%, #4b6cb7  100%)"
							color="white"
							disabled={!isWalletConnected || !tokenA || !tokenB}
							fontSize="16"
							leftIcon={<AddIcon />}
							w="6em"
							onClick={() => {
								onOpen()
							}}
							rounded="0.9em"
							transition="0.5s"
						>
							Add
						</Button>
					</Tooltip>
					{tokenA && tokenB && (
						<Portal>
							<LiquidityModal
								isOpen={isOpen}
								onClose={onClose}
								tokenA={tokenA}
								tokenAColor={tokenAColors.vibrant!}
								tokenAColorMuted={tokenAColors.darkMuted!}
								tokenB={tokenB}
								tokenBColor={tokenBColors.vibrant!}
								tokenBColorMuted={tokenBColors.darkMuted!}
							/>
						</Portal>
					)}
				</Flex>
			</Flex>
		</Flex>
	)
}
