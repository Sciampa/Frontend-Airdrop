/* eslint-disable no-console */
import { useContractList } from "../hooks/query/useListing"
import {
	Divider,
	Flex,
	HStack,
	Icon,
	Table,
	TableContainer,
	Tbody,
	Td,
	Text,
	Th,
	Thead,
	Tr,
	VStack
} from "@chakra-ui/react"
import React, { useEffect, useState } from "react"
import { FaCartShopping, FaNotesMedical } from "react-icons/fa6"

type CollectionDescriptionProps = {
	collection: {
		Author: string
		Tquantity: string
		contractAddress: string
		image: string
		imageA: string
		imageB: string
		marketAddress: string
		name: string
	}
}

export type Swap = {
	creator: string
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	expires: string | { never: {} }
	id: string
	nft_contract: string
	payment_token: string | null
	price: string
	swap_type: string
	token_id: string
}

const CollectionMarket: React.FC<CollectionDescriptionProps> = ({ collection }) => {
	const { marketAddress } = collection
	const [contractList, isLoading, error] = useContractList(marketAddress)
	const [neutronPrice, setNeutronPrice] = useState(0)

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

	// eslint-disable-next-line import/no-named-as-default-member
	React.useEffect(() => {}, [contractList, isLoading, error])

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

	// eslint-disable-next-line unicorn/consistent-function-scoping
	const formatCreator = (creator: string) => {
		if (creator.length <= 8) return creator // Return as is if less than or equal to 8 characters
		return `${creator.slice(0, 4)}...${creator.slice(-4)}` // Return first 4 and last 4 characters
	}

	// Separate the first four items and the rest
	const swaps = contractList?.swaps ?? []
	const sortedSwaps = swaps
		.filter((swap) => !Number.isNaN(Number(swap.price))) // Filter out swaps with non-numeric prices
		.sort((a, b) => Number(a.price) - Number(b.price))
	const firstFourSwaps = sortedSwaps.slice(0, 9)

	return (
		<Flex justify="center">
			<VStack>
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
					p={5}
					ml={0}
					width={{ base: "22rem", md: "46rem" }}
					height="16rem"
					mt={{ base: "0rem", md: "0rem" }}
				>
					<VStack w="full" alignItems="flex-start">
						<HStack width="full" align="center" mt="-0.8rem">
							<HStack spacing={2} flex="1">
								<Icon
									_dark={{ color: "white" }}
									color="black"
									as={FaNotesMedical}
									h="0.7rem"
									w="0.7rem"
									mt="0.1rem"
								/>
								<Text _dark={{ color: "white" }} color="black" fontSize="xs">
									Listings
								</Text>
							</HStack>
						</HStack>

						{/* Price Table */}
						<Divider mb="-2" w="full" _dark={{ color: "white" }} color="black" />
						<TableContainer w="full">
							<Table variant="simple">
								<Thead>
									<Tr>
										<Th
											_dark={{ color: "gray.400" }}
											color="black"
											fontSize="0.35rem"
											p={0}
											textAlign="center"
											verticalAlign="middle"
											width={8}
										>
											ID
										</Th>
										<Th
											_dark={{ color: "gray.400" }}
											color="black"
											fontSize="0.4rem"
											p={0}
											textAlign="center"
											verticalAlign="middle"
											width="10rem"
										>
											RUA ID
										</Th>
										<Th
											_dark={{ color: "gray.400" }}
											color="black"
											fontSize="0.4rem"
											p={0}
											textAlign="start"
											verticalAlign="middle"
											width="8rem"
										>
											PRICE
										</Th>
										<Th
											_dark={{ color: "gray.400" }}
											color="black"
											fontSize="0.4rem"
											p={0}
											textAlign="center"
											verticalAlign="middle"
											width="5rem"
										>
											USD
										</Th>
										<Th
											_dark={{ color: "gray.400" }}
											color="black"
											fontSize="0.4rem"
											p={0}
											textAlign="center"
											verticalAlign="middle"
											width="15rem"
										>
											EXPIRATION
										</Th>
										<Th
											_dark={{ color: "gray.400" }}
											color="black"
											fontSize="0.4rem"
											p={0}
											textAlign="center"
											verticalAlign="middle"
											width="120px"
										>
											FROM
										</Th>
									</Tr>
								</Thead>
								<Tbody>
									{firstFourSwaps.length > 0 ? (
										firstFourSwaps.map((swap, index) => (
											// eslint-disable-next-line react/no-array-index-key
											<Tr key={index}>
												<Td
													_dark={{ color: "white" }}
													color="black"
													fontSize="0.6rem"
													p={0}
													textAlign="center"
													verticalAlign="middle"
													fontWeight="bold"
												>
													{swap.id}
												</Td>
												<Td
													_dark={{ color: "white" }}
													color="black"
													fontSize="0.6rem"
													p={0}
													textAlign="center"
													verticalAlign="middle"
												>
													{swap.token_id}
												</Td>
												<Td
													_dark={{ color: "white" }}
													color="black"
													fontSize="0.6rem"
													p={0}
													textAlign="start"
													verticalAlign="middle"
													fontWeight="bold"
												>
													{convertUnitPrice(Number(swap.price)) || "N/A"} NTRN
												</Td>
												<Td
													_dark={{ color: "white" }}
													color="black"
													fontSize="0.6rem"
													p={0}
													textAlign="center"
													verticalAlign="middle"
													fontWeight="bold"
												>
													{calculateUsdValue(Number(swap.price)) || "N/A"}
												</Td>
												<Td
													_dark={{ color: "white" }}
													color="black"
													fontSize="0.6rem"
													p={0}
													textAlign="center"
													verticalAlign="middle"
												>
													{typeof swap.expires === "string"
														? swap.expires // If it's a string, display it directly
														: "never" in swap.expires // If the object contains "never", display "never"
														? "Never"
														: JSON.stringify(swap.expires)}{" "}
													{/* Fallback to JSON stringify */}
												</Td>

												<Td
													_dark={{ color: "white" }}
													color="black"
													fontSize="0.6rem"
													p={0}
													textAlign="center"
													verticalAlign="middle"
													fontWeight="bold"
												>
													{formatCreator(swap.creator)}
												</Td>
												<Td
													_dark={{ color: "white" }}
													color="black"
													fontSize="1rem"
													p={0}
													textAlign="center"
													verticalAlign="middle"
												>
													<Icon
														as={FaCartShopping}
														color={index === 0 ? "green.500" : "yellow.500"} // First icon green, next three yellow
														w="0.6rem"
														h="0.6rem"
														cursor="pointer"
													/>
												</Td>
											</Tr>
										))
									) : (
										<Tr>
											<Td colSpan={6} textAlign="center">
												No Listings Available
											</Td>
										</Tr>
									)}
								</Tbody>
							</Table>
						</TableContainer>
					</VStack>
				</Flex>
			</VStack>
		</Flex>
	)
}

export default CollectionMarket
