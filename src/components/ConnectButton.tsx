/* eslint-disable jsx-a11y/anchor-is-valid */
// eslint-disable-next-line import/no-extraneous-dependencies, import/no-unassigned-import
import "react-tooltip/dist/react-tooltip.css"
import { ToolsButton } from "./ToolsSettings"
import { InfoIcon } from "@chakra-ui/icons"
import {
	Box,
	Button,
	type ButtonProps,
	Divider,
	Flex,
	HStack,
	Icon,
	IconButton,
	Image,
	Text,
	useClipboard,
	VStack
} from "@chakra-ui/react"
import { useChain } from "@cosmos-kit/react"
import { keyframes } from "@emotion/react"
import { useTokenBalance } from "@hooks/tokens/query/useTokenBalance"
import { AnimatePresence, motion, type Variants } from "framer-motion"
import { type FC, useEffect } from "react"
import {
	FaClipboardList,
	FaGithub,
	FaMedium,
	FaSignInAlt,
	FaSignOutAlt,
	FaTelegram
} from "react-icons/fa"
import { FaXTwitter } from "react-icons/fa6"
import { toast } from "react-toastify"
// eslint-disable-next-line import/no-extraneous-dependencies
import { Tooltip } from "react-tooltip"
import { convertMicroDenomToDenom } from "utils/tokens/helpers"
import shortenNumber from "utils/ui/shortenNumber"
import truncateAddress from "utils/ui/truncateAddress"

export type ConnectButtonProps = ButtonProps & {
	activeIndex?: number
}

const gradientAnimation = keyframes`
  0% {
    background-position: 0% 50%;
  }
  50% {
    background-position: 100% 50%;
  }
  100% {
    background-position: 0% 50%;
  }
`

const connectWalletVariants: Variants = {
	hide: {
		opacity: 0,
		transition: {
			duration: 0.5,
			type: "tween"
		},
		y: -30
	},
	show: {
		opacity: 1,
		transition: {
			duration: 0.5,
			type: "tween"
		},
		y: 0
	}
}

export const walletToolbarVariants: Variants = {
	hide: {
		transition: {
			staggerChildren: 0.25,
			transition: {
				duration: 0.5,
				type: "tween"
			}
		}
	},
	show: {
		transition: {
			delayChildren: 0.25,
			staggerChildren: 0.2,
			transition: {
				duration: 1,
				type: "tween"
			}
		}
	}
}

export const walletToolbarItemVariants: Variants = {
	hide: { opacity: 0, y: -0 },
	show: { opacity: 1, y: 0 }
}

