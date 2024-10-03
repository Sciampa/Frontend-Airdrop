import { useExecuteUnstake } from "../hooks/tx/useExecuteUnstake"
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
import React, { useEffect, useState } from "react"
import { HiExternalLink } from "react-icons/hi"

type StakingContract = {
	address: string
}

type Collection = {
	issuance: string
	rua: {
		contractAddress: string
		issuance: string
	}
	stakingContract: StakingContract
}

type ActiveStakedCardProps = {
	assuranceText: string
	collection: Collection
	imageUrl: string
	tokenId: string
}

const ActiveStakedCard: React.FC<ActiveStakedCardProps> = ({
	collection,
	tokenId,
	imageUrl,
	assuranceText
}) => {
	const { stakingContract, rua } = collection
	const { mutate: executeUnstake } = useExecuteUnstake({ stakingContract })
	const [selectedImage, setSelectedImage] = useState<string>("")
	const [isModalOpen, setIsModalOpen] = useState(false)
	const [countdown, setCountdown] = useState<{
		days: number
		hours: number
		minutes: number
		seconds: number
	}>({ days: 30, hours: 0, minutes: 0, seconds: 0 })

	useEffect(() => {
		const calculateTimeLeft = () => {
			const now = new Date()

			const firstOfNextMonth = new Date(now.getFullYear(), now.getMonth(), 1)
			const targetDate = new Date(firstOfNextMonth.getTime() + 30 * 24 * 60 * 60 * 1_000)
			const timeDifference = targetDate.getTime() - now.getTime()

			if (timeDifference <= 0) {
				setCountdown({ days: 30, hours: 0, minutes: 0, seconds: 0 })
			} else {
				const days = Math.floor(timeDifference / (1_000 * 60 * 60 * 24))
				const hours = Math.floor((timeDifference % (1_000 * 60 * 60 * 24)) / (1_000 * 60 * 60))
				const minutes = Math.floor((timeDifference % (1_000 * 60 * 60)) / (1_000 * 60))
				const seconds = Math.floor((timeDifference % (1_000 * 60)) / 1_000)

				setCountdown({ days, hours, minutes, seconds })
			}
		}

		calculateTimeLeft()
		const timer = setInterval(calculateTimeLeft, 1_000)

		return () => clearInterval(timer)
	}, [])

	const handleModalClose = () => {
		setIsModalOpen(false)
		setSelectedImage("")
	}

	const handleUnstake = () => {
		executeUnstake({
			collection: {
				stakingContract: {
					address: stakingContract.address
				}
			},
			tokenIds: [tokenId]
		})
	}

	// eslint-disable-next-line @typescript-eslint/no-shadow
	const handleExternalLinkClick = (collection: { issuance: string }, event: React.MouseEvent) => {
		event.stopPropagation()
		const issuanceUrl = collection.issuance
		setSelectedImage(issuanceUrl)
		setIsModalOpen(true)
	}

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
								{assuranceText}
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
							<Text fontSize="0.8rem">Dividends Distribution In:</Text>
							<Text fontWeight="bold">{`${countdown.days} | ${countdown.hours} | ${countdown.minutes} | ${countdown.seconds}`}</Text>
							<Text fontSize="0.8rem">Current Dividend Earned</Text>
							<Text fontWeight="bold">$236,87</Text>
						</Flex>
					</HStack>
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
						minW="4rem"
						mt="1rem"
						mb="-1rem"
						onClick={handleUnstake}
					>
						Stop earning
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

export default ActiveStakedCard
