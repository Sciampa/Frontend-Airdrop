/* eslint-disable @typescript-eslint/no-shadow */
/* eslint-disable id-length */
/* eslint-disable no-console */
import { useRuaList } from "../../shares/hooks/query/useRuaList"
import ActiveStakedCard from "./components/ActiveStakedCard"
import ActiveUnbondCard from "./components/ActiveUnbondCard"
import SellCard from "./components/SellCard"
import SellCardListed from "./components/SellCardListed"
import StakeCard from "./components/StakeCard"
import {
	Box,
	Button,
	Center,
	Flex,
	Heading,
	HStack,
	Image,
	Modal,
	ModalBody,
	ModalCloseButton,
	ModalContent,
	ModalFooter,
	ModalHeader,
	ModalOverlay,
	SimpleGrid,
	Spacer,
	Text,
	VStack
} from "@chakra-ui/react"
import { BadgesIconRua } from "@components/Assets/BadgesIconRua"
import { useChain } from "@cosmos-kit/react"
import { motion } from "framer-motion"
import { PortfolioSummary } from "pages/portfolio/assets/components/PortfolioSummary"
import { useEffect, useState } from "react"
import { Helmet } from "react-helmet"
import { HiExternalLink } from "react-icons/hi"
import { useNavigate } from "react-router-dom"

const GlowCircle = ({ hasStakedNFTs }: { hasStakedNFTs: boolean }) => {
	return (
		<motion.div
			initial={{ scale: 0 }}
			animate={{ scale: 1 }}
			exit={{ scale: 0 }}
			transition={{ duration: 0.5 }}
		>
			<Box
				position="absolute"
				left="90%"
				top="50%"
				transform="translate(-50%, -50%)"
				width="1rem"
				height="1rem"
				borderRadius="50%"
				backgroundColor={hasStakedNFTs ? "green" : "#D3A000"}
				boxShadow={
					hasStakedNFTs ? "0 0 30px rgba(0, 255, 0, 0.8), 0 0 60px rgba(0, 255, 0, 0.5)" : "none"
				}
				zIndex={-1}
			/>
		</motion.div>
	)
}

