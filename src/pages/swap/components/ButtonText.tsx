import { HStack, Text } from "@chakra-ui/react"
import { convertMicroDenomToDenom } from "@utils/tokens/helpers"
import { type Token } from "@utils/tokens/tokens"
import { FaWallet } from "react-icons/fa"

export const ButtonText = ({
	isWalletConnected,
	from
}: {
	from: {
		amount: string
		token: Token
	}
	isWalletConnected: boolean
}) => {
	if (isWalletConnected) {
		return (
			<HStack spacing={1}>
				<Text>
					Swap{" "}
					{Number.isNaN(convertMicroDenomToDenom(from.amount, from.token.decimal).toNumber())
						? 0
						: convertMicroDenomToDenom(from.amount, from.token.decimal)
								.toNumber()
								.toLocaleString("en-US", {
									maximumFractionDigits: 3
								})}
				</Text>

				<Text textTransform="capitalize">{"$" + from.token.symbol.toUpperCase()}</Text>
			</HStack>
		)
	}

	return (
		<HStack spacing={4}>
			<FaWallet size="20" color="white" />
			<Text fontSize="20" textTransform="capitalize" color="white">
				Connect Wallet
			</Text>
		</HStack>
	)
}
