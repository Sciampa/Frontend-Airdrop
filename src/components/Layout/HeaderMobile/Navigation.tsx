import { RouterArea } from "./RouterArea"
import { Flex, Spacer } from "@chakra-ui/react"
import { useChain } from "@cosmos-kit/react"
import ConnectButtonHide from "components/ConnectButtonHide"

const NavigationMobile = () => {
	const { isWalletConnected } = useChain(import.meta.env.VITE_NEUTRONNETWORK)

	return (
		<Flex
			align="center"
			as="nav"
			bgGradient="linear(to-b, #0a2b33, #1a001e)"
			direction="row"
			gap={0}
			justifyContent="start"
			pb={0}
			pt={0}
			px={0}
			transition="0.5s all"
			w="full"
			zIndex={5}
		>
			<Flex
				justifyContent="start"
				marginTop={-1}
				pb={isWalletConnected ? 0 : 2}
				px={isWalletConnected ? 0 : 2}
			>
				<RouterArea />
			</Flex>
			<Spacer />
			<Flex
				justifyContent="end"
				marginTop={2}
				pb={isWalletConnected ? 0 : 2}
				px={isWalletConnected ? 0 : 2}
			>
				<ConnectButtonHide />
			</Flex>
		</Flex>
	)
}

export default NavigationMobile
