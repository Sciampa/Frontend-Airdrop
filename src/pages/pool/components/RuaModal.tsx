import { BondTokens } from "./BondTokens"
import { RedeemTokens } from "./RedeemTokens"
import { UnbondTokens } from "./UnbondTokens"
import {
	Modal,
	ModalBody,
	ModalCloseButton,
	ModalContent,
	ModalHeader,
	ModalOverlay,
	Tab,
	TabList,
	TabPanel,
	TabPanels,
	Tabs
} from "@chakra-ui/react"
import { usePoolFromListQueryById } from "@hooks/pool/query/usePoolList"
import { useParams } from "react-router-dom"

export const RuaModal = ({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) => {
	const parameters = useParams()
	const [pool] = usePoolFromListQueryById({
		poolId: Number(parameters.slug!)
	})

	return (
		<Modal isCentered isOpen={isOpen} onClose={onClose} size="xl">
			<ModalOverlay backdropFilter="blur(70px)" />
			<ModalContent
				_dark={{
					bg: "rgb(30, 41, 59)"
				}}
				bg="rgb(255, 255, 255)"
				h="31rem"
				rounded="1.25em"
			>
				<ModalHeader _dark={{ color: "white" }} color="black" textAlign="center" w="full">
					Manage Bonding
				</ModalHeader>
				<ModalCloseButton />
				<ModalBody>
					<Tabs h="full" isFitted isLazy variant="soft-rounded">
						<TabList
							_dark={{ bg: "whiteAlpha.200", color: "white" }}
							bg="whiteAlpha.200"
							color="black"
							gap={2}
							h="3rem"
							rounded="1.25em"
							shadow="md"
						>
							<Tab
								_dark={{
									_selected: { color: "gray-800" },
									color: "white"
								}}
								_selected={{
									bgGradient: "linear(45deg, #4b6cb7, brand.2)",
									color: "white",
									shadow: "glowMd"
								}}
								color="black"
								rounded="1.25em"
							>
								Bond
							</Tab>
							<Tab
								_dark={{
									_selected: { color: "gray-800" },
									color: "white"
								}}
								_selected={{
									bgGradient: "linear(45deg, #4b6cb7, brand.2)",
									color: "white",
									shadow: "glowMd"
								}}
								color="black"
								rounded="1.25em"
							>
								Unbond
							</Tab>
							<Tab
								_dark={{
									_selected: { color: "gray-800" },
									color: "white"
								}}
								_selected={{
									bgGradient: "linear(45deg, #4b6cb7, brand.2)",
									color: "white",
									shadow: "glowMd"
								}}
								color="black"
								rounded="1.25em"
							>
								Redeem
							</Tab>
						</TabList>
						<TabPanels h="calc(100% - 3rem)">
							<TabPanel h="full">
								<BondTokens />
							</TabPanel>
							<TabPanel h="full">
								<UnbondTokens pool={pool?.pool!} />
							</TabPanel>
							<TabPanel h="full">
								<RedeemTokens />
							</TabPanel>
						</TabPanels>
					</Tabs>
				</ModalBody>
			</ModalContent>
		</Modal>
	)
}
