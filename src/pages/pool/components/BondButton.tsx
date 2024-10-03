import { Box, useRadio } from "@chakra-ui/react"

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const BondButton = (props: any) => {
	const { getInputProps, getCheckboxProps, state } = useRadio(props)

	const input = getInputProps()
	const checkbox = getCheckboxProps()

	return (
		<Box as="label">
			<input {...input} />
			<Box
				{...checkbox}
				_checked={{
					bgGradient: "linear(45deg, #4b6cb7, brand.2)",
					color: "white",
					filter: "drop-shadow(0px 0px 2px rgba(33, 33, 33, 0.5))"
				}}
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
				_focus={{
					boxShadow: "glowMd"
				}}
				_hover={{
					filter:
						state.isChecked || props.isDisabled
							? ""
							: "brightness(110%) drop-shadow(0px 0px 3px rgba(33, 33, 33, 0.5))"
				}}
				bg="gray.800"
				borderRadius="1.25em"
				color="white"
				cursor={props.isDisabled ? "not-allowed" : "pointer"}
				opacity={props.isDisabled ? 0.3 : 1}
				px={5}
				py={3}
				rounded="1.25em"
				shadow="md"
				transition="0.2s all"
			>
				{props.children}
			</Box>
		</Box>
	)
}
