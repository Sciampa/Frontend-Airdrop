import {
	Button,
	chakra,
	Flex,
	Heading,
	HStack,
	Image,
	Text,
	useBreakpointValue,
	VStack
} from "@chakra-ui/react"
import { useNavigate } from "react-router-dom"

export const Poolcardtop = () => {
	const navigate = useNavigate()
	const isMobile = useBreakpointValue({ base: true, md: false })

	return (
		<Flex
			_dark={{
				bg: "rgb(30, 41, 59)"
			}}
			align="start"
			pb={{ base: 9, md: 3 }}
			bg="rgb(255, 255, 255)"
			pos="relative"
			pt={3}
			px={3}
			rounded="1.25em"
			shadow="md"
			w={{ base: "full", md: "full" }}
			mt={{ base: "0rem", md: "0rem" }}
		>
			{isMobile ? (
				<Flex direction="column" gap={0} w="full">
					<VStack align="start" h="full" spacing={0}>
						<Text fontSize="lg" _dark={{ color: "gray.400" }} color="gray.800">
							<chakra.span
								_dark={{ color: "white" }}
								color="black"
								fontSize="20px"
								fontWeight="500"
								pe="2px"
							>
								Introducing Ele Secured Lending
							</chakra.span>
						</Text>
						<VStack mt="1rem" align="start" h="full" w="full" spacing={0}>
							<Image rounded="1.25em" src="/yield.png" alt="yield" />
						</VStack>
						<Text mt="1rem" fontSize="lg" _dark={{ color: "gray.400" }} color="gray.800">
							<chakra.span
								_dark={{ color: "white" }}
								color="black"
								fontSize="20px"
								fontWeight="500"
								pe="2px"
							>
								Electron Secured Lending
							</chakra.span>
						</Text>
						<HStack alignItems="center">
							<Text fontSize="lg" _dark={{ color: "gray.400" }} color="gray.800">
								<chakra.span
									_dark={{ color: "white" }}
									color="black"
									fontSize="0.8rem"
									fontWeight="500"
									pe="2px"
								>
									Managed by Electron Direct - USDC
								</chakra.span>
							</Text>
							<Image mt="0.3rem" w="1.2rem" src="/assets/tokens/tUSDC.png" alt="yield" />
						</HStack>
					</VStack>
					<Flex direction="column" flex={1} gap={0}>
						<HStack
							_dark={{ color: "white" }}
							color="gray.800"
							h="6rem"
							px={0}
							py={1}
							rounded="0.8em"
							w="full"
							alignItems="center"
						>
							<Text fontSize="0.75rem">
								Earn enhanced native yield on altcoins with fully collateralized lending backed by
								major digital assets and institutional grade staking.
							</Text>
						</HStack>
					</Flex>
					<HStack>
						<VStack
							_dark={{ color: "white" }}
							color="gray.800"
							h="3rem"
							px={0}
							py={1}
							rounded="0.8em"
							w="full"
							justifyContent="start"
							alignItems="start"
						>
							<Heading fontWeight="300" fontSize="0.75rem">
								30-Day APY
							</Heading>
							<Heading fontSize="1rem">11.48%</Heading>
						</VStack>

						<Button
							_dark={{ bgGradient: "transparent", color: "white" }}
							_active={{
								filter: "brightness(80%) drop-shadow(0px 1px 3px rgba(2,226,150, 1))"
							}}
							_hover={{
								filter: "brightness(110%) drop-shadow(0px 1px 3px rgba(255,255,255,255))"
							}}
							alignSelf="center"
							bgGradient="linear(45deg, #4b6cb7, brand.2)"
							color="white"
							fontSize="12"
							maxW="6rem"
							mt={2}
							onClick={() => {
								navigate(`/pool`)
							}}
							rounded="0.9em"
							transition="all 0.5s"
						>
							View Pool
						</Button>
					</HStack>
				</Flex>
			) : (
				<Flex direction="column" gap={4} w="full">
					<Text mt="0rem" fontSize="lg" _dark={{ color: "gray.400" }} color="gray.800">
						<chakra.span
							_dark={{ color: "white" }}
							color="black"
							fontSize="24px"
							fontWeight="500"
							pe="2px"
						>
							Introducing Electron Secured Lending
						</chakra.span>
					</Text>
					<HStack align="start" h="full" spacing={4}>
						<VStack align="start" h="full" w="31.2%" spacing={0}>
							<Image rounded="1.25em" src="/yield.png" alt="yield" />
						</VStack>
						<VStack align="start" h="full" spacing={4} flex="1">
							<Text fontSize="lg" _dark={{ color: "gray.400" }} color="gray.800">
								<chakra.span
									_dark={{ color: "white" }}
									color="black"
									fontSize="20px"
									fontWeight="500"
									pe="2px"
								>
									Electron Secured Lending
								</chakra.span>
							</Text>
							<HStack align="start" spacing={2}>
								<Text fontSize="lg" _dark={{ color: "gray.400" }} color="gray.800">
									<chakra.span
										_dark={{ color: "white" }}
										color="black"
										fontSize="0.8rem"
										fontWeight="500"
										pe="2px"
									>
										Managed by Electron Direct - USDC
									</chakra.span>
								</Text>
								<Image mt="0.4rem" w="1.2rem" src="/assets/tokens/tUSDC.png" alt="yield" />
							</HStack>
							<Text fontSize="0.75rem" _dark={{ color: "gray.400" }} color="gray.800">
								Earn enhanced native yield on altcoins with fully collateralized lending backed by
								major digital assets and institutional grade staking.
							</Text>
							<HStack w="full" justify="space-between" align="center">
								<VStack
									_dark={{ color: "white" }}
									color="gray.800"
									h="3rem"
									px={0}
									py={1}
									rounded="0.8em"
									w="auto"
									justifyContent="start"
									alignItems="start"
								>
									<Heading fontWeight="300" fontSize="0.75rem">
										30-Day APY
									</Heading>
									<Heading fontSize="1rem">11.48%</Heading>
								</VStack>
								<Button
									_dark={{ bgGradient: "transparent", color: "white" }}
									_active={{
										filter: "brightness(80%) drop-shadow(0px 1px 3px rgba(2,226,150, 1))"
									}}
									_hover={{
										filter: "brightness(110%) drop-shadow(0px 1px 3px rgba(255,255,255,255))"
									}}
									bgGradient="linear(45deg, #4b6cb7, brand.2)"
									color="white"
									fontSize="12"
									maxW="6rem"
									onClick={() => {
										navigate(`/pool`)
									}}
									rounded="0.9em"
									transition="all 0.5s"
									alignSelf="flex-end"
									mt="2.2rem"
								>
									View Pool
								</Button>
							</HStack>
						</VStack>
					</HStack>
				</Flex>
			)}
		</Flex>
	)
}
