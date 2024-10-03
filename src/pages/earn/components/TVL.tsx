import { HStack, Skeleton, Text, useBreakpoint } from "@chakra-ui/react"
import { BigNumber } from "bignumber.js"
import shortenNumber from "utils/ui/shortenNumber"

const TVL = ({ usd }: { usd: BigNumber }) => {
	const breakpoint = useBreakpoint({ ssr: false })

	if (breakpoint === "base" || breakpoint === "sm ") {
		return (
			<HStack spacing={1}>
				<Text
					fontFamily="heading"
					fontSize={{ base: 0, md: "md" }}
					lineHeight={{ base: 1, md: 1.4 }}
					fontWeight="bold"
				>
					TVL
				</Text>
				<Skeleton isLoaded={Boolean(usd)} rounded="full" w="full">
					<Text
						bgClip="text"
						bgGradient="linear(45deg, #4b6cb7, brand.2)"
						fontFamily="heading"
						fontSize={{ base: 18, md: "md" }}
						lineHeight={{ base: 1, md: 1.4 }}
						fontWeight="bold"
					>
						{`$${shortenNumber(usd ?? BigNumber(0), 2)}`}
					</Text>
				</Skeleton>
			</HStack>
		)
	}

	return (
		<Text
			_dark={{ color: "white" }}
			fontFamily="heading"
			color="black"
			fontSize={{ base: "0.7rem", md: "0.7rem" }}
			lineHeight={{ base: 1, md: 1.4 }}
			fontWeight="bold"
		>
			{`$${shortenNumber(usd ?? BigNumber(0), 2)}`}
		</Text>
	)
}

export default TVL
