/* eslint-disable @typescript-eslint/no-unused-vars */
import { Box, Flex, Icon, Text, useBreakpoint } from "@chakra-ui/react"
import { ParachuteIconNavMobile } from "@components/Assets/AirdropIconNavMobile"
import { GovernanceIconNavMobile } from "@components/Assets/GovernanceIconNavMobile"
import { MoreIcon } from "@components/Assets/MoreIcon"
import { MyaccountIconNavMobile } from "@components/Assets/MyaccountIconNavMobile"
import { RUAIconNavMobile } from "@components/Assets/RUAIconNavMobile"
import { RWAIconNavMobile } from "@components/Assets/RWAIconNavMobile"
import { SwapIconNavMobile } from "@components/Assets/SwapIconNavMobile"
import { useChain } from "@cosmos-kit/react"
import { keyframes } from "@emotion/react"
import { BridgeIconNavMobile } from "components/Assets/BridgeIconNavMobile"
import { FarmIconNavMobile } from "components/Assets/FarmIconNavMobile"
import { StakingIconNavMobile } from "components/Assets/StakingIconNavMobile"
// eslint-disable-next-line import/no-extraneous-dependencies
import PropTypes from "prop-types"
import { type ReactNode, useCallback, useEffect, useMemo, useState } from "react"
import { useLocation, useNavigate } from "react-router-dom"
import { useRecoilState } from "recoil"
import { activeIndexState } from "state/UIState"

export type NavigationButtonProps = {
	icon: React.ReactElement
	isDisabled: boolean
	label: ReactNode
	navId: number
	onClick?: () => void
	subLinks?: { [key: string]: NavigationButtonProps }
	url: string
}

export type SubLinkPopupProps = {
	isVisible: boolean
	onClose: () => void
	subLinks: { [key: string]: NavigationButtonProps }
}

const SubLinkPopup: React.FC<SubLinkPopupProps> = ({ subLinks, isVisible, onClose }) => {
	const navigate = useNavigate() // Import useNavigate hook

	return isVisible ? (
		<Box
			position="absolute"
			bottom="100%"
			bgGradient="linear(to-b, #0a2b33, #1a001e)"
			color="white"
			p={2}
			borderRadius="md"
			boxShadow="md"
			zIndex="9999"
			width="5em"
			left="55%"
			mb="0.5rem"
			transform="translateX(-61%)"
		>
			{Object.entries(subLinks).map(([key, subLink]) => (
				<Flex
					key={subLink.navId}
					direction="column"
					alignItems="center"
					justifyContent="center"
					cursor={subLink.isDisabled ? "default" : "pointer"} // Change cursor to "pointer"
					opacity={subLink.isDisabled ? 0.5 : 0.8}
					mt={2}
					mb={2}
					onClick={() => {
						if (!subLink.isDisabled) {
							if (subLink.url === "/bridge") {
								// Check if the URL is for the Bridge page
								navigate(subLink.url) // Navigate to the Bridge page
								onClose() // Close the submenu after navigation
							} else {
								// Handle navigation for other URLs if needed
								// You can add more conditions here if necessary
								navigate(subLink.url) // Navigate to the specified URL
								onClose() // Close the submenu after navigation
							}
						}
					}}
				>
					<Flex ml={2.5}>{subLink.icon}</Flex>
					<Text fontSize="0.3rem" mt={-1.5} textAlign="center">
						{subLink.label}
					</Text>
					{subLink.isDisabled && ( // Render "coming soon" text only if isDisabled is true
						<Text fontSize="0.2rem" textAlign="center">
							coming soon
						</Text>
					)}
				</Flex>
			))}
		</Box>
	) : null
}

// Add PropTypes validation for SubLinkPopup component
SubLinkPopup.propTypes = {
	// eslint-disable-next-line import/no-named-as-default-member
	isVisible: PropTypes.bool.isRequired,
	// eslint-disable-next-line import/no-named-as-default-member
	onClose: PropTypes.func.isRequired,
	// eslint-disable-next-line import/no-named-as-default-member, @typescript-eslint/ban-ts-comment
	// @ts-expect-error
	// eslint-disable-next-line import/no-named-as-default-member
	subLinks: PropTypes.object.isRequired
}

