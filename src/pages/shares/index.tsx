/* eslint-disable import/no-duplicates */
/* eslint-disable no-negated-condition */
/* eslint-disable id-length */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/no-unstable-nested-components */
import PoolDepthGauge from "./components/PoolDepthGauge"
import { type DataTableProps } from "./components/PortfolioTable"
import { PortfolioTable } from "./components/PortfolioTable"
import {
	Box,
	chakra,
	Flex,
	HStack,
	Icon,
	IconButton,
	Img,
	Input,
	InputGroup,
	InputLeftElement,
	Skeleton,
	Spacer,
	Text,
	useBreakpoint,
	useBreakpointValue,
	useColorModeValue,
	VStack
} from "@chakra-ui/react"
import { MemoizedAvatar } from "@components/MemoizedAvatar"
import RpcStatusIndicator from "@components/RpcStatusIndicator"
import { CosmWasmClient } from "@cosmjs/cosmwasm-stargate"
import { type SortingState } from "@tanstack/react-table"
import {
	type ColumnDef,
	getCoreRowModel,
	getPaginationRowModel,
	getSortedRowModel,
	useReactTable
} from "@tanstack/react-table"
import { createColumnHelper } from "@tanstack/react-table"
import { useDebounce } from "ahooks"
import { motion } from "framer-motion"
import { PortfolioSummary } from "pages/portfolio/assets/components/PortfolioSummary"
import { type SetStateAction } from "react"
import React, { useEffect, useMemo, useState } from "react"
import { Helmet } from "react-helmet"
import {
	FaAngleDoubleLeft,
	FaAngleDoubleRight,
	FaAngleLeft,
	FaAngleRight,
	FaSearch
} from "react-icons/fa"
import { Link } from "react-router-dom"

// Define the Collection type
type Collection = {
	FullCollectionCount: number
	collection: string
	fordividend: number
	forsale: number
	forshare: number
	image: string
	imageA: string
	imageB: string
	marketAddress: string
	name: string
	pair: string
	poolContract: string
	poolContractVolume: string
	poolcontractVolume?: string
	rating: string
	ruaId: number
	shareRanking: number
	tokenA: string
	tokenB: string
}

type SharesProps = {
	Tquantity: string
	forsale: number | null
}

// Function to initialize the CosmWasm client
const initializeClient = async () => {
	return await CosmWasmClient.connect("https://rpc-neutron.whispernode.com")
}

// Function to query the smart contract for the number of tokens for sale
// eslint-disable-next-line func-style
async function getTokensForSale(client: CosmWasmClient, contractAddress: string): Promise<number> {
	const query = { num_tokens: {} }
	try {
		const result = await client.queryContractSmart(contractAddress, query)
		return result && typeof result.count === "number" ? result.count : 0
	} catch {
		return 0
	}
}

// Create the column helper with the Collection type
const columnHelper = createColumnHelper<Collection>()

