/* eslint-disable react/jsx-no-bind */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-shadow */
/* eslint-disable func-style */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-negated-condition */
/* eslint-disable id-length */
/* eslint-disable react/no-unstable-nested-components */
import Shares from "."
import CollectionActivity from "./components/CollectionActivity"
import CollectionDescription from "./components/CollectionDescription"
import CollectionImage from "./components/CollectionImage"
import CollectionMarket from "./components/CollectionMarket"
// import CollectionOffers from "./components/CollectionOffers"
import NeutronTokenPriceChart from "./components/FetchPriceGraph"
import MaxPriceBox from "./components/MaxPriceBox"
import PoolDepthGauge from "./components/PoolDepthGauge"
import MintMobile from "./mintmobile"
import {
	Alert,
	AlertIcon,
	AlertTitle,
	Button,
	Flex,
	HStack,
	Icon,
	Spinner,
	Text,
	useBreakpointValue,
	VStack
} from "@chakra-ui/react"
import { MemoizedAvatar } from "@components/MemoizedAvatar"
import { CosmWasmClient } from "@cosmjs/cosmwasm-stargate"
import { useEffect, useState } from "react"
import { FaGlobe, FaMedium, FaTelegramPlane, FaTwitter, FaUser, FaUserCheck } from "react-icons/fa"
import { useParams } from "react-router-dom"

type Socials = {
	medium?: string
	telegram?: string
	twitter?: string
	website?: string
}

// Define the Collection type with description
type Collection = {
	Author: string
	Tquantity: string
	contractAddress: string
	description?: string
	forsale?: number | null
	image: string
	imageA: string
	imageB: string
	isVerified: boolean
	issuerContract: string
	marketAddress: string
	name: string
	ruaId: number
	socials?: Socials
	tokenA: string
	tokenB: string
}

const initializeClient = async () => {
	return await CosmWasmClient.connect("https://rpc-neutron.whispernode.com")
}

// Custom hook to fetch collection data
const useCollectionData = (ruaId: number | undefined) => {
	const [collection, setCollection] = useState<Collection | null>(null)
	const [isLoading, setIsLoading] = useState(true)
	const [error, setError] = useState<string | null>(null)

	useEffect(() => {
		const fetchData = async () => {
			setIsLoading(true)
			setError(null)
			try {
				// Initialize the CosmWasm client
				const client = await initializeClient()

				// Fetch the collection data from the JSON file
				const response = await fetch("https://api.electronprotocol.io/ruaList")
				if (!response.ok) {
					throw new Error(`HTTP error! Status: ${response.status}`)
				}

				const data = await response.json()
				if (!data.collections) {
					throw new Error("Data structure is incorrect. No 'collections' array found.")
				}

				// Find the selected collection based on ruaId
				const selectedCollection = data.collections.find(
					(coll: Collection) => Number(coll.ruaId) === ruaId // Convert ruaId to a number
				)

				if (selectedCollection) {
					selectedCollection.isVerified = selectedCollection.isVerified === "true"

					setCollection(selectedCollection || null)
				} else {
					setCollection(null)
				}
			} catch (error) {
				setError((error as Error).message)
			} finally {
				setIsLoading(false)
			}
		}

		if (ruaId !== undefined) {
			void fetchData()
		}
	}, [ruaId])

	return { collection, error, isLoading }
}

