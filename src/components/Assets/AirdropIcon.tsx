/* eslint-disable no-empty-pattern */
import { Icon, type IconProps } from "@chakra-ui/react"
import { FaParachuteBox } from "react-icons/fa"

export const ParachuteIcon = ({}: IconProps) => (
	<Icon boxSize={7} mt={1.5} ml="0.3rem">
		<FaParachuteBox />
	</Icon>
)
