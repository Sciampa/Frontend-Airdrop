import { BalanceSwitch } from "./BalanceSwitch"
import {
	Box,
	Divider,
	Flex,
	FormControl,
	Grid,
	GridItem,
	HStack,
	Icon,
	IconButton,
	Input,
	InputGroup,
	InputRightElement,
	Popover,
	PopoverBody,
	PopoverContent,
	PopoverTrigger,
	Text,
	useColorModeValue,
	useDisclosure,
	useRadio,
	useRadioGroup
} from "@chakra-ui/react"
import { motion } from "framer-motion"
import { useRef, useState } from "react"
import { RiSettings4Fill } from "react-icons/ri"
import { useRecoilState } from "recoil"
import { slippageState } from "state/swapState"

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const RadioTag = (props: any) => {
	const { getInputProps, getCheckboxProps } = useRadio(props)
	const input = getInputProps()
	const checkbox = getCheckboxProps()

	return (
		<Box as="label" px={2}>
			<input {...input} />
			<Box
				{...checkbox}
				_checked={{
					bgGradient: "linear(45deg, #4b6cb7, brand.2)",
					color: "white"
				}}
				_disabled={{
					cursor: "not-allowed",
					opacity: 0.5
				}}
				bg={useColorModeValue("blackAlpha.300", "gray.700")}
				cursor="pointer"
				px={3}
				py={1}
				rounded="1em"
				shadow="md"
				transition="0.2s all"
			>
				<Text textAlign="center">{props.children}</Text>
			</Box>
		</Box>
	)
}

export const SettingsButton = () => {
	const { onToggle, onClose, isOpen } = useDisclosure()
	const initialFocusRef = useRef(null)
	const options = ["1%", "3%", "5%"]

	// const advancedMode = useRecoilValue(marketAdvancedModeState)
	const [slippage, setSlippage] = useRecoilState(slippageState)

	const [customSlippage, setCustomSlippage] = useState(false)
	const [isError, setIsError] = useState(false)
	const [errorText, setErrorText] = useState("")

	const { getRootProps, getRadioProps, setValue } = useRadioGroup({
		defaultValue: "1%",
		name: "setting",
		onChange: (next) => {
			setCustomSlippage(false)
			setSlippage(Number(next.split("%")[0]) / 100)
			setIsError(false)
		}
	})

	const group = getRootProps()

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
						bg: "gray.700",
						bgGradient: "linear(to-br, rgb(30, 41, 59) 1%, rgb(30, 41, 59) 90%)",
						color: "white"
					}}
					_focus={{ boxShadow: "none" }}
					_hover={{
						color: "#4b6cb7",
						filter: "brightness(110%)"
					}}
					aria-label="Open Swap Settings"
					as={motion.button}
					bg="gray.700"
					bgGradient="linear(to-br, rgba(255, 255, 255), rgba(255, 255, 255))"
					color={isOpen ? "#4b6cb7" : "black"}
					icon={<Icon as={RiSettings4Fill} />}
					onClick={onToggle}
					position="relative"
					rounded="0.8rem"
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
							Swap Settings
						</Text>
					</Flex>
					<Text color={useColorModeValue("black", "white")} px={3} py={1} w="full">
						Slippage Tolerance
					</Text>
					<Grid
						gap={{ base: 3, md: 1 }}
						px={3}
						templateColumns={{ base: "1fr 1fr 1fr", sm: "repeat(4, 1fr)" }}
						{...group}
					>
						{options.map((value) => {
							const radio = getRadioProps({ value })
							return (
								<RadioTag key={value} value={value} {...radio}>
									{value}
								</RadioTag>
							)
						})}
						<GridItem
							//  colSpan={{ base: 3, md: 1 }}
							colStart={4}
						>
							<FormControl isInvalid={isError}>
								<InputGroup>
									<Input
										_focus={{ border: "none", shadow: "none" }}
										bg={useColorModeValue("blackAlpha.300", "gray.700")}
										bgGradient={customSlippage ? "linear(45deg, #4b6cb7, brand.2)" : ""}
										border="none"
										cursor="pointer"
										h="2rem"
										isInvalid={slippage >= 1}
										max={100}
										onChange={(event) => {
											if (Number(event.target.value) <= 100 && Number(event.target.value) > 0.5) {
												setSlippage(Number(event.target.value) / 100)
												setCustomSlippage(true)
												setValue(-1)
												setIsError(false)
											} else {
												setCustomSlippage(false)
												setSlippage(1)
												if (Number(event.target.value) > 100) {
													setErrorText("Slippage can't be higher than 100%")
												} else {
													setErrorText("Slippage can't be lower than 0.5%")
												}

												setIsError(true)
											}
										}}
										placeholder="10"
										px={3}
										py={1}
										rounded="1em"
										shadow="md"
										transition="0.2s all"
										type="number"
										w={{ base: "4rem", md: "5rem" }}
									/>
									<InputRightElement h="2rem" p={0}>
										<Text>%</Text>
									</InputRightElement>
								</InputGroup>
							</FormControl>
						</GridItem>
					</Grid>
					<Text
						_dark={{ color: isError ? "red.400" : "white" }}
						color={isError ? "red.400" : "black"}
						px={3}
						py={2}
					>
						{isError ? errorText : `Current Slippage: ${slippage * 100}%`}
					</Text>
					<Divider />
					<HStack justify="space-between" px={{ base: 2, sm: 3 }} py={3} w="full">
						<Text fontSize={{ base: "sm", md: "md" }}>Zero Balance Assets</Text>
						<BalanceSwitch />
					</HStack>
				</PopoverBody>
			</PopoverContent>
		</Popover>
	)
}