const MintPage = () => {
	const { collectionName } = useParams<{ collectionName?: string }>()
	const ruaId = collectionName ? Number.parseInt(collectionName, 10) : undefined
	const { collection, isLoading, error } = useCollectionData(ruaId)
	const [thermometerValue, setThermometerValue] = useState<number>(0)
	const [rating, setRating] = useState<string>("")
	const [refreshKey, setRefreshKey] = useState(0)

	useEffect(() => {
		// Set up an interval to refresh every 10 seconds
		const intervalId = setInterval(() => {
			setRefreshKey((previousKey) => previousKey + 1) // Increment the key
		}, 10_000) // 10000 ms = 10 seconds

		// Clear the interval on component unmount
		return () => clearInterval(intervalId)
	}, [])

	// eslint-disable-next-line unicorn/consistent-function-scoping
	const calculateRating = (value: number) => {
		if (value >= 9) return "AAA"
		if (value >= 8) return "AA"
		if (value >= 7) return "A"
		if (value >= 6) return "BBB"
		if (value >= 5) return "BB"
		if (value >= 4) return "B"
		if (value >= 3) return "CCC"
		if (value >= 2) return "CC"
		if (value >= 1) return "C"
		return "Not Ranked"
	}

	// Color mapping for ratings
	const ratingColors = {
		A: "#66FF00",
		AA: "#33FF00",
		AAA: "#00FF00",
		B: "#FFCC00",
		BB: "#FFFF00",
		BBB: "#CCFF00",
		C: "#FF0000",
		CC: "#FF3300",
		CCC: "#FF6600",
		"Not Ranked": "#999999"
	}

	const handleThermometerValueChange = (value: number) => {
		setThermometerValue(value)
		const newRating = calculateRating(value)
		setRating(newRating)
	}

	const isMobile = useBreakpointValue({ base: true, md: false })

	if (isLoading) {
		return (
			<Flex align="center" justify="center" height="100vh" width="200vh">
				<Spinner size="xl" />
			</Flex>
		)
	}

	if (error) {
		return (
			<Flex align="center" justify="center" height="100vh">
				<Alert status="error">
					<AlertIcon />
					<AlertTitle>{error}</AlertTitle>
				</Alert>
			</Flex>
		)
	}

	if (!collection) {
		return (
			<Flex align="center" justify="center" height="100vh">
				<Text>No collection found</Text>
			</Flex>
		)
	}

	const verificationIcon = collection.isVerified ? FaUserCheck : FaUser
	const verificationColor = collection.isVerified ? "blue.400" : "gray.400"

	return isMobile ? (
		<MintMobile />
	) : (
		<Flex direction="row" p={6} align="start" justify="center" mx="0">
			<VStack>
				<CollectionImage collection={collection} />
				<NeutronTokenPriceChart />
				<CollectionDescription
					author={collection.Author}
					collection={collection}
					description={collection.description ?? ""}
				/>
			</VStack>
			<VStack>
				<Flex rounded="1.25em" p={2} ml={-2} minWidth="45rem">
					<VStack align="start">
						<HStack>
							<Text _dark={{ color: "white" }} color="black" fontSize="lg">
								REAL UTILITY ASSET
							</Text>
							<Flex ml="-1.5rem" mt="0.2rem">
								<PoolDepthGauge onValueChange={handleThermometerValueChange} />
							</Flex>
						</HStack>
						<HStack justify="space-between">
							<Text
								textAlign="left"
								fontWeight="bold"
								bgGradient="linear(to right, #4b6cb7 100%, #182848 100%, #4b6cb7 100%)"
								backgroundClip="text"
								fontSize="4xl"
								mt={-8}
								ml="-0.1rem"
							>
								{collection.name}
							</Text>
							<VStack>
								<Button
									_hover={{ backgroundPosition: "right center" }}
									backgroundSize="200% 100%" // Make the background larger
									transition="background-position 0.5s" // Smooth transition
									color="white"
									bgGradient="linear(to right, #4b6cb7 0%, #182848 51%, #4b6cb7 100%)"
									ml="20rem"
									size="lg"
									top="-0.5rem"
									visibility="hidden"
								>
									Issue
								</Button>
							</VStack>
						</HStack>
						<HStack mt="-0.6rem">
							<Text _dark={{ color: "white" }} color="black" fontSize="lg">
								{collection.tokenA}
							</Text>
							<MemoizedAvatar
								border="none"
								src={collection.imageA ?? "/assets/electron.png"}
								w={{ base: "2rem", md: "2rem" }}
								h={{ base: "2rem", md: "2rem" }}
								blurHash="jdgthr5gei4fhsqg"
							/>
							<Text color="gray" ml={-1} mr={-1} fontSize="lg">
								/
							</Text>
							<MemoizedAvatar
								border="none"
								src={collection.imageB ?? "/assets/electron.png"} // Fallback image if `imageB` is not available
								w={{ base: "2rem", md: "2rem" }}
								h={{ base: "2rem", md: "2rem" }}
								blurHash="jdgthr5gei4fhsqg"
							/>
							<Text _dark={{ color: "white" }} color="black" fontSize="lg">
								{collection.tokenB}
							</Text>
						</HStack>
					</VStack>
				</Flex>
				<VStack>
					<MaxPriceBox collection={collection} />

					<CollectionMarket key={refreshKey} collection={collection} />
					{/*	<CollectionOffers collection={collection} /> */}
					<CollectionActivity collection={collection} />
				</VStack>
			</VStack>
		</Flex>
	)
}

export default MintPage
