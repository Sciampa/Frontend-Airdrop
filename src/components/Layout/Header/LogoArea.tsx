import { Flex, HStack, Image, useBreakpointValue } from "@chakra-ui/react"
import { useNavigate } from "react-router-dom"
import { useRecoilState } from "recoil"
import { activeIndexState, activeRouteState } from "state/UIState"

const LogoArea = () => {
	const navigate = useNavigate()
	const [, setActiveRoute] = useRecoilState(activeRouteState)
	const [, setActiveIndex] = useRecoilState(activeIndexState)

	// Determine the height of the image based on the breakpoint
	const imageHeight = useBreakpointValue({ base: "4rem", md: "3rem" })

	return (
		<Flex
			direction="column"
			align="center"
			justify="center"
			pb={3}
			pt={2}
			w="full"
			onClick={() => {
				navigate("/")
				setActiveRoute(undefined)
				setActiveIndex(-1)
			}}
			_hover={{ cursor: "pointer" }}
		>
			<HStack justify="center">
				<Image pl={0} pr={2} h={imageHeight} src="/assets/electronnameW.svg" />
			</HStack>
		</Flex>
	)
}

export default LogoArea
