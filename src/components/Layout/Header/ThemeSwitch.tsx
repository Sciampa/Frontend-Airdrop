/* eslint-disable import/extensions */
/* eslint-disable @typescript-eslint/naming-convention */
import { Flex, Icon, useColorMode, useToken } from "@chakra-ui/react"
import { animate, AnimatePresence, motion, useMotionValue } from "framer-motion"
import { useEffect } from "react"
import { BsFillMoonStarsFill } from "react-icons/bs"
import { RiSunFill } from "react-icons/ri"

export const ThemeSwitch = () => {
	const { colorMode, toggleColorMode } = useColorMode()

	// const [brand1, brand2] = useToken("colors", ["#4b6cb7", "brand.2"])
	const lightBgColor = useToken("colors", "gray.200")
	const darkBgColor = "#0f172a"

	const colorModeBgColor = useMotionValue<string>(lightBgColor)

	useEffect(() => {
		if (colorMode === "dark") {
			void animate(colorModeBgColor, darkBgColor, {
				duration: 0.5,
				type: "tween"
			})
		} else {
			void animate(colorModeBgColor, lightBgColor, {
				duration: 0.5,
				type: "tween"
			})
		}
	}, [colorMode, lightBgColor, darkBgColor, colorModeBgColor])

	return (
		<Flex
			align="center"
			as={motion.div}
			cursor="pointer"
			h="1rem"
			onClick={toggleColorMode}
			overflow="hidden"
			px={1}
			rounded="full"
			shadow="md"
			style={{
				background: colorModeBgColor.get(),
				justifyContent: colorMode === "light" ? "flex-start" : "flex-end"
			}}
			transition="all .2s"
			w="2.5rem"
		>
			<Flex
				align="center"
				as={motion.div}
				bg="white"
				boxSize="1rem"
				justify="center"
				layout
				overflow="hidden"
				rounded="50%"
			>
				<AnimatePresence initial={false} mode="wait">
					{colorMode === "dark" ? (
						<Flex
							align="center"
							animate={{ opacity: 1, x: 0 }}
							as={motion.div}
							exit={{ opacity: 0, x: 30 }}
							initial={{ opacity: 0, x: -30 }}
							justify="center"
							key="moonIcon"
						>
							<Icon as={BsFillMoonStarsFill} color="gray.800" boxSize="0.5rem" />
						</Flex>
					) : (
						<Flex
							align="center"
							animate={{ opacity: 1, x: 0 }}
							as={motion.div}
							exit={{ opacity: 0, x: 30 }}
							initial={{ opacity: 0, x: -30 }}
							justify="center"
							key="sunIcon"
						>
							<Icon as={RiSunFill} color="gray.800" boxSize="0.5rem" />
						</Flex>
					)}
				</AnimatePresence>
			</Flex>
		</Flex>
	)
}
