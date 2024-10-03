/* eslint-disable id-length */
/* eslint-disable react/no-unstable-nested-components */
import { PortfolioTable } from "./components/PortfolioTable"
import {
	Button,
	Flex,
	HStack,
	Icon,
	IconButton,
	Skeleton,
	Text,
	useBreakpoint,
	useBreakpointValue,
	VStack
} from "@chakra-ui/react"
import { MemoizedAvatar } from "@components/MemoizedAvatar"
import { useChain } from "@cosmos-kit/react"
import { useMultipleTokenBalance } from "@hooks/tokens/query/useTokenBalance"
import { createColumnHelper } from "@tanstack/react-table"
import { type TokenWithBalance } from "@utils/tokens/tokens"
import { useLocalStorageState } from "ahooks"
import { motion } from "framer-motion"
import { useTokenList } from "hooks/tokens/query/useTokenList"
import { PortfolioSummary } from "pages/portfolio/assets/components/PortfolioSummary"
import MyPoolsPageMobile from "pages/portfolio/poolsMobile"
import { useMemo } from "react"
import { Helmet } from "react-helmet"
import { FaRegStar, FaStar } from "react-icons/fa"
import { HiExternalLink } from "react-icons/hi"
import { useNavigate } from "react-router-dom"
import { useRecoilValue } from "recoil"
import { showZeroBalanceAssetsState } from "state/UIState"
import { convertMicroDenomToDenom } from "utils/tokens/helpers"
import shortenNumber from "utils/ui/shortenNumber"

