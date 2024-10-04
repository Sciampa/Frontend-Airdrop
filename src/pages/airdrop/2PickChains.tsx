/* eslint-disable no-console */
/* eslint-disable complexity */
/* eslint-disable no-negated-condition */
/* eslint-disable eslint-comments/disable-enable-pair */
import Akashwallet from "../../components/ConnectButtonAkash"
import Celestiawallet from "../../components/ConnectButtonCelestia"
import Cosmoshubwallet from "../../components/ConnectButtonCosmoshub"
import Dydxwallet from "../../components/ConnectButtonDydx"
import Dymensionwallet from "../../components/ConnectButtonDymension"
import Junowallet from "../../components/ConnectButtonJuno"
import Noblewallet from "../../components/ConnectButtonNoble"
import Osmosiswallet from "../../components/ConnectButtonOsmosis"
import Seiwallet from "../../components/ConnectButtonSei"
import Stridewallet from "../../components/ConnectButtonStride"
import AkashDelegate from "./components/getAkash/getAkashDelegate"
import AkashIBCreceived from "./components/getAkash/getAkashIBCreceived"
import AkashIBCtransfer from "./components/getAkash/getAkashIBCtransfer"
import AkashRewards from "./components/getAkash/getAkashRewards"
import AkashUndelegate from "./components/getAkash/getAkashUndelegate"
import AkashVotes from "./components/getAkash/getAkashVotes"
import CelestiaDelegate from "./components/getCelestia/getCelestiaDelegate"
import CelestiaIBCreceived from "./components/getCelestia/getCelestiaIBCreceived"
import CelestiaIBCtransfer from "./components/getCelestia/getCelestiaIBCtransfer"
import CelestiaRewards from "./components/getCelestia/getCelestiaRewards"
import CelestiaUndelegate from "./components/getCelestia/getCelestiaUndelegate"
import CelestiaVotes from "./components/getCelestia/getCelestiaVotes"
import CosmosDelegate from "./components/getCosmos/getCosmosDelegate"
import CosmosIBCreceived from "./components/getCosmos/getCosmosIBCreceived"
import CosmosIBCtransfer from "./components/getCosmos/getCosmosIBCtransfer"
import CosmosRewards from "./components/getCosmos/getCosmosRewards"
import CosmosUndelegate from "./components/getCosmos/getCosmosUndelegate"
import CosmosVotes from "./components/getCosmos/getCosmosVotes"
import { useCosmosTotalParticles } from "./components/getCosmos/getTotalParticles"
import DydxDelegate from "./components/getDydx/getDydxDelegate"
import DydxIBCreceived from "./components/getDydx/getDydxIBCreceived"
import DydxIBCtransfer from "./components/getDydx/getDydxIBCtransfer"
import DydxRewards from "./components/getDydx/getDydxRewards"
import DydxUndelegate from "./components/getDydx/getDydxUndelegate"
import DydxVotes from "./components/getDydx/getDydxVotes"
import DymensionDelegate from "./components/getDymension/getDymensionDelegate"
import DymensionIBCreceived from "./components/getDymension/getDymensionIBCreceived"
import DymensionIBCtransfer from "./components/getDymension/getDymensionIBCtransfer"
import DymensionRewards from "./components/getDymension/getDymensionRewards"
import DymensionUndelegate from "./components/getDymension/getDymensionUndelegate"
import DymensionVotes from "./components/getDymension/getDymensionVotes"
import JunoDelegate from "./components/getJuno/getJunoDelegate"
import JunoIBCreceived from "./components/getJuno/getJunoIBCreceived"
import JunoIBCtransfer from "./components/getJuno/getJunoIBCtransfer"
import JunoRewards from "./components/getJuno/getJunoRewards"
import JunoUndelegate from "./components/getJuno/getJunoUndelegate"
import JunoVotes from "./components/getJuno/getJunoVotes"
import NobleBonders from "./components/getNoble/getNobleBonders"
import OsmosisDelegate from "./components/getOsmosis/getOsmosisDelegate"
import OsmosisIBCreceived from "./components/getOsmosis/getOsmosisIBCreceived"
import OsmosisIBCtransfer from "./components/getOsmosis/getOsmosisIBCtransfer"
import OsmosisRewards from "./components/getOsmosis/getOsmosisRewards"
import OsmosisUndelegate from "./components/getOsmosis/getOsmosisUndelegate"
import OsmosisVotes from "./components/getOsmosis/getOsmosisVotes"
import SeiDelegate from "./components/getSei/getSeiDelegate"
import SeiIBCreceived from "./components/getSei/getSeiIBCreceived"
import SeiIBCtransfer from "./components/getSei/getSeiIBCtransfer"
import SeiRewards from "./components/getSei/getSeiRewards"
import SeiUndelegate from "./components/getSei/getSeiUndelegate"
import SeiVotes from "./components/getSei/getSeiVotes"
import StrideIBCtransfer from "./components/getStride/getStrideIBCtransfer"
import StrideLSatom from "./components/getStride/getStrideLSatom"
import StrideLSdym from "./components/getStride/getStrideLSdym"
import StrideLSosmo from "./components/getStride/getStrideLSosmo"
import StrideLStia from "./components/getStride/getStrideLStia"
import StrideStakers from "./components/getStride/getStrideStakers"
import { PortfolioSummary } from "./components/PortfolioSummary"
import { ChevronDownIcon, ChevronUpIcon } from "@chakra-ui/icons"
import {
	Box,
	Button,
	Collapse,
	Divider,
	Flex,
	Heading,
	HStack,
	IconButton,
	Image,
	SimpleGrid,
	Skeleton,
	Text,
	useColorModeValue,
	VStack
} from "@chakra-ui/react"
import { useChain } from "@cosmos-kit/react"
import { keyframes } from "@emotion/react"
import { useTokenBalance } from "@hooks/tokens/query/useTokenBalance"
import { convertMicroDenomToDenom } from "@utils/tokens/helpers"
import shortenNumber from "@utils/ui/shortenNumber"
import { motion } from "framer-motion"
import { useEffect, useState } from "react"
import truncateAddress from "utils/ui/truncateAddress"

const gradientAnimation = keyframes`
  0% {
    background-position: 0% 50%;
  }
  50% {
    background-position: 100% 50%;
  }
  100% {
    background-position: 0% 50%;
  }
`

type PickchainsProps = {
	connect: () => void
	onNext: () => void
	onPrev: () => void
}

type ImageData = {
	id: string
	src: string
	text: string
}

