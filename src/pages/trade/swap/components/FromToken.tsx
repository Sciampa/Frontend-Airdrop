/* eslint-disable react-hooks/rules-of-hooks */
import { NoOptionsText } from "./NoOptionsText"
import { type SystemStyleObject } from "@chakra-ui/react"
import {
	Avatar,
	Box,
	Button,
	Flex,
	HStack,
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
import {
	type ChakraStylesConfig,
	type ControlProps,
	type GroupBase,
	type MenuListProps,
	type OptionProps
} from "chakra-react-select"
import { AsyncSelect, chakraComponents } from "chakra-react-select"
import { motion } from "framer-motion"
import { useTokenList } from "hooks/tokens/query/useTokenList"
import { useMemo, useState } from "react"
import { FaSearch } from "react-icons/fa"
import { FiChevronDown, FiChevronUp } from "react-icons/fi"
import { NumericFormat } from "react-number-format"
import { FixedSizeList as List } from "react-window"
import { useRecoilState, useRecoilValue } from "recoil"
import { tokenSwapState } from "state/swapState"
import { showZeroBalanceTokensState } from "state/UIState"
import fadeIn from "theme/motion/variants/general/fadeIn"
import { convertDenomToMicroDenom, convertMicroDenomToDenom } from "utils/tokens/helpers"
import { type TokenWithBalance } from "utils/tokens/tokens"

export const CustomOption = ({
	...props
}: OptionProps<TokenWithBalance, true, GroupBase<TokenWithBalance>>) => {
	// const [TFMPrice, isLoadingTFMPrice] = useTokenDollarPriceTFM({
	//   token: props.data.token.token
	// })

	return (
		<chakraComponents.Option {...props}>
			<Flex align="center" id={props.data.symbol} w="full">
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
							{props.data.symbol}
						</Text>
						<Text fontSize={{ base: "10", md: "14" }} textAlign="start">
							{props.data.chain?.chainPrettyName}
						</Text>
					</VStack>
				</Flex>
				<VStack align="end" spacing={0}>
					<Text fontSize={{ base: "sm", sm: "md" }} textAlign="end" wordBreak="break-word">
						{convertMicroDenomToDenom(props.data.balance, props.data.decimal ?? 6).toFixed(2) ??
							"0.00"}
					</Text>
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

export const CustomMenuList = ({ children, ...props }: MenuListProps<TokenWithBalance, true>) => {
	const itemHeight = 60
	const { options, maxHeight, getValue } = props
	const [value] = getValue()
	const initialOffset = options.indexOf(value) * itemHeight

	return (
		<chakraComponents.MenuList {...props}>
			<List
				height={maxHeight}
				initialScrollOffset={initialOffset}
				itemCount={40}
				itemSize={itemHeight}
				style={{
					// @ts-expect-error types
					"&::-webkit-scrollbar": {
						background: useColorModeValue("rgba(160,160,160,0.1)", "rgba(255,255,255,0.1)"),
						borderRadius: "4px",
						width: "12px"
					},

					"&::-webkit-scrollbar-thumb": {
						background: useColorModeValue("rgba(0,0,0,0.1)", "rgba(255,255,255,0.1)"),
						borderRadius: "4px"
					},

					overflowY: "scroll"
				}}
			>
				{({ index, style }) => (
					// @ts-expect-error types
					<Flex style={style}>{children?.[index]}</Flex>
				)}
			</List>
		</chakraComponents.MenuList>
	)
}

const IndicatorSeparator = () => {
	return null
}

const DropdownIndicator = () => {
	return null
}

export const FromToken = () => {
	const [{ from }, setSwapInfo] = useRecoilState(tokenSwapState)
	const [tokenList] = useTokenList()
	const [assets] = useMultipleTokenBalance(tokenList)
	const [inputValue, setInputValue] = useState("")
	const [isInputStarted, setIsInputStarted] = useState(false)
	const showZeroBalance = useRecoilValue(showZeroBalanceTokensState)

	const assetsToShow = useMemo(() => {
		if (showZeroBalance) {
			return assets
		} else {
			return assets?.filter((asset) => !asset.balance.isEqualTo(0))
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [assets, showZeroBalance, tokenList])

	const [tokenBalance] = useTokenBalance(from.token.denom)

	const tokenWithBalance: TokenWithBalance = useMemo(() => {
		return { balance: tokenBalance, ...from.token }
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [tokenBalance])

	// const [TFMPrice, isLoadingTFMPrice] = useTokenDollarPriceTFM({
	//   token: from.token
	// })

	const availableBalanceFormatted = convertMicroDenomToDenom(
		tokenBalance,
		from.token.decimal
	).toFixed(6)

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
			pb={6}
			position="relative"
			shadow="md"
			variants={fadeIn}
			w="full"
			textColor="black"
		>
			<Flex
				align={{ base: "start", sm: "center" }}
				flexDirection="row"
				justify="space-between"
				mb={4}
				position="relative"
				w="full"
			>
				<Flex align="center" gap={2} justify="start" maxW={{ sm: "2xs" }} w="full">
					<Text fontSize={{ base: "0.9em", md: "md" }} fontWeight="normal">
						Available
					</Text>
					<NumericFormat
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
						_disabled={{}}
						allowLeadingZeros={false}
						allowNegative={false}
						bgClip="text"
						bgGradient="linear(45deg, #4b6cb7, brand.2)"
						customInput={Input}
						decimalScale={from.token.decimal}
						fontSize={{ base: "0.9em", md: "md" }}
						fontWeight="900"
						isDisabled
						placeholder="0"
						py={1}
						rounded="0.6em"
						thousandSeparator=","
						value={convertMicroDenomToDenom(tokenBalance, from.token.decimal).toString() ?? 0}
						valueIsNumericString
						variant="unstyled"
						w="full"
					/>
				</Flex>
				<Spacer />
				<HStack>
					<Button
						_active={{ filter: "brightness(90%)" }}
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
						_hover={{ filter: "brightness(110%)" }}
						bg="rgba(245, 245, 245)"
						color="black"
						fontSize="sm"
						h={7}
						onClick={() => {
							const availableBalanceNumber = Number.parseFloat(availableBalanceFormatted)
							const halfAmount = (availableBalanceNumber / 2).toFixed(6)
							setInputValue(halfAmount)
							setSwapInfo(({ from: currentFrom, to: currentTo }) => {
								return {
									from: {
										...currentFrom,
										amount: tokenBalance.dividedBy(2).decimalPlaces(0, 1).toString()
									},
									to: { ...currentTo }
								}
							})
						}}
						px={0}
						py={0}
						rounded="0.8em"
						shadow="md"
						transition="0.2s all"
						w={12}
					>
						Half
					</Button>
					<Button
						_active={{ filter: "brightness(90%)" }}
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
						_hover={{ filter: "brightness(110%)" }}
						bg="rgba(245, 245, 245)"
						color="black"
						fontSize="sm"
						h={7}
						onClick={() => {
							setInputValue(availableBalanceFormatted)
							setSwapInfo(({ from: currentFrom, to: currentTo }) => {
								return {
									from: {
										...currentFrom,
										amount: tokenBalance.toString()
									},
									to: { ...currentTo }
								}
							})
						}}
						px={0}
						py={0}
						rounded="0.8em"
						shadow="md"
						transition="0.2s all"
						w={12}
					>
						Max
					</Button>
				</HStack>
			</Flex>
			<Menu flip={false} isLazy placement="bottom-start" preventOverflow={false}>
				{({ isOpen, onClose }) => (
					<>
						<Flex align="space-between" direction="row" gap={3} w="full">
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
									<Image src={from.token?.logoURI} w="2.5rem" />
									<Skeleton
										alignItems="center"
										display="flex"
										h={{ base: "3rem", md: "3rem" }}
										isLoaded={Boolean(from.token)}
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
												{from.token?.symbol}
											</Text>
											<Text
												lineHeight={1}
												fontSize={{ base: "0.9em", sm: "14" }}
												textAlign="start"
												fontWeight="400"
												fontFamily="body"
											>
												{from.token?.chain?.chainPrettyName}
											</Text>
										</VStack>
										<Spacer />
										<Icon
											as={isOpen ? FiChevronUp : FiChevronDown}
											color={useColorModeValue("black", "white")}
											fontSize={{ base: "xl", md: "3xl" }}
										/>
									</Skeleton>
								</Flex>
							</MenuButton>
							{from && (
								<Flex align="end" direction="column" flex={1} gap={3} maxW="14rem">
									<NumericFormat
										_dark={{ bg: "rgba(33, 33, 33, 0.3)" }}
										allowLeadingZeros={false}
										allowNegative={false}
										bg="rgba(33, 33, 33, 0.1)"
										color={useColorModeValue("black", "white")}
										customInput={Input}
										decimalScale={from.token.decimal}
										fontSize={{ base: "lg", sm: "24" }}
										fontWeight="bold"
										minH="3rem"
										sx={{ caretColor: isInputStarted ? "auto" : "transparent" }}
										onFocus={() => setInputValue("")} // Reset input value on focus
										onValueChange={(values) => {
											const { value } = values
											setInputValue(value) // Update state with new input value
											if (!isInputStarted && value !== "") {
												setIsInputStarted(true) // Set input started to true after first non-empty value
											}

											setSwapInfo(({ from: currentFrom, to: currentTo }) => ({
												from: {
													...currentFrom,
													amount:
														convertDenomToMicroDenom(value, currentFrom.token.decimal).toString() ??
														"0"
												},
												to: { ...currentTo }
											}))
										}}
										placeholder="0"
										px={2}
										py={1}
										rounded="1em"
										textAlign="end"
										thousandSeparator=","
										value={inputValue} // Set input value to state value
										valueIsNumericString
										variant="unstyled"
										w="full"
									/>

									<Skeleton isLoaded={false} rounded="0.8em">
										{/* <Text
                      fontSize={{ sm: "16" }}
                      textAlign="end"
                      fontWeight="bold"
                      color={
                        from.amount === "0"
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
                          from.amount,
                          TokenStatus[from.token].decimal
                        ).toNumber()
                      ).toLocaleString("en-US", {
                        style: "currency",
                        currency: "USD",
                        minimumFractionDigits: 2
                      })}
                    </Text> */}
									</Skeleton>
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
									{from && (
										<AsyncSelect
											blurInputOnSelect
											chakraStyles={customStyles}
											components={{
												Control: CustomControl,
												DropdownIndicator,
												IndicatorSeparator,
												Option: CustomOption
												// MenuList: CustomMenuList
											}}
											controlShouldRenderValue={false}
											defaultOptions={assetsToShow}
											isClearable={false}
											// eslint-disable-next-line @typescript-eslint/no-shadow
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

												setSwapInfo(({ to }) => {
													return {
														from: {
															amount: "0",
															token
														},
														to: { ...to, amount: "0" }
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
		</Box>
	)
}
