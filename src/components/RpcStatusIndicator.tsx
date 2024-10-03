// components/RpcStatusIndicator.tsx
import useRpcStatus from "../hooks/rpcstatus/useRpcStatus"
import { Circle, HStack, keyframes, Text } from "@chakra-ui/react"

// Define the keyframes
const glowAnimation = keyframes`
  0% {
    box-shadow: 0 0 5px rgba(0, 255, 0, 0.7);
  }
  50% {
    box-shadow: 0 0 8px rgba(0, 255, 0, 1);
  }
  100% {
    box-shadow: 0 0 5px rgba(0, 255, 0, 0.7);
  }
`

const redGlowAnimation = keyframes`
  0% {
    box-shadow: 0 0 5px rgba(255, 0, 0, 0.7);
  }
  50% {
    box-shadow: 0 0 20px rgba(255, 0, 0, 1);
  }
  100% {
    box-shadow: 0 0 5px rgba(255, 0, 0, 0.7);
  }
`

type RpcStatusIndicatorProps = {
	rpcUrl: string
}

// eslint-disable-next-line react/prop-types
const RpcStatusIndicator: React.FC<RpcStatusIndicatorProps> = ({ rpcUrl }) => {
	const isOnline = useRpcStatus(rpcUrl)

	return (
		<HStack minW="8rem">
			<Circle
				mt="0.11rem"
				size="0.8rem"
				bg={isOnline ? "green.500" : "red.500"}
				animation={`${isOnline ? glowAnimation : redGlowAnimation} 1.5s infinite`}
			/>
			<Text _dark={{ color: "white" }} color="black" fontSize="0.9rem">
				{isOnline ? "Live" : "Offline"}
			</Text>
		</HStack>
	)
}

export default RpcStatusIndicator
