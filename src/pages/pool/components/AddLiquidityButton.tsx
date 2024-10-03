import { LiquidityModal } from "./LiquidityModal"
import { Button, Portal, Tooltip, useColorModeValue, useDisclosure } from "@chakra-ui/react"
import { useChain } from "@cosmos-kit/react"
import { AddIcon } from "components/Assets/AddIconPool"
import { useTokenInfo } from "hooks/tokens/query/useTokenInfo"
import { usePalette } from "react-palette"
import { type TPool } from "utils/tokens/pools"

export const AddLiquidityButton = ({ pool }: { pool: TPool }) => {
	const { isWalletConnected } = useChain(import.meta.env.VITE_NEUTRONNETWORK)
	const { isOpen, onOpen, onClose } = useDisclosure()

	const tokenA = useTokenInfo(pool.liquidity.token1.denom)
	const tokenB = useTokenInfo(pool.liquidity.token2.denom)
	const { data: tokenAColors } = usePalette(tokenA?.logoURI ?? "/assets/electron.png")
	const { data: tokenBColors } = usePalette(tokenB?.logoURI ?? "/assets/electron.png")

	return (
		<>
			<Tooltip
				bg={useColorModeValue("gray.100", "rgba(33, 33, 33, 0.5)")}
				border="none"
				color={useColorModeValue("black", "white")}
				hasArrow
				// eslint-disable-next-line no-negated-condition
				label={!isWalletConnected ? "Connect your wallet to continue" : ""}
				rounded="1em"
				shadow="md"
			>
				<Button
					_dark={{
						backgroundSize: "200 auto",
						bgGradient: "linear(linear-gradient(to right, #4b6cb7 0%, #182848  51%, #4b6cb7  100%)",
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
		</>
	)
}
