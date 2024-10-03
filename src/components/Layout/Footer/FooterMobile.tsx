import {
	Box,
	Flex,
	IconButton,
	Image,
	Text,
	useBreakpointValue,
	useClipboard
} from "@chakra-ui/react"
import { useChain } from "@cosmos-kit/react"
import { useTokenBalance } from "@hooks/tokens/query/useTokenBalance"
import { convertMicroDenomToDenom } from "@utils/tokens/helpers"
import shortenNumber from "@utils/ui/shortenNumber"
import { motion } from "framer-motion"
import { useEffect } from "react"
import { FaClipboardList } from "react-icons/fa"
import { toast } from "react-toastify"
import truncateAddress from "utils/ui/truncateAddress"

export const FooterMobile = () => {
	const { address, isWalletConnected } = useChain(import.meta.env.VITE_NEUTRONNETWORK)
	const [ParticleBalance] = useTokenBalance(
		"factory/neutron14n0asvvxcks0x3t88chhhwzeesckekt5tvsc26/PARTICLE"
	)
	const [ntrnBalance] = useTokenBalance("untrn")

	const isMobile = useBreakpointValue({ base: true, md: false })
	const { onCopy, setValue } = useClipboard("")

	useEffect(() => {
		if (isWalletConnected && address) {
			setValue(address)
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [isWalletConnected, address])

	if (!isMobile || !address) return null

	return (
		<Flex
			bgGradient="linear(to-b, #0a2b33, #1a001e)"
			color="white"
			p={4}
			justify="space-between"
			align="center"
			position="fixed"
			bottom="0.1"
			height="8%"
			left="0"
			right="0"
			zIndex="999"
			width="100%"
			maxWidth="600px" // Adjust the maximum width as needed
			marginLeft="auto"
			marginRight="auto"
		>
			{/* First component: Token value */}
			<Flex align="center">
				<Box
					borderRadius="12px"
					bgGradient="linear(45deg, #4b6cb7, brand.2)"
					p={1}
					display="flex"
					alignItems="center"
					paddingLeft={2}
					paddingRight={2}
				>
					<Image src="/assets/tokens/particle.png" alt="Token" boxSize="1rem" mr={2} />
					{shortenNumber(convertMicroDenomToDenom(ParticleBalance, 6), 2)}
				</Box>
			</Flex>
			<Flex align="center">
				<Box
					w="0.8rem"
					h="0.7rem"
					borderRadius="50%"
					bgGradient="radial(#4b6cb7, brand.2)"
					boxShadow="0 0 10px rgba(35, 233, 196, 0.8)"
					mt={0.5}
				/>
				<Text
					bgClip="text"
					bgGradient="linear(45deg, #4b6cb7, brand.2)"
					fontFamily="heading"
					fontSize="md"
					fontWeight="900"
					mb={0}
					textAlign="center"
					w="full"
					ml={1} // Adjust the spacing between components
				>
					{truncateAddress(address!, 4, 4)}
				</Text>
				<IconButton
					_active={{ background: "rgba(255,255,255,0.1)" }}
					_hover={{
						background: "rgba(255,255,255,0.2)",
						cursor: "pointer"
					}}
					aria-label="Copy wallet address to clipboard"
					as={motion.div}
					bg="rgba(255,255,255,0.1)"
					h="0.6rem"
					shadow="md"
					icon={<FaClipboardList size="1rem" />}
					mt={0}
					ml={0.5}
					onClick={() => {
						onCopy()
						toast("Copied address!", {
							progressStyle: {
								background: "rgba(2, 226, 150, 1)",
								boxShadow: "var(--chakra-shadows-md)",
								height: "0.6rem"
							}
						})
					}}
					rounded="0.6rem"
					size="none"
					w="0.6rem"
				/>
			</Flex>
			<Flex align="end">
				{/* Third component: Neutron value */}
				{shortenNumber(convertMicroDenomToDenom(ntrnBalance, 6), 2)}
				<Image src="/assets/tokens/ntrn.png" w="1.5rem" ml={0.5} />
			</Flex>
		</Flex>
	)
}
