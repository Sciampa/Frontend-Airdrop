import { Button, chakra, Flex, Heading, HStack, Image, Text, VStack } from "@chakra-ui/react"
import React from "react"
import { useNavigate } from "react-router-dom"

// eslint-disable-next-line react/no-unused-prop-types
export const PoolCard = () => {
	const navigate = useNavigate()

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
			mt={{ base: "1rem", md: "0rem" }}
		>
			<Flex direction="column" gap={4} w="full">
				<VStack align="start" h="full" spacing={0}>
					<Image rounded="1.25em" src="/yield.png" alt="yield" />

					<Text mt="1rem" fontSize="lg" _dark={{ color: "gray.400" }} color="gray.800">
						<chakra.span
							_dark={{ color: "white" }}
							color="black"
							fontSize="20px"
							fontWeight="500"
							pe="2px"
						>
							High Yield Secured Lending
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
				<Flex direction="column" flex={1} gap={2}>
					<HStack
						_dark={{ color: "white" }}
						color="gray.800"
						h="6rem"
						px={0}
						py={1}
						rounded="0.8em"
						w="full"
						alignItems="top"
					>
						<Text fontSize="0.75rem">
							The High Yield Secured Lending Pool lends USDC to institutions, overcollateralized by
							liquid digital assets, where a portion of collateral may be staked with an
							institutional service provider or lent out on an overcollateralized, short duration
							basis to enhance yields to lenders.
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
						<Heading fontSize="1rem">19.09%</Heading>
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
		</Flex>
	)
}
