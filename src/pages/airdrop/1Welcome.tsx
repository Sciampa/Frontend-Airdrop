/* eslint-disable eslint-comments/disable-enable-pair */
import { DisclaimerModal } from "./components/DisclaimerModal"
import {
	Button,
	Checkbox,
	Flex,
	HStack,
	Spacer,
	Text,
	useColorModeValue,
	VStack
} from "@chakra-ui/react"
// import { useTokenBalance } from "@hooks/tokens/query/useTokenBalance"
import { motion } from "framer-motion"
import { useState } from "react"
import { type ZodVoidDef } from "zod"

type WelcomeProps = {
	onNext: () => ZodVoidDef
}
const Welcome: React.FC<WelcomeProps> = ({ onNext }) => {
	// eslint-disable-next-line @typescript-eslint/ban-ts-comment
	const [isChecked, setIsChecked] = useState(false)
	const [isBoxClicked, setIsBoxClicked] = useState(false)

	return (
		<Flex
			animate={{ opacity: 1 }}
			as={motion.main}
			exit={{ opacity: 0 }}
			flexDirection="column"
			gap={2}
			h="full"
			alignContent="center"
			initial={{ opacity: 0 }}
			p={{ base: 4, lg: 24, md: 16 }}
			w="full"
			mt={{ base: -3, md: -90 }}
		>
			<Flex
				_dark={{
					backdropFilter: "blur(32px)",
					background:
						"linear-gradient(137deg, rgba(143, 143, 143, 0.00) 41.48%, rgba(133, 133, 133, 0.28) 134.85%)",
					border: "1px solid rgba(224, 230, 255, 0.10)",
					color: "white",
					MozBackdropFilter: "blur(10px)",
					msBackdropFilter: "blur(32px)",
					transition: "border-color 0.3s ease",
					WebkitBackdropFilter: "blur(32px)"
				}}
				bg="rgb(255, 255, 255)"
				flexDir="column"
				px={2}
				py={3}
				rounded="1.25em"
				shadow="md"
				textColor={useColorModeValue("black", "white")}
				w="full"
				maxW="5xl"
				justifyContent="space-between"
				mt="1rem"
			>
				<Flex
					bgGradient="linear(rgba(33, 33, 33, 0.9))"
					flexDir="column"
					px={5}
					py={3}
					rounded="1.25em"
					shadow="md"
					w="full"
					maxW="100%"
				>
					<HStack w="full">
						<Text
							fontFamily="body"
							fontSize={{ base: "0.6rem", md: "2xl" }}
							fontWeight="400"
							textAlign="center"
							w="full"
							alignItems="start"
						>
							Welcome to the Electron Airdrop
						</Text>
					</HStack>
				</Flex>
				{/* Axelar activity */}
				<Flex
					bgGradient="linear(rgba(33, 33, 33, 0.9))"
					flexDir="column"
					px={5}
					py={3}
					rounded="1.25em"
					shadow="md"
					w="full"
					maxW="100%"
				>
					<VStack w="full" align="center" spacing={4}>
						<Spacer />
						<Text
							fontFamily="arial-regular"
							fontSize={{ base: "0.6rem", md: "xs" }}
							fontWeight="100"
							textAlign="center"
							w={{ base: "80%", md: "50%" }}
						>
							Electron is leveling up! We're pushing for deeper decentralization, and this airdrop
							is all about getting there by spreading the love to our early stakeholders.
						</Text>
						<Spacer />
						<Text
							fontFamily="arial-regular"
							fontSize={{ base: "0.6rem", md: "xs" }}
							fontWeight="100"
							textAlign="center"
							w={{ base: "80%", md: "50%" }}
						>
							Think you might snag some $ELE? You're in luck if you've interacted with Electron,
							hold specific tokens, or have staked tokens within the eligible Cosmos communities.
						</Text>
						<Spacer />
						<Text
							fontFamily="arial-regular"
							fontSize={{ base: "0.6rem", md: "xs" }}
							fontWeight="200"
							textAlign="center"
							w={{ base: "80%", md: "50%" }}
						>
							Oh, and just so you know, we snapped a snapshot on May 15th, 2024. Ready to see if
							you're on the list? Head over to claim your $ELE now!
						</Text>
					</VStack>
				</Flex>

				<Flex justifyContent="center" mt={2}>
					<HStack>
						<Checkbox
							onChange={(event) => {
								setIsChecked(event.target.checked)
								setIsBoxClicked(true)
							}}
							rounded="2em"
							size="lg"
						/>
						<Text fontFamily="heading" fontSize={10}>
							I have read and agreed to these terms.
						</Text>
					</HStack>
					{isBoxClicked && <DisclaimerModal />}
				</Flex>
				<Flex justifyContent="center" mt={4} mb={2} w="full">
					<Button
						_active={{
							filter: isChecked ? "brightness(80%) drop-shadow(0px 0px 3px)" : ""
						}}
						_dark={{
							_disabled: {
								bg: "whiteAlpha.500",
								color: "whiteAlpha.500",
								cursor: "not-allowed"
							}
						}}
						_disabled={{
							bg: "offwhite.4",
							color: "gray.800",
							cursor: "not-allowed",
							opacity: 0.5
						}}
						_hover={{
							filter: isChecked ? "brightness(110%) drop-shadow(0px 0px 6px)" : ""
						}}
						bgGradient="linear(45deg, #4b6cb7, brand.2)"
						color="white"
						fontSize="16"
						isDisabled={!isChecked}
						onClick={onNext}
						rounded="0.9em"
						transition="all 0.5s"
						w="30%"
					>
						Enter
					</Button>
				</Flex>
			</Flex>
		</Flex>
	)
}

export default Welcome

Welcome.propTypes = {
	onNext: () => null
}
