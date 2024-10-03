/* eslint-disable no-negated-condition */
import { BondingModal } from "./BondingModal"
import {
	Button,
	Flex,
	Heading,
	Portal,
	Tag,
	Text,
	Tooltip,
	useColorModeValue,
	useDisclosure
} from "@chakra-ui/react"
import { useChain } from "@cosmos-kit/react"
import { BadgesIcon2 } from "components/Assets/BadgesIcon"
import { useNavigate } from "react-router-dom"
import { type TPool } from "utils/tokens/pools"

export const RuaBonding = ({ pool }: { pool: TPool }) => {
	const { isWalletConnected } = useChain(import.meta.env.VITE_NEUTRONNETWORK)
	const { isOpen, onClose } = useDisclosure()
	const navigate = useNavigate()

	return (
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
			bg="rgb(255, 255, 255)"
			flexDirection="column"
			gap={4}
			ps={3}
			py={4}
			rounded="1.25em"
			shadow="md"
			w="full"
		>
			<Flex align="center" gap={2} w="full">
				<Tag
					_dark={{ bg: "gray.800" }}
					fontSize="18"
					fontWeight="600"
					px={3}
					py={2}
					bg="gray.200"
					shadow="md"
					rounded="0.8em"
				>
					<Text bgClip="text" bgGradient="linear(45deg, #4b6cb7, brand.2)">
						Step 3
					</Text>
				</Tag>
				<Heading _dark={{ color: "white" }} color="black" fontSize="22" fontWeight="800">
					RUA
				</Heading>
			</Flex>
			<Flex align="start" flex={1} gap={2} ps={4} w="full">
				<Text _dark={{ color: "white" }} color="black" fontSize="16">
					Mint or acquire RUA from these pools in the market and SHARE Securing Securing your RUA is
					essential for receiving your monthly dividend.
				</Text>
			</Flex>
			<Flex align="center" gap={2} justifyContent="flex-end" pe={3} w="full">
				<Tooltip
					bg={useColorModeValue("gray.100)", "rgba(33, 33, 33, 0.5)")}
					border="none"
					color={useColorModeValue("black", "white")}
					hasArrow
					label={!isWalletConnected ? "Connect your wallet to continue" : ""}
					rounded="1em"
					shadow="md"
				>
					<Button
						_active={{
							filter:
								pool.bondingPeriods.length !== 0
									? "brightness(80%) drop-shadow(0px 1px 3px rgba(2,226,150, 1))"
									: "",
							shadow: pool.bondingPeriods.length !== 0 ? "glowMd" : "md"
						}}
						_disabled={{
							_active: {
								_dark: { bg: "whiteAlpha.200" },
								bg: "blackAlpha.300",
								color: "whiteAlpha.500",
								cursor: "not-allowed",
								filter: ""
							},
							_dark: { bg: "whiteAlpha.200" },
							_focus: {
								_dark: { bg: "whiteAlpha.200" },
								bg: "blackAlpha.300",
								color: "whiteAlpha.500",
								cursor: "not-allowed",
								filter: ""
							},
							_hover: {},
							bg: "blackAlpha.300",
							bgGradient: "",
							color: "whiteAlpha.500",
							cursor: "not-allowed"
						}}
						_hover={{
							filter:
								pool.bondingPeriods.length !== 0
									? "brightness(110%) drop-shadow(0px 0px 4px rgba(2,226,150, 1))"
									: "",
							shadow: pool.bondingPeriods.length !== 0 ? "glowMd" : "md"
						}}
						shadow="md"
						bg="whiteAlpha.200"
						color="white"
						fontSize="16"
						leftIcon={<BadgesIcon2 />}
						onClick={() => {
							navigate(`/rua/${pool.ruaId}`)
						}}
						rounded="0.9em"
						transition="all 0.3s"
						w="6em"
					>
						Market
					</Button>
				</Tooltip>
			</Flex>
			{pool.bondingPeriods.length !== 0 && (
				<Portal>
					<BondingModal isOpen={isOpen} onClose={onClose} />
				</Portal>
			)}
		</Flex>
	)
}
