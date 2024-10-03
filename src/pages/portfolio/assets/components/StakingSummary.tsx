/* eslint-disable prettier/prettier */
import { Box, Flex, Heading, SimpleGrid, Skeleton, VStack } from "@chakra-ui/react"
import { useTotalBondedValue } from "@hooks/portfolio/query/useTotalBondedValue"
import { useTotalUnbondedValue } from "@hooks/portfolio/query/useTotalUnbondedValue"
// eslint-disable-next-line import/no-extraneous-dependencies
import { intervalToDuration } from "date-fns"
import { useTokenList } from "hooks/tokens/query/useTokenList"
// eslint-disable-next-line import/no-extraneous-dependencies
import PropTypes from "prop-types"
import React, { useCallback, useEffect, useState } from "react"
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-expect-error
const CountdownTimer = ({ targetDate }) => {
	// Calculate time left until targetDate
	const calculateTimeLeft = useCallback(() => {
		const now = new Date()
		const end = new Date(targetDate)
		return intervalToDuration({ end, start: now })
	}, [targetDate])

	// State to store the remaining time
	const [timeLeft, setTimeLeft] = useState(calculateTimeLeft())

	useEffect(() => {
		// Update time left every second
		const timer = setInterval(() => {
			setTimeLeft(calculateTimeLeft())
		}, 1_000)

		return () => clearInterval(timer)
	}, [calculateTimeLeft])

	const formatTimeLeft = () => {
		const { days, hours, minutes, seconds } = timeLeft
		return `${days} d : ${String(hours).padStart(2, "0")} h : ${String(minutes).padStart(
			2,
			"0"
		)} m : ${String(seconds).padStart(2, "0")} s`
	}

	return <Box>{formatTimeLeft()}</Box>
}

CountdownTimer.propTypes = {
	// eslint-disable-next-line import/no-named-as-default-member
	targetDate: PropTypes.string.isRequired
}

export const StakingSummary = () => {
	const targetDate = "2024-07-31T23:59:59"
	const [tokenList] = useTokenList()
	const [, isLoadingTotalBondedValue] = useTotalBondedValue()
	const [, isLoadingTotalUnbondedValue] = useTotalUnbondedValue({
		tokenList: tokenList ?? []
	})

	return (
		<SimpleGrid
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
			columns={{ base: 1, md: 3, sm: 2 }}
			px={4}
			py={{ base: "1rem", md: "3rem" }}
			rounded="1.25em"
			shadow="md"
			maxW="4xl"
			spacing={{ base: 2, lg: 10, md: 6, sm: 4 }}
			w="full"
		>
			<Box gridColumn={{ base: "1 / -1" }} w="full" textAlign="center" mb={0}>
				<Heading _dark={{ color: "white" }} color="black" as="h1">
					Staked Electron
				</Heading>
			</Box>
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

				align="start"
				bg="rgba(245, 245, 245)"
				h="full"
				maxH={{ base: "full", md: "full" }}
				pos="relative"
				px={3}
				py={{ base: 0, md: 3 }}
				rounded="1.25em"
				shadow="md"
				w={{ base: "full", md: "full" }}
			>
				<VStack align="start" h="full" spacing={0} w="full">
					<Heading
						_dark={{ color: "white" }}
						as="h2"
						color="black"
						fontSize={{ base: 18, md: 22 }}
						fontWeight="400"
						mb={1}
						mt={{ base: 1, md: 0 }}
					>
						Your Stake
					</Heading>
					<Flex align="center" flex={1} w="full">
						<Skeleton
							isLoaded={Boolean(!isLoadingTotalBondedValue && !isLoadingTotalUnbondedValue)}
							rounded="1em"
							w="full"
						>
							<Heading
								as="h1"
								bgClip="text"
								bgGradient="linear(45deg, #4b6cb7, brand.2)"
								fontSize={{ base: "24", lg: "36" }}
								fontWeight="900"
								noOfLines={1}
							>
								SOON
							</Heading>
						</Skeleton>
					</Flex>
				</VStack>
			</Flex>
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

				align="start"
				bg="rgba(245, 245, 245)"
				h="full"
				pos="relative"
				px={3}
				py={{ base: 0, md: 3 }}
				rounded="1.25em"
				shadow="md"
				w={{ base: "full", md: "full" }}
			>
				<VStack align="start" h="full" spacing={0} w="full">
					<Heading
						_dark={{ color: "white" }}
						as="h2"
						color="black"
						fontSize={{ base: 18, md: 22 }}
						fontWeight="400"
						mb={1}
						mt={{ base: 1, md: 0 }}
					>
						Your Rewards
					</Heading>
					<Flex align="center" flex={1} w="full">
						<Skeleton isLoaded={Boolean(!isLoadingTotalBondedValue)} rounded="1em" w="full">
							<Heading
								as="h1"
								bgClip="text"
								bgGradient="linear(45deg, #4b6cb7, brand.2)"
								fontSize={{ base: "24", lg: "36" }}
								fontWeight="900"
								noOfLines={1}
							>
								SOON
							</Heading>
						</Skeleton>
					</Flex>
				</VStack>
			</Flex>
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

				align="start"
				bg="rgba(245, 245, 245)"
				h="full"
				pos="relative"
				px={3}
				py={{ base: 0, md: 3 }}
				rounded="1.25em"
				shadow="md"
				w={{ base: "full", md: "full" }}
			>
				<VStack align="start" h="full" spacing={0} w="full">
					<Heading
						_dark={{ color: "white" }}
						as="h2"
						color="black"
						fontSize={{ base: 18, md: 22 }}
						fontWeight="400"
						mb={1}
						mt={{ base: 1, md: 0 }}
					>
						APY
					</Heading>
					<Flex align="center" flex={1} w="full">
						<Skeleton isLoaded={Boolean(!isLoadingTotalUnbondedValue)} rounded="1em" w="full">
							<Heading
								as="h1"
								bgClip="text"
								bgGradient="linear(45deg, #4b6cb7, brand.2)"
								fontSize={{ base: "24", lg: "36" }}
								fontWeight="900"
								noOfLines={1}
							>
								SOON
								{/* {totalUnbondedValue.toLocaleString("en-US", {
									currency: "USD",
									minimumFractionDigits: 2,
									style: "currency"
								})}
									*/}
							</Heading>
						</Skeleton>
					</Flex>
				</VStack>
			</Flex>
			<Box gridColumn={{ base: "1 / -1" }} w="full" textAlign="center" mb={0}>
				<Box mb={2}>
					<Box as="span" fontWeight="bold" _dark={{ color: "white" }} color="black">
						Unlocks in
					</Box>
				</Box>
				<Flex justifyContent="center">
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
						align="center"
						color="black"
						bg="rgba(245, 245, 245)"
						h="auto"
						pos="relative"
						px={3}
						py={{ base: 0, md: 3 }}
						rounded="1.25em"
						shadow="md"
						w={{ base: "full", md: "30%" }}
						mt="0.5rem"
						justifyContent="center"
					>
						<CountdownTimer targetDate={targetDate} />
					</Flex>
				</Flex>
			</Box>
		</SimpleGrid>
	)
}
