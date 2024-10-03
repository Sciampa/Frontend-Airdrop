/* eslint-disable no-negated-condition */
/* eslint-disable no-promise-executor-return */
/* eslint-disable @typescript-eslint/await-thenable */
/* eslint-disable @typescript-eslint/no-confusing-void-expression */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/promise-function-async */
/* eslint-disable no-console */
import { useContractList, useContractOffers } from "../hooks/query/useListing"
import { useBuyCheapest } from "../hooks/tx/useBuyCheapest"
import { useExecuteContractMsg as useExecuteContractMessage } from "../hooks/tx/useIssueRua"
import { useOfferCheapest } from "../hooks/tx/useOfferCheapest"
import { AddIcon, InfoIcon, MinusIcon } from "@chakra-ui/icons"
import {
	Button,
	Checkbox,
	Divider,
	Flex,
	HStack,
	Icon,
	IconButton,
	Input,
	Text,
	Tooltip,
	useBreakpointValue,
	VStack
} from "@chakra-ui/react"
import React, { useEffect, useState } from "react"
import { FaTag } from "react-icons/fa"
import { FaCartShopping } from "react-icons/fa6"
import { toast } from "react-toastify"

export type Swap = {
	creator: string
	cw721: string
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	expires: string | { never: {} }
	id: string
	nft_contract: string
	payment_token: string | null
	price: string
	swap_type: string
	token_id: string
}

type MaxPriceBoxProps = {
	collection: {
		Author: string
		Tquantity: string
		contractAddress: string
		image: string
		imageA: string
		imageB: string
		issuerContract: string
		marketAddress: string
		name: string
	}
	initialValue?: number
}

