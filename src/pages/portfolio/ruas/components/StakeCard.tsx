/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-console */
import { useExecuteStake } from "../hooks/tx/useExecuteStake"
import { InfoIcon } from "@chakra-ui/icons"
import { Button, Flex, HStack, Icon, Text, Tooltip, VStack } from "@chakra-ui/react"
import { useState } from "react"

type StakingContract = {
	address: string
	msg: string
}

type Collection = {
	marketAddress: string
	stakingContract: StakingContract
}

type StakeCardProps = {
	collection: Collection
	contractAddress: string
	tokenId: string
}

const StakeCard = ({ contractAddress, tokenId, collection }: StakeCardProps) => {
	const { mutate: executeStake } = useExecuteStake({ collection })
	const handleConfirm = () => {
		if (!contractAddress || !tokenId) {
			console.error("Contract Address or Token ID is undefined")
			return
		}

		executeStake({
			collection: {
				stakingContract: {
					address: collection.stakingContract.address,
					msg: collection.stakingContract.msg
				}
			},
			msg: "",
			nftContract: contractAddress,
			tokenId
		})
	}

	return (
		<Flex
			sx={{ perspective: "1000px" }}
			align="center"
			justify="center"
			h="8rem"
			w="9rem"
			mt="-0.5rem"
		>
			<Flex position="relative" w="100%" h="100%">
				<Flex
					position="absolute"
					sx={{
						backfaceVisibility: "hidden"
					}}
					align="center"
					justify="center"
					flexDirection="column"
					h="100%"
					w="100%"
					bg="white"
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
					<VStack justify="space-between" gap={1}>
						<Flex
							align="center"
							justify="center"
							flexDirection="column"
							w="8rem"
							h="4.5rem"
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
							<Text align="center" fontSize="0.7rem" w="full">
								Actual APY
							</Text>
							<Text mt="-0.2rem" align="center" fontSize="0.7rem" fontWeight="bold" w="full">
								173%
							</Text>
							<Text align="center" fontSize="0.7rem" w="full">
								Last weekly dividends
							</Text>
							<Text mt="-0.2rem" align="center" fontSize="0.7rem" fontWeight="bold" w="full">
								$103.2
							</Text>
						</Flex>
						<HStack>
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
								minW="4rem"
								onClick={handleConfirm}
								mt="0.5rem"
							>
								Start earning
							</Button>
							<Tooltip
								label={
									<div>
										<p>
											It will take 12 days from when you stop earning until you can withdraw them.
											During that time, you will not receive rewards for RUA, your voting power will
											be revoked and you will not be able to cancel the process.
										</p>
									</div>
								}
								bgGradient="linear(to right, rgba(75, 108, 183, 0.8), rgba(24, 40, 72, 0.8), rgba(75, 108, 183, 0.8))"
								borderRadius="10px"
								fontSize="0.5rem"
								textAlign="center"
								placement="top"
								color="white"
								p={2}
							>
								<Icon
									as={InfoIcon}
									boxSize={2}
									position="absolute"
									top="73%"
									left="81%"
									transform="translateY(-50%)"
									cursor="pointer"
									zIndex={1}
								/>
							</Tooltip>
						</HStack>
					</VStack>
				</Flex>
			</Flex>
		</Flex>
	)
}

export default StakeCard
