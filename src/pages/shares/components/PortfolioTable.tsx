/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable no-console */
/* eslint-disable no-negated-condition */
/* eslint-disable @typescript-eslint/no-explicit-any */
import {
	chakra,
	Flex,
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
import RpcStatusIndicator from "@components/RpcStatusIndicator"
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
import { AwesomeButton } from "react-awesome-button"
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
	columns: Array<ColumnDef<Data, any>>
	data: Data[]
}

export const PortfolioTable = <Data extends object>({
	data,
	columns,
	favourites
}: DataTableProps<Data> & { favourites: string[] }) => {
	const [sorting, setSorting] = useState<SortingState>([])
	const [searchValue, setSearchValue] = useState<string>("")
	const debouncedValue = useDebounce(searchValue, { wait: 250 })
	const handleChange = (event: { target: { value: SetStateAction<string> } }) =>
		setSearchValue(event.target.value)
	// const [TokenSymbol, setTokenSymbol] = useState<Record<string, string>>({})
	// const [TokenFullName, setTokenFullName] = useState<Record<string, string>>({})
	const rpcMainnetUrl = "https://api.electronprotocol.io"

	const { otherRows } = useMemo(() => {
		const currentFavoriteRows = data.filter((row) => {
			if (searchValue.length > 0) {
				return (
					// @ts-expect-error types
					favourites.includes(row.denom) &&
					// @ts-expect-error types
					(row.symbol.toLowerCase().includes(debouncedValue.toLowerCase()) ||
						// @ts-expect-error types
						row.denom.toLowerCase().includes(debouncedValue.toLowerCase()))
				)
			} else {
				// @ts-expect-error types
				return favourites.includes(row.denom)
			}
		})

		const currentOtherRows = data.filter((row) => {
			if (searchValue.length > 0) {
				return (
					// @ts-expect-error types
					!favourites.includes(row.token.token) &&
					// @ts-expect-error types
					(row.symbol.toLowerCase().includes(debouncedValue.toLowerCase()) ||
						// @ts-expect-error types
						row.denom.toLowerCase().includes(debouncedValue.toLowerCase()))
				)
			} else {
				// @ts-expect-error types
				return !favourites.includes(row.denom)
			}
		})

		return { favoriteRows: currentFavoriteRows, otherRows: currentOtherRows }
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [columns, data, favourites, debouncedValue])

	const table = useReactTable({
		autoResetPageIndex: false,
		columns,
		data: otherRows,
		getCoreRowModel: getCoreRowModel(),
		getPaginationRowModel: getPaginationRowModel(),
		getSortedRowModel: getSortedRowModel(),
		onSortingChange: setSorting,
		state: {
			sorting
		}
	})

	const breakpoint = useBreakpoint({ ssr: false })

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
			bg="rgb(255, 255, 255)"
			flexDir="column"
			px={2}
			py={2}
			rounded="1.25em"
			shadow="md"
			maxW="6xl"
			w="full"
			alignItems="center"
		>
			{breakpoint === "base" || breakpoint === "sm" ? (
				<VStack align="start" pb={2} px={0} w="full">
					<HStack justify="space-between" w="full">
						<RpcStatusIndicator
							rpcUrl={
								import.meta.env.VITE_NEUTRONNETWORK === "neutron" ? rpcMainnetUrl : rpcMainnetUrl
							}
						/>
						<Text fontSize="0.8rem" _dark={{ color: "gray.200" }} color="gray.700">
							2
						</Text>
						<Text fontSize="0.8rem" _dark={{ color: "gray.200" }} color="gray.700">
							Results
						</Text>
					</HStack>
					<InputGroup w="full">
						<InputLeftElement pointerEvents="none">
							<Icon _dark={{ color: "white" }} as={FaSearch} color="blue.500" />
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
				<HStack ml="1.4rem" pb={2} px={0} w="full">
					<RpcStatusIndicator
						rpcUrl={
							import.meta.env.VITE_NEUTRONNETWORK === "neutron" ? rpcMainnetUrl : rpcMainnetUrl
						}
					/>
					<Text fontSize="0.8rem" _dark={{ color: "gray.200" }} color="gray.700">
						2
					</Text>
					<Text fontSize="0.8rem" _dark={{ color: "gray.200" }} color="gray.700">
						Results
					</Text>
					<Spacer />
					<InputGroup maxW="12rem">
						<InputLeftElement pointerEvents="none">
							<Icon _dark={{ color: "white" }} as={FaSearch} color="blue.500" />
						</InputLeftElement>
						<Input
							_dark={{
								_placeholder: { color: "white" },
								bg: "#182848",
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
							shadow="lg"
							value={searchValue}
							variant="filled"
							mr="0.8rem"
						/>
					</InputGroup>
				</HStack>
			)}
			<Table
				pos="relative"
				border="1px solid rgba(224, 230, 255, 0.10)"
				borderRadius="0.5rem"
				overflow="hidden"
			>
				<Thead bg="gray.100" _dark={{ bg: "#182848", color: "white" }}>
					{table.getHeaderGroups().map((headerGroup) => (
						<Tr key={headerGroup.id}>
							{headerGroup.headers.map((header) => {
								const meta: any = header.column.columnDef.meta
								const isCollectionHeader = header.column.columnDef.header === "Collection"
								return (
									<Th
										_dark={{ bg: "#182848", color: "white" }}
										bg="#182848"
										borderBottom="none"
										color="black"
										fontSize="14"
										fontWeight="400"
										isNumeric={meta?.isNumeric}
										key={header.id}
										onClick={header.column.getToggleSortingHandler()}
										py={1}
										textTransform="capitalize"
										textAlign={isCollectionHeader ? "start" : "center"}
										pr={isCollectionHeader ? "0rem" : "0rem"}
									>
										{header.column.columnDef.header !== "Actions" ? (
											<AwesomeButton>
												<Flex
													alignItems="center"
													justifyContent={isCollectionHeader ? "flex-start" : "center"}
												>
													{flexRender(header.column.columnDef.header, header.getContext())}
													<Flex ps={0}>
														{header.column.getIsSorted() ? (
															header.column.getIsSorted() === "desc" ? (
																<Icon as={FaArrowAltCircleDown} />
															) : (
																<Icon as={FaArrowAltCircleUp} />
															)
														) : null}
													</Flex>
												</Flex>
											</AwesomeButton>
										) : (
											<Flex alignItems="center" justifyContent="center">
												{flexRender(header.column.columnDef.header, header.getContext())}
											</Flex>
										)}
									</Th>
								)
							})}
						</Tr>
					))}
				</Thead>
				<Tbody>
					{table.getRowModel().rows.map((row) => (
						<Tr _hover={{ bg: "rgba(33, 33, 33, 0.2)", shadow: "md" }} key={row.id}>
							{row.getVisibleCells().map((cell) => (
								<Td key={cell.id} textAlign="center">
									{flexRender(cell.column.columnDef.cell, cell.getContext())}
								</Td>
							))}
						</Tr>
					))}
				</Tbody>
			</Table>
			<HStack justify="center" mt={0} mb={2} w="full">
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
	)
}