const MaxPriceBox: React.FC<MaxPriceBoxProps> = ({ initialValue = 1, collection }) => {
	const { issuerContract, marketAddress } = collection
	const [value, setValue] = useState(initialValue)
	// eslint-disable-next-line
	const [inputValue, setInputValue] = useState("")
	const [isChecked, setIsChecked] = useState(false)
	const { mutate: executeContract } = useExecuteContractMessage(issuerContract)
	const { mutate: executeBuyCheapest } = useBuyCheapest({ collection })
	const { mutate: executeOfferCheapest } = useOfferCheapest({ collection })
	const handleDecrement = () => setValue((previous) => Math.max(1, previous - 1))
	const handleIncrement = () => setValue((previous) => previous + 1)
	const handleCheckboxChange = () => setIsChecked((previous) => !previous)
	const [neutronPrice, setNeutronPrice] = useState(0)
	const [contractList, isLoading, error] = useContractList(marketAddress)
	const [contractOffer] = useContractOffers(marketAddress)
	const [maxPrice, setMaxPrice] = useState("")
	const [isMinPrice, setIsMinPrice] = useState(true)

	const handleBuyClick = () => {
		// Only set to true if it's not already "Buy" mode
		if (!isMinPrice) {
			setIsMinPrice(true)
		}
	}

	const handleOfferClick = () => {
		// Only set to false if it's not already "Offer" mode
		if (isMinPrice) {
			setIsMinPrice(false)
		}
	}

	const buttonWidth = useBreakpointValue({ base: "100%", md: "22rem" })

	// eslint-disable-next-line id-length, unicorn/prevent-abbreviations, @typescript-eslint/no-explicit-any
	const handlePriceChange = (e: { target: { value: any } }) => {
		const price = e.target.value
		setInputValue(price) // Update the local state for the input

		// Set maxPrice in the parent component as a string
		setMaxPrice(price)
	}

	// eslint-disable-next-line unicorn/consistent-function-scoping
	const delay = (ms: number | undefined) => new Promise((resolve) => setTimeout(resolve, ms))

	const handleIssueMultiple = async () => {
		for (let index = 0; index < value; index++) {
			try {
				await executeContract() // Wait for the transaction to complete
				await delay(8_000)
				// eslint-disable-next-line @typescript-eslint/no-shadow
			} catch (error) {
				console.error("Error issuing token:", error)
				break // Stop if there's an error
			}
		}
	}

	// Fetch the Neutron price from the API
	useEffect(() => {
		const fetchNeutronPrice = async () => {
			try {
				const response = await fetch("https://api.electronprotocol.io/FuzioPrice")
				const price = await response.json()
				setNeutronPrice(Number(price))
			} catch (error_) {
				console.error("Error fetching Neutron price:", error_)
			}
		}

		void fetchNeutronPrice()
	}, [])
	// eslint-disable-next-line unicorn/consistent-function-scoping, import/no-named-as-default-member
	React.useEffect(() => {}, [contractList, isLoading, error])
	// eslint-disable-next-line unicorn/consistent-function-scoping, import/no-named-as-default-member
	React.useEffect(() => {}, [contractOffer, isLoading, error])

	// Convert the unit price for display (6 decimal places)
	// eslint-disable-next-line unicorn/consistent-function-scoping
	const convertUnitPrice = (price: number) => {
		const convertedPrice = price / 1_000_000 // 1,000,000 units = 1 Neutron
		return convertedPrice.toFixed(4) // Format to 6 decimal places
	}

	if (isLoading) return <Text>Loading...</Text>
	if (error) return <Text>Error</Text>

	const calculateUsdValue = (price: number) => {
		const pricePerUnit = neutronPrice / 1_000_000 // Calculate price per unit
		const usdValue = price * pricePerUnit
		return usdValue.toFixed(2) // Format to 2 decimal places
	}

	const swaps = contractList?.swaps ?? []
	const swapsOffer = contractOffer?.swaps ?? []
	const sortedSwaps = swaps
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		.filter((swap: { price: any }) => !Number.isNaN(Number(swap.price))) // Filter out swaps with non-numeric prices
		.sort((a: { price: unknown }, b: { price: unknown }) => Number(a.price) - Number(b.price))

	const sortedOffers = swapsOffer
		.filter((offer) => !Number.isNaN(Number(offer.price))) // Filter out offers with non-numeric prices
		.sort((a, b) => Number(b.price) - Number(a.price))

	const firstFourSwaps = sortedSwaps.slice(0, 1)
	const firstFourOffers = sortedOffers.slice(0, 1)

	return (
		<Flex justify="center" p={4} mt="-1rem">
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
				bg="rgba(255, 255, 255)"
				rounded="1.25em"
				shadow="md"
				px={5}
				py={4}
				ml={0}
				mb={{ base: "0rem", md: "-1rem" }}
				width={{ base: "22rem", md: "46rem" }}
			>
				<VStack align="start" width="100%">
					{/*	<HStack spacing={2}>
						<Button
							onClick={handleBuyClick}
							variant={isMinPrice ? "solid" : "outline"}
							bgGradient={
								isMinPrice ? "linear(to-r, #4b6cb7 0%, #182848 51%, #4b6cb7 100%)" : "none"
							}
							color={isMinPrice ? "white" : "gray.500"}
							borderColor={isMinPrice ? "transparent" : "gray.500"}
							transition="all 0.5s"
							width="5em"
							height="1.8rem"
							fontSize="0.8rem"
							_hover={!isMinPrice ? { backgroundPosition: "right center" } : {}}
						>
							Buy
						</Button>
						<Button
							onClick={handleOfferClick}
							variant={isMinPrice ? "solid" : "outline"}
							bgGradient={
								isMinPrice ? "none" : "linear(to-r, #4b6cb7 0%, #182848 51%, #4b6cb7 100%)"
							}
							color={isMinPrice ? "white" : "gray.500"}
							borderColor={isMinPrice ? "transparent" : "gray.500"}
							transition="all 0.5s"
							width="5em"
							height="1.8rem"
							fontSize="0.8rem"
							_hover={!isMinPrice ? { backgroundPosition: "right center" } : {}}
						>
							Offer
						</Button>
					</HStack> */}
					<HStack justify="space-between" width="100%">
						<Text _dark={{ color: "white" }} color="black" fontSize="xs">
							{isMinPrice ? "Minimum Buyout" : "Best Offer"}
						</Text>
						<HStack flexDirection={{ base: "column", md: "row" }} spacing={{ base: 2, md: 4 }}>
							<HStack spacing={2}>
								<IconButton
									_hover={{ backgroundPosition: "right center" }}
									backgroundSize="200% 100%" // Make the background larger
									transition="background-position 0.5s" // Smooth transition
									icon={<MinusIcon />}
									bgGradient="linear(to right, #4b6cb7 0%, #182848 51%, #4b6cb7 100%)"
									onClick={handleDecrement}
									aria-label="Decrease value"
									size="xs"
									top={{ base: "0rem", md: "0rem" }}
								/>

								<Input
									_dark={{ color: "white" }}
									color="black"
									value={value}
									// eslint-disable-next-line id-length, unicorn/prevent-abbreviations
									onChange={(e) => setValue(Number.parseInt(e.target.value, 10) || 1)}
									textAlign="center"
									width="3rem"
									type="number"
									size="xs"
									top={{ base: "0rem", md: "0rem" }}
								/>

								<IconButton
									_hover={{ backgroundPosition: "right center" }}
									backgroundSize="200% 100%" // Make the background larger
									transition="background-position 0.5s" // Smooth transition
									icon={<AddIcon />}
									bgGradient="linear(to right, #4b6cb7 0%, #182848 51%, #4b6cb7 100%)"
									onClick={handleIncrement}
									aria-label="Increase value"
									size="xs"
									top={{ base: "0rem", md: "0rem" }}
								/>
							</HStack>
						</HStack>
					</HStack>
					{isMinPrice
						? firstFourSwaps.map((swap, index) => (
								// eslint-disable-next-line react/no-array-index-key
								<HStack key={index} mt={-4}>
									<Text _dark={{ color: "white" }} color="black" fontSize="2xl" fontWeight="bold">
										{convertUnitPrice(Number(swap.price)) || "N/A"} NTRN
									</Text>
									<Text fontSize="xs" color="gray.500">
										${calculateUsdValue(Number(swap.price)) || "N/A"}
									</Text>
								</HStack>
						  ))
						: firstFourOffers.map((swap, index) => (
								// eslint-disable-next-line react/no-array-index-key
								<HStack key={`offer-${index}`} mt={-4}>
									<Text _dark={{ color: "white" }} color="black" fontSize="2xl" fontWeight="bold">
										{convertUnitPrice(Number(swap.price)) || "N/A"} NTRN
									</Text>
									<Text fontSize="xs" color="gray.500">
										${calculateUsdValue(Number(swap.price)) || "N/A"}
									</Text>
								</HStack>
						  ))}

					<HStack mt="-0.2rem">
						<Checkbox
							size="sm"
							isChecked={isChecked}
							onChange={handleCheckboxChange}
							colorScheme="gray"
							borderColor="gray.500"
							width="0.5rem"
							height="0.5rem"
							mt="-0.45rem"
						/>
						<Text fontSize="xs" color="gray.500" mt="-0.5rem">
							Substitute listings
						</Text>
						<Tooltip
							label={
								<div>
									<p>Unavailable listings will be substituted</p>
									<p>with the cheapest listings below your</p>
									<p>specified max price.</p>
								</div>
							}
							bgGradient="linear(to right, rgba(75, 108, 183, 0.8), rgba(24, 40, 72, 0.8), rgba(75, 108, 183, 0.8))"
							borderRadius="10px"
							fontSize="0.5rem"
							textAlign="center"
							placement="top"
							color="white"
							p={2}
						>
							<span>
								<Icon
									as={InfoIcon}
									boxSize={2}
									mb={3}
									py={0}
									ml={{ base: -1.5, md: -1.5, sm: 2 }}
									mt={{ base: 0, md: -1, sm: 0 }}
									color="gray.300"
									cursor="pointer"
								/>
							</span>
						</Tooltip>
					</HStack>
					<HStack>
						<Divider maxW="95%" />
					</HStack>
					{!isMinPrice && (
						<HStack mt={1} mb={1} width="100%">
							<Text fontSize="2xs">Max price to offer</Text>
							<Input
								type="number"
								placeholder="Enter max price"
								width="100%"
								maxWidth="full"
								borderRadius="lg"
								size="xs"
								value={maxPrice} // Bind maxPrice to input
								onChange={handlePriceChange}
							/>
						</HStack>
					)}
					<HStack justify="center" spacing={4} width="100%">
						<Button
							_hover={{ backgroundPosition: "right center" }}
							color="white"
							bgGradient="linear(to right, #4b6cb7 0%, #182848 51%, #4b6cb7 100%)"
							backgroundSize="200% 100%" // Make the background larger
							transition="background-position 0.5s" // Smooth transition
							size="md"
							width={buttonWidth} // Responsive width for buttons
							maxHeight="2.5rem"
							leftIcon={<Icon as={FaCartShopping} w={3} h={3} mt="0.1rem" />}
							onClick={async () => {
								try {
									if (isMinPrice) {
										await executeBuyCheapest() // Only execute if isMinPrice is true
									}
									// eslint-disable-next-line @typescript-eslint/no-shadow
								} catch (error) {
									console.error("Error executing contract:", error)
								}
							}}
							isDisabled={!isMinPrice} // Disable if not isMinPrice
						>
							Buy now
						</Button>

						{/*	<Button
							_hover={{ backgroundPosition: "right center" }}
							color="white"
							bgGradient="linear(to right, #4b6cb7 0%, #182848 51%, #4b6cb7 100%)"
							backgroundSize="200% 100%" // Make the background larger
							transition="background-position 0.5s" // Smooth transition
							size="md"
							width={buttonWidth} // Responsive width for buttons
							maxHeight="2.5rem"
							leftIcon={<Icon as={FaTag} w={3} h={3} mt="0.1rem" />}
							onClick={() => {
								const priceNumber = Number(inputValue) // Convert to number
								if (!Number.isNaN(priceNumber) && priceNumber > 0) {
									if (!isMinPrice) {
										executeOfferCheapest({ maxPrice: priceNumber }) // Only execute if not isMinPrice
									}
								} else {
									// Display a toast notification for the invalid price
									toast.warn("Please enter a valid price before making an offer.", {
										// You can adjust the position
										autoClose: 5_000,
										closeOnClick: true,
										draggable: true,

										// Adjust auto close duration (in milliseconds)
										hideProgressBar: false,

										pauseOnHover: true,
										position: "top-right",
										progress: undefined
									})
								}
							}}
							isDisabled={isMinPrice} // Disable if isMinPrice
						>
							Make offer
						</Button>
						*/}
						<Button
							_hover={{ backgroundPosition: "right center" }}
							color="white"
							bgGradient="linear(to right, #4b6cb7 0%, #182848 51%, #4b6cb7 100%)"
							backgroundSize="200% 100%" // Make the background larger
							transition="background-position 0.5s" // Smooth transition
							size="md"
							width={buttonWidth} // Responsive width for buttons
							maxHeight="2.5rem"
							leftIcon={<Icon as={FaTag} w={3} h={3} mt="0.1rem" />}
							onClick={handleIssueMultiple}
						>
							Issue {value}
						</Button>
					</HStack>
				</VStack>
			</Flex>
		</Flex>
	)
}

export default MaxPriceBox
