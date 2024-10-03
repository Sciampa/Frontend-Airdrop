import { Icon, type IconProps } from "@chakra-ui/react"
import { SiBabylondotjs } from "react-icons/si"

export const ExternalIcon = ({ ...props }: IconProps) => (
	<Icon as={SiBabylondotjs} fill="gray" pos="relative" right={0} {...props} />
)
