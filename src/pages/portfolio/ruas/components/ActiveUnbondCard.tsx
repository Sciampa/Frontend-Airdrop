import { useFetchedReleaseCountdownData } from "../hooks/query/UnbondCountdown"
import { useExecuteClaim } from "../hooks/tx/useExecuteClaim"
import {
	Button,
	Flex,
	HStack,
	Image,
	Modal,
	ModalBody,
	ModalCloseButton,
	ModalContent,
	ModalFooter,
	ModalHeader,
	ModalOverlay,
	Text,
	VStack
} from "@chakra-ui/react"
import React, { useState } from "react"
import { HiExternalLink } from "react-icons/hi"

type StakingContract = {
	address: string
}

type Collection = {
	issuance: string
	rua: {
		contractAddress: string
		issuance: string // Add other properties as needed
	}
	stakingContract: StakingContract
	// Include any other relevant fields from your collection structure
}

type ActiveUnbondCardProps = {
	assuranceText: string
	collection: Collection
	imageUrl: string
	tokenId: string
}

const ActiveUnbondCard: React.FC<ActiveUnbondCardProps> = ({
	collection,
	tokenId,
	imageUrl,
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	assuranceText
}) => {
	const { stakingContract, rua } = collection
	const { mutate: executeClaim } = useExecuteClaim({ stakingContract })
	const [countdown, setCountdown] = useState<string | null>(null)
	const [selectedImage, setSelectedImage] = useState<string>("")
	const [isModalOpen, setIsModalOpen] = useState(false) // State for modal

	const handleModalClose = () => {
		setIsModalOpen(false)
		setSelectedImage("") // Reset selected image
	}

	// eslint-disable-next-line @typescript-eslint/no-shadow
	const handleExternalLinkClick = (collection: { issuance: string }, event: React.MouseEvent) => {
		event.stopPropagation()
		const issuanceUrl = collection.issuance
		setSelectedImage(issuanceUrl)
		setIsModalOpen(true)
	}

	const countdownValue = useFetchedReleaseCountdownData({
		onReleaseCountdownUpdate: setCountdown,
		stakingContractAddress: stakingContract.address,
		tokenId
	})

	const handleClaim = () => {
		executeClaim({
			collection: {
				stakingContract: {
					address: stakingContract.address
				}
			},
			tokenIds: [tokenId]
		})
	}

	const isButtonDisabled = countdown !== null && Number.parseFloat(countdown) > 0

	return (
		<Flex
			key={`Token ID #${tokenId}`}
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
			maxW="16rem"
		>
			<VStack mb="1rem">
				<img
					src={imageUrl}
					alt={`Token ID #${tokenId}`}
					style={{
						borderRadius: "8px",
						height: "5rem",
						marginBottom: "0rem",
						width: "5rem"
					}}
				/>
				<VStack justify="start" gap={0} py={0}>
					<HStack justify="center" gap={20} w="full" mb="0.5rem" position="relative">
						<Text fontSize="0.8rem">RUA ID #{tokenId}</Text>
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
							align="center"
							justify="center"
							flexDirection="column"
							w="14rem"
							h="7rem"
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
							{/* Render the countdown text */}
							<VStack align="center" w="full">
								<h1>Claimable in</h1>
								{countdownValue ? (
									<Text fontWeight="bold">{countdownValue}</Text>
								) : (
									<Text>No countdown available</Text>
								)}
							</VStack>
						</Flex>
					</HStack>
					<Button
						_dark={{
							// Styles for dark mode
							_hover: {
								backgroundPosition: "right center",
								filter: "brightness(120%)"
							},
							bg: isButtonDisabled
								? "gray.400"
								: "linear-gradient(to right, #7e0000 0%, #3c0000 51%, #7e0000 100%)", // Gray in dark mode when disabled
							color: isButtonDisabled ? "gray.600" : "white" // Gray text when disabled
						}}
						_hover={{ filter: "brightness(120%)" }}
						bg={isButtonDisabled ? "gray.400" : "green.500"} // Green when enabled
						color={isButtonDisabled ? "gray.600" : "white"} // Gray text when disabled
						backgroundSize="200% auto"
						transition="0.5s"
						rounded="0.4em"
						shadow="glowMd"
						size="xs"
						minW="4rem"
						mt="1rem"
						mb="-1rem"
						onClick={handleClaim}
						isDisabled={isButtonDisabled} // Disable the button while countdown is active
					>
						{isButtonDisabled ? `Claimable soon` : "Claimable"}
					</Button>
				</VStack>
			</VStack>
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

export default ActiveUnbondCard