const MyRuasPage = () => {
	const { address, getCosmWasmClient } = useChain(import.meta.env.VITE_NEUTRONNETWORK)
	const [nftTokensByContract, setNftTokensByContract] = useState<{ [key: string]: string[] }>({})
	const [collectionMap, setCollectionMap] = useState<{ [key: string]: string }>({})
	const [nftImages, setNftImages] = useState<{ [key: string]: string }>({})
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	const [issuanceImages, setIssuanceImages] = useState<{ [key: string]: string }>({})
	const [isLoading, setIsLoading] = useState(true)
	const [ruaList, isRuaListLoading] = useRuaList()
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	const [swapsData, setSwapsData] = useState<{ [key: string]: any[] }>({})
	const [isModalOpen, setIsModalOpen] = useState(false) // State for modal
	const [selectedImage, setSelectedImage] = useState<string>("")
	const [stakedStatus, setStakedStatus] = useState<{ [key: string]: string[] }>({})
	const [unbondStatus, setUnbondStatus] = useState<{ [key: string]: string[] }>({})

	const handleModalClose = () => {
		setIsModalOpen(false)
		setSelectedImage("")
	}

	useEffect(() => {
		const map: { [key: string]: string } = {}
		const images: { [key: string]: string } = {}
		const issuances: { [key: string]: string } = {}

		if (ruaList) {
			for (const rua of ruaList) {
				map[rua.contractAddress] = rua.name
				images[rua.contractAddress] = rua.image || ""

				if (rua.issuance) {
					issuances[rua.issuance] = rua.issuance
				} else {
					console.warn(`Missing issuance for ${rua.contractAddress}`)
				}
			}
		}

		setCollectionMap(map)
		setNftImages(images)
		setIssuanceImages(issuances)
	}, [ruaList])

	useEffect(() => {
		const fetchNFTs = async () => {
			if (!address || isRuaListLoading || !ruaList) {
				setIsLoading(false)
				return
			}

			setIsLoading(true)
			const tokensByContract: { [key: string]: string[] } = {}

			try {
				const cosmwasmClient = await getCosmWasmClient()

				for (const rua of ruaList) {
					const response = await cosmwasmClient.queryContractSmart(rua.contractAddress, {
						tokens: { limit: 10, owner: address }
					})

					const tokens = response.tokens || []
					if (tokens.length > 0) {
						tokensByContract[rua.contractAddress] = tokens
					}
				}

				setNftTokensByContract(tokensByContract)
			} catch (error) {
				console.error("Error fetching NFTs:", error)
			} finally {
				setIsLoading(false)
			}
		}

		void fetchNFTs()
	}, [address, getCosmWasmClient, ruaList, isRuaListLoading])

	useEffect(() => {
		const fetchStakedStatus = async () => {
			if (!address || !ruaList) {
				console.warn("Address or ruaList is missing.")
				return
			}

			try {
				const cosmwasmClient = await getCosmWasmClient()
				if (!cosmwasmClient) {
					console.error("Failed to get CosmWasm client.")
					return
				}

				const stakedTokenIds: { [key: string]: string[] } = {}

				for (const rua of ruaList) {
					const stakingAddress = rua.stakingContract?.address

					if (stakingAddress) {
						try {
							const response = await cosmwasmClient.queryContractSmart(stakingAddress, {
								staked_nfts: { address }
							})

							if (Array.isArray(response) && response.length > 0) {
								stakedTokenIds[stakingAddress] = response
							} else {
								console.warn(`No staked NFTs found for staking contract ${stakingAddress}`)
							}
						} catch (queryError) {
							console.error(`Error querying staking contract ${stakingAddress}:`, queryError)
						}
					}
				}

				setStakedStatus(stakedTokenIds)
			} catch (error) {
				console.error("Error fetching staking status:", error)
			}
		}

		void fetchStakedStatus()
	}, [address, getCosmWasmClient, ruaList])

	useEffect(() => {
		const fetchSwapsData = async (marketAddress: string) => {
			if (!marketAddress) return

			try {
				const cosmwasmClient = await getCosmWasmClient()
				const response = await cosmwasmClient.queryContractSmart(marketAddress, {
					swaps_of: { address }
				})

				if (response?.swaps) {
					setSwapsData((previous) => ({
						...previous,
						[marketAddress]: response.swaps
					}))
				}
			} catch (error) {
				console.error("Error fetching swaps data:", error)
			}
		}

		const fetchAllSwapsData = () => {
			if (ruaList) {
				for (const rua of ruaList) {
					const marketAddress = rua.marketAddress ?? ""
					if (marketAddress) {
						void fetchSwapsData(marketAddress)
					}
				}
			}
		}

		fetchAllSwapsData()
		const intervalId = setInterval(fetchAllSwapsData, 5_000)

		return () => clearInterval(intervalId)
	}, [ruaList, address, getCosmWasmClient])

	useEffect(() => {}, [swapsData])

	useEffect(() => {
		const map: { [key: string]: string } = {}
		const images: { [key: string]: string } = {}

		if (ruaList) {
			for (const rua of ruaList) {
				map[rua.contractAddress] = rua.name
				images[rua.contractAddress] = rua.image || ""
			}
		}

		setCollectionMap(map)
		setNftImages(images)
	}, [ruaList])

	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	const handleExternalLinkClick = (collection: { issuance: string }, event: React.MouseEvent) => {
		event.stopPropagation()
		const issuanceUrl = collection.issuance
		setSelectedImage(issuanceUrl)
		setIsModalOpen(true)
	}

	useEffect(() => {
		const fetchUnbondedStatus = async () => {
			if (!address || !ruaList) {
				console.warn("Address or ruaList is missing.")
				return
			}

			try {
				const cosmwasmClient = await getCosmWasmClient()
				const unbondedTokenIds: { [key: string]: string[] } = {}

				for (const rua of ruaList) {
					const stakingAddress = rua.stakingContract?.address

					if (stakingAddress) {
						try {
							const response = await cosmwasmClient.queryContractSmart(stakingAddress, {
								nft_claims: { address }
							})

							const claims = response?.nft_claims ?? []

							if (claims.length > 0) {
								unbondedTokenIds[stakingAddress] = claims.map(
									// eslint-disable-next-line @typescript-eslint/no-explicit-any
									(claim: { token_id: any }) => claim.token_id
								)
							} else {
								console.warn(`No unbonded NFTs found for staking contract ${stakingAddress}`)
							}
						} catch (queryError) {
							console.error(`Error querying unbonding contract ${stakingAddress}:`, queryError)
						}
					}
				}

				setUnbondStatus(unbondedTokenIds)
			} catch (error) {
				console.error("Error fetching unbonding status:", error)
			}
		}

		void fetchUnbondedStatus()
	}, [address, getCosmWasmClient, ruaList])

	const navigate = useNavigate()

	const getStakedVsTotal = (nftContractAddress: string): string => {
		const matchedCollection = ruaList?.find(
			(collection) => collection.contractAddress === nftContractAddress
		)

		if (!matchedCollection) {
			console.warn(`No collection found for contract address ${nftContractAddress}`)
			return "No holdings"
		}

		const stakingAddress = matchedCollection.stakingContract?.address

		const totalNFTs = nftTokensByContract[nftContractAddress]?.length || 0
		const stakedNFTs = stakingAddress ? stakedStatus[stakingAddress]?.length || 0 : 0

		if (stakedNFTs === 0) {
			return "No holdings"
		}

		return `${stakedNFTs}/${totalNFTs} Earning`
	}

	return (
		<Flex
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
			mb="5em"
			mx={7}
		>
			<Helmet>
				<title>My RUAs | Electron</title>
			</Helmet>
			<PortfolioSummary />
			<Flex flexDirection="column" w="full" mb={6} alignItems="center" justifyContent="center">
				{Object.keys(stakedStatus).some(
					(contractAddress) => stakedStatus[contractAddress]?.length > 0
				) && (
					<Heading
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
						justifyContent="center"
						bg="rgb(255, 255, 255)"
						color="black"
						pb={3}
						pt={3}
						px={3}
						rounded="0.85rem"
						shadow="md"
						size="lg"
						w={{ base: "full", md: "100%" }}
						textAlign="center"
					>
						STAKED RUA
					</Heading>
				)}

				<SimpleGrid
					columns={{ base: 1, md: 4 }}
					spacing={5}
					w="full"
					mt={3}
					justifyItems="center"
					alignItems="center"
				>
					{Object.keys(stakedStatus).map((contractAddress) => {
						const hasStakedTokens = stakedStatus[contractAddress]?.length > 0

						if (hasStakedTokens) {
							return stakedStatus[contractAddress].map((tokenId) => {
								const matchedCollection = ruaList?.find(
									(collection) => collection.stakingContract.address === contractAddress
								)
								const issuance = matchedCollection?.issuance ?? "default-issuance-url"
								const imageUrl = matchedCollection?.image ?? "default-image-url.png"
								const assuranceText = "Issuance"

								return (
									<ActiveStakedCard
										key={`${contractAddress}-${tokenId}`}
										tokenId={tokenId}
										imageUrl={imageUrl}
										assuranceText={assuranceText}
										collection={{
											issuance,
											rua: {
												contractAddress,
												issuance
											},
											stakingContract: {
												address: matchedCollection?.stakingContract.address ?? ""
											}
										}}
									/>
								)
							})
						}

						return null
					})}

					{Object.keys(unbondStatus).map((contractAddress) => {
						const hasUnbondTokens = unbondStatus[contractAddress]?.length > 0

						if (hasUnbondTokens) {
							return unbondStatus[contractAddress].map((tokenId) => {
								const matchedCollection = ruaList?.find(
									(collection) => collection.stakingContract.address === contractAddress
								)
								const issuance = matchedCollection?.issuance ?? "default-issuance-url"
								const imageUrl = matchedCollection?.image ?? "default-image-url.png"
								const assuranceText = "Unbonding"

								return (
									<ActiveUnbondCard
										key={`${contractAddress}-${tokenId}`}
										tokenId={tokenId}
										imageUrl={imageUrl}
										assuranceText={assuranceText}
										collection={{
											issuance,
											rua: {
												contractAddress,
												issuance
											},
											stakingContract: {
												address: matchedCollection?.stakingContract.address ?? ""
											}
										}}
									/>
								)
							})
						}

						return null
					})}
				</SimpleGrid>
			</Flex>

			{isLoading ? (
				<Center h="22rem" w="full">
					<p>Loading your RUAs...</p>
				</Center>
			) : Object.keys(nftTokensByContract).length === 0 ? (
				<Center w="full" p={4}>
					<p>You have no RUAs.</p>
				</Center>
			) : (
				Object.keys(nftTokensByContract).map((contractAddress) => {
					const rua = ruaList?.find((r) => r.contractAddress === contractAddress)

					if (!rua) {
						console.warn(`No rua found for contract address: ${contractAddress}`)
						return null
					}

					const marketAddress = rua.marketAddress ?? ""
					const swaps = swapsData[marketAddress] || []
					const stakedCount = getStakedVsTotal(rua.contractAddress)
					// eslint-disable-next-line @typescript-eslint/no-unused-vars
					const [staked, total] = stakedCount.split("/").map(Number)
					const hasStakedNFTs = staked > 0
					const stakedVsTotal = getStakedVsTotal(contractAddress)

					return (
						<Flex key={contractAddress} flexDirection="column" w="full" mb={6} align="center">
							<Heading
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
								justifyContent="center"
								bg="rgb(255, 255, 255)"
								color="black"
								pb={3}
								pt={3}
								px={3}
								rounded="0.85rem"
								shadow="md"
								size="md"
								w={{ base: "full", md: "100%" }}
								textAlign="start"
							>
								<HStack w="full" alignItems="center">
									<HStack spacing={2}>
										<Text>{collectionMap[contractAddress]}</Text>
										<Button
											_dark={{
												_disabled: {
													_hover: { bg: "rgba(33, 33, 33, 0.5)" },
													cursor: "not-allowed",
													opacity: 0.5
												},
												_hover: {
													backgroundPosition: "right center",
													filter: "brightness(120%)"
												},
												bgGradient:
													"linear-gradient(to right, #4b6cb7 0%, #182848 51%, #4b6cb7 100%)",
												color: "white"
											}}
											_hover={{ filter: "brightness(120%)" }}
											aria-label="Go to RUA mint page"
											bg="white"
											bgGradient="linear-gradient(to right, #4b6cb7 0%, #182848 51%, #4b6cb7 100%)"
											color="white"
											leftIcon={<BadgesIconRua />}
											onClick={() => {
												navigate(`/rua/${rua.ruaId}`)
											}}
											backgroundSize="200% auto"
											transition="0.5s"
											rounded="0.4em"
											shadow="glowMd"
											size="xs"
											px="1.05rem"
											ml="2rem"
										>
											Market
										</Button>
									</HStack>
									<Spacer />
									<Text fontSize="0.8rem">{stakedVsTotal}</Text>
									<GlowCircle hasStakedNFTs={hasStakedNFTs} />
								</HStack>
							</Heading>

							<SimpleGrid
								columns={{ base: 1, md: 3 }}
								spacing={5}
								w="full"
								mt={3}
								justifyItems="center"
								alignItems="center"
							>
								{nftTokensByContract[contractAddress].map((tokenId) => {
									const tokenSwaps = swaps.filter((swap) => swap.token_id === tokenId)
									const listedSwap = tokenSwaps.find((swap) => swap.swap_type === "Sale")

									return (
										<Flex
											key={tokenId}
											_dark={{
												backdropFilter: "blur(32px)",
												background:
													"linear-gradient(137deg, rgba(143, 143, 143, 0.00) 41.48%, rgba(133, 133, 133, 0.28) 134.85%)",
												border: "1px solid rgba(224, 230, 255, 0.10)",
												color: "white",
												transition: "border-color 0.3s ease"
											}}
											align="center"
											bg="rgb(255, 255, 255)"
											color="black"
											pb={3}
											pt={3}
											px={3}
											rounded="1.25em"
											shadow="md"
											flexDirection="column"
											maxW="20rem"
											justify="center"
										>
											<VStack mb="1rem">
												<img
													src={nftImages[contractAddress]}
													alt={`NFT ${tokenId}`}
													style={{
														borderRadius: "8px",
														height: "5rem",
														marginBottom: "8px",
														width: "5rem"
													}}
												/>
												<VStack justify="start" gap={2} py={0}>
													<HStack justify="center" gap={20} w="full" mb="1rem" position="relative">
														<Text fontSize="0.8rem">RUA ID:{tokenId}</Text>
														<HStack>
															<Text mr="0rem" align="end" fontSize="0.8rem">
																Issuance
															</Text>
															<HiExternalLink
																key={rua.contractAddress}
																onClick={(event) => {
																	event.stopPropagation()
																	handleExternalLinkClick(rua, event)
																}}
																style={{
																	cursor: "pointer",
																	marginLeft: "-0.5rem",
																	marginTop: "0.2rem"
																}}
															/>
														</HStack>
													</HStack>
													<HStack justify="center" w="full">
														<Flex
															style={{
																filter: listedSwap ? "blur(4px)" : "none",
																pointerEvents: listedSwap ? "none" : "auto"
															}}
														>
															<StakeCard
																collection={{
																	marketAddress,
																	stakingContract: {
																		address: rua.stakingContract.address,
																		msg: rua.stakingContract.msg
																	}
																}}
																contractAddress={contractAddress}
																tokenId={tokenId}
															/>
														</Flex>
														{listedSwap ? (
															<SellCardListed
																key={listedSwap.id}
																tokenId={listedSwap.token_id}
																contractAddress={contractAddress}
																marketAddress={marketAddress}
																collection={{
																	marketAddress
																}}
															/>
														) : (
															<SellCard
																tokenId={tokenId}
																contractAddress={contractAddress}
																marketAddress={marketAddress}
																collection={{ marketAddress }}
															/>
														)}
													</HStack>
												</VStack>
											</VStack>
										</Flex>
									)
								})}
							</SimpleGrid>
						</Flex>
					)
				})
			)}
			<Modal isOpen={isModalOpen} onClose={handleModalClose} isCentered>
				<ModalOverlay />
				<ModalContent
					sx={{
						background:
							"linear-gradient(137deg, rgba(143, 143, 143, 0.00) 41.48%, rgba(133, 133, 133, 0.28) 134.85%)", // Customize your gradient colors
						color: "white",
						rounded: "1.25rem"
					}}
				>
					<ModalHeader id="modal-title">Real Utility Asset Agreement</ModalHeader>
					<ModalCloseButton />
					<ModalBody>
						{selectedImage ? (
							<Image src={selectedImage} alt="RUA" />
						) : (
							<Text>No image available</Text>
						)}
					</ModalBody>
					<ModalFooter>
						<Button
							_dark={{
								_hover: {
									backgroundPosition: "right center",
									filter: "brightness(120%)"
								},
								bgGradient: "linear-gradient(to right, #4b6cb7 0%, #182848 51%, #4b6cb7 100%)",
								color: "white"
							}}
							_hover={{ filter: "brightness(120%)" }}
							bg="white"
							bgGradient="linear-gradient(to right, #4b6cb7 0%, #182848 51%, #4b6cb7 100%)"
							color="white"
							backgroundSize="200% auto"
							transition="0.5s"
							rounded="0.4em"
							shadow="glowMd"
							size="xs"
							minW="3rem"
							onClick={handleModalClose}
						>
							Close
						</Button>
					</ModalFooter>
				</ModalContent>
			</Modal>
		</Flex>
	)
}

export default MyRuasPage
