import { Box, type BoxProps, Text } from "@chakra-ui/react"

type ParticlesTagProps = BoxProps & {
	text?: string
}

export const ParticlesTag = ({ text = "PARTICLES", ...props }: ParticlesTagProps) => (
	<Box
		ml="-0.2rem"
		display="flex"
		alignItems="center"
		justifyContent="center"
		border="1px solid"
		borderColor="#0ed145"
		borderRadius="4px"
		textAlign="center"
		{...props}
	>
		<Text fontSize="0.33rem" color="#0ed145" fontWeight="bold">
			{text}
		</Text>
	</Box>
)
