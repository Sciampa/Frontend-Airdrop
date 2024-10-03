/* eslint-disable react/iframe-missing-sandbox */
import { Box } from "@chakra-ui/react" // Assuming you're using Chakra UI

const MyAssets = () => {
	// Replace this with the URL you want to embed
	const externalUrl = "https://bridge.electronprotocol.io/"

	return (
		<Box
			w={{ base: "90%", md: "100%" }} // Smaller width on mobile, larger on tablets/desktops
			h={{ base: "80vh", md: "100vh" }} // Adjust height for different screen sizes
			maxW={{ base: "380px", md: "full" }} // Maximum width to avoid too large on very large screens
			maxH={{ base: "704.2px", md: "full" }}
			mx="auto" // Center horizontally
			my="auto" // Center vertically
			bg="rgba(245, 245, 245)" // Light gray background
		>
			<iframe
				src={externalUrl}
				title="External Site"
				style={{ border: "none", height: "100%", width: "100%" }}
			/>
		</Box>
	)
}

export default MyAssets
