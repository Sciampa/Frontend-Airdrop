/* eslint-disable no-negated-condition */
import { PoolsSwitch } from "./PoolsSwitch"
import { PoolTableMobile } from "./PoolTableMobile"
import {
	Box,
	Button,
	chakra,
	Flex,
	Heading,
	HStack,
	Icon,
	IconButton,
	Input,
	InputGroup,
	InputLeftElement,
	Spacer,
	Table,
	Tbody,
	Td,
	Text,
	Th,
	Thead,
	Tr,
	useBreakpoint,
	VStack
} from "@chakra-ui/react"
import { type ColumnDef, type SortingState } from "@tanstack/react-table"
import {
	flexRender,
	getCoreRowModel,
	getPaginationRowModel,
	getSortedRowModel,
	useReactTable
} from "@tanstack/react-table"
import { useDebounce } from "ahooks"
import { type SetStateAction } from "react"
import { useMemo, useState } from "react"
import {
	FaAngleDoubleLeft,
	FaAngleDoubleRight,
	FaAngleLeft,
	FaAngleRight,
	FaArrowAltCircleDown,
	FaArrowAltCircleUp,
	FaSearch
} from "react-icons/fa"

export type DataTableProps<Data extends object> = {
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	columns: Array<ColumnDef<Data, any>>
	data: Data[]
}

