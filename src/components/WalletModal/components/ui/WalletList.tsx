/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable id-length */
import { type DisplayWalletListType } from "../types"
import {
	Box,
	Button,
	Center,
	Divider,
	Flex,
	HStack,
	Icon,
	Image,
	Text,
	VStack
} from "@chakra-ui/react"
import { useMemo } from "react"

export const SimpleDisplayWalletListBaseStyle = () => ({
	alignItems: "center",
	columnGap: 2,
	flex: 1,
	gridTemplateColumns: "auto",
	gridTemplateRows: "auto",
	justifyContent: "center",
	position: "relative",
	py: 1
})

export const SimpleDisplayWalletListItemBaseStyle = () => {
	return {
		_hover: {
			bgGradient: "linear(45deg, #4b6cb7, brand.2)",
			filter: "brightness(110%)"
		},
		alignItems: "center",
		borderRadius: "full",
		display: "flex",
		h: "3.5rem",
		justifyContent: "center",
		p: 0,
		position: "relative",
		shadow: "md",
		transition: "all .1s ease-in-out",
		w: "3.5rem"
	}
}

export const SimpleDisplayWalletList = ({ walletsData }: DisplayWalletListType) => {
	const emailLogin = useMemo(() => {
		return walletsData.find((wallet) => wallet.name === "web3auth_email_passwordless")
	}, [walletsData])

	const phoneLogin = useMemo(() => {
		return walletsData.find((wallet) => wallet.name === "web3auth_sms_passwordless")
	}, [walletsData])

	return (
		<Box pb={4} pos="relative">
			{/* <EmailSMSInput emailLogin={emailLogin!} phoneLogin={phoneLogin!} /> */}
			<HStack pt={2}>
				<Divider />

				<Text color="gray.100" fontSize="sm" fontWeight="900" minW="10rem" textAlign="center">
					Select your wallet
				</Text>

				<Divider />
			</HStack>
			{/*	<HStack sx={SimpleDisplayWalletListBaseStyle()}>
				{walletsData
					.filter(
						(wallet) =>
							wallet.name.includes("web3auth") &&
							wallet.name !== "web3auth_email_passwordless" &&
							wallet.name !== "web3auth_sms_passwordless"
					)
					.map(({ name, logo, subLogo, onClick }) => {
						return (
							<Flex
								as={Button}
								id={name}
								key={name}
								onClick={onClick}
								sx={SimpleDisplayWalletListItemBaseStyle()}
							>
								<Center h="full" overflow="hidden" pos="relative" w="full">
									{typeof logo === "string" ? (
										<Image
											h="full"
											objectFit="fill"
											p={2}
											rounded={name.includes("leap") ? "full" : "full"}
											src={name.includes("leap") ? "/assets/leap-logo.svg" : logo}
											w="full"
										/>
									) : (
										<Icon as={logo} />
									)}
									{subLogo && (
										<Center
											bg="white"
											bottom="0"
											h="1.5rem"
											pos="absolute"
											right="0"
											rounded="full"
											w="1.5rem"
										>
											{typeof subLogo === "string" ? (
												<Image src={subLogo} w="1.25rem" />
											) : (
												<Icon as={subLogo} w="1.25rem" />
											)}
										</Center>
									)}
								</Center>
							</Flex>
						)
					})}
			</HStack>
			<HStack pt={2}>
				<Divider />
				<Text color="gray.100" fontSize="sm" fontWeight="900" minW="6rem" textAlign="center">
					Wallets
				</Text>
				<Divider />
			</HStack>
			*/}
			<HStack sx={SimpleDisplayWalletListBaseStyle()} spacing={4} justifyContent="center">
				{/* Top left image */}
				<VStack>
					{walletsData
						.filter((wallet) => !wallet.name.includes("web3auth"))
						.slice(0, 1) // Select only the first item for the top left
						.map(({ name, logo, subLogo, onClick }) => (
							<Flex
								as={Button}
								id={name}
								key={name}
								onClick={onClick}
								sx={SimpleDisplayWalletListItemBaseStyle()}
							>
								<Center h="full" overflow="hidden" pos="relative" w="full">
									{typeof logo === "string" ? (
										<Image
											h="full"
											objectFit="fill"
											p={2}
											rounded={name.includes("leap") ? "full" : "full"}
											src={name.includes("leap") ? "/assets/leap-logo.svg" : logo}
											w="full"
										/>
									) : (
										<Icon as={logo} />
									)}
									{subLogo && (
										<Center
											bg="white"
											bottom="0"
											h="1.5rem"
											pos="absolute"
											right="0"
											rounded="full"
											w="1.5rem"
										>
											{typeof subLogo === "string" ? (
												<Image src={subLogo} w="1.25rem" />
											) : (
												<Icon as={subLogo} w="1.25rem" />
											)}
										</Center>
									)}
								</Center>
							</Flex>
						))}
				</VStack>

				{/* Top right image */}
				<VStack>
					{walletsData
						.filter((wallet) => !wallet.name.includes("web3auth"))
						.slice(1, 2) // Select only the second item for the top right
						.map(({ name, logo, subLogo, onClick }) => (
							<Flex
								as={Button}
								id={name}
								key={name}
								onClick={onClick}
								sx={SimpleDisplayWalletListItemBaseStyle()}
							>
								<Center h="full" overflow="hidden" pos="relative" w="full">
									{typeof logo === "string" ? (
										<Image
											h="full"
											objectFit="fill"
											p={2}
											rounded={name.includes("leap") ? "full" : "full"}
											src={name.includes("leap") ? "/assets/leap-logo.svg" : logo}
											w="full"
										/>
									) : (
										<Icon as={logo} />
									)}
									{subLogo && (
										<Center
											bg="white"
											bottom="0"
											h="1.5rem"
											pos="absolute"
											right="0"
											rounded="full"
											w="1.5rem"
										>
											{typeof subLogo === "string" ? (
												<Image src={subLogo} w="1.25rem" />
											) : (
												<Icon as={subLogo} w="1.25rem" />
											)}
										</Center>
									)}
								</Center>
							</Flex>
						))}
				</VStack>
			</HStack>
			<HStack pt={2}>
				<Divider />

				<Text color="gray.100" fontSize="sm" fontWeight="900" minW="10rem" textAlign="center">
					Wallet Connect
				</Text>

				<Divider />
			</HStack>
			<HStack sx={SimpleDisplayWalletListBaseStyle()} spacing={4} justifyContent="center">
				{/* Bottom left image */}
				<VStack>
					{walletsData
						.filter((wallet) => !wallet.name.includes("web3auth"))
						.slice(3, 4) // Select only the fourth item for the bottom left
						.map(({ name, logo, subLogo, onClick }) => (
							<Flex
								as={Button}
								id={name}
								key={name}
								onClick={onClick}
								sx={SimpleDisplayWalletListItemBaseStyle()}
							>
								<Center h="full" overflow="hidden" pos="relative" w="full">
									{typeof logo === "string" ? (
										<Image
											h="full"
											objectFit="fill"
											p={2}
											rounded={name.includes("leap") ? "full" : "full"}
											src={name.includes("leap") ? "/assets/leap-logo.svg" : logo}
											w="full"
										/>
									) : (
										<Icon as={logo} />
									)}
									{subLogo && (
										<Center
											bg="white"
											bottom="0"
											h="1.5rem"
											pos="absolute"
											right="0"
											rounded="full"
											w="1.5rem"
										>
											{typeof subLogo === "string" ? (
												<Image src={subLogo} w="1.25rem" />
											) : (
												<Icon as={subLogo} w="1.25rem" />
											)}
										</Center>
									)}
								</Center>
							</Flex>
						))}
				</VStack>

				{/* Bottom right image */}
				<VStack>
					{walletsData
						.filter((wallet) => !wallet.name.includes("keplr"))
						.slice(2, 3) // Select only the third item for the bottom right
						.map(({ name, logo, subLogo, onClick }) => (
							<Flex
								as={Button}
								id={name}
								key={name}
								onClick={onClick}
								sx={SimpleDisplayWalletListItemBaseStyle()}
							>
								<Center h="full" overflow="hidden" pos="relative" w="full">
									{typeof logo === "string" ? (
										<Image
											h="full"
											objectFit="fill"
											p={2}
											rounded={name.includes("leap") ? "full" : "full"}
											src={name.includes("leap") ? "/assets/leap-logo.svg" : logo}
											w="full"
										/>
									) : (
										<Icon as={logo} />
									)}
									{subLogo && (
										<Center
											bg="white"
											bottom="0"
											h="1.5rem"
											pos="absolute"
											right="0"
											rounded="full"
											w="1.5rem"
										>
											{typeof subLogo === "string" ? (
												<Image src={subLogo} w="1.25rem" />
											) : (
												<Icon as={subLogo} w="1.25rem" />
											)}
										</Center>
									)}
								</Center>
							</Flex>
						))}
				</VStack>
			</HStack>
		</Box>
	)
}
