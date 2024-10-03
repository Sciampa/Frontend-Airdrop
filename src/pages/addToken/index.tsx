import {
	Alert,
	AlertDescription,
	AlertTitle,
	Box,
	Button,
	Center,
	Flex,
	FormControl,
	FormLabel,
	Image,
	Input,
	Link,
	Text,
	VStack
} from "@chakra-ui/react"
import { type ChangeEvent, type FormEvent } from "react"
import React, { useState } from "react"
import { Helmet } from "react-helmet"

type TokenData = {
	chain: {
		chainId: string
		chainName: string
		chainPrettyName: string
		gasPrice: {
			amount: string
			denom: string
		}
		isEVM: boolean
		localDenom: string
	}
	decimal: number
	denom: string
	fullName: string
	isIBCCoin: boolean
	isNativeCoin: boolean
	logoURI: string
	logohash: string
	symbol: string
	tokenPrettyName: string
}

const AddToken: React.FC = () => {
	const [tokenDenom, setTokenDenom] = useState<string>("")
	const [tokenData, setTokenData] = useState<TokenData | null>(null)
	const [errorMessageVerify, setErrorMessageVerify] = useState<string | null>(null)
	const [messagePr, setMessagePr] = useState<string | null>(null)
	const [isLoading, setIsLoading] = useState<boolean>(false)

	const handleTokenDenomChange = (event: ChangeEvent<HTMLInputElement>) => {
		setTokenDenom(event.target.value)
	}

	const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
		event.preventDefault()
		setIsLoading(true)
		setErrorMessageVerify(null)
		setMessagePr(null)

		setTokenData(null)

		try {
			const request = { denom: tokenDenom }
			const response = await fetch("https://api.electronprotocol.io/getTokenData", {
				body: JSON.stringify(request),
				method: "POST"
			})

			if (!response.ok) {
				throw new Error(`HTTP error! status: ${response.status}`)
			}

			const parsedResponse = await response.json()
			setTokenData(parsedResponse)
		} catch (error) {
			// eslint-disable-next-line no-console
			console.error("Error:", error)
			setErrorMessageVerify(
				error instanceof Error
					? error.message + ". Make sure the token is present on Chain Registry"
					: "An unknown error occurred"
			)
		} finally {
			setIsLoading(false)
		}
	}

	const addOnElectron = async (event: React.MouseEvent<HTMLButtonElement>) => {
		event.preventDefault()
		setIsLoading(true)
		setMessagePr(null)

		try {
			const request = tokenData
			const response = await fetch("https://api.electronprotocol.io/sendPullRequest", {
				body: JSON.stringify(request),
				method: "POST"
			})

			const parsedResponse = await response.json()
			if (parsedResponse.message === "success") {
				setMessagePr("Token listed on Electron successfully!")
			}
		} catch (error) {
			// eslint-disable-next-line no-console
			console.error("Error:", error)
			setMessagePr(
				"An error occurred, check if token is already listed on Electron or if is present on Chain Registry"
			)
		} finally {
			setIsLoading(false)
		}
	}

	const renderTokenData = () => {
		if (!tokenData) return null

		return (
			<Flex
				align="center"
				direction="column"
				gap={3}
				justify="center"
				pos="relative"
				py={0}
				w="full"
				mt={5}
				_dark={{
					background: "#0F172A",
					border: "1px solid rgba(224, 230, 255, 0.10)",
					color: "white",
					transition: "border-color 0.3s ease"
				}}
				rounded="1.25em"
				p={10}
			>
				<Text>
					Token found: {tokenData.fullName} ({tokenData.symbol})
				</Text>

				<Box>
					<Image boxSize="100px" src={tokenData.logoURI} alt={`${tokenData.symbol} logo`} />
				</Box>

				<Box>
					<Center>
						<VStack spacing={1} align="center">
							{Object.entries(tokenData).map(([key, value]) => (
								<Box
									key={key}
									textAlign="center"
									borderTop="1px solid rgba(224, 230, 255, 0.10)"
									w="4xl"
								>
									<Text fontWeight="bold" display="inline">
										{key}:
									</Text>{" "}
									<Text display="inline">
										{typeof value === "object" ? JSON.stringify(value, null, 2) : String(value)}
									</Text>
								</Box>
							))}
						</VStack>
					</Center>
				</Box>

				<Box>
					<Button type="button" onClick={addOnElectron}>
						Add {tokenData.fullName} ({tokenData.symbol}) on Electron
					</Button>
				</Box>
			</Flex>
		)
	}

	return (
		<Flex
			width="100vw"
			height="100vh"
			alignContent="center"
			justifyContent="center"
			_dark={{
				backdropFilter: "blur(32px)",
				background:
					"linear-gradient(137deg, rgba(143, 143, 143, 0.00) 41.48%, rgba(133, 133, 133, 0.28) 134.85%)",
				color: "white",
				MozBackdropFilter: "blur(10px)",
				msBackdropFilter: "blur(32px)",
				transition: "border-color 0.3s ease",
				WebkitBackdropFilter: "blur(32px)"
			}}
			bg="rgb(255, 255, 255)"
			flexDir="column"
			px={2}
			py={2}
			rounded="1.25em"
			shadow="md"
			w="full"
		>
			<Helmet>
				<title>Add Token | Electron</title>
			</Helmet>
			<Center>
				<Flex
					align="center"
					justifyContent="center"
					alignItems="center"
					direction="column"
					gap={1}
					_dark={{
						background: "#0F172A",
						border: "1px solid rgba(224, 230, 255, 0.10)",
						color: "white",
						transition: "border-color 0.3s ease"
					}}
					rounded="1.25em"
					p={10}
				>
					<Box>
						<Text fontWeight="bold" fontSize="2xl">
							Add Token
						</Text>
					</Box>
					<Box w="3xl">
						<FormControl>
							<form onSubmit={handleSubmit} className="mb-4">
								<FormLabel>Token denom</FormLabel>
								<Input type="text" onChange={handleTokenDenomChange} />
								<Center>
									<Button mt="5" type="submit" disabled={isLoading || tokenDenom === ""}>
										Verify
									</Button>
								</Center>
							</form>
						</FormControl>
					</Box>

					{isLoading && <p>Loading...</p>}

					{errorMessageVerify && (
						<Box display="block" width="100%">
							<Alert display="block" width="100%">
								<AlertTitle display="block" width="100%">
									<Center>Error</Center>
								</AlertTitle>
								<AlertDescription display="block" width="100%">
									<Center>{errorMessageVerify}</Center>
								</AlertDescription>
								<AlertDescription display="block" width="100%">
									<Center>
										<Text>
											You can make a Pull Request for your token{" "}
											<Link href="https://github.com/cosmos/chain-registry/pulls" isExternal>
												<b>
													<u>HERE!</u>
												</b>
											</Link>
										</Text>
									</Center>
								</AlertDescription>
							</Alert>
						</Box>
					)}

					{!isLoading && !messagePr && renderTokenData()}

					{messagePr && (
						<Box mt="4">
							<Alert>
								<AlertDescription>{messagePr}</AlertDescription>
							</Alert>
						</Box>
					)}
				</Flex>
			</Center>
		</Flex>
	)
}

export default AddToken
