import { Box, type BoxProps, Text } from "@chakra-ui/react"

type ParticlesTagProps = BoxProps & {
	text?: string
}

export const ExternalTag = ({ text = "EXTERNAL", ...props }: ParticlesTagProps) => (
	<Box
		ml="-0.2rem"
		display="flex"
		alignItems="center"
		justifyContent="center"
		border="1px solid"
		borderColor="gray"
		borderRadius="4px"
		textAlign="center"
		{...props}
	>
		<Text fontSize="0.33rem" color="gray" fontWeight="bold">
			{text}
		</Text>
	</Box>
)
