import { Button, Flex, HStack, Icon, Text, VStack } from "@chakra-ui/react"
import { MemoizedAvatar } from "@components/MemoizedAvatar"
import React, { useState } from "react"
import { FaChevronDown, FaChevronUp, FaNotesMedical } from "react-icons/fa"

type CollectionDetailsProps = {
	Tquantity: string
	contractAddress: string
	imageA?: string
	imageB?: string
	name: string
}

const shortenAddress = (address: string, startLength: number = 6, endLength: number = 6) => {
	if (address.length <= startLength + endLength) {
		return address
	}

	return `${address.slice(0, startLength)}...${address.slice(-endLength)}`
}

const CollectionDetails: React.FC<CollectionDetailsProps> = ({
	name,
	Tquantity,
	imageA,
	imageB,
	contractAddress
}) => {
	const [isExpanded, setIsExpanded] = useState(false)

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
			bg="rgba(255, 255, 255)"
			rounded="1.25em"
			shadow="md"
			width="400px"
		>
			<VStack w="full" alignItems="flex-start" p={4}>
				<HStack width="full" align="center">
					<HStack spacing={2} flex="1">
						<Icon as={FaNotesMedical} h="0.7rem" w="0.7rem" mt="0.1rem" />
						<Text _dark={{ color: "white" }} color="black" fontSize="xs">
							Details
						</Text>
					</HStack>
					<Button
						onClick={() => setIsExpanded(!isExpanded)}
						size="xs"
						variant="link"
						rightIcon={<Icon as={isExpanded ? FaChevronUp : FaChevronDown} />}
						p={0}
						minW="auto"
					/>
				</HStack>
				{isExpanded && (
					<VStack
						_dark={{ color: "white" }}
						color="black"
						mt={4}
						spacing={2}
						p={4}
						border="1px"
						borderColor="gray.200"
						borderRadius="md"
						minWidth="23rem"
					>
						<HStack width="full" justify="space-between">
							<Text fontSize="2xs">Collection Name</Text>
							<Text fontSize="2xs">{name}</Text>
						</HStack>
						<HStack width="full" justify="space-between">
							<Text fontSize="2xs">RUA Quantity</Text>
							<Text fontSize="2xs">{Tquantity}</Text>
						</HStack>
						<HStack width="full" justify="space-between">
							<Text fontSize="2xs">Pair</Text>
							<HStack>
								<MemoizedAvatar
									border="none"
									src={imageA ?? "/assets/electron.png"}
									w={{ base: "2rem", md: "1rem" }}
									h={{ base: "2rem", md: "1rem" }}
									blurHash="jdgthr5gei4fhsqg"
								/>
								<Text color="gray" ml={-1} mr={-1} fontSize="2xs">
									/
								</Text>
								<MemoizedAvatar
									border="none"
									src={imageB ?? "/assets/electron.png"}
									w={{ base: "2rem", md: "1rem" }}
									h={{ base: "2rem", md: "1rem" }}
									blurHash="jdgthr5gei4fhsqg"
								/>
							</HStack>
						</HStack>
						<HStack width="full" justify="space-between">
							<Text fontSize="2xs">Contract Address</Text>
							<Text fontSize="2xs">{shortenAddress(contractAddress)}</Text>
						</HStack>
						<HStack width="full" justify="end">
							<a
								href={`https://www.mintscan.io/neutron/wasm/contract/${contractAddress}`}
								target="_blank"
								rel="noopener noreferrer"
							>
								<Text fontSize="2xs" textDecoration="underline">
									View on MintScan
								</Text>
							</a>
						</HStack>
					</VStack>
				)}
			</VStack>
		</Flex>
	)
}

export default CollectionDetails
