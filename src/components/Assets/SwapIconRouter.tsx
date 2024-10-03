/* eslint-disable no-empty-pattern */
import { Icon, type IconProps } from "@chakra-ui/react"
import { PiSwapFill } from "react-icons/pi"

export const SwapIconRouter = ({}: IconProps) => (
	<Icon boxSize={9} mt="0.35rem" ml="0.1rem">
		<PiSwapFill />
	</Icon>
)
