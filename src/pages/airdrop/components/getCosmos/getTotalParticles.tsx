/* eslint-disable no-console */
import { Flex, Image, Spinner } from "@chakra-ui/react"
import { useChain } from "@cosmos-kit/react"
// eslint-disable-next-line import/no-extraneous-dependencies
import axios from "axios"
import { useEffect, useState } from "react"

const CosmosTotalParticles = () => {
	const { address, isWalletConnected } = useChain("cosmoshub")
	const [totalParticles, setTotalParticles] = useState<number | null>(null) // Store total_particles as number
	const [isLoading, setIsLoading] = useState<boolean>(true) // Loading state

	// Fetch data based on the wallet address
	useEffect(() => {
		const fetchData = async (): Promise<void> => {
			if (!isWalletConnected || !address) {
				setTotalParticles(null)
				setIsLoading(false)
				return // Exit if not connected
			}

			setIsLoading(true) // Set loading state at the start
			try {
				const response = await axios.get<
					Array<{ delegator_address: string; total_particles: number }>
				>(
					"https://raw.githubusercontent.com/Electron-Protocol/airdrop/main/Cosmos/Total_Particles_Cosmos.json"
				)
				const addressData = response.data.find((item) => item.delegator_address === address)
				if (addressData) {
					// Convert to desired units (assuming particles are in smaller units)
					setTotalParticles(addressData.total_particles / 1_000_000)
				} else {
					setTotalParticles(0) // Address not found
				}
			} catch (error) {
				console.error("Error fetching data:", error)
				setTotalParticles(0) // Reset total particles on error
			} finally {
				setIsLoading(false) // Set loading to false regardless of success or error
			}
		}

		void fetchData()
	}, [isWalletConnected, address])

	return (
		<Flex alignItems="center" flexDirection="column" justifyContent="center">
			{isLoading ? (
				<Spinner size="sm" />
			) : (
				<Flex
					alignItems="center"
					fontWeight="bold"
					fontSize={{ base: "0.35rem", md: "1.5rem" }}
					ml="0"
					justifyContent="center" // Centering text and image horizontally
				>
					{totalParticles === null ? "Not eligible" : totalParticles.toFixed(2)}
					{totalParticles !== null && (
						<Image
							src="/assets/tokens/particle.png"
							alt="Particle Icon"
							boxSize="1.25rem"
							ml="0.3rem"
							mt="0.1rem"
						/>
					)}
				</Flex>
			)}
		</Flex>
	)
}

// Export the component and values
export const useCosmosTotalParticles = () => {
	const { address, isWalletConnected } = useChain("cosmoshub")
	const [totalParticles, setTotalParticles] = useState<number | null>(null) // Store total_particles as number

	useEffect(() => {
		const fetchData = async (): Promise<void> => {
			if (!isWalletConnected || !address) {
				setTotalParticles(null)
				return // Exit if not connected
			}

			try {
				const response = await axios.get<
					Array<{ delegator_address: string; total_particles: number }>
				>(
					"https://raw.githubusercontent.com/Electron-Protocol/airdrop/main/Cosmos/Total_Particles_Cosmos.json"
				)
				const addressData = response.data.find((item) => item.delegator_address === address)
				if (addressData) {
					// Convert to desired units (assuming particles are in smaller units)
					setTotalParticles(addressData.total_particles / 1_000_000)
				} else {
					setTotalParticles(0) // Address not found
				}
			} catch (error) {
				console.error("Error fetching data:", error)
				setTotalParticles(0) // Reset total particles on error
			}
		}

		void fetchData()
	}, [isWalletConnected, address])

	// Compute the divided value
	const dividedParticles = totalParticles ? totalParticles / 10 : null

	return { dividedParticles, totalParticles } // Return both values
}

export default CosmosTotalParticles
