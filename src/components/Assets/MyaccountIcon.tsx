/* eslint-disable no-empty-pattern */
import { Icon, type IconProps } from "@chakra-ui/react"
import { FaHouseUser } from "react-icons/fa6"

export const MyaccountIcon = ({}: IconProps) => (
	<Icon boxSize={7} mt={1.5} ml="0.3rem">
		<FaHouseUser />
	</Icon>
)