const MyAssets = () => {
	const breakpoint = useBreakpoint({ ssr: false })

	const [tokenList] = useTokenList()
	const [assets] = useMultipleTokenBalance(tokenList)
	const navigate = useNavigate()
	const showZeroBalance = useRecoilValue(showZeroBalanceAssetsState)

	const { isWalletConnected } = useChain(import.meta.env.VITE_NEUTRONNETWORK)

	const [favourites, setFavourites] = useLocalStorageState<string[]>("favoriteTokens", {
		defaultValue: [""]
	})

	const handleClick = () => {
		navigate("/bridge")
	}

	const assetsToShow = useMemo(() => {
		if (showZeroBalance) {
			return assets
		} else {
			return assets?.filter((asset) => !asset.balance.isZero())
		}
	}, [assets, showZeroBalance])

	const addToFavourites = (token: string) => {
		// eslint-disable-next-line no-negated-condition
		if (!favourites?.includes(token)) {
			setFavourites([...favourites!, token])
		} else {
			setFavourites(favourites!.filter((item) => item !== token))
		}
	}

	const isMobile = useBreakpointValue({ base: true, md: false })

	const columnHelper = createColumnHelper<TokenWithBalance>()
	const columns = useMemo(() => {
		return [
			columnHelper.accessor("symbol", {
				cell: (info) => {
					return (
						<HStack>
							{breakpoint !== "base" && breakpoint !== "sm" && (
								<IconButton
									_dark={{
										_hover: {
											bg: "rgba(33, 33, 33, 0.5)"
										},
										color: favourites?.includes(info.row.original.denom) ? "yellow.600" : "white"
									}}
									_hover={{ bg: "rgba(33, 33, 33, 0.2)" }}
									aria-label="add/remove favourite token"
									bg="transparent"
									color={favourites?.includes(info.row.original.denom) ? "yellow.400" : "gray.800"}
									icon={
										favourites?.includes(info.row.original.denom) ? (
											<Icon as={FaStar} h="1.5rem" w="1.5rem" />
										) : (
											<Icon as={FaRegStar} h="1.5rem" w="1.5rem" />
										)
									}
									onClick={() => addToFavourites(info.row.original.denom)}
									rounded="full"
									size="sm"
								/>
							)}
							<HStack>
								<Skeleton isLoaded={Boolean(info.row.original.logoURI)} rounded="full">
									<MemoizedAvatar
										border="none"
										src={info.row.original.logoURI ?? "/assets/electron.png"}
										blurHash={info.row.original.logoHash}
										w={{ base: "3rem", md: "3rem" }}
										h={{ base: "3rem", md: "3rem" }}
									/>
								</Skeleton>
								<Skeleton isLoaded={Boolean(info.row.original.symbol)} rounded="full">
									<VStack align="start" minW="2rem" spacing={{ base: 0, md: 2 }}>
										<Text
											_dark={{ color: "white" }}
											color="black"
											fontFamily="heading"
											fontSize={{ base: "0.8rem", sm: "18" }}
											fontWeight="400"
											lineHeight={1}
											textAlign="start"
										>
											{info.row.original.symbol}
										</Text>
										<Text
											_dark={{ color: "white" }}
											color="black"
											lineHeight={1}
											fontSize={{ base: "0.5em", sm: "14" }}
											textAlign="start"
											fontWeight="400"
											fontFamily="body"
										>
											{info.row.original.fullName}
										</Text>
									</VStack>
								</Skeleton>
							</HStack>
						</HStack>
					)
				},
				header: "Asset",
				id: "tokens",
				sortingFn: (a, b, columnId) => {
					return String(a.getValue(columnId)).toLowerCase() <
						String(b.getValue(columnId)).toLowerCase()
						? -1
						: String(a.getValue(columnId)).toLowerCase() >
						  String(b.getValue(columnId)).toLowerCase()
						? 1
						: 0
				}
			}),
			columnHelper.accessor("balance", {
				cell: (info) => {
					return (
						<Skeleton isLoaded={Boolean(info)} rounded="full">
							<VStack align="end" spacing={3}>
								<Text _dark={{ color: "white" }} color="black" fontFamily="heading">
									{`${shortenNumber(
										convertMicroDenomToDenom(
											info.row.original.balance,
											info.row.original.decimal ?? 6
										),
										2
									)}`}
								</Text>
								{/* <Text
                  fontSize={{ base: "md", sm: "sm" }}
                  textAlign="end"
                  wordBreak="break-word"
                  color="offwhite.3"
                  _dark={{ color: "offwhite.3" }}
                >
                  {Number(info.getValue() ?? 0).toLocaleString("en-US", {
                    style: "currency",
                    currency: "USD",
                    minimumFractionDigits: 2
                  }) ?? 0}
                </Text> */}
							</VStack>
						</Skeleton>
					)
				},
				header: "Balance",
				id: "tokenBalance",
				meta: {
					isNumeric: true
				}
			}),
			columnHelper.display({
				cell: (info) => {
					if (!info.row.original.isIBCCoin || !isWalletConnected) {
						return null
					}

					if (breakpoint === "base" || breakpoint === "sm") {
						return (
							<Flex justify="center">
								<IconButton
									onClick={handleClick}
									bg="white"
									color="rgba(33, 33, 33, 0.5)"
									bgGradient="linear(45deg, #4b6cb7, brand.2)"
									rounded="full"
									aria-label="Open Actions Modal"
									icon={<HiExternalLink size="20" />}
								/>
							</Flex>
						)
					}

					if (info.row.original.chain?.chainId.includes("worm")) {
						return (
							<Button
								_hover={{ filter: "brightness(120%)" }}
								bg="white"
								color="rgba(33, 33, 33, 0.5)"
								bgGradient="linear(45deg, #4b6cb7, brand.2)"
								shadow="md"
								as="a"
								href="https://ibc.fun/"
								target="_blank"
								_disabled={{
									_hover: { bg: "white" },
									cursor: "not-allowed",
									opacity: 0.5
								}}
								_dark={{
									_disabled: {
										_hover: { bg: "rgba(33, 33, 33, 0.5)" },
										cursor: "not-allowed",
										opacity: 0.5
									},
									_hover: {
										backgroundPosition: "right center",
										filter: "brightness(120%)"
									},
									bgGradient: "linear-gradient(to right, #4b6cb7 0%, #182848  51%, #4b6cb7  100%)",
									color: "white"
								}}
								rounded="1em"
								onClick={handleClick}
								size="sm"
								leftIcon={<HiExternalLink size="18" />}
								transition="0.5s"
							>
								Bridge
							</Button>
						)
					}

					return (
						<HStack>
							<Button
								_hover={{ filter: "brightness(120%)" }}
								bg="white"
								color="white"
								bgGradient="linear(45deg, #4b6cb7, brand.2)"
								shadow="md"
								_disabled={{
									_hover: { bg: "white" },
									cursor: "not-allowed",
									opacity: 0.5
								}}
								_dark={{
									_disabled: {
										_hover: { bg: "rgba(33, 33, 33, 0.5)" },
										cursor: "not-allowed",
										opacity: 0.5
									},
									_hover: {
										backgroundPosition: "right center",
										filter: "brightness(120%)"
									},
									bgGradient: "linear-gradient(to right, #4b6cb7 0%, #182848  51%, #4b6cb7  100%)",
									color: "white"
								}}
								rounded="1em"
								size="sm"
								transition="0.5s"
								onClick={handleClick}
							>
								Bridge
							</Button>
						</HStack>
					)
				},
				header: "Actions",
				id: "actions"
			})
		]
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [assetsToShow, favourites, breakpoint])

	return (
		<Flex
			animate={{ opacity: 1 }}
			as={motion.main}
			exit={{ opacity: 0 }}
			flexDirection="column"
			gap={{ base: 5, md: 3 }}
			initial={{ opacity: 0 }}
			pos="relative"
			w="full"
			p={3}
			align="center"
			justify="start"
		>
			<Helmet>
				<title>My Assets | Electron</title>
			</Helmet>
			<PortfolioSummary />
			<PortfolioTable columns={columns} data={assetsToShow ?? []} favourites={favourites ?? []} />
			{isMobile && isWalletConnected && <MyPoolsPageMobile />}
		</Flex>
	)
}

export default MyAssets
