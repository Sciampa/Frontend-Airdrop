import {
	Box,
	Divider,
	Flex,
	HStack,
	Icon,
	Table,
	TableContainer,
	Tbody,
	Td,
	Text,
	Th,
	Thead,
	Tr,
	VStack
} from "@chakra-ui/react"
import React from "react"
import { FaNotesMedical } from "react-icons/fa6"

type CollectionDescriptionProps = {
	collection: {
		Author: string
		Tquantity: string
		contractAddress: string
		image: string
		imageA: string
		imageB: string
		name: string
	}
}

const data = [
	{
		expiration: "-",
		floordifference: "-",
		from: "-",
		quantity: "-",
		unitPrice: "-",
		usdUnitPrice: "-"
	},
	{
		expiration: "-",
		floordifference: "-",
		from: "-",
		quantity: "-",
		unitPrice: "-",
		usdUnitPrice: "-"
	},
	{
		expiration: "-",
		floordifference: "-",
		from: "-",
		quantity: "-",
		unitPrice: "-",
		usdUnitPrice: "-"
	},
	{
		expiration: "-",
		floordifference: "-",
		from: "-",
		quantity: "-",
		unitPrice: "-",
		usdUnitPrice: "-"
	}
]

const CollectionActivity: React.FC<CollectionDescriptionProps> = () => {
	return (
		<Flex justify="center">
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
					p={5}
					ml={0}
					minWidth={{ base: "22rem", md: "46rem" }}
					height="9.5rem"
				>
					<VStack w="full" alignItems="flex-start">
						<HStack width="full" align="center" mt="-0.8rem">
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
									Item Activity
								</Text>
							</HStack>
						</HStack>

						{/* Price Table */}
						<Divider mb="-2" w="full" _dark={{ color: "white" }} color="black" />
						<TableContainer w="full">
							<Table variant="simple">
								<Thead>
									<Tr>
										<Th
											_dark={{ color: "white" }}
											color="black"
											fontSize="0.4rem"
											p={0.2}
											textAlign="center"
											verticalAlign="middle"
										>
											Event
										</Th>
										<Th
											_dark={{ color: "white" }}
											color="black"
											fontSize="0.4rem"
											p={0.2}
											textAlign="center"
											verticalAlign="middle"
										>
											Unit Price
										</Th>
										<Th
											_dark={{ color: "white" }}
											color="black"
											fontSize="0.4rem"
											p={0.2}
											textAlign="center"
											verticalAlign="middle"
										>
											Quantity
										</Th>
										<Th
											_dark={{ color: "white" }}
											color="black"
											fontSize="0.4rem"
											p={0.2}
											textAlign="center"
											verticalAlign="middle"
										>
											From
										</Th>
										<Th
											_dark={{ color: "white" }}
											color="black"
											fontSize="0.4rem"
											p={0.2}
											textAlign="center"
											verticalAlign="middle"
										>
											To
										</Th>
										<Th
											_dark={{ color: "white" }}
											color="black"
											fontSize="0.4rem"
											p={0.2}
											textAlign="center"
											verticalAlign="middle"
										>
											Date
										</Th>
									</Tr>
								</Thead>
								<Tbody>
									{data.map((item, index) => (
										// eslint-disable-next-line react/no-array-index-key
										<Tr key={index}>
											<Td
												_dark={{ color: "white" }}
												color="black"
												fontSize="0.4rem"
												p={0.2}
												textAlign="center"
												verticalAlign="middle"
											>
												{item.unitPrice}
											</Td>
											<Td
												_dark={{ color: "white" }}
												color="black"
												fontSize="0.4rem"
												p={0.2}
												textAlign="center"
												verticalAlign="middle"
											>
												{item.usdUnitPrice}
											</Td>
											<Td
												_dark={{ color: "white" }}
												color="black"
												fontSize="0.4rem"
												p={0.2}
												textAlign="center"
												verticalAlign="middle"
											>
												{item.quantity}
											</Td>
											<Td
												_dark={{ color: "white" }}
												color="black"
												fontSize="0.4rem"
												p={0.2}
												textAlign="center"
												verticalAlign="middle"
											>
												{item.floordifference}
											</Td>
											<Td
												_dark={{ color: "white" }}
												color="black"
												fontSize="0.4rem"
												p={0.2}
												textAlign="center"
												verticalAlign="middle"
											>
												{item.expiration}
											</Td>
											<Td
												_dark={{ color: "white" }}
												color="black"
												fontSize="0.4rem"
												p={0.2}
												textAlign="center"
												verticalAlign="middle"
											>
												{item.from}
											</Td>
										</Tr>
									))}
								</Tbody>
							</Table>
						</TableContainer>
					</VStack>
				</Flex>
			</VStack>
			<Box height="11rem" />
		</Flex>
	)
}

export default CollectionActivity