export const FooterMobile2 = () => {
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
	const navigate = useNavigate()
	const [, setActiveIndex] = useRecoilState(activeIndexState)
	const { isWalletConnected } = useChain(import.meta.env.VITE_NEUTRONNETWORK)
	const [isMoreMenuOpen, setIsMoreMenuOpen] = useState(false)

	const url = import.meta.env.VITE_NEUTRONNETWORK === "neutron" ? "/oops" : "/airdrop"

	const data: NavigationButtonProps[] = useMemo(() => {
		return [
			{
				icon: <Icon as={SwapIconNavMobile} h="full" w="full" zIndex={1} />,
				isDisabled: false,
				label: <div style={{ marginLeft: "0px", marginTop: "-0.2rem" }}>Swap</div>,
				navId: 0,
				url: "/swap"
			},
			{
				icon: <Icon as={FarmIconNavMobile} h="full" w="full" zIndex={1} />,
				isDisabled: false,
				label: <div style={{ marginLeft: "0px", marginTop: "-0.2rem" }}>Pools</div>,
				navId: 1,
				url: "/pools"
			},
			{
				icon: <Icon as={RUAIconNavMobile} h="full" w="full" zIndex={1} />,
				isDisabled: false,
				label: <div style={{ marginLeft: "0px" }}>RUA</div>,
				navId: 9,
				url: "/rua"
			},
			{
				icon: <Icon as={BridgeIconNavMobile} h="full" w="full" zIndex={1} />,
				isDisabled: false,
				label: <div style={{ marginRight: "0.05rem", marginTop: "-0.2rem" }}>Bridge</div>,
				navId: 7,
				url: "/bridge"
			},
			{
				icon: <Icon as={MyaccountIconNavMobile} h="full" w="full" zIndex={1} />,
				isDisabled: !isWalletConnected,
				label: <div style={{ marginLeft: "0px", marginTop: "-0.2rem" }}>My Account</div>,
				navId: 4,
				url: "/portfolio"
			},
			{
				icon: <Icon as={MoreIcon} h="full" w="full" zIndex={1} />,
				isDisabled: false,
				label: <div style={{ marginLeft: "0px", marginTop: "-0.2rem" }}>More</div>,
				navId: 8,
				subLinks: {
					Airdrop: {
						icon: <Icon as={ParachuteIconNavMobile} h="full" w="full" zIndex={1} />,
						isDisabled: false,
						label: <div style={{ marginRight: "0.05rem" }}>Airdrop</div>,
						navId: 5,
						url
					},
					Governance: {
						icon: <Icon as={GovernanceIconNavMobile} h="full" w="full" zIndex={1} />,
						isDisabled: true,
						label: <div style={{ marginLeft: "0px" }}>Governance</div>,
						navId: 3,
						url: "/governance"
					},
					//	RWA: {
					//		icon: <Icon as={RWAIconNavMobile} h="full" w="full" zIndex={1} />,
					//		isDisabled: true,
					//		label: <div style={{ marginLeft: "0px", marginTop: "-0.2rem" }}>RWA</div>,
					//		navId: 1,
					//		url: "/"
					//	},
					Staking: {
						icon: <Icon as={StakingIconNavMobile} h="full" w="full" zIndex={1} />,
						isDisabled: true,
						label: <div style={{ marginLeft: "0px" }}>Earn</div>,
						navId: 2,
						url: "/earn"
					}
				},
				url: "#"
			}
		]
	}, [isWalletConnected, url])

	const initialIndex = useCallback(() => {
		let initialIndexId = 0
		switch (location.pathname.split("/")[1]) {
			case "trade":
				initialIndexId = 0
				break
			case "assets":
				initialIndexId = 1
				break
			case "staking":
				initialIndexId = 2
				break
			case "governance":
				initialIndexId = 3
				break
			case "portfolio":
				initialIndexId = 4
				break
			case "airdrop":
				initialIndexId = 5
				break
			case "oops":
				initialIndexId = 6
				break
			case "bridge":
				initialIndexId = 7
				break
			case "popup":
				initialIndexId = 8
				break
			default:
				initialIndexId = -1
				break
		}

		return initialIndexId
	}, [location.pathname])

	useEffect(() => {
		setActiveIndex(initialIndex())
	}, [initialIndex, setActiveIndex])

	// eslint-disable-next-line @typescript-eslint/no-shadow
	// eslint-disable-next-line @typescript-eslint/no-shadow
	const handleClick = (
		navId: number,
		// eslint-disable-next-line @typescript-eslint/no-shadow
		url: string,
		isDisabled: boolean,
		hasSubLinks?: boolean,
		subLinks?: { [key: string]: NavigationButtonProps }
	) => {
		if (hasSubLinks && subLinks) {
			setIsMoreMenuOpen(!isMoreMenuOpen) // Toggle the visibility of the sublinks menu
		} else if (!isDisabled) {
			setActiveIndex(navId)
			if (url === "#") {
				// If the URL is "#" (indicating sublinks), no navigation needed here
				// Instead, we open the sublinks menu
				setIsMoreMenuOpen(!isMoreMenuOpen)
			} else {
				// Otherwise, navigate to the specified URL
				navigate(url)
				// Close the sublinks menu if it was open
				setIsMoreMenuOpen(false)
			}
		}
	}

	const breakpoint = useBreakpoint({ ssr: false })
	const isMobile = Boolean(breakpoint === "base" || breakpoint === "sm")

	if (!isMobile) {
		return null
	}

	return (
		<Flex
			bgGradient="linear(to-b, #0a2b33, #1a001e)"
			color="white"
			p={2}
			justify="space-between"
			align="center"
			position="fixed"
			bottom="0.1"
			height="6%"
			left="0"
			right="0"
			zIndex="999"
			width="100%"
			marginLeft="auto"
			marginRight="auto"
		>
			{data.map((item) => (
				<Flex
					key={item.navId}
					direction="column"
					alignItems="center"
					marginLeft="auto"
					marginRight="auto"
					position="relative"
					onClick={() => handleClick(item.navId, item.url, item.isDisabled, Boolean(item.subLinks))}
					cursor={item.isDisabled ? "default" : "pointer"}
					opacity={item.isDisabled ? 0.5 : 1}
				>
					{item.icon}
					<Text fontSize="0.4rem" mt={-1.5} mr={2.5}>
						{item.label}
					</Text>
					{item.subLinks && (
						<SubLinkPopup
							subLinks={item.subLinks}
							isVisible={isMoreMenuOpen && item.navId === 8}
							onClose={() => setIsMoreMenuOpen(false)}
						/>
					)}
				</Flex>
			))}
		</Flex>
	)
}
