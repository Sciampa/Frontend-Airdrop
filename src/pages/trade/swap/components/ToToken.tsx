/* eslint-disable react-hooks/rules-of-hooks */
import { NoOptionsText } from "./NoOptionsText"
import { type SystemStyleObject } from "@chakra-ui/react"
import {
	Avatar,
	Box,
	Button,
	Flex,
	Icon,
	Image,
	Input,
	Menu,
	MenuButton,
	MenuList,
	Portal,
	Skeleton,
	Spacer,
	Text,
	useColorModeValue,
	VStack
} from "@chakra-ui/react"
import { useMultipleTokenBalance, useTokenBalance } from "@hooks/tokens/query/useTokenBalance"
import { BigNumber } from "bignumber.js"
import {
	type ChakraStylesConfig,
	type ControlProps,
	type GroupBase,
	type OptionProps
} from "chakra-react-select"
import { AsyncSelect, chakraComponents } from "chakra-react-select"
import { motion } from "framer-motion"
import { useTokenToTokenPrice } from "hooks/swap/query/useTokenToTokenPrice"
import { useTokenList } from "hooks/tokens/query/useTokenList"
import { useEffect, useMemo } from "react"
import { FaSearch } from "react-icons/fa"
import { FiChevronDown, FiChevronUp } from "react-icons/fi"
// import { useTokenDollarPrice } from "hooks/swap/useTokenDollarPrice"
import { NumericFormat } from "react-number-format"
import { useRecoilState, useRecoilValue } from "recoil"
import { tokenSwapState } from "state/swapState"
import { showZeroBalanceTokensState } from "state/UIState"
import fadeIn from "theme/motion/variants/general/fadeIn"
import { convertMicroDenomToDenom } from "utils/tokens/helpers"
import { type TokenWithBalance } from "utils/tokens/tokens"
// import { useTokenDollarPriceTFM } from "hooks/swap/useTokenPriceTFM"

export const CustomOption = ({
	...props
}: OptionProps<TokenWithBalance, true, GroupBase<TokenWithBalance>>) => {
	// const [TFMPrice, isLoadingTFMPrice] = useTokenDollarPriceTFM({
	//   token: props.data.token.token
	//   // : TokenStatus[props.data.token.token].contractAddress!
	// })

	return (
		<chakraComponents.Option {...props}>
			<Flex align="center" id={props.data.fullName} w="full">
				<Flex align="center" flex={1} gap={1}>
					<Avatar
						h={{ base: "1rem", md: "2.5rem" }}
						src={props.data.logoURI}
						w={{ base: "1rem", md: "2.5rem" }}
					/>
					<VStack align="start" spacing={0}>
						<Text
							fontSize={{ base: "12", md: "18" }}
							fontWeight="bold"
							lineHeight="1"
							textAlign="start"
						>
							{props.data.fullName}
						</Text>
						{/* <Text fontSize={{ base: "14", md: "14" }} textAlign="start">
              {
                ChainConfigs[TokenStatus[props.data.token.token].chain]
                  .chainName
              }
            </Text> */}
					</VStack>
				</Flex>
				<VStack align="end" spacing={0}>
					<Text fontSize={{ base: "sm", sm: "md" }} textAlign="end" wordBreak="break-word">
						{convertMicroDenomToDenom(props.data.balance, props.data.decimal ?? 6).toFixed(2) ?? 0}
					</Text>
					{/* <Text
            fontSize={{ base: "md", sm: "sm" }}
            textAlign="end"
            wordBreak="break-word"
            color="gray.400"
            _dark={{ color: "gray.100" }}
          >
            {convertMicroDenomToDenom(
              Number(props.data.balance),
              TokenStatus[props.data.token.token].decimal
            )
              .times(TFMPrice)
              .toNumber()
              .toLocaleString("en-US", {
                style: "currency",
                currency: "USD",
                minimumFractionDigits: 2
              }) ?? 0}
          </Text> */}
				</VStack>
			</Flex>
		</chakraComponents.Option>
	)
}

export const CustomControl = ({ children, ...props }: ControlProps<TokenWithBalance, true>) => {
	return (
		<Flex direction="column" gap={2}>
			<chakraComponents.Control {...props}>
				<Flex align="center" ps={2} color={useColorModeValue("black", "white")}>
					<Icon as={FaSearch} />
				</Flex>
				{children}
			</chakraComponents.Control>
		</Flex>
	)
}

const IndicatorSeparator = () => {
	return null
}

const DropdownIndicator = () => {
	return null
}

