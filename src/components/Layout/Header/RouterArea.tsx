/* eslint-disable jsx-a11y/anchor-is-valid */

import { type NavigationButtonProps } from "./NavigationButton"
import NavigationButton from "./NavigationButton"
import { Accordion, Box, Flex, Icon, Text } from "@chakra-ui/react"
import { ParachuteIcon } from "@components/Assets/AirdropIcon"
import { keyframes } from "@emotion/react"
import { motion } from "framer-motion"
import { type ReactElement } from "react"
import { useCallback, useEffect, useMemo } from "react"
import { useLocation } from "react-router-dom"
import { useRecoilState } from "recoil"
import { activeIndexState, activeRouteState } from "state/UIState"

export const RouterArea = () => {
	const gradientAnimation = keyframes`
    0% {
      background-position: 0% 50%;
    }
    50% {
      background-position: 100% 50%;
    }
    100% {
      background-position: 0% 50%;
    }
  `

	const location = useLocation()
	const [, setActiveRoute] = useRecoilState(activeRouteState)
	const [activeIndex, setActiveIndex] = useRecoilState(activeIndexState)

	const url = import.meta.env.VITE_NEUTRONNETWORK === "neutron" ? "/airdrop" : "/airdrop"
	// @ts-expect-error types
	const data: NavigationButtonProps[] = useMemo(() => {
		return [
			{
				icon: <Icon as={ParachuteIcon} h="full" w="full" zIndex={1} />,
				isDisabled: false,
				label: (
					<Text
						css={{
							animation: `${gradientAnimation} 2s ease infinite`,
							background: "-webkit-linear-gradient(45deg, #61a9bb, #ec80fe)",
							backgroundSize: "400% 400%",
							marginLeft: "6px",
							WebkitBackgroundClip: "text",
							WebkitTextFillColor: "transparent"
						}}
					>
						Airdrop Checker
					</Text>
				),
				navId: 11,
				url
			}
		]
	}, [gradientAnimation, url])

	const initialIndex = useCallback(() => {
		let initialIndexId = -1 // Default to -1 if no match
		const pathParts = location.pathname.split("/")

		const foundIndex = data.findIndex((item) => {
			if (item.subLinks) {
				return Object.keys(item.subLinks).some((subItem) => {
					return pathParts.includes(subItem.toLowerCase())
				})
			}

			return pathParts.includes(item.url.split("/")[1].toLowerCase())
		})

		// eslint-disable-next-line no-negated-condition
		if (foundIndex !== -1) {
			initialIndexId = data[foundIndex].navId
			setActiveRoute(data[foundIndex].subLinks)
		} else {
			setActiveRoute(undefined)
		}

		return initialIndexId
	}, [data, location.pathname, setActiveRoute])

	useEffect(() => {
		setActiveIndex(initialIndex())
	}, [initialIndex, setActiveIndex])

	const handleClick = (
		navid: number,
		subLinks: Record<string, { icon: ReactElement; url: string }> | undefined
	) => {
		setActiveIndex(navid)
		setActiveRoute(subLinks)
	}

	return (
		<>
			<Flex align="start" justify="end" pos="relative" w="full" pt={3}>
				<Accordion allowToggle as={motion.div} border="0px" layout w="full">
					{data.map((props) => (
						<NavigationButton
							// eslint-disable-next-line react/prop-types
							key={props.navId}
							activeIndex={activeIndex}
							// eslint-disable-next-line react/prop-types
							isDisabled={props.isDisabled}
							onClick={() => {
								// eslint-disable-next-line react/prop-types
								handleClick(props.navId, props.subLinks)
							}}
							{...props}
						/>
					))}
				</Accordion>
			</Flex>
			<Box display={{ base: "none", md: "flex" }} />
		</>
	)
}