const ConnectButton: FC<ConnectButtonProps> = () => {
	const { address, openView, isWalletConnected } = useChain(import.meta.env.VITE_NEUTRONNETWORK)

	const { onCopy, setValue } = useClipboard("")

	// TODO: Add Electron denom once minted
	const [ParticleBalance] = useTokenBalance(
		"factory/neutron14n0asvvxcks0x3t88chhhwzeesckekt5tvsc26/PARTICLE"
	)
	const [EleBalance] = useTokenBalance("factory/neutron13r3st22qa04c8q0d6elg4eyc55vcyrdhgcjm9f/ELE")
	const [ntrnBalance] = useTokenBalance("untrn")

	useEffect(() => {
		if (isWalletConnected && address) {
			setValue(address)
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [isWalletConnected])

	if (isWalletConnected) {
		return (
			<>
				<Flex
					display={{ base: "flex", md: "flex" }}
					justifyContent="center" // Center horizontally
					alignItems="center"
					w="full"
				>
					<AnimatePresence mode="wait">
						{isWalletConnected && (
							<VStack align="center" as={motion.div} p={2} w="full">
								<Box display={{ base: "none", md: "flex" }}>
									<Flex
										pos="relative"
										left="0"
										right="0"
										top="8"
										justifyContent="left"
										pl={{ base: 4, md: 0, sm: 20 }} // Padding left responsive
										pt={{ base: 2, md: 0, sm: 2 }} // Padding top responsive
									>
										<Flex
											_dark={{ _hover: { bg: "whiteAlpha.200" } }}
											_hover={{ bg: "blackAlpha.100" }}
											as="a"
											bg="transparent"
											href="https://x.com/ElectronDeFi"
											target="_blank"
											alignItems="center" // Align items vertically
											justifyContent="center" // Align items horizontally
											mx={2} // Add margin between icons
											mb={isWalletConnected ? 10 : 0}
										>
											<Icon as={FaXTwitter} h="1.3rem" w="1.3rem" />
										</Flex>
										<Flex
											_dark={{ _hover: { bg: "whiteAlpha.200" } }}
											_hover={{ bg: "blackAlpha.100" }}
											as="a"
											bg="transparent"
											href="https://t.me/electroncommunity"
											target="_blank"
											alignItems="center" // Align items vertically
											justifyContent="center" // Align items horizontally
											mx={2} // Add margin between icons
											mb={isWalletConnected ? 10 : 0}
										>
											<Icon as={FaTelegram} h="1.3rem" w="1.3rem" />
										</Flex>
										<Flex
											_dark={{ _hover: { bg: "whiteAlpha.200" } }}
											_hover={{ bg: "blackAlpha.100" }}
											as="a"
											bg="transparent"
											href="https://medium.com/@Electron-Protocol"
											target="_blank"
											alignItems="center" // Align items vertically
											justifyContent="center" // Align items horizontally
											mx={2} // Add margin between icons
											mb={isWalletConnected ? 10 : 0}
										>
											<Icon as={FaMedium} h="1.3rem" w="1.3rem" />
										</Flex>
										<Flex
											_dark={{ _hover: { bg: "whiteAlpha.200" } }}
											_hover={{ bg: "blackAlpha.100" }}
											as="a"
											bg="transparent"
											href="https://github.com/Electron-Protocol"
											target="_blank"
											alignItems="center" // Align items vertically
											justifyContent="center" // Align items horizontally
											mx={2} // Add margin between icons
											mb={isWalletConnected ? 10 : 0}
										>
											<Icon as={FaGithub} h="1.3rem" w="1.3rem" />
										</Flex>
									</Flex>
								</Box>
								<Divider maxW="95%" />
								<HStack justify="center" w="full">
									<Image src="/assets/tokens/particle.png" w="1rem" ml="0.8rem" />
									<Text fontFamily="body" fontSize="md" fontWeight="900" textAlign="start" w="full">
										{shortenNumber(convertMicroDenomToDenom(ParticleBalance, 6), 2)}
									</Text>
									<Text
										fontFamily="body"
										fontSize="sm"
										fontWeight="900"
										textAlign="start"
										w="full"
										display="inline-flex"
										alignItems="center"
									>
										<span
											style={{
												animation: `${gradientAnimation} 2s ease infinite`,
												background: "-webkit-linear-gradient(45deg, #61a9bb, #ec80fe)",
												backgroundSize: "400% 400%",
												marginRight: "4px",
												WebkitBackgroundClip: "text",
												WebkitTextFillColor: "transparent"
											}}
										>
											Particles
										</span>
									</Text>
									{isWalletConnected && (
										<a style={{ position: "relative" }}>
											<Icon
												as={InfoIcon}
												data-tooltip-id="my-tooltip"
												boxSize={2}
												mb={3}
												py={0}
												ml={{ base: -10, md: -6, sm: 2 }}
												mt={0}
												color="gray.300"
											/>
										</a>
									)}
								</HStack>
								<Divider maxW="95%" />
								<Tooltip
									id="my-tooltip"
									style={{
										background: "linear-gradient(to right, #61a9bb, #ec80fe)",
										borderRadius: "10px",
										fontSize: "0.5rem",
										marginLeft: "0em",
										marginTop: "0rem",
										textAlign: "center"
									}}
								>
									<div>
										<p>Liquidity providers are eligible</p>
										<p>to earn $Particles rewards.</p>
										<p>These rewards will be swapped to</p>
										<p>$ELE, the official governance</p>
										<p>token of Electron once it goes live.</p>
									</div>
								</Tooltip>
								<HStack
									align="end"
									animate="show"
									as={motion.div}
									exit="hide"
									fontSize="md"
									h="full"
									initial="hide"
									justify="end"
									key="walletConnected"
									spacing="0.2rem"
									variants={connectWalletVariants}
									w="full"
								>
									<VStack align="start" spacing={0.25} w="full">
										<HStack justify="start" w="full">
											<Image src="/assets/tokens/electron.png" w="1.4rem" />
											<Text
												fontFamily="body"
												fontSize="md"
												fontWeight="900"
												textAlign="start"
												w="full"
											>
												{shortenNumber(convertMicroDenomToDenom(EleBalance, 6), 2)}
											</Text>
										</HStack>
										<HStack justify="start" w="full">
											<Image src="/assets/tokens/ntrn.png" w="1.4rem" />
											<Text
												fontFamily="body"
												fontSize="md"
												fontWeight="900"
												textAlign="start"
												w="full"
											>
												{shortenNumber(convertMicroDenomToDenom(ntrnBalance, 6), 2)}
											</Text>
										</HStack>
									</VStack>
									<HStack
										align="end"
										animate="show"
										as={motion.div}
										exit="hide"
										initial="hide"
										justify="end"
										spacing={1}
										variants={walletToolbarVariants}
										w="full"
									>
										<ToolsButton />
										<IconButton
											_active={{ background: "rgba(255,255,255,0.1)" }}
											_hover={{
												background: "rgba(255,255,255,0.2)",
												cursor: "pointer"
											}}
											_dark={{ background: "rgba(255,255,255,0.1)" }}
											aria-label="Copy wallet address to clipboard"
											as={motion.div}
											bg="rgba(255,255,255)"
											h="2rem"
											shadow="md"
											icon={<FaClipboardList size="1rem" />}
											onClick={() => {
												onCopy()
												toast("Copied address!", {
													progressStyle: {
														background: "rgba(2, 226, 150, 1)",
														boxShadow: "var(--chakra-shadows-md)",
														height: "0.6rem"
													}
												})
											}}
											rounded="0.6rem"
											size="none"
											variants={walletToolbarItemVariants}
											w="2rem"
										/>
										<IconButton
											_active={{ background: "rgba(255,255,255,0.1)" }}
											_hover={{
												background: "rgba(255,255,255,0.2)",
												cursor: "pointer"
											}}
											_dark={{ background: "rgba(255,255,255,0.1)" }}
											aria-label="Open Wallet Modal"
											as={motion.div}
											bg="rgba(255,255,255)"
											h="2rem"
											icon={<FaSignOutAlt size="1rem" />}
											onClick={() => {
												openView()
											}}
											shadow="md"
											rounded="0.6rem"
											size="none"
											variants={walletToolbarItemVariants}
											w="2rem"
										/>
									</HStack>
								</HStack>
								<Text
									bgClip="text"
									bgGradient="linear(45deg, #4b6cb7,brand.2)"
									fontFamily="heading"
									fontSize="md"
									fontWeight="900"
									mb={-2}
									textAlign="center"
									w="full"
								>
									{truncateAddress(address!, 8, 8)}
								</Text>
							</VStack>
						)}
					</AnimatePresence>
				</Flex>
				<Flex
					display={{ base: "flex", md: "none" }}
					mr={2}
					mb={2}
					alignItems="center"
					justifyContent="center"
				/>
			</>
		)
	}

	return (
		<Button
			_active={{ filter: "brightness(100%)" }}
			_hover={{ backgroundPosition: "right center", cursor: "pointer", filter: "brightness(110%)" }}
			alignItems="center"
			as={motion.div}
			bgGradient="linear-gradient(to right, #4b6cb7 0%, #182848  51%, #4b6cb7  100%)"
			bgSize="200% auto"
			color="white"
			h={{ base: "2.5rem", md: "3.5rem" }}
			w={{ base: "8rem", md: "full" }}
			justifyItems="center"
			onClick={() => {
				openView()
			}}
			transition="0.5s"
			overflow="hidden"
			px={2}
			rounded={{ base: "0.7em", md: "1em" }}
		>
			<AnimatePresence mode="wait">
				{!isWalletConnected && (
					<HStack
						animate="show"
						as={motion.div}
						exit="hide"
						initial={false}
						key="walletDisconnected"
						variants={connectWalletVariants}
					>
						<Icon as={FaSignInAlt} h="1.4rem" w="1.4rem" />
						<Text fontFamily="heading" fontSize="xl" textAlign="center" w="full">
							Log In
						</Text>
					</HStack>
				)}
			</AnimatePresence>
		</Button>
	)
}

export default ConnectButton
