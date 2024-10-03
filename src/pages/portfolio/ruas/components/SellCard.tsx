import { useExecuteSell } from "../hooks/useExecuteSell"
import SellCardForm from "./SellCardForm"
import { InfoIcon } from "@chakra-ui/icons"
import { Box, Button, Flex, HStack, Icon, Input, Text, Tooltip, VStack } from "@chakra-ui/react"
import { useState } from "react"

type SellCardProps = {
	collection: {
		marketAddress: string
	}
	contractAddress: string
	marketAddress: string
	tokenId: string
}

const SellCard = ({ contractAddress, marketAddress, tokenId, collection }: SellCardProps) => {
	const [isFlipped, setIsFlipped] = useState(false)
	const [maxPrice, setMaxPrice] = useState("")
	const { mutate: executeSell } = useExecuteSell({ collection })

	// eslint-disable-next-line id-length, unicorn/prevent-abbreviations
	const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setMaxPrice(e.target.value)
	}

	const handleFlip = () => {
		setIsFlipped((previous) => !previous)
	}

	const handleConfirm = () => {
		// Parse the price entered by the user
		const numericMaxPrice = Number.parseFloat(maxPrice)

		if (!maxPrice) {
			return
		}

		if (!marketAddress || !contractAddress) {
			// eslint-disable-next-line no-console
			console.error("Market Address or Contract Address is undefined")
			return
		}

		executeSell({
			currentId: "",
			marketAddress,
			maxPrice: numericMaxPrice,
			nftContract: contractAddress,
			tokenId
		})
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
			<Flex
				position="relative"
				w="100%"
				h="100%"
				transition="transform 0.6s"
				transform={isFlipped ? "rotateY(180deg)" : "rotateY(0deg)"}
				sx={{ transformStyle: "preserve-3d" }}
			>
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
							<Text>Net worth</Text>
							<Text fontWeight="bold">$685.76</Text>
						</Flex>
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
							minW="4rem"
							onClick={handleFlip}
							mt="0.5rem"
						>
							List for sale
						</Button>
					</VStack>
				</Flex>
				<Flex
					position="absolute"
					sx={{ backfaceVisibility: "hidden" }}
					transform="rotateY(180deg)"
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
					<SellCardForm />
					<HStack spacing={0} position="relative">
						<Flex position="relative" width="100%" align="center" justify="center">
							<Input
								type="number"
								placeholder="Enter price"
								width="80%"
								maxWidth="full"
								borderRadius="0.5rem"
								size="xs"
								value={maxPrice}
								onChange={handlePriceChange}
								mb="0.7rem"
								pr="2rem"
								_placeholder={{ color: "gray.500" }}
							/>
							<Box
								position="absolute"
								right="1.5rem"
								top="35%"
								transform="translateY(-50%)"
								color="white"
								fontSize="xs"
								whiteSpace="nowrap"
							>
								NTRN
							</Box>
							<Tooltip
								label={
									<div>
										<p>10% will be applied to this amount</p>
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
								<Icon
									as={InfoIcon}
									boxSize={2}
									position="relative"
									right="-0.12rem"
									mt="-1.5rem"
									transform="translateY(-50%)"
									cursor="pointer"
									zIndex={1}
								/>
							</Tooltip>
						</Flex>
					</HStack>
					<HStack>
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
							onClick={handleFlip}
						>
							Back
						</Button>
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
							onClick={handleConfirm}
						>
							Confirm
						</Button>
					</HStack>
				</Flex>
			</Flex>
		</Flex>
	)
}

export default SellCard