export const ToToken = () => {
	const customStyles: ChakraStylesConfig<TokenWithBalance, true, GroupBase<TokenWithBalance>> = {
		control: (provided: SystemStyleObject) => ({
			...provided,
			_placeholder: { color: "white" },
			bg: useColorModeValue("rgba(33, 33, 33, 0.2)", "rgba(33, 33, 33, 0.2)"),
			border: "none",
			borderRadius: "1.25em",
			color: "black",
			shadow: "md"
		}),
		menu: (provided: SystemStyleObject) => ({
			...provided,
			maxH: { base: "sm", md: "3xl" },
			mb: 0,
			position: "relative",
			px: 0,
			zIndex: 20
		}),
		menuList: (provided: SystemStyleObject) => ({
			...provided,
			"&::-webkit-scrollbar": {
				background: useColorModeValue("rgba(160,160,160,0.1)", "rgba(255,255,255,0.1)"),
				borderRadius: "4px",
				width: "12px"
			},

			"&::-webkit-scrollbar-thumb": {
				background: useColorModeValue("rgba(0,0,0,0.1)", "rgba(255,255,255,0.1)"),
				borderRadius: "4px"
			},

			bg: "transparent",
			border: "none",
			borderRadius: "0",
			maxH: { base: "9rem", md: "11.5rem" },
			overflowX: "hidden",
			overflowY: "scroll",
			paddingEnd: 1,
			paddingStart: 0,
			py: 0,
			scrollbarColor: useColorModeValue(
				"rgba(0,0,0,0.3) rgba(0,0,0,0.2)",
				"rgba(255,255,255,0.2) rgba(255,255,255,0.1)"
			),
			scrollbarWidth: "auto",
			shadow: "none"
		}),
		option: (provided: SystemStyleObject, state: { isSelected: boolean }) => ({
			...provided,
			_dark: {
				color: "white"
			},
			_disabled: {
				_hover: { bg: "transparent" }
			},
			_hover: {
				bgGradient: state.isSelected
					? "linear(45deg, #4b6cb7,brand.2)"
					: useColorModeValue("whiteAlpha.300", "whiteAlpha.200"),
				color: "white"
			},
			bg: state.isSelected
				? useColorModeValue("rgba(33, 33, 33, 0.2)", "rgba(33, 33, 33, 0.5)")
				: "transparent",

			borderRadius: "1.5em",
			color: "black",
			mt: 2,
			paddingBottom: 0,
			paddingLeft: 1,
			paddingTop: 0,
			shadow: "md"
		})
	}
	const [tokenList] = useTokenList()
	const [{ to }, setSwapInfo] = useRecoilState(tokenSwapState)
	const [assets] = useMultipleTokenBalance(tokenList)

	const showZeroBalance = useRecoilValue(showZeroBalanceTokensState)

	const assetsToShow = useMemo(() => {
		if (showZeroBalance) {
			return assets
		} else {
			return assets?.filter((asset) => asset.balance !== BigNumber(0))
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [assets, showZeroBalance, tokenList])

	const [tokenBalance] = useTokenBalance(to.token.denom)

	const tokenWithBalance: TokenWithBalance = useMemo(() => {
		return { balance: tokenBalance, ...to.token! }
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [tokenBalance, to])

	const [tokenToTokenPrice] = useTokenToTokenPrice()

	useEffect(() => {
		setSwapInfo((previous) => ({
			...previous,
			to: {
				...previous.to,
				amount: tokenToTokenPrice.price
			}
		}))
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [])

	return (
		<Box
			_dark={{
				bg: "rgb(30, 41, 59)",
				textColor: "white"
			}}
			as={motion.div}
			bg="rgb(255, 255, 255)"
			borderRadius="1em"
			p={3}
			pb={8}
			position="relative"
			shadow="md"
			variants={fadeIn}
			w="full"
			textColor="black"
		>
			<Flex
				align={{ base: "start", sm: "center" }}
				flexDirection={{ base: "column", sm: "row" }}
				justify="space-between"
				position="relative"
				w="full"
			>
				<Menu flip={false} isLazy placement="bottom-start" preventOverflow={false}>
					{({ isOpen, onClose }) => (
						<>
							<Flex align="space-between" direction="row" gap={3} pt={6} w="full">
								<MenuButton
									_dark={{ bg: "rgba(33, 33, 33, 0.3)" }}
									as={Button}
									bg="rgba(33, 33, 33, 0.1)"
									flex={1}
									h="3rem"
									px={1}
									rounded="1.5em"
									shadow="md"
									variant="unstyled"
									w="full"
									whiteSpace="normal"
								>
									<Flex align="center" flexDirection="row" gap={2} h="3rem" justify="center">
										<Image src={to.token?.logoURI} w="2.5rem" />
										<Skeleton
											alignItems="center"
											display="flex"
											h={{ base: "3rem", md: "3rem" }}
											isLoaded={Boolean(to)}
											rounded="1em"
											w="full"
										>
											<VStack align="start" spacing={0.5}>
												<Text
													fontFamily="heading"
													fontSize={{ base: "md", sm: "18" }}
													fontWeight="700"
													lineHeight={1}
													textAlign="start"
												>
													{to.token?.symbol}
												</Text>
												<Text
													lineHeight={1}
													fontSize={{ base: "0.9em", sm: "14" }}
													textAlign="start"
													fontWeight="400"
													fontFamily="body"
												>
													{to.token.chain?.chainPrettyName}
												</Text>
											</VStack>
											<Spacer />
											<Icon
												as={isOpen ? FiChevronUp : FiChevronDown}
												color={useColorModeValue("black", "white")}
												fontSize={{ base: "xl", sm: "3xl" }}
											/>
										</Skeleton>
									</Flex>
								</MenuButton>
								{to && (
									<Flex align="end" direction="column" flex={1} gap={0} maxW="14rem">
										<NumericFormat
											_dark={{ _focus: { bg: "rgba(33, 33, 33, 0.5)" }, color: "white" }}
											_disabled={{}}
											_focus={{ bg: "rgba(33, 33, 33, 0.5)" }}
											allowLeadingZeros={false}
											allowNegative={false}
											bg="transparent"
											color="black"
											customInput={Input}
											decimalScale={to.token.decimal}
											fontSize={{ base: "lg", sm: "24" }}
											fontWeight="bold"
											h="3rem"
											isDisabled
											mb={{ base: 1, md: 0 }}
											placeholder="0"
											py={1}
											rounded="0.6em"
											textAlign="end"
											thousandSeparator=","
											value={
												convertMicroDenomToDenom(
													tokenToTokenPrice.price,
													to.token.decimal
												).toString() ?? "0"
											}
											valueIsNumericString
											variant="unstyled"
											w="full"
										/>
										{/* <Text
                      fontSize={{ sm: "16" }}
                      textAlign="end"
                      fontWeight="bold"
                      color={
                        tokenToTokenPrice.price === 0
                          ? useColorModeValue(
                              "blackAlpha.600",
                              "whiteAlpha.600"
                            )
                          : useColorModeValue(
                              "blackAlpha.700",
                              "whiteAlpha.700"
                            )
                      }
                    >
                      {(
                        TFMPrice *
                        convertMicroDenomToDenom(
                          tokenToTokenPrice.price,
                          TokenStatus[to.token].decimal
                        ).toNumber()
                      ).toLocaleString("en-US", {
                        style: "currency",
                        currency: "USD",
                        minimumFractionDigits: 2
                      })}
                    </Text> */}
									</Flex>
								)}
							</Flex>
							<Portal>
								<MenuList
									_dark={{ bgGradient: "linear(to-b, rgb(30, 41, 59), rgb(30, 41, 59) 20%)" }}
									bg="rgba(255, 255, 255)"
									border="none"
									left={{ base: -3, md: -3 }}
									maxW={{ base: "18rem", md: "32rem" }}
									minW={{ base: "18rem", md: "32rem" }}
									position="relative"
									px={{ base: 2, md: 3 }}
									rounded="1em"
									shadow="md"
									w="full"
									zIndex={999}
								>
									<Box py={1}>
										{to && (
											<AsyncSelect
												blurInputOnSelect
												chakraStyles={customStyles}
												components={{
													Control: CustomControl,
													DropdownIndicator,
													IndicatorSeparator,
													Option: CustomOption
												}}
												controlShouldRenderValue={false}
												defaultOptions={assetsToShow}
												isClearable={false}
												loadOptions={(inputValue, callback) => {
													const values = assetsToShow.filter((option) =>
														option.fullName.toLowerCase().includes(inputValue.toLowerCase())
													)
													callback(values)
												}}
												menuIsOpen
												noOptionsMessage={NoOptionsText}
												onChange={(selectedOption) => {
													// @ts-expect-error types
													// eslint-disable-next-line @typescript-eslint/no-unused-vars
													const { balance, ...token }: TokenWithBalance = selectedOption
													setSwapInfo(({ from: currentFrom }) => {
														return {
															from: {
																...currentFrom,
																amount: "0"
															},
															to: {
																amount: "0",
																token
															}
														}
													})
													onClose()
												}}
												placeholder="Search..."
												value={tokenWithBalance}
											/>
										)}
									</Box>
								</MenuList>
							</Portal>
						</>
					)}
				</Menu>
			</Flex>
		</Box>
	)
}
