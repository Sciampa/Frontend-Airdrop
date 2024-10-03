/* eslint-disable import/no-unassigned-import */
import { Flex } from "@chakra-ui/react"
import { motion } from "framer-motion"
import { StakingSummary } from "pages/portfolio/assets/components/StakingSummary"
import { Helmet } from "react-helmet"

const MyStakingPage = () => {
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
			justify="center"
			mb="5em"
		>
			<Helmet>
				<title>My Earn | Electron</title>
			</Helmet>
			<StakingSummary />
		</Flex>
	)
}

export default MyStakingPage
