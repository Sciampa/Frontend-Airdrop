import { Box, type BoxProps, Text } from "@chakra-ui/react"

type ParticlesTagProps = BoxProps & {
	text?: string
}

export const VerifiedTag = ({ text = "VERIFIED", ...props }: ParticlesTagProps) => (
	<Box
		display="flex"
		alignItems="center"
		justifyContent="center"
		border="1px solid"
		borderColor="#4b6cb7"
		borderRadius="4px"
		textAlign="center"
		{...props}
	>
		<Text fontSize="0.33rem" color="#4b6cb7" fontWeight="bold">
			{text}
		</Text>
	</Box>
)
