/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable react/hook-use-state */
/* eslint-disable no-console */
/* eslint-disable no-negated-condition */
import RpcStatusIndicator from "../../../components/RpcStatusIndicator"
import { PoolsSwitch } from "./PoolsSwitch"
import { PoolTableMobile } from "./PoolTableMobile"
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
import { type DataTableProps } from "@pages/rwa/components/PoolTable"
import { type SortingState } from "@tanstack/react-table"
import {
	flexRender,
	getCoreRowModel,
	getPaginationRowModel,
	getSortedRowModel,
	useReactTable
} from "@tanstack/react-table"
import { useDebounce } from "ahooks"
import { type SetStateAction, useEffect } from "react"
import { useMemo, useState } from "react"
import { AwesomeButton } from "react-awesome-button"
// eslint-disable-next-line
import {
	FaAngleDoubleLeft,
	FaAngleDoubleRight,
	FaAngleLeft,
	FaAngleRight,
	FaArrowAltCircleDown,
	FaArrowAltCircleUp,
	FaSearch
} from "react-icons/fa"

export const PoolTable = <Data extends object>({ data, columns }: DataTableProps<Data>) => {
	const [sorting, setSorting] = useState<SortingState>([])
	const [searchValue, setSearchValue] = useState<string>("")
	const debouncedValue = useDebounce(searchValue, { wait: 250 })
	const handleChange = (event: { target: { value: SetStateAction<string> } }) =>
		setSearchValue(event.target.value)

	const [TokenSymbol, setTokenSymbol] = useState<Record<string, string>>({})
	const [TokenFullName, setTokenFullName] = useState<Record<string, string>>({})
	const rpcMainnetUrl = "https://api.electronprotocol.io"
	const fetchTokenData = async () => {
		try {
			const response = await fetch(
				"https://raw.githubusercontent.com/Electron-Protocol/Assetlist/main/assets/tokenList.json"
			)
			// eslint-disable-next-line @typescript-eslint/no-shadow
			const data = await response.json()

			// Update TokenSymbol and TokenFullName with fetched data
			const symbolMap: Record<string, string> = {}
			const fullNameMap: Record<string, string> = {}

			// eslint-disable-next-line unicorn/no-array-for-each, @typescript-eslint/no-explicit-any
			data.tokens.forEach((token: any) => {
				symbolMap[token.denom] = token.symbol
				fullNameMap[token.denom] = token.fullName
			})

			setTokenSymbol(symbolMap)
			setTokenFullName(fullNameMap)
		} catch (error) {
			console.error("Error fetching token data:", error)
		}
	}

	useEffect(() => {
		void fetchTokenData()
	}, [])

	// Define your search logic
	const poolsToShow = useMemo(() => {
		return data.filter(
			// eslint-disable-next-line @typescript-eslint/ban-ts-comment
			// @ts-expect-error
			(row: {
				pool: {
					liquidity: { token1: { denom: number | string }; token2: { denom: number | string } }
					poolId: { toString: () => string[] | string }
				}
			}) => {
				if (searchValue.length > 0) {
					return (
						row.pool.poolId.toString().includes(debouncedValue.toLowerCase()) ||
						(TokenSymbol[row.pool.liquidity.token1.denom] ?? "unknown")
							.toLowerCase()
							.includes(debouncedValue.toLowerCase()) ||
						(TokenFullName[row.pool.liquidity.token1.denom] ?? "unknown")
							.toLowerCase()
							.includes(debouncedValue.toLowerCase()) ||
						(TokenSymbol[row.pool.liquidity.token2.denom] ?? "unknown")
							.toLowerCase()
							.includes(debouncedValue.toLowerCase()) ||
						(TokenFullName[row.pool.liquidity.token2.denom] ?? "unknown")
							.toLowerCase()
							.includes(debouncedValue.toLowerCase())
					)
				} else {
					return row
				}
			}
		)
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [data, debouncedValue, TokenSymbol, TokenFullName])

	const uniquePoolIds = useMemo(() => {
		// eslint-disable-next-line @typescript-eslint/ban-ts-comment
		// @ts-expect-error
		const poolIds = poolsToShow.map((row) => row.pool.poolId.toString())
		return new Set(poolIds).size
	}, [poolsToShow])

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
		<Flex justify="center" maxW="6xl" w="full">
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
							<HStack ml="0.4rem">
								<RpcStatusIndicator
									rpcUrl={
										import.meta.env.VITE_NEUTRONNETWORK === "neutron"
											? rpcMainnetUrl
											: rpcMainnetUrl
									}
								/>
							</HStack>
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
								_dark={{
									_placeholder: { color: "white" },
									bgGradient:
										"linear-gradient(137deg, rgba(143, 143, 143, 0.00) 41.48%, rgba(133, 133, 133, 0.28) 134.85%)",
									color: "white"
								}}
								_hover={{ bg: "gray.200" }}
								_placeholder={{ color: "black" }}
								bgGradient="linear-gradient(137deg, rgba(143, 143, 143, 0.00) 41.48%, rgba(133, 133, 133, 0.28) 134.85%)"
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
					<HStack pb={2} px={0} ml="0.8rem" w="full">
						<RpcStatusIndicator
							rpcUrl={
								import.meta.env.VITE_NEUTRONNETWORK === "neutron" ? rpcMainnetUrl : rpcMainnetUrl
							}
						/>
						<Text fontSize="0.8rem" _dark={{ color: "gray.200" }} color="gray.700">
							{uniquePoolIds}
						</Text>
						<Text fontSize="0.8rem" _dark={{ color: "gray.200" }} color="gray.700">
							Results
						</Text>
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
				{breakpoint === "base" || breakpoint === "sm" ? (
					<VStack spacing={5} w="full">
						{table.getRowModel().rows.map((row) => (
							// eslint-disable-next-line react/jsx-key
							<PoolTableMobile row={row} />
						))}
					</VStack>
				) : (
					<Table
						pos="relative"
						border="1px solid rgba(224, 230, 255, 0.10)"
						borderRadius="0.5rem"
						overflow="hidden" // This ensures that content stays within the rounded border
					>
						<Thead bg="gray.100" _dark={{ bg: "#182848", color: "white" }}>
							{table.getHeaderGroups().map((headerGroup) => (
								<Tr key={headerGroup.id}>
									{headerGroup.headers.map((header) => {
										// eslint-disable-next-line @typescript-eslint/no-explicit-any
										const meta: any = header.column.columnDef.meta
										const isPoolHeader = header.column.columnDef.header === "Pool"
										const isVolumeHeader = header.column.columnDef.header === "Pool"
										return (
											<Th
												_dark={{ bg: "#182848", color: "white" }}
												bg="gray.100"
												borderBottom="none"
												color="black"
												fontSize="12"
												fontWeight="400"
												isNumeric={meta?.isNumeric}
												key={header.id}
												onClick={header.column.getToggleSortingHandler()}
												py={1.5}
												textTransform="capitalize"
												textAlign={isPoolHeader ? "start" : "start"}
												pr={isPoolHeader && isVolumeHeader ? "2rem" : "8.5rem"}
											>
												{header.column.columnDef.header !== "Actions" ? (
													<AwesomeButton>
														<Flex
															alignItems="center"
															justifyContent={isPoolHeader ? "flex-start" : "center"}
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
														</Flex>
													</AwesomeButton>
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
									bg="rgba(133, 133, 133, 0.28) 134.85%)"
									border="1px solid rgba(224, 230, 255, 0.10)"
									mb="8px"
									_last={{ mb: "0px" }}
									py="0.5rem"
								>
									{row.getVisibleCells().map((cell) => {
										// eslint-disable-next-line @typescript-eslint/no-explicit-any
										const meta: any = cell.column.columnDef.meta
										const isPoolCell = cell.column.columnDef.header === "Pool"
										return (
											<Td
												borderBottom="none"
												isNumeric={meta?.isNumeric}
												key={cell.id}
												textAlign={isPoolCell ? "start" : "center"}
												pr={isPoolCell ? "2rem" : "1rem"}
												py="1rem"
											>
												{flexRender(cell.column.columnDef.cell, cell.getContext())}
											</Td>
										)
									})}
								</Tr>
							))}
						</Tbody>
					</Table>
				)}
				<HStack justify="center" mt={3} mb={3} w="full">
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
