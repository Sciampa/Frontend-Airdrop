/* eslint-disable prettier/prettier */
/* eslint-disable react/style-prop-object */
/* eslint-disable jsx-a11y/iframe-has-title */
/* eslint-disable react/self-closing-comp */
/* eslint-disable react/iframe-missing-sandbox */
/* eslint-disable id-length */
/* eslint-disable react-hooks/rules-of-hooks */
/* eslint-disable import/no-unassigned-import */
import "swiper/css"
import "swiper/css/effect-coverflow"
import "swiper/css/pagination"
import { PoolCard } from "./components/PoolCard"
import { PoolCard2 } from "./components/PoolCard2"
import { PoolCard3 } from "./components/PoolCard3"
import { Poolcardtop } from "./components/Poolcardtop"
import {
	Box,
	Center,
	Flex,
	HStack,
	useBreakpoint,
	useColorMode,
} from "@chakra-ui/react"
import { useChain } from "@cosmos-kit/react"
import { usePoolList } from "@hooks/pool/query/usePoolList"
import { motion } from "framer-motion"
import { useEffect, useMemo, useRef, useState } from "react"
import { Helmet } from "react-helmet"
import { Navigation, Pagination } from "swiper"
import { type Swiper as SwiperRef } from "swiper"
import { Swiper, SwiperSlide } from "swiper/react"

const Rwa = () => {
	const { colorMode } = useColorMode()
	const [poolsList] = usePoolList()
	const { isWalletConnected } = useChain(import.meta.env.VITE_NEUTRONNETWORK)

	const [swiper, setSwiper] = useState<SwiperRef>()
	const previousRef = useRef()
	const nextRef = useRef()

	const breakpoint = useBreakpoint({ ssr: false })

	useMemo(() => {
		return []
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [breakpoint, isWalletConnected])

	useEffect(() => {
		if (swiper) {
			// eslint-disable-next-line @typescript-eslint/ban-ts-comment
			// @ts-expect-error
			swiper.params.navigation.prevEl = previousRef.current
			// eslint-disable-next-line @typescript-eslint/ban-ts-comment
			// @ts-expect-error
			swiper.params.navigation.nextEl = nextRef.current
			swiper.navigation.init()
			swiper.navigation.update()
		}
	}, [swiper])

	return (
		<Box position="relative" w="full" h="100vh" overflow="hidden">
			<Helmet>
				<title>Pools | Electron</title>
			</Helmet>

			{/* Main content container */}
			<Box position="absolute" top={0} left={0} right={0} bottom={0} overflowY="auto" zIndex={2}>
				<Flex
					animate={{ opacity: 1 }}
					as={motion.main}
					exit={{ opacity: 0 }}
					flexDirection="column"
					gap={{ base: 3, md: 3 }}
					initial={{ opacity: 0 }}
					p={3}
					alignItems="center"
					justifyContent="start"
					style={{ minHeight: "100vh" }} // Ensure the component takes at least full viewport height
				>
					<HStack gap={3} w="full" maxW="6xl">
						<Poolcardtop />
					</HStack>
					{poolsList &&
						poolsList.poolsWithAPR.length > 0 &&
						poolsList.highestTVLPool &&
						poolsList.highestAPRPool &&
						(breakpoint === "base" || breakpoint === "sm" ? (
							<Center maxW="6xl" w="full">
								<Swiper
									centeredSlides
									grabCursor={false}
									modules={[Pagination, Navigation]}
									navigation
									onSwiper={(currentSwiper) => setSwiper(currentSwiper)}
									pagination
									slidesPerView={1}
									spaceBetween={40}
									style={{
										marginBottom: "3rem",
										minHeight: "20rem",
										width: "100%"
									}}
									initialSlide={0}
								>
									<SwiperSlide>
										{({ isActive }) => (
											<div
												style={{ display: isActive ? "flex" : "none", justifyContent: "center" }}
											>
												<PoolCard />
											</div>
										)}
									</SwiperSlide>
									<SwiperSlide>
										{({ isActive }) => (
											<div
												style={{ display: isActive ? "flex" : "none", justifyContent: "center" }}
											>
												<PoolCard2 />
											</div>
										)}
									</SwiperSlide>
									<SwiperSlide>
										{({ isActive }) => (
											<div
												style={{ display: isActive ? "flex" : "none", justifyContent: "center" }}
											>
												<PoolCard3 />
											</div>
										)}
									</SwiperSlide>
								</Swiper>
							</Center>
						) : (
							<HStack gap={3} w="full" maxW="6xl">
								<PoolCard />
								<PoolCard2 />
								<PoolCard3 />
							</HStack>
						))}
				</Flex>
			</Box>

			{/* Blur effect container */}
			<Box
				position="absolute"
				top={0}
				left={0}
				right={0}
				bottom={0}
				backdropFilter="blur(4px)" // Blur effect
				zIndex={3}
			/>

			{/* Clear center container */}
			<Center
				_dark={{
					bg: "transparent"
				}}
				position="absolute"
				top="50%"
				left="50%"
				transform="translate(-50%, -50%)"
				zIndex={3}
				w={{ base: "75%", md: "40%" }}
				maxW="6xl"
				bg="transparent" // Solid background color to prevent blur effect
				borderRadius="md"
				p={5}
				
			>
				{/* Empty flex inside the clear center */}
				<Flex
					// _dark={{
					// 	bg: "rgb(30, 41, 59)"
					// }}
					align="start"
					pb={{ base: 9, md: 3 }}
					flexDirection="column"
					gap={3}
					w="full"
					alignItems="center"
					justifyContent="center"
					zIndex={999}
				>
					 <Flex direction="column" gap={4} w="full">
            {/* Conditional rendering based on colorMode */}
            {colorMode === 'light' && (
              <iframe
                width="540"
                height="440"
                src="https://c8acae28.sibforms.com/serve/MUIFAOlTOEDV8KQilRaco7n0DfQrnt4RKqva6EZTo2gNBFL1Vg7a7e3VjhZ8mORey6naZqY1aYUblbRIYHDXGt2jQFx5iOj6ImhHuoIE8KsY7ap-uegJxw0sDwmN0ntiiPmvC4ZPIZG7e-Y3Oni_ymysBbn3n0zpAcYnnZVxekl7KEtDOdZMdDkZ6Ropi_DR-_MWAPeLuR_WxXM1"
                frameBorder="0"
                scrolling="auto"
                allowFullScreen
              ></iframe>
            )}
            {colorMode === 'dark' && (
              <iframe
                width="540"
                height="440"
                src="https://c8acae28.sibforms.com/serve/MUIFAIEcfUfzOQ5og9MXbSZ2SgeNViOhWSWloeMoc-OxQJglUdTTFxeVP6JL7m7lchWDAtbqjxuiVA2PcKK0PDoGlKbiZxoukwtR08n03vPzxRKX9qeJmiDF5ZSthmRrj5pVMWz2fHbnMKFuPENUWLLTXzPW7kie-x4hWx9jxnKfwLl2oKhutJkETr63JQGAJjY4FGgB8nzh0PvO"
                frameBorder="0"
                scrolling="auto"
                allowFullScreen
              ></iframe>
            )}
          </Flex>
					</Flex>
				
			</Center>
		</Box>
	)
}

export default Rwa
