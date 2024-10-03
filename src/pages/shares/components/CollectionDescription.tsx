import { Button, Divider, Flex, HStack, Icon, Link, Text, VStack } from "@chakra-ui/react"
import { MemoizedAvatar } from "@components/MemoizedAvatar"
import React, { useState } from "react"
import {
	FaChevronDown,
	FaChevronUp,
	FaGlobe,
	FaMedium,
	FaTelegramPlane,
	FaTwitter
} from "react-icons/fa"
import { FaBars, FaCircleInfo, FaNotesMedical } from "react-icons/fa6"

type Socials = {
	medium?: string
	telegram?: string
	twitter?: string
	website?: string
}

type CollectionDescriptionProps = {
	// eslint-disable-next-line react/no-unused-prop-types
	author: string
	collection: {
		Author: string
		Tquantity: string
		contractAddress: string
		image: string
		imageA: string
		imageB: string
		name: string
		socials?: Socials
		tokenA: string
		tokenB: string
	}
	description: string
}

const shortenAddress = (address: string, startLength: number = 6, endLength: number = 6) => {
	if (address.length <= startLength + endLength) {
		return address
	}

	const start = address.slice(0, startLength)
	const end = address.slice(-endLength)
	return `${start}...${end}`
}

const CollectionDescription: React.FC<CollectionDescriptionProps> = ({
	description,
	collection
}) => {
	const [isTraitsExpanded, setIsTraitsExpanded] = useState(false)
	const [isDetailsExpanded, setIsDetailsExpanded] = useState(false)

	const toggleTraits = () => setIsTraitsExpanded((previous) => !previous)
	const toggleDetails = () => setIsDetailsExpanded((previous) => !previous)

	return (
		<VStack>
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
				width={{ base: "22rem", md: "25rem" }}
				mt={{ base: "-1rem", md: "0rem" }}
			>
				<VStack w="full" alignItems="flex-start" p={4}>
					<HStack spacing={2} alignItems="center">
						<Icon
							as={FaBars}
							_dark={{ color: "white" }}
							color="black"
							h="0.7rem"
							w="0.7rem"
							mt="0.05rem"
						/>
						<Text _dark={{ color: "white" }} color="black" p={1} fontSize="xs">
							Description
						</Text>
					</HStack>
					<Divider w="full" _dark={{ color: "white" }} color="black" />
					<HStack justify="space-between" gap={{ base: "14.5rem", md: "17.5rem" }}>
						<Text textAlign="left" color="white" fontSize="2xs">
							Issuer
						</Text>
						{/* Add socials after the text */}
						{collection.socials && (
							<HStack spacing={2} mb="-0.9rem" justify="start" w="full" mt="-0.8rem">
								{collection.socials.twitter && (
									<a href={collection.socials.twitter} target="_blank" rel="noopener noreferrer">
										<Icon as={FaTwitter} w={3} h={3} color="white" />
									</a>
								)}
								{collection.socials.telegram && (
									<a href={collection.socials.telegram} target="_blank" rel="noopener noreferrer">
										<Icon as={FaTelegramPlane} w={3} h={3} color="white" />
									</a>
								)}
								{collection.socials.medium && (
									<a href={collection.socials.medium} target="_blank" rel="noopener noreferrer">
										<Icon as={FaMedium} w={3} h={3} color="white" />
									</a>
								)}
								{collection.socials.website && (
									<a href={collection.socials.website} target="_blank" rel="noopener noreferrer">
										<Icon as={FaGlobe} w={3} h={3} color="white" />
									</a>
								)}
							</HStack>
						)}
					</HStack>
					<HStack>
						<Text
							_dark={{ color: "white" }}
							color="black"
							textAlign="left"
							fontSize="2xs"
							fontWeight="bold"
						>
							{collection.Author || "Unknown"}
						</Text>
					</HStack>
					<Text textAlign="left" color="#4b6cb7" fontSize="2xs">
						{collection.tokenA} {collection.tokenB}
					</Text>
					<Divider w="full" _dark={{ color: "white" }} color="black" />
					<HStack width="full" align="center">
						<HStack spacing={2} flex="1">
							<Icon as={FaCircleInfo} h="0.7rem" w="0.7rem" mt="0.1rem" />
							<Text _dark={{ color: "white" }} color="black" fontSize="xs">
								About
							</Text>
						</HStack>
						<Button
							onClick={toggleTraits}
							size="xs"
							variant="link"
							rightIcon={<Icon as={isTraitsExpanded ? FaChevronUp : FaChevronDown} />}
							p={0}
							minW="auto"
						/>
					</HStack>
					{isTraitsExpanded && description && (
						<VStack mt={4} spacing={4} p={4} border="1px" borderColor="gray.200" borderRadius="md">
							<Text _dark={{ color: "white" }} color="black" fontSize="2xs">
								{description}
							</Text>
						</VStack>
					)}
					<Divider w="full" _dark={{ color: "white" }} color="black" />
					<HStack width="full" align="center">
						<HStack spacing={2} flex="1">
							<Icon
								_dark={{ color: "white" }}
								color="black"
								as={FaNotesMedical}
								h="0.7rem"
								w="0.7rem"
								mt="0.1rem"
							/>
							<Text _dark={{ color: "white" }} color="black" fontSize="xs">
								Details
							</Text>
						</HStack>
						<Button
							onClick={toggleDetails}
							size="xs"
							variant="link"
							rightIcon={<Icon as={isDetailsExpanded ? FaChevronUp : FaChevronDown} />}
							p={0}
							minW="auto"
						/>
					</HStack>
					{isDetailsExpanded && (
						<VStack
							_dark={{ color: "white" }}
							color="black"
							mt={4}
							spacing={2}
							p={4}
							border="1px"
							borderColor="gray.200"
							borderRadius="md"
							minWidth={{ base: "20rem", md: "23rem" }}
						>
							<HStack width="full" justify="space-between">
								<Text fontSize="2xs">Binary Coin Holdings</Text>
								<HStack>
									<MemoizedAvatar
										border="none"
										src={collection.imageA ?? "/assets/electron.png"}
										w={{ base: "1.5rem", md: "1rem" }}
										h={{ base: "1.5rem", md: "1rem" }}
										blurHash="jdgthr5gei4fhsqg"
									/>
									<Text color="gray" ml={-1} mr={-1} fontSize="2xs">
										/
									</Text>
									<MemoizedAvatar
										border="none"
										src={collection.imageB ?? "/assets/electron.png"}
										w={{ base: "1.5rem", md: "1rem" }}
										h={{ base: "1.5rem", md: "1rem" }}
										blurHash="jdgthr5gei4fhsqg"
									/>
								</HStack>
							</HStack>
							<HStack width="full" justify="space-between">
								<Text fontSize="2xs">RUA Certificate Cap</Text>
								<Text fontSize="2xs">{collection.Tquantity}</Text>
							</HStack>
							<HStack width="full" justify="space-between">
								<Text fontSize="2xs">Contract Address</Text>
								<Text fontSize="2xs">{shortenAddress(collection.contractAddress)}</Text>
							</HStack>
							<HStack width="full" justify="end">
								<Link
									href={`https://www.mintscan.io/neutron/wasm/contract/${collection.contractAddress}`}
									isExternal
								>
									<Text fontSize="2xs" textDecoration="underline">
										View on MintScan
									</Text>
								</Link>
							</HStack>
						</VStack>
					)}
				</VStack>
			</Flex>
		</VStack>
	)
}

export default CollectionDescription