const Pickchains: React.FC<PickchainsProps> = ({ onPrev }) => {
	const { address, isWalletConnected } = useChain(import.meta.env.VITE_NEUTRONNETWORK)
	const [selectionMade, setSelectionMade] = useState(false)
	const [isVisible, setIsVisible] = useState(true)
	const [isNobleSelected, setIsNobleSelected] = useState(false)
	const [isCelestiaSelected, setIsCelestiaSelected] = useState(false)
	const [isCosmoshubSelected, setIsCosmoshubSelected] = useState(false)
	const [isDydxSelected, setIsDydxSelected] = useState(false)
	const [isDymensionSelected, setIsDymensionSelected] = useState(false)
	const [isJunoSelected, setIsJunoSelected] = useState(false)
	const [isAkashSelected, setIsAkashSelected] = useState(false)
	const [isOsmosisSelected, setIsOsmosisSelected] = useState(false)
	const [isSeiSelected, setIsSeiSelected] = useState(false)
	const [isStrideSelected, setIsStrideSelected] = useState(false)
	const [EleBalance] = useTokenBalance("factory/neutron13r3st22qa04c8q0d6elg4eyc55vcyrdhgcjm9f/ELE")
	const [ParticleBalance] = useTokenBalance(
		"factory/neutron14n0asvvxcks0x3t88chhhwzeesckekt5tvsc26/PARTICLE"
	)
	const [selectionCount, setSelectionCount] = useState(0)
	const [nextButtonClicked, setNextButtonClicked] = useState(false)
	const [isNobleExpanded, setIsNobleExpanded] = useState(false)
	const [isCelestiaExpanded, setIsCelestiaExpanded] = useState(false)
	const [isCosmoshubExpanded, setIsCosmoshubExpanded] = useState(false)
	const [isDydxExpanded, setIsDydxExpanded] = useState(false)
	const [isDymensionExpanded, setIsDymensionExpanded] = useState(false)
	const [isJunoExpanded, setIsJunoExpanded] = useState(false)
	const [isAkashExpanded, setIsAkashExpanded] = useState(false)
	const [isOsmosisExpanded, setIsOsmosisExpanded] = useState(false)
	const [isSeiExpanded, setIsSeiExpanded] = useState(false)
	const [isStrideExpanded, setIsStrideExpanded] = useState(false)

	const [isBoxSelected, setIsBoxSelected] = useState<{ [key: string]: boolean }>({
		"1": false,
		"2": false,
		"3": false,
		"4": false,
		"5": false,
		"6": false,
		"7": false,
		"8": false,
		"9": false,
		"10": false
	})
	// eslint-disable-next-line @typescript-eslint/ban-ts-comment, @typescript-eslint/no-unused-vars
	const [disabledBoxes, setDisabledBoxes] = useState<string[]>([
		"1",
		"2",
		"4",
		"5",
		"6",
		"7",
		"8",
		"9",
		"10"
	])

	const areChainsSelected =
		isAkashSelected ||
		isCelestiaSelected ||
		isCosmoshubSelected ||
		isDydxSelected ||
		isDymensionSelected ||
		isJunoSelected ||
		isNobleSelected ||
		isOsmosisSelected ||
		isSeiSelected ||
		isStrideSelected

	const toggleNoble = () => setIsNobleExpanded(!isNobleExpanded)
	const toggleCelestia = () => setIsCelestiaExpanded(!isCelestiaExpanded)
	const toggleCosmoshub = () => setIsCosmoshubExpanded(!isCosmoshubExpanded)
	const toggleDydx = () => setIsDydxExpanded(!isDydxExpanded)
	const toggleDymension = () => setIsDymensionExpanded(!isDymensionExpanded)
	const toggleJuno = () => setIsJunoExpanded(!isJunoExpanded)
	const toggleAkash = () => setIsAkashExpanded(!isAkashExpanded)
	const toggleOsmosis = () => setIsOsmosisExpanded(!isOsmosisExpanded)
	const toggleSei = () => setIsSeiExpanded(!isSeiExpanded)
	const toggleStride = () => setIsStrideExpanded(!isStrideExpanded)
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	const { totalParticles, dividedParticles } = useCosmosTotalParticles()

	const { connect } = useChain("akash")

	const [pressed, setPressed] = useState(false)

	const handleClick = () => {
		setPressed(true)
		void connect() // Call the connect function from useChain
	}

	const handleImageClick = (id: string) => {
		if (id === "1") {
			setIsNobleSelected(!isNobleSelected)
			setIsBoxSelected({ ...isBoxSelected, "1": !isNobleSelected })
			if (!isNobleSelected) {
				setSelectionCount(selectionCount + 1)
			} else {
				setSelectionCount(selectionCount - 1)
			}
		} else if (id === "2") {
			setIsCelestiaSelected(!isCelestiaSelected)
			setIsBoxSelected({ ...isBoxSelected, "2": !isCelestiaSelected })
			if (!isCelestiaSelected) {
				setSelectionCount(selectionCount + 1)
			} else {
				setSelectionCount(selectionCount - 1)
			}
		} else if (id === "3") {
			setIsCosmoshubSelected(!isCosmoshubSelected)
			setIsBoxSelected({ ...isBoxSelected, "3": !isCosmoshubSelected })
			if (!isCosmoshubSelected) {
				setSelectionCount(selectionCount + 1)
			} else {
				setSelectionCount(selectionCount - 1)
			}
		} else if (id === "4") {
			setIsDydxSelected(!isDydxSelected)
			setIsBoxSelected({ ...isBoxSelected, "4": !isDydxSelected })
			if (!isDydxSelected) {
				setSelectionCount(selectionCount + 1)
			} else {
				setSelectionCount(selectionCount - 1)
			}
		} else if (id === "5") {
			setIsDymensionSelected(!isDymensionSelected)
			setIsBoxSelected({ ...isBoxSelected, "5": !isDymensionSelected })
			if (!isDymensionSelected) {
				setSelectionCount(selectionCount + 1)
			} else {
				setSelectionCount(selectionCount - 1)
			}
		} else if (id === "6") {
			setIsJunoSelected(!isJunoSelected)
			setIsBoxSelected({ ...isBoxSelected, "6": !isJunoSelected })
			if (!isJunoSelected) {
				setSelectionCount(selectionCount + 1)
			} else {
				setSelectionCount(selectionCount - 1)
			}
		} else if (id === "7") {
			setIsAkashSelected(!isAkashSelected)
			setIsBoxSelected({ ...isBoxSelected, "7": !isAkashSelected })
			if (!isAkashSelected) {
				setSelectionCount(selectionCount + 1)
			} else {
				setSelectionCount(selectionCount - 1)
			}
		} else if (id === "8") {
			setIsOsmosisSelected(!isOsmosisSelected)
			setIsBoxSelected({ ...isBoxSelected, "8": !isOsmosisSelected })
			if (!isOsmosisSelected) {
				setSelectionCount(selectionCount + 1)
			} else {
				setSelectionCount(selectionCount - 1)
			}
		} else if (id === "9") {
			setIsSeiSelected(!isSeiSelected)
			setIsBoxSelected({ ...isBoxSelected, "9": !isSeiSelected })
			if (!isSeiSelected) {
				setSelectionCount(selectionCount + 1)
			} else {
				setSelectionCount(selectionCount - 1)
			}
		} else if (id === "10") {
			setIsStrideSelected(!isStrideSelected)
			setIsBoxSelected({ ...isBoxSelected, "10": !isStrideSelected })
			if (!isStrideSelected) {
				setSelectionCount(selectionCount + 1)
			} else {
				setSelectionCount(selectionCount - 1)
			}
		}
	}

	useEffect(() => {
		// If at least one selection is made, set selectionMade to true
		setSelectionMade(selectionCount > 0)
	}, [selectionCount])

	const handleSelectionMade = () => {
		// Check if at least one ID is selected
		return (
			isNobleSelected ||
			isCelestiaSelected ||
			isCosmoshubSelected ||
			isDydxSelected ||
			isDymensionSelected ||
			isJunoSelected ||
			isAkashSelected ||
			isOsmosisSelected ||
			isSeiSelected ||
			isStrideSelected
		)
	}

	const handleNextClick = () => {
		// Check if at least one ID is selected before setting isVisible to false
		if (handleSelectionMade()) {
			setIsVisible(false) // Allow setting isVisible to false
		} else {
			// Handle case when no IDs are selected
			// eslint-disable-next-line eslint-comments/no-duplicate-disable
			// eslint-disable-next-line no-console
			console.log("Please select at least one Chain before proceeding.")
		}

		setNextButtonClicked(false)
	}

	const images: ImageData[] = [
		{ id: "1", src: "/assets/tokens/airdrop/noble.png", text: "Neutron" },
		{ id: "2", src: "/assets/tokens/airdrop/celestia.png", text: "Celestia" },
		{ id: "3", src: "/assets/tokens/airdrop/cosmoshub.png", text: "Cosmoshub" },
		{ id: "4", src: "/assets/tokens/airdrop/dydx.svg", text: "Dydx" },
		{ id: "5", src: "/assets/tokens/airdrop/dymension.png", text: "Dymension" },
		{ id: "6", src: "/assets/tokens/airdrop/juno.png", text: "Juno" },
		{ id: "7", src: "/assets/tokens/airdrop/akash.png", text: "Akash" },
		{ id: "8", src: "/assets/tokens/airdrop/osmosis.png", text: "Osmosis" },
		{ id: "9", src: "/assets/tokens/airdrop/sei.png", text: "Sei" },
		{ id: "10", src: "/assets/tokens/airdrop/stride.png", text: "Stride+LSassets" }
	]

	const rows = []
	if (images.length > 0) {
		// Add the first row with one larger image
		rows.push([images[0]])
	}

	for (let index = 1; index < Math.min(images.length, 10); index += 3) {
		rows.push(images.slice(index, index + 3))
	}

	return (
		<Flex
			animate={{ opacity: 1 }}
			as={motion.main}
			exit={{ opacity: 0 }}
			flexDirection="column"
			gap={2}
			h="full"
			mt={-4}
			initial={{ opacity: 0 }}
			p={{ base: 5, lg: 24, md: 16 }}
			w="full"
			justifyContent="center"
		>
			<Heading fontWeight="600" textColor={useColorModeValue("black", "white")}>
				Verify Eligibility
			</Heading>
			<Flex
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
				textColor={useColorModeValue("black", "white")}
				flexDir="column"
				px={2}
				py={3}
				bg="rgb(255, 255, 255)"
				rounded="1.25em"
				shadow="md"
				w="full"
				maxW="5xl"
				justifyContent="space-between"
				mt="1rem"
			>
				{isVisible && (
					<Flex
						bgGradient="linear(rgba(33, 33, 33, 0.9))"
						flexDir="column"
						px={5}
						py={3}
						rounded="1.25em"
						shadow="md"
						w="full"
						maxW="100%"
					>
						<HStack w="full">
							<Text
								fontFamily="body"
								fontSize={{ base: "0.6rem", md: "0.7rem" }}
								fontWeight="600"
								textAlign="center"
								w="full"
								alignItems="start"
							>
								Ready to claim your $ELE? Safely connect the wallet used for your Electron
								interactions or the one holding/staking eligible Cosmos tokens. Reminder: A secure
								connection is essential to successfully claim your $ELE. We prioritize your security
								and privacy every step of the way.
							</Text>
						</HStack>
					</Flex>
				)}
				<Flex
					bgGradient="linear(rgba(33, 33, 33, 0.9))"
					flexDir="column"
					px={5}
					py={3}
					rounded="1.25em"
					shadow="md"
					w="full"
					maxW="100%"
				>
					{isVisible && (
						<HStack w="full" justifyContent="center">
							<VStack spacing={4}>
								{rows.map((row, rowIndex) => (
									// eslint-disable-next-line react/no-array-index-key
									<HStack key={rowIndex} spacing={2} justifyContent="center">
										{row.map((image, imageIndex) => (
											<Box
												key={image.id}
												onClick={() => {
													if (!disabledBoxes.includes(image.id)) {
														handleImageClick(image.id)
													}
												}}
												border="0.5px solid"
												borderRadius="md"
												p={2}
												cursor={disabledBoxes.includes(image.id) ? "not-allowed" : "pointer"}
												w={
													rowIndex === 0 && imageIndex === 0
														? { base: "10em", md: "307px" }
														: { base: "5em", md: "153.5px" }
												}
												h={{ base: "4em", md: "80px" }}
												opacity={isBoxSelected[image.id] ? 0.9 : 0.4}
												display="flex"
												flexDirection="column"
												alignItems="center"
												justifyContent="space-between"
												borderBottom={
													disabledBoxes.includes(image.id) ? "1px solid red" : "1px solid white"
												}
												borderTop={
													disabledBoxes.includes(image.id) ? "1px solid red" : "1px solid white"
												}
												borderLeft={
													disabledBoxes.includes(image.id) ? "1px solid red" : "1px solid white"
												}
												borderRight={
													disabledBoxes.includes(image.id) ? "1px solid red" : "1px solid white"
												}
											>
												<Image
													src={image.src}
													boxSize={rowIndex === 0 && imageIndex === 0 ? "160px" : "80px"}
													w={
														rowIndex === 0 && imageIndex === 0
															? { base: "1.8em", md: "2.5em" }
															: { base: "1.8em", md: "2em" }
													}
													h={
														rowIndex === 0 && imageIndex === 0
															? { base: "1.8em", md: "2.5em" }
															: { base: "1.8em", md: "2em" }
													}
													mr="0px"
													opacity={0.9}
												/>
												<Text fontSize={{ base: "10px", md: "1em" }}>{image.text}</Text>
											</Box>
										))}
									</HStack>
								))}
							</VStack>
						</HStack>
					)}
					{!isVisible && areChainsSelected && (
						<Flex alignItems="center" justifyContent="space-between">
							<Text
								fontFamily="body"
								fontSize={{ base: "0.6rem", md: "sm" }}
								fontWeight="900"
								position="relative"
								textAlign="left"
								w="full"
								alignItems="start"
								mr={0}
							>
								Chains
							</Text>
							<Text
								fontFamily="body"
								fontSize={{ base: "0.6rem", md: "sm" }}
								fontWeight="900"
								position="relative"
								w="full"
								alignItems="center"
								mr={{ base: "0em", md: "0em" }}
							>
								Wallets
							</Text>
							{pressed ? (
								<Button
									variant="outline"
									h={{ base: "1.8rem", md: "2rem" }}
									px={1}
									position="relative"
									fontSize={{ base: "0.5rem", md: "1rem" }}
									rounded="0.7em"
									colorScheme="blue" // Change color or any other property as needed
									onClick={() => console.log("Another action")}
									mt={0}
									pos="relative"
									w={{ base: "130%", md: "23%" }}
									shadow="rgba(59, 130, 246, 0.42) 0px 0px 10px, rgba(255, 255, 255, 0.2) 0px 1px 0px inset, rgba(0, 0, 0, 0.15) 0px -3px 0px inset, rgb(59, 130, 246) 0px 0px 7px inset"
								>
									Claim
								</Button>
							) : (
								<Button
									variant="outline"
									h={{ base: "1.8rem", md: "2rem" }}
									px={1}
									position="relative"
									fontSize={{ base: "0.5rem", md: "1rem" }}
									rounded="0.7em"
									colorScheme="blue"
									onClick={handleClick}
									mt={0}
									pos="relative"
									w={{ base: "130%", md: "23%" }}
									shadow="rgba(59, 130, 246, 0.42) 0px 0px 10px, rgba(255, 255, 255, 0.2) 0px 1px 0px inset, rgba(0, 0, 0, 0.15) 0px -3px 0px inset, rgb(59, 130, 246) 0px 0px 7px inset"
								>
									Check
								</Button>
							)}
						</Flex>
					)}
				</Flex>

				{/* Neutron activity */}
				{!isVisible && areChainsSelected && (
					<Flex
						key="noble"
						bgGradient="linear(rgba(33, 33, 33, 0.9))"
						flexDir="column"
						px={5}
						py={3}
						rounded="1.25em"
						shadow="md"
						w="full"
						maxW="100%"
						display={isNobleSelected ? "flex" : "none"}
					>
						<HStack w="100%">
							<Image
								src="/assets/tokens/airdrop/noble.png"
								w="1.5rem"
								ml={{ base: "-0.5rem", md: "0rem" }}
							/>
							<Text
								fontFamily="body"
								fontSize={{ base: "0.5rem", md: "sm" }}
								fontWeight="900"
								textAlign="start"
								w="82%"
								alignItems="start"
							>
								<span
									style={{
										animation: `${gradientAnimation} 2s ease infinite`,
										background: "-webkit-linear-gradient(45deg, #61a9bb, #ec80fe)",
										backgroundSize: "100% 100%",
										fontSize: "1em",
										marginRight: "0px",
										WebkitBackgroundClip: "text",
										WebkitTextFillColor: "transparent"
									}}
								>
									Neutron activity
								</span>
							</Text>
							<HStack
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
								bg="offwhite.2"
								color="gray.800"
								h="2rem"
								justify="center"
								minW={{ base: "35%", md: "8rem" }}
								px={3}
								py={1}
								rounded="0.8em"
								shadow="md"
								w={{ base: "80%", md: "20%" }}
								position="relative"
								mr={{ base: 0, md: "12rem" }}
							>
								<Skeleton isLoaded={Boolean(Noblewallet)}>
									<HStack>
										<Text fontSize="15">
											<Noblewallet />
										</Text>
									</HStack>
								</Skeleton>
							</HStack>

							<HStack
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
								bg="offwhite.2"
								color="gray.800"
								h="2rem"
								justify="center"
								px={3}
								py={1}
								rounded="0.8em"
								shadow="md"
								w={{ base: "75%", md: "20%" }}
								position="relative"
							>
								<Skeleton isLoaded={Boolean(EleBalance)}>
									<HStack>
										<Text fontSize="15" mr={{ base: "-0.5rem", md: "0rem" }}>
											{shortenNumber(convertMicroDenomToDenom(EleBalance, 6), 2)}
										</Text>
										<Image
											src="/assets/tokens/electron.png"
											w={{ base: "1rem", md: "1.2rem" }}
											mr={{ base: "0.5rem", md: "0.7rem" }}
										/>
									</HStack>
								</Skeleton>
							</HStack>
							<IconButton
								background="-webkit-linear-gradient(45deg, #61a9bb, #ec80fe)"
								paddingRight={{ base: "0rem", md: "0rem" }}
								icon={
									isNobleExpanded ? <ChevronUpIcon boxSize={4} /> : <ChevronDownIcon boxSize={4} />
								}
								onClick={toggleNoble}
								aria-label="Toggle Details"
								variant="ghost"
								size="xs"
							/>
						</HStack>
					</Flex>
				)}
				{/* New empty component */}
				<Collapse in={isNobleExpanded}>
					<Box
						_dark={{ bg: "rgba(33, 33, 33, 0.1)" }}
						bg="gray.100"
						px={5}
						py={10}
						rounded="1.25em"
						shadow="md"
						w="full"
						maxW="100%"
						mt={0}
						textAlign="center"
					>
						<Flex
							justify="center"
							align="center"
							w="full"
							mt={{ base: "-5", md: "-5" }}
							mb={{ base: "-5", md: "-5" }}
						>
							<SimpleGrid
								columns={1}
								spacing={{ base: "2", md: "4" }}
								gridColumnGap={{ base: "6", md: "40" }}
							>
								<NobleBonders />
							</SimpleGrid>
						</Flex>
					</Box>
				</Collapse>
				{/* Celestia activity */}
				{!isVisible && areChainsSelected && (
					<Flex
						key="celestia"
						bgGradient="linear(rgba(33, 33, 33, 0.9))"
						flexDir="column"
						px={5}
						py={3}
						rounded="1.25em"
						shadow="md"
						w="full"
						maxW="100%"
						display={isCelestiaSelected ? "flex" : "none"}
					>
						<HStack w="100%">
							<Image
								src="/assets/tokens/airdrop/celestia.png"
								w="1.5rem"
								ml={{ base: "-0.5rem", md: "0rem" }}
							/>
							<Text
								fontFamily="body"
								fontSize={{ base: "0.5rem", md: "sm" }}
								fontWeight="900"
								textAlign="start"
								w="82%"
								alignItems="start"
							>
								<span
									style={{
										animation: `${gradientAnimation} 2s ease infinite`,
										background: "-webkit-linear-gradient(45deg, #61a9bb, #ec80fe)",
										backgroundSize: "100% 100%",
										fontSize: "1em",
										marginRight: "0px",
										WebkitBackgroundClip: "text",
										WebkitTextFillColor: "transparent"
									}}
								>
									Celestia activity
								</span>
							</Text>
							<HStack
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
								bg="offwhite.2"
								color="gray.800"
								h="2rem"
								justify="center"
								minW={{ base: "35%", md: "8rem" }}
								px={3}
								py={1}
								rounded="0.8em"
								shadow="md"
								w={{ base: "80%", md: "20%" }}
								position="relative"
								mr={{ base: 0, md: "12rem" }}
							>
								<Skeleton isLoaded={Boolean(Celestiawallet)}>
									<HStack>
										<Text fontSize="15">
											<Celestiawallet />
										</Text>
									</HStack>
								</Skeleton>
							</HStack>
							<HStack
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
								bg="offwhite.2"
								color="gray.800"
								h="2rem"
								justify="center"
								px={3}
								py={1}
								rounded="0.8em"
								shadow="md"
								w={{ base: "75%", md: "20%" }}
								position="relative"
							>
								<Skeleton isLoaded={Boolean(EleBalance)}>
									<HStack>
										<Text fontSize="15" mr={{ base: "-0.5rem", md: "0rem" }}>
											{shortenNumber(convertMicroDenomToDenom(EleBalance, 6), 2)}
										</Text>
										<Image
											src="/assets/tokens/electron.png"
											w={{ base: "1rem", md: "1.2rem" }}
											mr={{ base: "0.5rem", md: "0.7rem" }}
										/>
									</HStack>
								</Skeleton>
							</HStack>
							<IconButton
								background="-webkit-linear-gradient(45deg, #61a9bb, #ec80fe)"
								paddingRight={{ base: "0rem", md: "0rem" }}
								icon={
									isCelestiaExpanded ? (
										<ChevronUpIcon boxSize={4} />
									) : (
										<ChevronDownIcon boxSize={4} />
									)
								}
								onClick={toggleCelestia}
								aria-label="Toggle Details"
								variant="ghost"
								size="xs"
							/>
						</HStack>
					</Flex>
				)}
				{/* Celestia percentage */}
				<Collapse in={isCelestiaExpanded}>
					<Box
						_dark={{ bg: "rgba(33, 33, 33, 0.1)" }}
						bg="gray.100"
						px={5}
						py={10}
						rounded="1.25em"
						shadow="md"
						w="full"
						maxW="100%"
						mt={0}
						textAlign="center"
					>
						<Flex
							justify="center"
							align="center"
							w="full"
							mt={{ base: "-5", md: "-5" }}
							mb={{ base: "-5", md: "-5" }}
						>
							<SimpleGrid
								columns={3}
								spacing={{ base: "2", md: "4" }}
								gridColumnGap={{ base: "6", md: "40" }}
							>
								<CelestiaRewards />
								<CelestiaDelegate />
								<CelestiaIBCtransfer />
								<CelestiaVotes />
								<CelestiaUndelegate />
								<CelestiaIBCreceived />
							</SimpleGrid>
						</Flex>
					</Box>
				</Collapse>
				{/* Cosmoshub activity */}
				{!isVisible && areChainsSelected && (
					<Flex
						key="cosmoshub"
						bgGradient="linear(rgba(33, 33, 33, 0.9))"
						flexDir="column"
						px={5}
						py={3}
						rounded="1.25em"
						shadow="md"
						w="full"
						maxW="100%"
						display={isCosmoshubSelected ? "flex" : "none"}
					>
						<HStack w="100%">
							<Image
								src="/assets/tokens/airdrop/cosmoshub.png"
								w="1.5rem"
								ml={{ base: "-0.5rem", md: "0rem" }}
							/>
							<Text
								fontFamily="body"
								fontSize={{ base: "0.5rem", md: "sm" }}
								fontWeight="900"
								textAlign="start"
								w="82%"
								alignItems="start"
							>
								<span
									style={{
										animation: `${gradientAnimation} 2s ease infinite`,
										background: "-webkit-linear-gradient(45deg, #61a9bb, #ec80fe)",
										backgroundSize: "100% 100%",
										fontSize: "1em",
										marginRight: "0px",
										WebkitBackgroundClip: "text",
										WebkitTextFillColor: "transparent"
									}}
								>
									Cosmos activity
								</span>
							</Text>
							<HStack
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
								bg="offwhite.2"
								color="gray.800"
								h="2rem"
								justify="center"
								minW={{ base: "35%", md: "8rem" }}
								px={3}
								py={1}
								rounded="0.8em"
								shadow="md"
								w={{ base: "80%", md: "20%" }}
								position="relative"
								mr={{ base: 0, md: "12rem" }}
							>
								<Skeleton isLoaded={Boolean(Cosmoshubwallet)}>
									<HStack>
										<Text fontSize="15">
											<Cosmoshubwallet />
										</Text>
									</HStack>
								</Skeleton>
							</HStack>
							<HStack
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
								bg="offwhite.2"
								color="gray.800"
								h="2rem"
								justify="center"
								px={3}
								py={1}
								rounded="0.8em"
								shadow="md"
								w={{ base: "75%", md: "20%" }}
								position="relative"
							>
								<Skeleton isLoaded={Boolean(EleBalance)}>
									<HStack>
										<Text
											fontSize={{ base: "1rem", md: "15" }}
											mr={{ base: "-0.5rem", md: "0rem" }}
										>
											~{dividedParticles !== null ? dividedParticles.toFixed(2) : "Loading.."}
										</Text>
										<Image
											src="/assets/tokens/electron.png"
											w={{ base: "1rem", md: "1.2rem" }}
											ml={{ base: "0rem", md: "-0.4rem" }}
											mr={{ base: "0.8rem", md: "0.9rem" }}
											mt={{ base: "-0.024rem", md: "0.06rem" }}
										/>
									</HStack>
								</Skeleton>
							</HStack>
							<IconButton
								background="-webkit-linear-gradient(45deg, #61a9bb, #ec80fe)"
								paddingRight={{ base: "0rem", md: "0rem" }}
								icon={
									isCosmoshubExpanded ? (
										<ChevronUpIcon boxSize={4} />
									) : (
										<ChevronDownIcon boxSize={4} />
									)
								}
								onClick={toggleCosmoshub}
								aria-label="Toggle Details"
								variant="ghost"
								size="xs"
							/>
						</HStack>
					</Flex>
				)}
				{/* Cosmos percentage */}
				<Collapse in={isCosmoshubExpanded}>
					<Box
						_dark={{ bg: "rgba(33, 33, 33, 0.1)" }}
						bg="gray.100"
						px={5}
						py={10}
						rounded="1.25em"
						shadow="md"
						w="full"
						maxW="100%"
						mt={0}
						textAlign="center"
					>
						<Flex
							justify="center"
							align="center"
							w="full"
							mt={{ base: "-5", md: "-5" }}
							mb={{ base: "-5", md: "-5" }}
						>
							<SimpleGrid
								columns={3}
								spacing={{ base: "2", md: "4" }}
								gridColumnGap={{ base: "6", md: "40" }}
							>
								<CosmosRewards />
								<CosmosDelegate />
								<CosmosIBCtransfer />
								<CosmosVotes />
								<CosmosUndelegate />
								<CosmosIBCreceived />
							</SimpleGrid>
						</Flex>
					</Box>
				</Collapse>
				{/* Dydx activity */}
				{!isVisible && areChainsSelected && (
					<Flex
						key="dydx"
						bgGradient="linear(rgba(33, 33, 33, 0.9))"
						flexDir="column"
						px={5}
						py={3}
						rounded="1.25em"
						shadow="md"
						w="full"
						maxW="100%"
						display={isDydxSelected ? "flex" : "none"}
					>
						<HStack w="100%">
							<Image
								src="/assets/tokens/airdrop/dydx.svg"
								w="1.5rem"
								ml={{ base: "-0.5rem", md: "0rem" }}
							/>
							<Text
								fontFamily="body"
								fontSize={{ base: "0.5rem", md: "sm" }}
								fontWeight="900"
								textAlign="start"
								w="82%"
								alignItems="start"
							>
								<span
									style={{
										animation: `${gradientAnimation} 2s ease infinite`,
										background: "-webkit-linear-gradient(45deg, #61a9bb, #ec80fe)",
										backgroundSize: "100% 100%",
										fontSize: "1em",
										marginRight: "0px",
										WebkitBackgroundClip: "text",
										WebkitTextFillColor: "transparent"
									}}
								>
									Dydx activity
								</span>
							</Text>
							<HStack
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
								bg="offwhite.2"
								color="gray.800"
								h="2rem"
								justify="center"
								minW={{ base: "35%", md: "8rem" }}
								px={3}
								py={1}
								rounded="0.8em"
								shadow="md"
								w={{ base: "80%", md: "20%" }}
								position="relative"
								mr={{ base: 0, md: "12rem" }}
							>
								<Skeleton isLoaded={Boolean(Dydxwallet)}>
									<HStack>
										<Text fontSize="15">
											<Dydxwallet />
										</Text>
									</HStack>
								</Skeleton>
							</HStack>
							<HStack
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
								bg="offwhite.2"
								color="gray.800"
								h="2rem"
								justify="center"
								px={3}
								py={1}
								rounded="0.8em"
								shadow="md"
								w={{ base: "75%", md: "20%" }}
								position="relative"
							>
								<Skeleton isLoaded={Boolean(EleBalance)}>
									<HStack>
										<Text fontSize="15" mr={{ base: "-0.5rem", md: "0rem" }}>
											{shortenNumber(convertMicroDenomToDenom(EleBalance, 6), 2)}
										</Text>
										<Image
											src="/assets/tokens/electron.png"
											w={{ base: "1rem", md: "1.2rem" }}
											mr={{ base: "0.5rem", md: "0.7rem" }}
										/>
									</HStack>
								</Skeleton>
							</HStack>
							<IconButton
								background="-webkit-linear-gradient(45deg, #61a9bb, #ec80fe)"
								paddingRight={{ base: "0rem", md: "0rem" }}
								icon={
									isDydxExpanded ? <ChevronUpIcon boxSize={4} /> : <ChevronDownIcon boxSize={4} />
								}
								onClick={toggleDydx}
								aria-label="Toggle Details"
								variant="ghost"
								size="xs"
							/>
						</HStack>
					</Flex>
				)}
				{/* dydx percentage */}
				<Collapse in={isDydxExpanded}>
					<Box
						_dark={{ bg: "rgba(33, 33, 33, 0.1)" }}
						bg="gray.100"
						px={5}
						py={10}
						rounded="1.25em"
						shadow="md"
						w="full"
						maxW="100%"
						mt={0}
						textAlign="center"
					>
						<Flex
							justify="center"
							align="center"
							w="full"
							mt={{ base: "-5", md: "-5" }}
							mb={{ base: "-5", md: "-5" }}
						>
							<SimpleGrid
								columns={3}
								spacing={{ base: "2", md: "4" }}
								gridColumnGap={{ base: "6", md: "40" }}
							>
								<DydxRewards />
								<DydxDelegate />
								<DydxIBCtransfer />
								<DydxVotes />
								<DydxUndelegate />
								<DydxIBCreceived />
							</SimpleGrid>
						</Flex>
					</Box>
				</Collapse>
				{/* Dymension activity */}
				{!isVisible && areChainsSelected && (
					<Flex
						key="dymension"
						bgGradient="linear(rgba(33, 33, 33, 0.9))"
						flexDir="column"
						px={5}
						py={3}
						rounded="1.25em"
						shadow="md"
						w="full"
						maxW="100%"
						display={isDymensionSelected ? "flex" : "none"}
					>
						<HStack w="100%">
							<Image
								src="/assets/tokens/airdrop/dymension.png"
								w="1.5rem"
								ml={{ base: "-0.5rem", md: "0rem" }}
							/>
							<Text
								fontFamily="body"
								fontSize={{ base: "0.5rem", md: "sm" }}
								fontWeight="900"
								textAlign="start"
								w="82%"
								alignItems="start"
							>
								<span
									style={{
										animation: `${gradientAnimation} 2s ease infinite`,
										background: "-webkit-linear-gradient(45deg, #61a9bb, #ec80fe)",
										backgroundSize: "100% 100%",
										fontSize: "1em",
										marginRight: "0px",
										WebkitBackgroundClip: "text",
										WebkitTextFillColor: "transparent"
									}}
								>
									Dym activity
								</span>
							</Text>
							<HStack
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
								bg="offwhite.2"
								color="gray.800"
								h="2rem"
								justify="center"
								minW={{ base: "35%", md: "8rem" }}
								px={3}
								py={1}
								rounded="0.8em"
								shadow="md"
								w={{ base: "80%", md: "20%" }}
								position="relative"
								mr={{ base: 0, md: "12rem" }}
							>
								<Skeleton isLoaded={Boolean(Dymensionwallet)}>
									<HStack>
										<Text fontSize="15">
											<Dymensionwallet />
										</Text>
									</HStack>
								</Skeleton>
							</HStack>
							<HStack
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
								bg="offwhite.2"
								color="gray.800"
								h="2rem"
								justify="center"
								px={3}
								py={1}
								rounded="0.8em"
								shadow="md"
								w={{ base: "75%", md: "20%" }}
								position="relative"
							>
								<Skeleton isLoaded={Boolean(EleBalance)}>
									<HStack>
										<Text fontSize="15" mr={{ base: "-0.5rem", md: "0rem" }}>
											{shortenNumber(convertMicroDenomToDenom(EleBalance, 6), 2)}
										</Text>
										<Image
											src="/assets/tokens/electron.png"
											w={{ base: "1rem", md: "1.2rem" }}
											mr={{ base: "0.5rem", md: "0.7rem" }}
										/>
									</HStack>
								</Skeleton>
							</HStack>
							<IconButton
								background="-webkit-linear-gradient(45deg, #61a9bb, #ec80fe)"
								paddingRight={{ base: "0rem", md: "0rem" }}
								icon={
									isDymensionExpanded ? (
										<ChevronUpIcon boxSize={4} />
									) : (
										<ChevronDownIcon boxSize={4} />
									)
								}
								onClick={toggleDymension}
								aria-label="Toggle Details"
								variant="ghost"
								size="xs"
							/>
						</HStack>
					</Flex>
				)}
				{/* Dymension percentage */}
				<Collapse in={isDymensionExpanded}>
					<Box
						_dark={{ bg: "rgba(33, 33, 33, 0.1)" }}
						bg="gray.100"
						px={5}
						py={10}
						rounded="1.25em"
						shadow="md"
						w="full"
						maxW="100%"
						mt={0}
						textAlign="center"
					>
						<Flex
							justify="center"
							align="center"
							w="full"
							mt={{ base: "-5", md: "-5" }}
							mb={{ base: "-5", md: "-5" }}
						>
							<SimpleGrid
								columns={3}
								spacing={{ base: "2", md: "4" }}
								gridColumnGap={{ base: "6", md: "40" }}
							>
								<DymensionRewards />
								<DymensionDelegate />
								<DymensionIBCtransfer />
								<DymensionVotes />
								<DymensionUndelegate />
								<DymensionIBCreceived />
							</SimpleGrid>
						</Flex>
					</Box>
				</Collapse>
				{/* Juno activity */}
				{!isVisible && areChainsSelected && (
					<Flex
						key="juno"
						bgGradient="linear(rgba(33, 33, 33, 0.9))"
						flexDir="column"
						px={5}
						py={3}
						rounded="1.25em"
						shadow="md"
						w="full"
						maxW="100%"
						display={isJunoSelected ? "flex" : "none"}
					>
						<HStack w="100%">
							<Image
								src="/assets/tokens/airdrop/juno.png"
								w="1.5rem"
								ml={{ base: "-0.5rem", md: "0rem" }}
							/>
							<Text
								fontFamily="body"
								fontSize={{ base: "0.5rem", md: "sm" }}
								fontWeight="900"
								textAlign="start"
								w="82%"
								alignItems="start"
							>
								<span
									style={{
										animation: `${gradientAnimation} 2s ease infinite`,
										background: "-webkit-linear-gradient(45deg, #61a9bb, #ec80fe)",
										backgroundSize: "100% 100%",
										fontSize: "1em",
										marginRight: "0px",
										WebkitBackgroundClip: "text",
										WebkitTextFillColor: "transparent"
									}}
								>
									Juno activity
								</span>
							</Text>
							<HStack
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
								bg="offwhite.2"
								color="gray.800"
								h="2rem"
								justify="center"
								minW={{ base: "35%", md: "8rem" }}
								px={3}
								py={1}
								rounded="0.8em"
								shadow="md"
								w={{ base: "80%", md: "20%" }}
								position="relative"
								mr={{ base: 0, md: "12rem" }}
							>
								<Skeleton isLoaded={Boolean(Junowallet)}>
									<HStack>
										<Text fontSize="15">
											<Junowallet />
										</Text>
									</HStack>
								</Skeleton>
							</HStack>
							<HStack
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
								bg="offwhite.2"
								color="gray.800"
								h="2rem"
								justify="center"
								px={3}
								py={1}
								rounded="0.8em"
								shadow="md"
								w={{ base: "75%", md: "20%" }}
								position="relative"
							>
								<Skeleton isLoaded={Boolean(EleBalance)}>
									<HStack>
										<Text fontSize="15" mr={{ base: "-0.5rem", md: "0rem" }}>
											{shortenNumber(convertMicroDenomToDenom(EleBalance, 6), 2)}
										</Text>
										<Image
											src="/assets/tokens/electron.png"
											w={{ base: "1rem", md: "1.2rem" }}
											mr={{ base: "0.5rem", md: "0.7rem" }}
										/>
									</HStack>
								</Skeleton>
							</HStack>
							<IconButton
								background="-webkit-linear-gradient(45deg, #61a9bb, #ec80fe)"
								paddingRight={{ base: "0rem", md: "0rem" }}
								icon={
									isJunoExpanded ? <ChevronUpIcon boxSize={4} /> : <ChevronDownIcon boxSize={4} />
								}
								onClick={toggleJuno}
								aria-label="Toggle Details"
								variant="ghost"
								size="xs"
							/>
						</HStack>
					</Flex>
				)}
				{/* Juno percentage */}
				<Collapse in={isJunoExpanded}>
					<Box
						_dark={{ bg: "rgba(33, 33, 33, 0.1)" }}
						bg="gray.100"
						px={5}
						py={10}
						rounded="1.25em"
						shadow="md"
						w="full"
						maxW="100%"
						mt={0}
						textAlign="center"
					>
						<Flex
							justify="center"
							align="center"
							w="full"
							mt={{ base: "-5", md: "-5" }}
							mb={{ base: "-5", md: "-5" }}
						>
							<SimpleGrid
								columns={3}
								spacing={{ base: "2", md: "4" }}
								gridColumnGap={{ base: "6", md: "40" }}
							>
								<JunoRewards />
								<JunoDelegate />
								<JunoIBCtransfer />
								<JunoVotes />
								<JunoUndelegate />
								<JunoIBCreceived />
							</SimpleGrid>
						</Flex>
					</Box>
				</Collapse>
				{/* Akash activity */}
				{!isVisible && areChainsSelected && (
					<Flex
						key="akash"
						bgGradient="linear(rgba(33, 33, 33, 0.9))"
						flexDir="column"
						px={5}
						py={3}
						rounded="1.25em"
						shadow="md"
						w="full"
						maxW="100%"
						display={isAkashSelected ? "flex" : "none"}
					>
						<HStack w="100%">
							<Image
								src="/assets/tokens/airdrop/akash.png"
								w="1.5rem"
								ml={{ base: "-0.5rem", md: "0rem" }}
							/>
							<Text
								fontFamily="body"
								fontSize={{ base: "0.5rem", md: "sm" }}
								fontWeight="900"
								textAlign="start"
								w="82%"
								alignItems="start"
							>
								<span
									style={{
										animation: `${gradientAnimation} 2s ease infinite`,
										background: "-webkit-linear-gradient(45deg, #61a9bb, #ec80fe)",
										backgroundSize: "100% 100%",
										fontSize: "1em",
										marginRight: "0px",
										WebkitBackgroundClip: "text",
										WebkitTextFillColor: "transparent"
									}}
								>
									Akash activity
								</span>
							</Text>
							<HStack
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
								bg="offwhite.2"
								color="gray.800"
								h="2rem"
								justify="center"
								minW={{ base: "35%", md: "8rem" }}
								px={3}
								py={1}
								rounded="0.8em"
								shadow="md"
								w={{ base: "80%", md: "20%" }}
								position="relative"
								mr={{ base: 0, md: "12rem" }}
							>
								<Skeleton isLoaded={Boolean(Akashwallet)}>
									<HStack>
										<Text fontSize="15">
											<Akashwallet />
										</Text>
									</HStack>
								</Skeleton>
							</HStack>
							<HStack
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
								bg="offwhite.2"
								color="gray.800"
								h="2rem"
								justify="center"
								px={3}
								py={1}
								rounded="0.8em"
								shadow="md"
								w={{ base: "75%", md: "20%" }}
								position="relative"
							>
								<Skeleton isLoaded={Boolean(EleBalance)}>
									<HStack>
										<Text fontSize="15" mr={{ base: "-0.5rem", md: "0rem" }}>
											{shortenNumber(convertMicroDenomToDenom(EleBalance, 6), 2)}
										</Text>
										<Image
											src="/assets/tokens/electron.png"
											w={{ base: "1rem", md: "1.2rem" }}
											mr={{ base: "0.5rem", md: "0.7rem" }}
										/>
									</HStack>
								</Skeleton>
							</HStack>
							<IconButton
								background="-webkit-linear-gradient(45deg, #61a9bb, #ec80fe)"
								paddingRight={{ base: "0rem", md: "0rem" }}
								icon={
									isAkashExpanded ? <ChevronUpIcon boxSize={4} /> : <ChevronDownIcon boxSize={4} />
								}
								onClick={toggleAkash}
								aria-label="Toggle Details"
								variant="ghost"
								size="xs"
							/>
						</HStack>
					</Flex>
				)}
				{/* Akash percentage */}
				<Collapse in={isAkashExpanded}>
					<Box
						_dark={{ bg: "rgba(33, 33, 33, 0.1)" }}
						bg="gray.100"
						px={5}
						py={10}
						rounded="1.25em"
						shadow="md"
						w="full"
						maxW="100%"
						mt={0}
						textAlign="center"
					>
						<Flex
							justify="center"
							align="center"
							w="full"
							mt={{ base: "-5", md: "-5" }}
							mb={{ base: "-5", md: "-5" }}
						>
							<SimpleGrid
								columns={3}
								spacing={{ base: "2", md: "4" }}
								gridColumnGap={{ base: "6", md: "40" }}
							>
								<AkashRewards />
								<AkashDelegate />
								<AkashIBCtransfer />
								<AkashVotes />
								<AkashUndelegate />
								<AkashIBCreceived />
							</SimpleGrid>
						</Flex>
					</Box>
				</Collapse>
				{/* Osmosis activity */}
				{!isVisible && areChainsSelected && (
					<Flex
						key="osmosis"
						bgGradient="linear(rgba(33, 33, 33, 0.9))"
						flexDir="column"
						px={5}
						py={3}
						rounded="1.25em"
						shadow="md"
						w="full"
						maxW="100%"
						display={isOsmosisSelected ? "flex" : "none"}
					>
						<HStack w="100%">
							<Image
								src="/assets/tokens/airdrop/osmosis.png"
								w="1.5rem"
								ml={{ base: "-0.5rem", md: "0rem" }}
							/>
							<Text
								fontFamily="body"
								fontSize={{ base: "0.5rem", md: "sm" }}
								fontWeight="900"
								textAlign="start"
								w="82%"
								alignItems="start"
							>
								<span
									style={{
										animation: `${gradientAnimation} 2s ease infinite`,
										background: "-webkit-linear-gradient(45deg, #61a9bb, #ec80fe)",
										backgroundSize: "100% 100%",
										fontSize: "1em",
										marginRight: "0px",
										WebkitBackgroundClip: "text",
										WebkitTextFillColor: "transparent"
									}}
								>
									Osmo activity
								</span>
							</Text>
							<HStack
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
								bg="offwhite.2"
								color="gray.800"
								h="2rem"
								justify="center"
								minW={{ base: "35%", md: "8rem" }}
								px={3}
								py={1}
								rounded="0.8em"
								shadow="md"
								w={{ base: "80%", md: "20%" }}
								position="relative"
								mr={{ base: 0, md: "12rem" }}
							>
								<Skeleton isLoaded={Boolean(Osmosiswallet)}>
									<HStack>
										<Text fontSize="15">
											<Osmosiswallet />
										</Text>
									</HStack>
								</Skeleton>
							</HStack>
							<HStack
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
								bg="offwhite.2"
								color="gray.800"
								h="2rem"
								justify="center"
								px={3}
								py={1}
								rounded="0.8em"
								shadow="md"
								w={{ base: "75%", md: "20%" }}
								position="relative"
							>
								<Skeleton isLoaded={Boolean(EleBalance)}>
									<HStack>
										<Text fontSize="15" mr={{ base: "-0.5rem", md: "0rem" }}>
											{shortenNumber(convertMicroDenomToDenom(EleBalance, 6), 2)}
										</Text>
										<Image
											src="/assets/tokens/electron.png"
											w={{ base: "1rem", md: "1.2rem" }}
											mr={{ base: "0.5rem", md: "0.7rem" }}
										/>
									</HStack>
								</Skeleton>
							</HStack>
							<IconButton
								background="-webkit-linear-gradient(45deg, #61a9bb, #ec80fe)"
								paddingRight={{ base: "0rem", md: "0rem" }}
								icon={
									isOsmosisExpanded ? (
										<ChevronUpIcon boxSize={4} />
									) : (
										<ChevronDownIcon boxSize={4} />
									)
								}
								onClick={toggleOsmosis}
								aria-label="Toggle Details"
								variant="ghost"
								size="xs"
							/>
						</HStack>
					</Flex>
				)}
				{/* Osmosis percentage */}
				<Collapse in={isOsmosisExpanded}>
					<Box
						_dark={{ bg: "rgba(33, 33, 33, 0.1)" }}
						bg="gray.100"
						px={5}
						py={10}
						rounded="1.25em"
						shadow="md"
						w="full"
						maxW="100%"
						mt={0}
						textAlign="center"
					>
						<Flex
							justify="center"
							align="center"
							w="full"
							mt={{ base: "-5", md: "-5" }}
							mb={{ base: "-5", md: "-5" }}
						>
							<SimpleGrid
								columns={3}
								spacing={{ base: "2", md: "4" }}
								gridColumnGap={{ base: "6", md: "40" }}
							>
								<OsmosisRewards />
								<OsmosisDelegate />
								<OsmosisIBCtransfer />
								<OsmosisVotes />
								<OsmosisUndelegate />
								<OsmosisIBCreceived />
							</SimpleGrid>
						</Flex>
					</Box>
				</Collapse>
				{/* Sei activity */}
				{!isVisible && areChainsSelected && (
					<Flex
						key="sei"
						bgGradient="linear(rgba(33, 33, 33, 0.9))"
						flexDir="column"
						px={5}
						py={3}
						rounded="1.25em"
						shadow="md"
						w="full"
						maxW="100%"
						display={isSeiSelected ? "flex" : "none"}
					>
						<HStack w="100%">
							<Image
								src="/assets/tokens/airdrop/sei.png"
								w="1.5rem"
								ml={{ base: "-0.5rem", md: "0rem" }}
							/>
							<Text
								fontFamily="body"
								fontSize={{ base: "0.5rem", md: "sm" }}
								fontWeight="900"
								textAlign="start"
								w="82%"
								alignItems="start"
							>
								<span
									style={{
										animation: `${gradientAnimation} 2s ease infinite`,
										background: "-webkit-linear-gradient(45deg, #61a9bb, #ec80fe)",
										backgroundSize: "100% 100%",
										fontSize: "1em",
										marginRight: "0px",
										WebkitBackgroundClip: "text",
										WebkitTextFillColor: "transparent"
									}}
								>
									Sei activity
								</span>
							</Text>
							<HStack
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
								bg="offwhite.2"
								color="gray.800"
								h="2rem"
								justify="center"
								minW={{ base: "35%", md: "8rem" }}
								px={3}
								py={1}
								rounded="0.8em"
								shadow="md"
								w={{ base: "80%", md: "20%" }}
								position="relative"
								mr={{ base: 0, md: "12rem" }}
							>
								<Skeleton isLoaded={Boolean(Seiwallet)}>
									<HStack>
										<Text fontSize="15">
											<Seiwallet />
										</Text>
									</HStack>
								</Skeleton>
							</HStack>
							<HStack
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
								bg="offwhite.2"
								color="gray.800"
								h="2rem"
								justify="center"
								px={3}
								py={1}
								rounded="0.8em"
								shadow="md"
								w={{ base: "75%", md: "20%" }}
								position="relative"
							>
								<Skeleton isLoaded={Boolean(EleBalance)}>
									<HStack>
										<Text fontSize="15" mr={{ base: "-0.5rem", md: "0rem" }}>
											{shortenNumber(convertMicroDenomToDenom(EleBalance, 6), 2)}
										</Text>
										<Image
											src="/assets/tokens/electron.png"
											w={{ base: "1rem", md: "1.2rem" }}
											mr={{ base: "0.5rem", md: "0.7rem" }}
										/>
									</HStack>
								</Skeleton>
							</HStack>
							<IconButton
								background="-webkit-linear-gradient(45deg, #61a9bb, #ec80fe)"
								paddingRight={{ base: "0rem", md: "0rem" }}
								icon={
									isSeiExpanded ? <ChevronUpIcon boxSize={4} /> : <ChevronDownIcon boxSize={4} />
								}
								onClick={toggleSei}
								aria-label="Toggle Details"
								variant="ghost"
								size="xs"
							/>
						</HStack>
					</Flex>
				)}
				{/* Sei percentage */}
				<Collapse in={isSeiExpanded}>
					<Box
						_dark={{ bg: "rgba(33, 33, 33, 0.1)" }}
						bg="gray.100"
						px={5}
						py={10}
						rounded="1.25em"
						shadow="md"
						w="full"
						maxW="100%"
						mt={0}
						textAlign="center"
					>
						<Flex
							justify="center"
							align="center"
							w="full"
							mt={{ base: "-5", md: "-5" }}
							mb={{ base: "-5", md: "-5" }}
						>
							<SimpleGrid
								columns={3}
								spacing={{ base: "2", md: "4" }}
								gridColumnGap={{ base: "6", md: "40" }}
							>
								<SeiRewards />
								<SeiDelegate />
								<SeiIBCtransfer />
								<SeiVotes />
								<SeiUndelegate />
								<SeiIBCreceived />
							</SimpleGrid>
						</Flex>
					</Box>
				</Collapse>
				{/* Stride activity */}
				{!isVisible && areChainsSelected && (
					<Flex
						key="stride"
						bgGradient="linear(rgba(33, 33, 33, 0.9))"
						flexDir="column"
						px={5}
						py={3}
						rounded="1.25em"
						shadow="md"
						w="full"
						maxW="100%"
						display={isStrideSelected ? "flex" : "none"}
					>
						<HStack w="100%">
							<Image
								src="/assets/tokens/airdrop/stride.png"
								w="1.5rem"
								ml={{ base: "-0.5rem", md: "0rem" }}
							/>
							<Text
								fontFamily="body"
								fontSize={{ base: "0.5rem", md: "sm" }}
								fontWeight="900"
								textAlign="start"
								w="82%"
								alignItems="start"
							>
								<span
									style={{
										animation: `${gradientAnimation} 2s ease infinite`,
										background: "-webkit-linear-gradient(45deg, #61a9bb, #ec80fe)",
										backgroundSize: "100% 100%",
										fontSize: "1em",
										marginRight: "0px",
										WebkitBackgroundClip: "text",
										WebkitTextFillColor: "transparent"
									}}
								>
									Stride activity
								</span>
							</Text>
							<HStack
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
								bg="offwhite.2"
								color="gray.800"
								h="2rem"
								justify="center"
								minW={{ base: "35%", md: "8rem" }}
								px={3}
								py={1}
								rounded="0.8em"
								shadow="md"
								w={{ base: "80%", md: "20%" }}
								position="relative"
								mr={{ base: 0, md: "12rem" }}
							>
								<Skeleton isLoaded={Boolean(Stridewallet)}>
									<HStack>
										<Text fontSize="15">
											<Stridewallet />
										</Text>
									</HStack>
								</Skeleton>
							</HStack>
							<HStack
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
								bg="offwhite.2"
								color="gray.800"
								h="2rem"
								justify="center"
								px={3}
								py={1}
								rounded="0.8em"
								shadow="md"
								w={{ base: "75%", md: "20%" }}
								position="relative"
							>
								<Skeleton isLoaded={Boolean(EleBalance)}>
									<HStack>
										<Text fontSize="15" mr={{ base: "-0.5rem", md: "0rem" }}>
											{shortenNumber(convertMicroDenomToDenom(EleBalance, 6), 2)}
										</Text>
										<Image
											src="/assets/tokens/electron.png"
											w={{ base: "1rem", md: "1.2rem" }}
											mr={{ base: "0.5rem", md: "0.7rem" }}
										/>
									</HStack>
								</Skeleton>
							</HStack>
							<IconButton
								background="-webkit-linear-gradient(45deg, #61a9bb, #ec80fe)"
								paddingRight={{ base: "0rem", md: "0rem" }}
								icon={
									isStrideExpanded ? <ChevronUpIcon boxSize={4} /> : <ChevronDownIcon boxSize={4} />
								}
								onClick={toggleStride}
								aria-label="Toggle Details"
								variant="ghost"
								size="xs"
							/>
						</HStack>
					</Flex>
				)}
				{/* Stride percentage */}
				<Collapse in={isStrideExpanded}>
					<Box
						_dark={{ bg: "rgba(33, 33, 33, 0.1)" }}
						bg="gray.100"
						px={5}
						py={10}
						rounded="1.25em"
						shadow="md"
						w="full"
						maxW="100%"
						mt={0}
						textAlign="center"
					>
						<Flex
							justify="center"
							align="center"
							w="full"
							mt={{ base: "-5", md: "-5" }}
							mb={{ base: "-5", md: "-5" }}
						>
							<SimpleGrid
								columns={3}
								spacing={{ base: "2", md: "4" }}
								gridColumnGap={{ base: "6", md: "40" }}
							>
								<StrideStakers />
								<StrideLSatom />
								<StrideLSosmo />
								<StrideIBCtransfer />
								<StrideLSdym />
								<StrideLStia />
							</SimpleGrid>
						</Flex>
					</Box>
				</Collapse>
				{!isVisible && (
					<Flex justifyContent="center" mt={2} mb={2} gap={{ base: 20, md: 250 }}>
						<PortfolioSummary />
					</Flex>
				)}
				<Flex justifyContent="center" mt={2} mb={2} gap={{ base: 20, md: 250 }}>
					{!isVisible && (
						<Button
							marginLeft={{ base: "0", md: "0em" }}
							onClick={onPrev}
							_active={{
								filter: "brightness(80%) drop-shadow(0px 1px 3px rgba(2,226,150, 1))"
							}}
							_hover={{
								filter: "brightness(110%) drop-shadow(0px 1px 3px rgba(2,226,150, 1))"
							}}
							alignSelf="end"
							bgGradient="linear(45deg, #4b6cb7, brand.2)"
							color="gray.100"
							fontSize={{ base: "8", md: "16" }}
							maxW={{ base: "6rem", md: "6rem" }}
							mt={2}
							rounded="0.9em"
							transition="all 0.5s"
							width={{ base: "120px", md: "120px" }}
						>
							Done
						</Button>
					)}

					{!nextButtonClicked && isVisible && (
						<Button
							onClick={handleNextClick}
							marginRight={{ base: "0em", md: "0em" }}
							_active={{
								filter: "brightness(80%) drop-shadow(0px 1px 3px rgba(2,226,150, 1))"
							}}
							_hover={{
								filter: "brightness(110%) drop-shadow(0px 1px 3px rgba(2,226,150, 1))"
							}}
							alignSelf="end"
							bgGradient="linear(45deg, #4b6cb7, brand.2)"
							color="gray.100"
							fontSize={{ base: "8", md: "16" }}
							maxW="6rem"
							mt={2}
							ml={{ base: 0, md: 0 }}
							rounded="0.9em"
							transition="all 0.5s"
							width={{ base: "120px", md: "120px" }}
							disabled={!selectionMade}
							bg={selectionMade ? "linear(45deg, #4b6cb7, brand.2)" : "gray"}
						>
							Next
						</Button>
					)}
				</Flex>
			</Flex>
			<>
				{isWalletConnected && (
					<Flex
						_dark={{ bg: "rgb(30, 41, 59)", textColor: "white" }}
						textColor="black"
						flexDir="column"
						px={2}
						py={3}
						bg="rgb(255, 255, 255)"
						rounded="1.25em"
						shadow="md"
						w="full"
						maxW="5xl"
						justifyContent="space-between"
						mt="0rem"
						mb="1rem"
					>
						<Text fontWeight="600" textAlign="center">
							Particle Reward Program
						</Text>
						<Divider mb="0.7rem" maxW="100%" />
						<HStack justify="center" w="full">
							<Image src="/assets/tokens/wallet.png" w="1.5rem" ml="1.5rem" />
							<Text
								bgClip="text"
								bgGradient="linear(45deg, #4b6cb7,brand.2)"
								fontFamily="heading"
								fontSize="md"
								fontWeight="900"
								mb={0.5}
								textAlign="start"
								w="full"
							>
								{truncateAddress(address, 8, 8)}
							</Text>
							<Text
								fontFamily="body"
								fontSize="md"
								fontWeight="700"
								textAlign="end"
								w="full"
								mb="0.1rem"
							>
								{shortenNumber(convertMicroDenomToDenom(ParticleBalance, 6), 2)}
							</Text>
							<Image src="/assets/tokens/particle.png" w="1rem" mr="1.5rem" />
						</HStack>
					</Flex>
				)}
			</>
		</Flex>
	)
}

export default Pickchains

Pickchains.propTypes = {
	onPrev: () => null
}
