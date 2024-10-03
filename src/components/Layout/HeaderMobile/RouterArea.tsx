/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable jsx-a11y/anchor-is-valid */
import { type NavigationButtonProps } from "./NavigationButton"
import NavigationButton from "./NavigationButton"
import { InfoIcon } from "@chakra-ui/icons"
import {
	Accordion,
	Box,
	Drawer,
	DrawerBody,
	DrawerContent,
	DrawerFooter,
	DrawerOverlay,
	Flex,
	HStack,
	Icon,
	IconButton,
	Text,
	useBreakpoint,
	useDisclosure
} from "@chakra-ui/react"
import { ParachuteIcon } from "@components/Assets/AirdropIcon"
import { useChain } from "@cosmos-kit/react"
import { keyframes } from "@emotion/react"
import ConnectButton from "components/ConnectButton"
import { motion } from "framer-motion"
import { useCallback, useEffect, useMemo, useState } from "react"
import { FaGithub, FaMedium, FaTelegram } from "react-icons/fa"
import { FaXTwitter } from "react-icons/fa6"
import { HiExternalLink, HiOutlineMenuAlt3 } from "react-icons/hi"
import { useLocation } from "react-router-dom"
import { useRecoilState } from "recoil"
import { activeIndexState, activeRouteState } from "state/UIState"