export const PoolTable = <Data extends object>({ data, columns }: DataTableProps<Data>) => {
	const [sorting, setSorting] = useState<SortingState>([])
	const [searchValue, setSearchValue] = useState<string>("")
	const debouncedValue = useDebounce(searchValue, { wait: 250 })
	const handleChange = (event: { target: { value: SetStateAction<string> } }) =>
		setSearchValue(event.target.value)

	const poolsToShow = useMemo(() => {
		return data.filter((row) => {
			if (searchValue.length > 0) {
				return (
					// @ts-expect-error types
					row.pool.poolId.toString().includes(debouncedValue.toLowerCase()) ||
					// @ts-expect-error types
					(TokenSymbol[row.pool.liquidity.token1.denom] ?? String("unknown"))
						.toLowerCase()
						.includes(debouncedValue.toLowerCase()) ||
					// @ts-expect-error types
					(TokenFullName[row.pool.liquidity.token1.denom] ?? String("unknown"))
						.toLowerCase()
						.includes(debouncedValue.toLowerCase()) ||
					// @ts-expect-error types
					(TokenSymbol[row.pool.liquidity.token2.denom] ?? String("unknown"))
						.toLowerCase()
						.includes(debouncedValue.toLowerCase()) ||
					// @ts-expect-error types
					(TokenFullName[row.pool.liquidity.token2.denom] ?? String("unknown"))
						.toLowerCase()
						.includes(debouncedValue.toLowerCase())
				)
			} else {
				return row
			}
		})
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [columns, data, debouncedValue])

	const breakpoint = useBreakpoint({ ssr: false })

	const table = useReactTable({
		autoResetPageIndex: false,
		columns,
		data: poolsToShow,
		getCoreRowModel: getCoreRowModel(),
		getPaginationRowModel: getPaginationRowModel(),
		getSortedRowModel: getSortedRowModel(),
		onSortingChange: setSorting,
		state: {
			sorting
		}
	})

	return (
		<Flex mb={8} justify="center" maxW="6xl" w="full">
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
				bg="rgb(255, 255, 255)"
				flexDir="column"
				py={3}
				px={4}
				rounded="1.25em"
				shadow="md"
				mb={{ base: "16", md: "4" }}
				w="full"
			>
				{breakpoint === "base" || breakpoint === "sm" ? (
					<VStack align="start" pb={2} px={0} w="full">
						<HStack justify="space-between" w="full">
							<Heading
								bgClip="text"
								bgGradient="linear(45deg, #4b6cb7, brand.2)"
								fontSize={{ base: "xl", md: "3xl" }}
							>
								All Pools
							</Heading>
							<HStack justify="end" ml="auto">
								<Text _dark={{ color: "white" }} color="black">
									{"<$100 Pools"}
								</Text>
								<PoolsSwitch />
							</HStack>
						</HStack>
						<InputGroup w="full">
							<InputLeftElement pointerEvents="none">
								<Icon _dark={{ color: "white" }} as={FaSearch} color="gray.800" />
							</InputLeftElement>
							<Input
								_dark={{ _placeholder: { color: "white" }, bg: "gray.800", color: "white" }}
								_hover={{ bg: "gray.200" }}
								_placeholder={{ color: "black" }}
								bg="gray.100"
								color="black"
								fontSize="14"
								onChange={handleChange}
								placeholder="Search..."
								rounded="1.25em"
								shadow="md"
								value={searchValue}
								variant="filled"
							/>
						</InputGroup>
					</VStack>
				) : (
					<HStack pb={2} px={0} w="full">
						<Heading
							bgClip="text"
							bgGradient="linear(45deg, #4b6cb7, brand.2)"
							fontSize={{ base: "xl", md: "3xl" }}
						>
							All Pools
						</Heading>
						<Spacer />
						<HStack>
							<Text _dark={{ color: "white" }} color="black">
								{"Show <$100 Pools"}
							</Text>
							<PoolsSwitch />
						</HStack>
						<InputGroup maxW="12rem">
							<InputLeftElement pointerEvents="none">
								<Icon _dark={{ color: "white" }} as={FaSearch} color="blue.500" />
							</InputLeftElement>
							<Input
								_dark={{
									_placeholder: { color: "white" },
									bg: "rgba(33, 33, 33, 0.5)",
									color: "white"
								}}
								_hover={{ bg: "gray.200" }}
								_focus={{ border: "none", shadow: "glowMd" }}
								_placeholder={{ color: "black" }}
								bg="gray.100"
								color="black"
								fontSize="14"
								onChange={handleChange}
								placeholder="Search..."
								rounded="1.25em"
								shadow="md"
								value={searchValue}
								variant="filled"
							/>
						</InputGroup>
					</HStack>
				)}
				{breakpoint === "base" || breakpoint === "sm" ? (
					<VStack spacing={5} w="full">
						{table.getRowModel().rows.map((row) => (
							// eslint-disable-next-line react/jsx-key
							<PoolTableMobile row={row} />
						))}
					</VStack>
				) : (
					<Box
						w="full"
						maxH="calc(100vh - 10rem)" // Adjust based on the height of other content
						mb={4} // Reduce the margin-bottom
					>
						<Table pos="relative">
							<Thead w="full">
								{table.getHeaderGroups().map((headerGroup) => (
									<Tr key={headerGroup.id}>
										{headerGroup.headers.map((header) => {
											// see https://tanstack.com/table/v8/docs/api/core/column-def#meta to type this correctly
											// eslint-disable-next-line @typescript-eslint/no-explicit-any
											const meta: any = header.column.columnDef.meta
											return (
												<Th
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
													_first={{
														roundedStart: "1.25em"
													}}
													_last={{ roundedEnd: "1.25em" }}
													bg="gray.100"
													borderBottom="none"
													color="black"
													fontSize="14"
													fontWeight="400"
													isNumeric={meta?.isNumeric}
													key={header.id}
													onClick={header.column.getToggleSortingHandler()}
													py={1.5}
													textTransform="capitalize"
												>
													{header.column.columnDef.header !== "Actions" ? (
														<Button
															_hover={{
																bgGradient: "linear(45deg, #4b6cb7,brand.2)"
															}}
															bg="rgb(59,130,246, 0.8)"
															color="white"
															rounded="0.8em"
															size="sm"
														>
															{flexRender(header.column.columnDef.header, header.getContext())}

															<Flex ps={1}>
																{header.column.getIsSorted() ? (
																	header.column.getIsSorted() === "desc" ? (
																		<FaArrowAltCircleDown aria-label="sorted descending" />
																	) : (
																		<FaArrowAltCircleUp aria-label="sorted ascending" />
																	)
																) : null}
															</Flex>
														</Button>
													) : (
														"Actions"
													)}
												</Th>
											)
										})}
									</Tr>
								))}
							</Thead>
							<Tbody>
								{table.getRowModel().rows.map((row) => (
									<Tr
										_hover={{ bg: "rgba(33, 33, 33, 0.2)", shadow: "md" }}
										key={row.id}
										pos="relative"
										rounded="1.25em"
										top="0.5rem"
									>
										{row.getVisibleCells().map((cell) => {
											// see https://tanstack.com/table/v8/docs/api/core/column-def#meta to type this correctly
											// eslint-disable-next-line @typescript-eslint/no-explicit-any
											const meta: any = cell.column.columnDef.meta
											return (
												<Td
													_first={{ roundedStart: "1.25em" }}
													_last={{ roundedEnd: "1.25em" }}
													borderBottom="none"
													isNumeric={meta?.isNumeric}
													key={cell.id}
												>
													{flexRender(cell.column.columnDef.cell, cell.getContext())}
												</Td>
											)
										})}
									</Tr>
								))}
							</Tbody>
						</Table>
					</Box>
				)}
				<HStack justify="center" mt={4} mb={4} w="full">
					<IconButton
						_dark={{
							_disabled: {
								_active: { bg: "whiteAlpha.200", color: "whiteAlpha.500", cursor: "not-allowed" },
								_focus: { bg: "whiteAlpha.200", color: "whiteAlpha.500", cursor: "not-allowed" },
								bg: "whiteAlpha.200",
								color: "whiteAlpha.500",
								cursor: "not-allowed"
							},
							_hover: { bg: "gray.600" },
							bg: "gray.700",
							color: "white"
						}}
						_disabled={{
							_active: { bg: "blackAlpha.200", color: "blackAlpha.500", cursor: "not-allowed" },
							_focus: { bg: "blackAlpha.200", color: "blackAlpha.500", cursor: "not-allowed" },
							bg: "blackAlpha.200",
							color: "blackAlpha.500",
							cursor: "not-allowed"
						}}
						_hover={{ bg: "gray.200" }}
						aria-label="firstPage"
						bg="gray.300"
						color="black"
						icon={<FaAngleDoubleLeft />}
						isDisabled={!table.getCanPreviousPage()}
						onClick={() => table.setPageIndex(0)}
						rounded="0.8em"
						shadow="md"
						size="md"
					/>
					<IconButton
						_dark={{
							_disabled: {
								_active: { bg: "whiteAlpha.200", color: "whiteAlpha.500", cursor: "not-allowed" },
								_focus: { bg: "whiteAlpha.200", color: "whiteAlpha.500", cursor: "not-allowed" },
								bg: "whiteAlpha.200",
								color: "whiteAlpha.500",
								cursor: "not-allowed"
							},
							_hover: { bg: "gray.600" },
							bg: "gray.700",
							color: "white"
						}}
						_disabled={{
							_active: { bg: "blackAlpha.200", color: "blackAlpha.500", cursor: "not-allowed" },
							_focus: { bg: "blackAlpha.200", color: "blackAlpha.500", cursor: "not-allowed" },
							bg: "blackAlpha.200",
							color: "blackAlpha.500",
							cursor: "not-allowed"
						}}
						_hover={{ bg: "gray.200" }}
						aria-label="previousPage"
						bg="gray.300"
						color="black"
						icon={<FaAngleLeft />}
						isDisabled={!table.getCanPreviousPage()}
						onClick={() => table.previousPage()}
						rounded="0.8em"
						shadow="md"
						size="md"
					/>
					<Text _dark={{ color: "white" }} fontWeight="900" color="black">
						{table.getState().pagination.pageIndex + 1}{" "}
						<chakra.span fontWeight="400" px="2px">
							of
						</chakra.span>{" "}
						{table.getPageCount()}
					</Text>
					<IconButton
						_dark={{
							_disabled: {
								_active: { bg: "whiteAlpha.200", color: "whiteAlpha.500", cursor: "not-allowed" },
								_focus: { bg: "whiteAlpha.200", color: "whiteAlpha.500", cursor: "not-allowed" },
								bg: "whiteAlpha.200",
								color: "whiteAlpha.500",
								cursor: "not-allowed"
							},
							_hover: { bg: "gray.600" },
							bg: "gray.700",
							color: "white"
						}}
						_disabled={{
							_active: { bg: "blackAlpha.200", color: "blackAlpha.500", cursor: "not-allowed" },
							_focus: { bg: "blackAlpha.200", color: "blackAlpha.500", cursor: "not-allowed" },
							bg: "blackAlpha.200",
							color: "blackAlpha.500",
							cursor: "not-allowed"
						}}
						_hover={{ bg: "gray.200" }}
						aria-label="nextPage"
						bg="gray.300"
						color="black"
						icon={<FaAngleRight />}
						isDisabled={!table.getCanNextPage()}
						onClick={() => table.nextPage()}
						rounded="0.8em"
						shadow="md"
						size="md"
					/>
					<IconButton
						_dark={{
							_disabled: {
								_active: { bg: "whiteAlpha.200", color: "whiteAlpha.500", cursor: "not-allowed" },
								_focus: { bg: "whiteAlpha.200", color: "whiteAlpha.500", cursor: "not-allowed" },
								bg: "whiteAlpha.200",
								color: "whiteAlpha.500",
								cursor: "not-allowed"
							},
							_hover: { bg: "gray.600" },
							bg: "gray.700",
							color: "white"
						}}
						_disabled={{
							_active: { bg: "blackAlpha.200", color: "blackAlpha.500", cursor: "not-allowed" },
							_focus: { bg: "blackAlpha.200", color: "blackAlpha.500", cursor: "not-allowed" },
							bg: "blackAlpha.200",
							color: "blackAlpha.500",
							cursor: "not-allowed"
						}}
						_hover={{ bg: "gray.200" }}
						aria-label="lastPage"
						bg="gray.300"
						color="black"
						icon={<FaAngleDoubleRight />}
						isDisabled={!table.getCanNextPage()}
						onClick={() => table.setPageIndex(table.getPageCount() - 1)}
						rounded="0.8em"
						shadow="md"
						size="md"
					/>
				</HStack>
			</Flex>
		</Flex>
	)
}
