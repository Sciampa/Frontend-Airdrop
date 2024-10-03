import { ThemeSwitch } from "./Layout/Header/ThemeSwitch"
import RpcStatusIndicator from "./RpcStatusIndicator"
import {
	Divider,
	Flex,
	HStack,
	Icon,
	IconButton,
	Popover,
	PopoverBody,
	PopoverContent,
	PopoverTrigger,
	Text,
	useColorModeValue,
	useDisclosure
} from "@chakra-ui/react"
import { motion } from "framer-motion"
import { useRef } from "react"
import { FaWrench } from "react-icons/fa"

// eslint-disable-next-line @typescript-eslint/no-explicit-any

export const ToolsButton = () => {
	const { onToggle, onClose, isOpen } = useDisclosure()
	const initialFocusRef = useRef(null)
	const rpcMainnetUrl = "https://api.electronprotocol.io"
	const rpcTestnetUrl = "https://apit.electronprotocol.io"

	return (
		<Popover
			isOpen={isOpen}
			onClose={onClose}
			initialFocusRef={initialFocusRef}
			// placement={advancedMode ? "left" : "right"}
		>
			<PopoverTrigger>
				<IconButton
					_active={{ filter: "brightness(90%)" }}
					_dark={{
						_hover: {
							color: "#4b6cb7"
						},
						bg: "rgba(255,255,255,0.1)",
						color: "white"
					}}
					_focus={{ boxShadow: "none" }}
					_hover={{
						color: "#4b6cb7",
						filter: "brightness(110%)"
					}}
					aria-label="Open Swap Settings"
					as={motion.button}
					bg="rgba(255,255,255)"
					bgGradient="linear(to-br, rgba(255, 255, 255), rgba(255, 255, 255))"
					color={isOpen ? "black" : "black"}
					icon={<Icon as={FaWrench} />}
					onClick={onToggle}
					position="relative"
					rounded="0.6rem"
					shadow="md"
					size="sm"
					transition="0.2s all"
				/>
			</PopoverTrigger>
			<PopoverContent
				as={motion.div}
				border="none"
				bgGradient="linear(to-br, #fffff 10%, #fffff 25%)"
				color="black"
				rounded="1em"
				shadow="md"
				w="full"
				bg="#ffffff"
				// bg="rgba(255,255,255,1)"
				_dark={{
					bg: "linear(to-br, #1E293B 1%, #1E293B 80%)",
					bgGradient: "linear(to-br, #1E293B 1%, #1E293B 80%)",
					color: "white"
				}}
			>
				<PopoverBody p={0}>
					<Flex pt={1} roundedTop="1em" w="full">
						<Text
							bgClip="text"
							bgGradient="linear(45deg, #4b6cb7, brand.2)"
							fontFamily="heading"
							fontSize="18"
							textAlign="center"
							w="full"
						>
							Settings
						</Text>
					</Flex>
					<Text color={useColorModeValue("black", "white")} px={3} py={1} w="full">
						Theme
					</Text>
					<Flex pl={4} pb={4} w="full">
						<ThemeSwitch />
					</Flex>
					<Divider />
					<HStack justify="space-between" px={{ base: 2, sm: 3 }} py={3} w="full">
						<RpcStatusIndicator
							rpcUrl={
								import.meta.env.VITE_NEUTRONNETWORK === "neutron" ? rpcMainnetUrl : rpcTestnetUrl
							}
						/>
					</HStack>
				</PopoverBody>
			</PopoverContent>
		</Popover>
	)
}