export const RouterArea = () => {
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

	const location = useLocation()
	const [, setActiveRoute] = useRecoilState(activeRouteState)
	const [activeIndex, setActiveIndex] = useRecoilState(activeIndexState)
	const { isOpen, onOpen, onClose } = useDisclosure()
	const { isWalletConnected } = useChain(import.meta.env.VITE_NEUTRONNETWORK)

	const [sectionTitle, setSectionTitle] = useState("")

	useEffect(() => {
		// Extract the title of the section from the current location
		const title = location.pathname.split("/")[1]
		const capitalizedTitle = title.charAt(0).toUpperCase() + title.slice(1)
		setSectionTitle(capitalizedTitle)
	}, [location.pathname])

	const url = import.meta.env.VITE_NEUTRONNETWORK === "neutron" ? "/airdrop" : "/airdrop"
	// @ts-expect-error types
	const data: NavigationButtonProps[] = useMemo(() => {
		return [
			{
				icon: <Icon as={ParachuteIcon} h="full" w="full" zIndex={1} />,
				isDisabled: false,
				label: (
					<Text
						css={{
							animation: `${gradientAnimation} 2s ease infinite`,
							background: "-webkit-linear-gradient(45deg, #61a9bb, #ec80fe)",
							backgroundSize: "400% 400%",
							marginLeft: "6px",
							WebkitBackgroundClip: "text",
							WebkitTextFillColor: "transparent"
						}}
					>
						Airdrop
					</Text>
				),
				navId: 11,
				url
			}
		]
	}, [gradientAnimation, url])

	const breakpoint = useBreakpoint({ ssr: false })
	const isMobile = Boolean(breakpoint === "base" || breakpoint === "sm")

	return (
		<>
			<Flex align="start" justify="center" pos="relative" w="full" pt={3} pb={2} pl={3}>
				{isMobile ? (
					<>
						<IconButton
							_active={{ bg: "blackAlpha.500" }}
							_dark={{
								_active: { bg: "whiteAlpha.400" },
								_hover: { bg: "whiteAlpha.300" },
								bg: "whiteAlpha.0"
							}}
							_hover={{ bg: "blackAlpha.400" }}
							aria-label="Open Menu"
							bg="blackAlpha.300"
							color="white"
							h={{ base: "3rem", md: "4rem" }}
							icon={<HiOutlineMenuAlt3 size="25" />}
							isActive={isOpen}
							mb={-1.5}
							minWidth="2rem"
							onClick={() => onOpen()}
							rounded="1em"
							w={{ base: "3rem", md: "4rem" }}
						/>
						<Box display="flex" alignItems="center" pl={2} pt={2.5}>
							{" "}
							<Text>{sectionTitle}</Text>
						</Box>
						<Drawer isOpen={isOpen} onClose={onClose} placement="right">
							<DrawerOverlay backdropFilter="blur(70px)" bg="transparent" />
							<DrawerContent
								_dark={{ bgGradient: "linear(to-b, gray.600, gray.800)" }}
								bgGradient="linear(to-b, white, white)"
								overflow="hidden"
								roundedStart="2em"
								shadow="md"
							>
								{/* {isWalletConnected && (
									<Accordion allowToggle>
										{data.map((item) => (
											<NavigationButton
												key={item.navId}
												activeIndex={activeIndex}
												isDisabled={item.isDisabled}
												onClick={() => handleClick(item.navId, item.subLinks)}
												{...item}
											/>
										))}
									</Accordion>
								)} */}
								<DrawerBody bg="transparent" flex={1} flexDirection="column" p={3}>
									<Flex
										bgGradient="linear(45deg, #4b6cb7, brand.2)"
										h="0.3rem"
										mb={4}
										mt={2}
										rounded="full"
										w="full"
									/>
									<Flex direction="column" gap={{ base: 4, md: 1 }} px={3}>
										<Flex
											_dark={{ _hover: { bg: "whiteAlpha.200" } }}
											_hover={{ bg: "blackAlpha.100" }}
											as="a"
											bg="transparent"
											href="https://x.com/ElectronDeFi"
											target="_blank"
										>
											<HStack justify="space-between" w="full">
												<HStack>
													<Icon as={FaXTwitter} h="1rem" w="1rem" zIndex={1} />
													<Text fontSize="14" w="full">
														X
													</Text>
												</HStack>
												<HiExternalLink />
											</HStack>
										</Flex>
										<Flex
											_dark={{ _hover: { bg: "whiteAlpha.200" } }}
											_hover={{ bg: "blackAlpha.100" }}
											as="a"
											bg="transparent"
											href="https://electron.network/social/telegram"
											target="_blank"
										>
											<HStack justify="space-between" w="full">
												<HStack>
													<Icon as={FaTelegram} h="1rem" w="1rem" zIndex={1} />
													<Text fontSize="14" w="full">
														Telegram
													</Text>
												</HStack>
												<HiExternalLink />
											</HStack>
										</Flex>
										{/* <Flex
                _dark={{ _hover: { bg: "whiteAlpha.200" } }}
                _hover={{ bg: "blackAlpha.100" }}
                as="a"
                bg="transparent"
                href="https://www.coingecko.com/en/coins/Electronnetwork"
                target="_blank"
            >
                <HStack justify="space-between" w="full">
                    <HStack>
                        <Icon as={CGWhite} h="1.5rem" w="1.5rem" zIndex={1} />
                        <Text fontSize="20" w="full">
                            CoinGecko
                        </Text>
                    </HStack>
                    <HiExternalLink />
                </HStack>
            </Flex> */}

										<Flex
											_dark={{ _hover: { bg: "whiteAlpha.200" } }}
											_hover={{ bg: "blackAlpha.100" }}
											as="a"
											bg="transparent"
											href="https://github.com/Electron-Protocol"
											target="_blank"
										>
											<HStack justify="space-between" w="full">
												<HStack>
													<Icon as={FaGithub} h="1rem" w="1rem" zIndex={1} />
													<Text fontSize="14" w="full">
														Github
													</Text>
												</HStack>
												<HiExternalLink />
											</HStack>
										</Flex>
										<Flex
											_dark={{ _hover: { bg: "whiteAlpha.200" } }}
											_hover={{ bg: "blackAlpha.100" }}
											as="a"
											bg="transparent"
											href="https://medium.com/@Electron-Protocol"
											target="_blank"
										>
											<HStack justify="space-between" w="full">
												<HStack>
													<Icon as={FaMedium} h="1rem" w="1rem" zIndex={1} />
													<Text fontSize="14" w="full">
														Medium
													</Text>
												</HStack>
												<HiExternalLink />
											</HStack>
										</Flex>
									</Flex>
								</DrawerBody>
								<DrawerFooter>
									<HStack flex={1}>
										<ConnectButton />
									</HStack>
								</DrawerFooter>
							</DrawerContent>
						</Drawer>
					</>
				) : (
					<Accordion allowToggle as={motion.div} border="0px" layout w="full">
						{data.map((props: NavigationButtonProps) => {
							return (
								<NavigationButton
									key={props.navId} // Use navId as the key
									activeIndex={activeIndex}
									isDisabled={props.isDisabled}
									{...props}
								/>
							)
						})}
					</Accordion>
				)}
			</Flex>
			<Box display={{ base: "none", md: "flex" }}>
				<Flex
					pos="fixed"
					bottom="6.5rem"
					left="0"
					right="0"
					justifyContent="left"
					pl={{ base: 4, md: 9, sm: 20 }} // Padding left responsive
					pt={{ base: 2, md: 9, sm: 2 }} // Padding top responsive
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
					{isWalletConnected && (
						<a style={{ position: "relative" }}>
							<Icon
								as={InfoIcon}
								data-tooltip-id="my-tooltip"
								boxSize={2}
								mb={-10}
								py={0}
								ml={2.5}
								mt={4}
								color="gray.300"
							/>
						</a>
					)}
				</Flex>
			</Box>
		</>
	)
}
