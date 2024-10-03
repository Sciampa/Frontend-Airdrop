import { Flex, Menu, VStack } from "@chakra-ui/react"
import { type Row } from "@tanstack/react-table"
import { flexRender } from "@tanstack/react-table"

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const PoolTableMobile = ({ row }: { row: Row<any> }) => {
	return (
		<Menu isLazy matchWidth offset={[0, -5]}>
			{({ isOpen }) => (
				<Flex
					_dark={{
						_hover: {
							bgGradiend:
								"linear-gradient(137deg, rgba(143, 143, 143, 0.00) 41.48%, rgba(133, 133, 133, 0.28) 134.85%)"
						},
						color: "white"
					}}
					_hover={{ bg: "gray.200", cursor: "pointer", shadow: "md" }}
					as={Flex}
					border="1px solid rgba(224, 230, 255, 0.10)"
					color="black"
					bg="linear-gradient(137deg, rgba(143, 143, 143, 0.00) 41.48%, rgba(133, 133, 133, 0.28) 134.85%)"
					flexDir="column"
					key={row.id}
					pos="relative"
					px={3}
					py={3}
					roundedBottom={isOpen ? "0" : "1.25em"}
					roundedTop="1.25em"
					shadow="md"
					transition="0.2s all"
					w="full"
				>
					<VStack align="start" spacing={3} w="full">
						{row.getVisibleCells().map((cell, index) => {
							if (index === 3) {
								return null
							}

							if (index === 0) {
								return (
									<Flex key={cell.id} mb={2}>
										{flexRender(cell.column.columnDef.cell, cell.getContext())}
									</Flex>
								)
							}

							return (
								<Flex key={cell.id}>
									{flexRender(cell.column.columnDef.cell, cell.getContext())}
								</Flex>
							)
						})}
					</VStack>
				</Flex>
			)}
		</Menu>
	)
}
