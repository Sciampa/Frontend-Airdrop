/* eslint-disable import/no-extraneous-dependencies */
import { Icon } from "@chakra-ui/react"
import { PiIdentificationBadgeLight } from "react-icons/pi"

export const BadgesIcon = () => (
	<Icon boxSize={10} pt={1}>
		<PiIdentificationBadgeLight />
	</Icon>
)

export const BadgesIcon2 = () => (
	<Icon boxSize={8} pt={0} mt={3} mr={-4}>
		<PiIdentificationBadgeLight />
	</Icon>
)
