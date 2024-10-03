/* eslint-disable import/no-named-as-default */
/* eslint-disable no-negated-condition */
/* eslint-disable no-console */
import FetchedListedData from "../hooks/query/useFetchedListedData"
// import useExecuteAccept from "../hooks/tx/useExecuteAccept"
import useExecuteCancel from "../hooks/tx/useExecuteCancel"
import { Button, Flex, HStack, Text, VStack } from "@chakra-ui/react"
import { useState } from "react"

type SellCardProps = {
	collection: {
		marketAddress: string
	}
	contractAddress: string
	marketAddress: string
	tokenId: string
}

const SellCardListed = ({ contractAddress, marketAddress, tokenId, collection }: SellCardProps) => {
	// const [isFlipped, setIsFlipped] = useState(false)
	const [highestPrice, setHighestPrice] = useState<number | null>(null)
	const [highestOffer, setHighestOffer] = useState<number | null>(null)
	// const { mutate: executeAccept } = useExecuteAccept({ collection })
	const { mutate: executeCancel } = useExecuteCancel({ collection })

	const handleHighestPriceUpdate = (price: number | null) => {
		setHighestPrice(price)
	}

	const handleHighestOfferUpdate = (offer: number | null) => {
		setHighestOffer(offer)
	}

	// const handleAccept = async () => {
	//	try {
	// Update to only use parameters that exist in ExecuteSellParameters
	//		executeAccept({
	//			currentId: tokenId, // Assuming you want to pass the tokenId as currentId
	//			marketAddress, // marketAddress from props
	//			maxPrice: highestPrice ?? 0, // Example: use the highest price or a default
	//			nftContract: contractAddress, // Use contractAddress here as your NFT contract address
	//			tokenId // Keep tokenId as is
	//		})
	//		console.log("Accept action executed successfully.")
	//	} catch (error) {
	//		console.error("Error executing accept action:", error)
	//	}
	// }

	const handleCancel = async () => {
		try {
			executeCancel({
				currentId: tokenId,
				marketAddress,
				maxPrice: highestPrice ?? 0,
				nftContract: contractAddress,
				tokenId
			})
		} catch (error) {
			console.error("Error executing accept action:", error)
		}
	}

	return (
		<Flex
			sx={{ perspective: "1000px" }}
			align="center"
			justify="center"
			h="8rem"
			w="9rem"
			mt="-0.5rem"
		>
			<FetchedListedData
				marketAddress={marketAddress}
				tokenId={tokenId}
				onHighestPriceUpdate={handleHighestPriceUpdate}
				onHighestOfferUpdate={handleHighestOfferUpdate}
			/>
			<Flex position="relative" w="100%" h="100%" sx={{ transformStyle: "preserve-3d" }}>
				<Flex
					position="absolute"
					sx={{ backfaceVisibility: "hidden" }}
					align="center"
					justify="center"
					flexDirection="column"
					h="100%"
					w="100%"
					bg="white"
					color="black"
					rounded="1.25em"
					shadow="md"
					_dark={{
						backdropFilter: "blur(32px)",
						background:
							"linear-gradient(137deg, rgba(143, 143, 143, 0.00) 41.48%, rgba(133, 133, 133, 0.28) 134.85%)",
						border: "1px solid rgba(224, 230, 255, 0.10)",
						color: "white"
					}}
				>
					<VStack justify="space-between" gap={1}>
						<Flex
							align="center"
							justify="center"
							flexDirection="column"
							w="8rem"
							h="4.5rem"
							bg="rgb(255, 255, 255)"
							color="black"
							rounded="1.25em"
							shadow="md"
							_dark={{
								backdropFilter: "blur(32px)",
								background:
									"linear-gradient(137deg, rgba(143, 143, 143, 0.00) 41.48%, rgba(133, 133, 133, 0.28) 134.85%)",
								border: "1px solid rgba(224, 230, 255, 0.10)",
								color: "white"
							}}
						>
							<Text align="center" fontSize="0.7rem" w="full">
								Actual floor price
							</Text>
							<Text mt="-0.2rem" align="center" fontSize="0.7rem" fontWeight="bold" w="full">
								{highestOffer !== null ? (highestOffer / 1_000_000).toFixed(3) : "No floor.."} NTRN
							</Text>
							<Text align="center" fontSize="0.7rem" w="full">
								Your listed price
							</Text>
							<Text mt="-0.2rem" align="center" fontSize="0.7rem" fontWeight="bold" w="full">
								{highestPrice !== null ? (highestPrice / 1_000_000).toFixed(3) : "Loading..."} NTRN
							</Text>
						</Flex>
						<HStack>
							<Button
								_dark={{
									_hover: {
										backgroundPosition: "right center",
										filter: "brightness(120%)"
									},
									bgGradient: "linear-gradient(to right, #7e0000 0%, #3c0000 51%, #7e0000 100%)",
									color: "white"
								}}
								_hover={{ filter: "brightness(120%)" }}
								bg="white"
								bgGradient="linear-gradient(to right, #7e0000 0%, #3c0000 51%, #7e0000 100%)"
								color="white"
								backgroundSize="200% auto"
								transition="0.5s"
								rounded="0.4em"
								shadow="glowMd"
								size="xs"
								minW="3.5rem"
								onClick={handleCancel}
								mt="0.5rem"
							>
								Cancel listing
							</Button>
							{/*	<Button
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
								minW="3.5rem"
								//	onClick={handleAccept}

								mt="0.5rem"
							>
								Accept
							</Button>
							*/}
						</HStack>
					</VStack>
				</Flex>
			</Flex>
		</Flex>
	)
}

export default SellCardListed
