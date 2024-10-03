/* eslint-disable no-empty-pattern */
import { Icon, type IconProps } from "@chakra-ui/react"
import { FaLayerGroup } from "react-icons/fa"

export const StakingIcon = ({}: IconProps) => (
	<Icon boxSize={7} mt="0.5rem" ml="0.3rem">
		<FaLayerGroup />
	</Icon>
)
