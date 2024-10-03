// eslint-disable-next-line canonical/filename-match-exported
import { PoolsPanel } from "./components/PoolsPanel"
import { SwapPanel } from "./components/SwapPanel"
import { Flex, Grid, Heading, useBreakpointValue } from "@chakra-ui/react"
import { motion } from "framer-motion"

const Trade = () => {
	const showHeading = useBreakpointValue({ base: false, md: true })

	return (
		<Flex
			animate={{ opacity: 1 }}
			as={motion.main}
			exit={{ opacity: 0 }}
			flexDirection="column"
			gap={2}
			h="full"
			initial={{ opacity: 0 }}
			p={{ base: 4, lg: 24, md: 16 }}
			w="full"
			mt={{ base: 16, md: -4 }}
		>
			{showHeading && <Heading>Trade</Heading>}
			<Grid
				gap={4}
				h="full"
				minH="53.8vh"
				templateColumns={{ base: "1fr", md: "1fr" }}
				templateRows={{ base: "1fr 1fr", md: "auto" }}
				w="full"
			>
				<SwapPanel />
				<PoolsPanel />
			</Grid>
		</Flex>
	)
}

export default Trade