const Shares = () => {
	const [collections, setCollections] = useState<Collection[]>([])
	const [thermometerValue, setThermometerValue] = useState<number>(0)
	const [rating, setRating] = useState<string>("")
	const [isLoading, setIsLoading] = useState(true)
	const breakpoint = useBreakpoint({ ssr: false })
	const isMobile = useBreakpointValue({ base: true, md: false })
	const [poolVolumes, setPoolVolumes] = useState<Record<string, string>>({})

	useEffect(() => {
		const fetchData = async () => {
			try {
				const client = await initializeClient()
				const response = await fetch("https://api.electronprotocol.io/ruaList")
				const result = await response.json()

				const responseVolumes = await fetch("https://api.electronprotocol.io/FuzioVolume")
				const resultVolumes = await responseVolumes.json()

				const poolVolumesMap = new Map<string, string>()
				for (const [address, volume] of Object.entries(resultVolumes)) {
					poolVolumesMap.set(address, volume as string)
				}

				setPoolVolumes(resultVolumes)

				const collectionsWithCounts = []
				for (const collection of result.collections) {
					const { contractAddress, Tquantity, shareRanking, poolContract } = collection
					if (contractAddress) {
						const count = await getTokensForSale(client, contractAddress)
						collectionsWithCounts.push({
							...collection,
							forsale: count,
							FullCollectionCount: Tquantity,
							poolContractVolume: poolContract ? poolVolumesMap.get(poolContract) ?? "0" : "0",
							shareRanking: Number(shareRanking)
						})
					}
				}

				setCollections(collectionsWithCounts)
			} catch {
				// Handle errors as needed
			} finally {
				setIsLoading(false)
			}
		}

		void fetchData()
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

	// Use Chakra UI's useColorModeValue for text color
	const textColor = useColorModeValue("black", "white")

	// Columns definition
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	const columns: Array<ColumnDef<Collection, any>> = useMemo(
		() => [
			columnHelper.accessor("name", {
				cell: (info) => (
					<Link to={`/rua/${encodeURIComponent(info.row.original.ruaId)}`}>
						<Flex direction="column" justify="center">
							<HStack>
								<Skeleton isLoaded={Boolean(info.row.original.image)}>
									<Img
										src={info.row.original.image ?? "/assets/electron.png"}
										w={{ base: "2rem", md: "4rem" }}
										h={{ base: "2rem", md: "4rem" }}
										borderRadius="2.25px"
										alt={info.row.original.name}
									/>
								</Skeleton>
							</HStack>
						</Flex>
					</Link>
				),
				header: () => (
					<Text textAlign="left" ml={{ base: "0rem", md: "-3rem" }}>
						Certificate
					</Text>
				),
				id: "collectionName"
			}),
			columnHelper.accessor("pair", {
				cell: (info) => (
					<Link to={`/rua/${encodeURIComponent(info.row.original.ruaId)}`}>
						<Flex direction="column" align="center" justify="center" ml="1.5rem">
							<Text color={textColor} fontSize="0.8rem" textAlign="center" mt="0.35rem">
								Real utility asset
							</Text>

							<Text color={textColor} fontSize="0.8rem" textAlign="center" mt={1} fontWeight="bold">
								{info.row.original.tokenA}
								{" / "}
								{info.row.original.tokenB}
							</Text>
						</Flex>
					</Link>
				),
				header: () => (
					<Flex direction="column" align="center" justify="center">
						<Text color={textColor} textAlign="center">
							RUA
						</Text>
					</Flex>
				),
				id: "collectionPair"
			}),
			columnHelper.accessor("pair", {
				cell: (info) => (
					<Link to={`/rua/${encodeURIComponent(info.row.original.ruaId)}`}>
						<Flex direction="column" align="center" justify="center" ml="1.5rem">
							<Text color={textColor} fontSize="0.8rem" textAlign="center" mt={1}>
								APY
							</Text>
							125%
						</Flex>
					</Link>
				),
				header: () => (
					<Flex direction="column" align="center" justify="center">
						<Text color={textColor} textAlign="center">
							Returns
						</Text>
					</Flex>
				),
				id: "collectionPair"
			}),
			columnHelper.accessor("pair", {
				cell: (info) => (
					<Link to={`/rua/${encodeURIComponent(info.row.original.ruaId)}`}>
						<Flex direction="column" align="center" justify="center" ml="1.5rem">
							<Text color={textColor} fontSize="0.8rem" textAlign="center" mt="0.35rem">
								Volume 24H
							</Text>
							<Text
								fontFamily="heading"
								color={textColor}
								fontSize="md"
								fontWeight="bold"
								textAlign="center"
							>
								${info.row.original.poolContractVolume || "0.00"}
							</Text>
							<Text color={textColor} fontSize="0.8rem" textAlign="center" mt={1}>
								Pool depth
							</Text>
							<PoolDepthGauge onValueChange={handleThermometerValueChange} />
						</Flex>
					</Link>
				),
				header: () => (
					<Flex direction="column" align="center" justify="center">
						<Text color={textColor} textAlign="center">
							Volume
						</Text>
					</Flex>
				),
				id: "collectionPair"
			}),
			columnHelper.accessor("forsale", {
				cell: (info) => (
					<Link to={`/rua/${encodeURIComponent(info.row.original.ruaId)}`}>
						<Flex direction="column" align="center" justify="center" ml="1.5rem">
							<Text color={textColor} fontSize="0.8rem" textAlign="center">
								RUA Value
							</Text>
							<Text
								fontFamily="heading"
								color={textColor}
								fontSize="md"
								fontWeight="bold"
								textAlign="center"
							>
								$0.00
							</Text>
							<Text color={textColor} fontSize="0.8rem" textAlign="center" mt={1}>
								RUA Issued
							</Text>
							<Text
								fontFamily="heading"
								color={textColor}
								fontSize="md"
								fontWeight="bold"
								textAlign="center"
							>
								{info.getValue<number | null>() ?? "Loading..."}
							</Text>
						</Flex>
					</Link>
				),
				header: "Minted",
				id: "forsaleData"
			}),
			columnHelper.accessor("fordividend", {
				cell: (info) => (
					<Link to={`/rua/${encodeURIComponent(info.row.original.ruaId)}`}>
						<Flex direction="column" align="center" justify="center" ml="1.5rem">
							<Text color={textColor} fontSize="0.8rem" textAlign="center">
								Total Dividends Paid
							</Text>
							<Text
								fontFamily="heading"
								color={textColor}
								fontSize="md"
								fontWeight="bold"
								textAlign="center"
							>
								$0.00
							</Text>
							<Text color={textColor} fontSize="0.8rem" textAlign="center" mt={1}>
								Latest Weekly Dividend
							</Text>
							<Text
								fontFamily="heading"
								color={textColor}
								fontSize="md"
								fontWeight="bold"
								textAlign="center"
							>
								$0.00
							</Text>
						</Flex>
					</Link>
				),
				header: "Dividends",
				id: "forsaleDividends"
			}),
			columnHelper.accessor("shareRanking", {
				cell: (info) => {
					// Ensure that shareRanking is a number
					const shareRanking = info.getValue<number | null>() ?? 0

					// Calculate the rating based on the ranking value
					// eslint-disable-next-line @typescript-eslint/no-shadow
					const rating = calculateRating(shareRanking)

					// Get the color for the rating, or default to black if not found
					const ratingColor = ratingColors[rating] || "#000"

					// Define the font size based on the rating
					const fontSize = rating === "Not Ranked" ? "0.7rem" : "1.5rem"

					return (
						<Link to={`/rua/${encodeURIComponent(info.row.original.ruaId)}`}>
							<VStack spacing={2} align="start" ml={5}>
								<Skeleton isLoaded={Boolean(shareRanking !== null)}>
									<Flex direction="column" align="center" justify="center" ml="6.3rem">
										<Text color={textColor} fontSize="0.6rem" textAlign="center">
											Product Ranking
										</Text>

										<Text
											color={ratingColor}
											fontWeight="bold"
											fontSize={fontSize} // Apply the conditional font size
											mt="0.5rem"
											textAlign="center"
										>
											{rating}
										</Text>
									</Flex>
								</Skeleton>
							</VStack>
						</Link>
					)
				},
				header: () => (
					<Text textAlign="left" ml={{ base: "0rem", md: "4rem" }}>
						Ranking
					</Text>
				),
				id: "shareRanking"
			})
		],
		[isLoading, textColor, collections, handleThermometerValueChange, ratingColors]
	)

	// eslint-disable-next-line @typescript-eslint/no-shadow
	const MobileSection = <Data extends object>({
		data,
		// eslint-disable-next-line @typescript-eslint/no-shadow
		columns,
		favourites
	}: DataTableProps<Data> & { favourites: string[] }) => {
		const [sorting, setSorting] = useState<SortingState>([])
		const rpcMainnetUrl = "https://api.electronprotocol.io"
		const [searchValue, setSearchValue] = useState<string>("")
		const debouncedValue = useDebounce(searchValue, { wait: 250 })
		const handleChange = (event: { target: { value: SetStateAction<string> } }) =>
			setSearchValue(event.target.value)

		const { otherRows } = useMemo(() => {
			const currentFavoriteRows = data.filter((row) => {
				if (searchValue.length > 0) {
					return (
						// @ts-expect-error types
						favourites.includes(row.denom) &&
						// @ts-expect-error types
						(row.symbol.toLowerCase().includes(debouncedValue.toLowerCase()) ||
							// @ts-expect-error types
							row.denom.toLowerCase().includes(debouncedValue.toLowerCase()))
					)
				} else {
					// @ts-expect-error types
					return favourites.includes(row.denom)
				}
			})

			const currentOtherRows = data.filter((row) => {
				if (searchValue.length > 0) {
					return (
						// @ts-expect-error types
						!favourites.includes(row.token.token) &&
						// @ts-expect-error types
						(row.symbol.toLowerCase().includes(debouncedValue.toLowerCase()) ||
							// @ts-expect-error types
							row.denom.toLowerCase().includes(debouncedValue.toLowerCase()))
					)
				} else {
					// @ts-expect-error types
					return !favourites.includes(row.denom)
				}
			})

			return { favoriteRows: currentFavoriteRows, otherRows: currentOtherRows }
			// eslint-disable-next-line
		}, [columns, data, favourites, debouncedValue])

		const table = useReactTable({
			autoResetPageIndex: false,
			columns,
			data: otherRows,
			getCoreRowModel: getCoreRowModel(),
			getPaginationRowModel: getPaginationRowModel(),
			getSortedRowModel: getSortedRowModel(),
			onSortingChange: setSorting,
			state: {
				pagination: {
					pageIndex: 0,
					pageSize: 3
				},
				sorting
			}
		})

		return (
			<Flex direction="column" p={4}>
				<HStack mt="-1.7rem" mb="0.5rem" ml="0.7rem" pb={2} px={0} w="full">
					<RpcStatusIndicator
						rpcUrl={
							import.meta.env.VITE_NEUTRONNETWORK === "neutron" ? rpcMainnetUrl : rpcMainnetUrl
						}
					/>
					<Text fontSize="0.8rem" _dark={{ color: "gray.200" }} color="gray.700">
						2
					</Text>
					<Text fontSize="0.8rem" _dark={{ color: "gray.200" }} color="gray.700">
						Results
					</Text>
					<Spacer />
					<InputGroup maxW="12rem">
						<InputLeftElement pointerEvents="none">
							<Icon _dark={{ color: "white" }} as={FaSearch} color="blue.500" />
						</InputLeftElement>
						<Input
							_dark={{
								_placeholder: { color: "white" },
								bg: "#182848",
								color: "white"
							}}
							_hover={{ bg: "gray.200" }}
							_focus={{ border: "none", shadow: "glowMd" }}
							_placeholder={{ color: "black" }}
							bg="gray.100"
							color="black"
							fontSize="14"
							onChange={handleChange}
							placeholder="Search..."
							rounded="1.25em"
							shadow="lg"
							variant="filled"
							mr="0.8rem"
						/>
					</InputGroup>
				</HStack>
				{collections.map((collection) => (
					<Link
						key={collection.name}
						to={`/rua/${encodeURIComponent(collection.ruaId)}`}
						style={{ textDecoration: "none" }} // Optional: Remove underline from the link
					>
						<Flex
							key={collection.name}
							direction="column"
							backdropFilter="blur(32px)"
							background="linear-gradient(137deg, rgba(143, 143, 143, 0.00) 41.48%, rgba(133, 133, 133, 0.28) 134.85%)"
							border="1px solid rgba(224, 230, 255, 0.10)"
							color="white"
							transition="border-color 0.3s ease"
							rounded="1.25rem"
							p={4}
							mb={4}
							width="22.2rem"
							mt="-0.5rem"
							align="center"
						>
							<HStack spacing={4}>
								<Img
									ml="-0.7rem"
									src={collection.image ?? "/assets/electron.png"}
									w="4.5rem"
									h="4.5rem"
									borderRadius="8px"
									alt={collection.name}
								/>
								<VStack align="flex-start">
									<Text fontSize="2xl" fontWeight="bold" color={textColor}>
										{collection.tokenA} {collection.tokenB}
									</Text>
									<HStack mt="-0.5rem" ml="0.2rem">
										<Text _dark={{ color: "white" }} mr="-0.3rem" color="black" fontSize="xs">
											{collection.tokenA}
										</Text>
										<MemoizedAvatar
											border="none"
											src={collection.imageA ?? "/assets/electron.png"}
											w={{ base: "1rem", md: "2rem" }}
											h={{ base: "1rem", md: "2rem" }}
											blurHash="jdgthr5gei4fhsqg"
										/>
										<Text color="gray" mb="0.1rem" ml={-2} mr={-2} fontSize="xs">
											/
										</Text>
										<MemoizedAvatar
											border="none"
											src={collection.imageB ?? "/assets/electron.png"} // Fallback image if `imageB` is not available
											w={{ base: "1rem", md: "2rem" }}
											h={{ base: "1rem", md: "2rem" }}
											blurHash="jdgthr5gei4fhsqg"
										/>
										<Text _dark={{ color: "white" }} ml="-0.3rem" color="black" fontSize="xs">
											{collection.tokenB}
										</Text>
										<Flex ml="-0.5rem">
											<PoolDepthGauge onValueChange={handleThermometerValueChange} />
										</Flex>
									</HStack>
								</VStack>
							</HStack>
							<VStack mt={4} align="center" spacing={0}>
								<HStack gap={8} justify="center" w="100%">
									<VStack mt="0.4rem" align="center">
										<Text fontSize="xs" color={textColor}>
											Volume 24H
										</Text>
										<Text mt="-0.5rem" fontSize="xs" fontWeight="bold" color={textColor}>
											${collection.poolContractVolume || "0.00"}
										</Text>
									</VStack>
									<VStack mt="0.4rem" align="center">
										<Text color={textColor} fontSize="xs">
											RUA Value
										</Text>
										<Text
											mt="-0.5rem"
											ml="-0.2rem"
											color={textColor}
											fontWeight="bold"
											fontSize="xs"
										>
											$0.00
										</Text>
									</VStack>
									<VStack mt="0.4rem" align="center">
										<Text color={textColor} fontSize="xs">
											Total Dividends Paid
										</Text>
										<Text mt="-0.5rem" color={textColor} fontWeight="bold" fontSize="xs">
											$0.00
										</Text>
									</VStack>
								</HStack>
								<HStack gap={10} justify="center" w="100%">
									<VStack mt="0.4rem" align="center">
										<Text ml="1.5rem" color={textColor} fontSize="xs">
											Rating
										</Text>
										<Text
											color={ratingColors}
											fontWeight="bold"
											mt="-0.6rem"
											ml="1.5rem"
											textAlign="center"
											fontSize="1rem"
										>
											{rating}
										</Text>
									</VStack>
									<VStack mt="0.4rem" align="center">
										<Text ml="0.9rem" color={textColor} fontSize="xs">
											Issued
										</Text>
										<Text
											mt="-0.5rem"
											ml="0.9rem"
											color={textColor}
											fontWeight="bold"
											fontSize="xs"
										>
											{collection.forsale ?? "Loading..."}
										</Text>
									</VStack>
									<VStack mt="0.4rem" align="center">
										<Text ml="0rem" color={textColor} fontSize="xs">
											Weekly Dividends Paid
										</Text>
										<Text
											mt="-0.5rem"
											ml="-0.15rem"
											color={textColor}
											fontWeight="bold"
											fontSize="xs"
										>
											$0.00
										</Text>
									</VStack>
								</HStack>
							</VStack>
						</Flex>
					</Link>
				))}
				<HStack justify="center" mt={0} mb={2} w="full">
					<IconButton
						_dark={{
							_disabled: {
								_active: { bg: "whiteAlpha.200", color: "whiteAlpha.500", cursor: "not-allowed" },
								_focus: { bg: "whiteAlpha.200", color: "whiteAlpha.500", cursor: "not-allowed" },
								bg: "whiteAlpha.200",
								color: "whiteAlpha.500",
								cursor: "not-allowed"
							},
							_hover: { bg: "gray.600" },
							bg: "gray.700",
							color: "white"
						}}
						_disabled={{
							_active: { bg: "blackAlpha.200", color: "blackAlpha.500", cursor: "not-allowed" },
							_focus: { bg: "blackAlpha.200", color: "blackAlpha.500", cursor: "not-allowed" },
							bg: "blackAlpha.200",
							color: "blackAlpha.500",
							cursor: "not-allowed"
						}}
						_hover={{ bg: "gray.200" }}
						aria-label="firstPage"
						bg="gray.300"
						color="black"
						icon={<FaAngleDoubleLeft />}
						isDisabled={!table.getCanPreviousPage()}
						onClick={() => table.setPageIndex(0)}
						rounded="0.8em"
						shadow="md"
						size="md"
					/>
					<IconButton
						_dark={{
							_disabled: {
								_active: { bg: "whiteAlpha.200", color: "whiteAlpha.500", cursor: "not-allowed" },
								_focus: { bg: "whiteAlpha.200", color: "whiteAlpha.500", cursor: "not-allowed" },
								bg: "whiteAlpha.200",
								color: "whiteAlpha.500",
								cursor: "not-allowed"
							},
							_hover: { bg: "gray.600" },
							bg: "gray.700",
							color: "white"
						}}
						_disabled={{
							_active: { bg: "blackAlpha.200", color: "blackAlpha.500", cursor: "not-allowed" },
							_focus: { bg: "blackAlpha.200", color: "blackAlpha.500", cursor: "not-allowed" },
							bg: "blackAlpha.200",
							color: "blackAlpha.500",
							cursor: "not-allowed"
						}}
						_hover={{ bg: "gray.200" }}
						aria-label="previousPage"
						bg="gray.300"
						color="black"
						icon={<FaAngleLeft />}
						isDisabled={!table.getCanPreviousPage()}
						onClick={() => table.previousPage()}
						rounded="0.8em"
						shadow="md"
						size="md"
					/>
					<Text _dark={{ color: "white" }} fontWeight="900" color="black">
						{table.getState().pagination.pageIndex + 1}{" "}
						<chakra.span fontWeight="400" px="2px">
							of
						</chakra.span>{" "}
						{table.getPageCount()}
					</Text>
					<IconButton
						_dark={{
							_disabled: {
								_active: { bg: "whiteAlpha.200", color: "whiteAlpha.500", cursor: "not-allowed" },
								_focus: { bg: "whiteAlpha.200", color: "whiteAlpha.500", cursor: "not-allowed" },
								bg: "whiteAlpha.200",
								color: "whiteAlpha.500",
								cursor: "not-allowed"
							},
							_hover: { bg: "gray.600" },
							bg: "gray.700",
							color: "white"
						}}
						_disabled={{
							_active: { bg: "blackAlpha.200", color: "blackAlpha.500", cursor: "not-allowed" },
							_focus: { bg: "blackAlpha.200", color: "blackAlpha.500", cursor: "not-allowed" },
							bg: "blackAlpha.200",
							color: "blackAlpha.500",
							cursor: "not-allowed"
						}}
						_hover={{ bg: "gray.200" }}
						aria-label="nextPage"
						bg="gray.300"
						color="black"
						icon={<FaAngleRight />}
						isDisabled={!table.getCanNextPage()}
						onClick={() => table.nextPage()}
						rounded="0.8em"
						shadow="md"
						size="md"
					/>
					<IconButton
						_dark={{
							_disabled: {
								_active: { bg: "whiteAlpha.200", color: "whiteAlpha.500", cursor: "not-allowed" },
								_focus: { bg: "whiteAlpha.200", color: "whiteAlpha.500", cursor: "not-allowed" },
								bg: "whiteAlpha.200",
								color: "whiteAlpha.500",
								cursor: "not-allowed"
							},
							_hover: { bg: "gray.600" },
							bg: "gray.700",
							color: "white"
						}}
						_disabled={{
							_active: { bg: "blackAlpha.200", color: "blackAlpha.500", cursor: "not-allowed" },
							_focus: { bg: "blackAlpha.200", color: "blackAlpha.500", cursor: "not-allowed" },
							bg: "blackAlpha.200",
							color: "blackAlpha.500",
							cursor: "not-allowed"
						}}
						_hover={{ bg: "gray.200" }}
						aria-label="lastPage"
						bg="gray.300"
						color="black"
						icon={<FaAngleDoubleRight />}
						isDisabled={!table.getCanNextPage()}
						onClick={() => table.setPageIndex(table.getPageCount() - 1)}
						rounded="0.8em"
						shadow="md"
						size="md"
					/>
				</HStack>
				<Box height="2rem" />
			</Flex>
		)
	}

	return (
		<Flex
			_dark={{
				backdropFilter: "blur(32px)",
				color: "white",
				MozBackdropFilter: "blur(10px)",
				msBackdropFilter: "blur(32px)",
				transition: "border-color 0.3s ease",
				WebkitBackdropFilter: "blur(32px)"
			}}
			animate={{ opacity: 1 }}
			as={motion.main}
			exit={{ opacity: 0 }}
			flexDirection="column"
			gap={{ base: 5, md: 3 }}
			initial={{ opacity: 0 }}
			pos="relative"
			w="full"
			p={3}
			align="center"
			justify="start"
		>
			<Helmet>
				<title>RUA | Electron</title>
			</Helmet>
			<PortfolioSummary />
			{!isMobile ? (
				<PortfolioTable columns={columns} data={collections} favourites={[]} />
			) : (
				<MobileSection columns={columns} data={collections} favourites={[]} />
			)}
		</Flex>
	)
}

export default Shares
