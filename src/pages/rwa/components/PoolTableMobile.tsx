import { Flex, IconButton, Menu, MenuButton, MenuItem, MenuList, VStack } from "@chakra-ui/react"
import { useChain } from "@cosmos-kit/react"
import { usePoolRewards } from "@hooks/pool/query/usePoolRewards"
import { type Row } from "@tanstack/react-table"
import { flexRender } from "@tanstack/react-table"
import { FarmIcon } from "components/Assets/FarmIcon"
import { useClaimRewards } from "hooks/pool/tx/useClaimRewards"
import { FaChevronRight } from "react-icons/fa"
import { HiExternalLink } from "react-icons/hi"
import { useNavigate } from "react-router-dom"

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const PoolTableMobile = ({ row }: { row: Row<any> }) => {
	const navigate = useNavigate()

	const { isWalletConnected } = useChain(import.meta.env.VITE_NEUTRONNETWORK)

	const [poolRewards] = usePoolRewards({
		pool: row.original.pool
	})

	const { mutate: handleClaimRewards } = useClaimRewards({
		pool: row.original.pool
	})

	return (
		<Menu isLazy matchWidth offset={[0, -5]}>
			{({ isOpen }) => (
				<>
					<MenuButton
						_dark={{ _hover: { bg: "gray.800" }, bg: "gray.800", color: "white" }}
						_hover={{ bg: "gray.200", cursor: "pointer", shadow: "md" }}
						as={Flex}
						color="black"
						bg="gray.100"
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
						<IconButton
							aria-label="Go to pools page"
							bg="transparent"
							icon={<FaChevronRight size="14" />}
							pos="absolute"
							right="1rem"
							size="sm"
							top="calc(50% - 1rem)"
						/>
					</MenuButton>
					<MenuList
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
						border="none"
						bg="rgba(245, 245, 245)"
						fontFamily="heading"
						fontSize="20"
						overflow="hidden"
						py={0}
						roundedBottom="1.25em"
						roundedTop="0"
						shadow="md"
					>
						<MenuItem
							_dark={{ bg: "rgb(30, 41, 59)", color: "white" }}
							bg="gray.100"
							color="black"
							icon={<HiExternalLink />}
							onClick={() => {
								navigate(`/pool/${row.original.pool.poolId}`)
							}}
						>
							Open Pool
						</MenuItem>
						{isWalletConnected && (
							<MenuItem
								_dark={{ bg: "rgb(30, 41, 59)", color: "white" }}
								bg="gray.200"
								color="black"
								icon={<FarmIcon />}
								isDisabled={poolRewards.length <= 0}
								onClick={() => {
									handleClaimRewards()
								}}
							>
								Claim Rewards
							</MenuItem>
						)}
					</MenuList>
				</>
			)}
		</Menu>
	)
}
