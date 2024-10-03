/* eslint-disable id-length */
import Navigation from "./Header/Navigation"
import NavigationMobile from "./HeaderMobile/Navigation"
import { Flex, useBreakpoint, useColorModeValue } from "@chakra-ui/react"
import { type ReactNode } from "react"
import { ToastContainer } from "react-toastify"

type LayoutProps = {
	children: ReactNode
}

const Layout = ({ children }: LayoutProps) => {
	const breakpoint = useBreakpoint({ ssr: false })
	const bgColor = useColorModeValue("gray.200", "#0f172a")

	return (
		<Flex color="white" maxW="100vw" transition="0.5s ease-out" direction="column">
			<Flex
				bg={bgColor}
				direction={{ base: "column", md: "row" }}
				gap={0}
				minH="100vh"
				maxH="100vh"
				pos="relative"
				w="full"
			>
				<Flex display={{ base: "none", md: "flex" }}>
					<Navigation />
				</Flex>
				<Flex display={{ base: "flex", md: "none" }}>
					<NavigationMobile />
				</Flex>
				<Flex
					flex={1}
					w="full"
					zIndex={5}
					overflowY="auto"
					css={{
						"&::-webkit-scrollbar": {
							background: useColorModeValue("rgba(160,160,160,0.25)", "rgba(255,255,255,0.25)"),
							borderRadius: "4px",
							left: 0,
							m: 0,
							p: 0,
							pos: "absolute",
							width: "10px"
						},
						"&::-webkit-scrollbar-thumb": {
							background: useColorModeValue("rgba(0,0,0,0.1)", "rgba(255,255,255,0.25)"),
							borderRadius: "16px"
						}
					}}
				>
					{children}
				</Flex>
			</Flex>
			<ToastContainer
				autoClose={3_000}
				bodyStyle={{
					color: useColorModeValue("white", "white"),
					fontFamily: "var(--chakra-fonts-heading)",
					fontSize: "1.25em"
				}}
				closeButton={false}
				closeOnClick
				draggableDirection="x"
				draggablePercent={20}
				icon={false}
				key="toastContainer"
				newestOnTop={false}
				pauseOnHover
				position={breakpoint === "base" || breakpoint === "sm" ? "bottom-center" : "bottom-right"}
				style={{
					width: "auto"
				}}
				toastStyle={{
					background: useColorModeValue(
						"linear-gradient(90deg, var(--chakra-colors-gray-600), var(--chakra-colors-gray-800)",
						"linear-gradient(90deg, var(--chakra-colors-gray-600), var(--chakra-colors-gray-800)"
					),
					borderBottomLeftRadius: breakpoint === "base" || breakpoint === "sm" ? "0" : "1.25em",
					borderBottomRightRadius: breakpoint === "base" || breakpoint === "sm" ? "0" : "1.25em",
					borderRadius: "1.25em",
					color: "white",
					padding: "0.5rem",
					width: "25rem"
				}}
			/>
		</Flex>
	)
}

export default Layout
