/* eslint-disable no-empty-pattern */
import { Icon, type IconProps } from "@chakra-ui/react"
import { PiSwapFill } from "react-icons/pi"

export const SwapIcon = ({}: IconProps) => (
	<Icon boxSize={9} pt={1}>
		<PiSwapFill />
	</Icon>
)
