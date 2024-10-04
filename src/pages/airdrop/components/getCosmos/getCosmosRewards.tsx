/* eslint-disable no-negated-condition */
/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable no-console */
import { Flex, Image, Spinner, Text } from "@chakra-ui/react"
import { useChain } from "@cosmos-kit/react"
import axios from "axios"
import { useEffect, useState } from "react"

type AddressData = {
	delegator_address: string
	leftover: string
	particles: string
	share_percentage: number
	total_count: string
}

const CosmosIBCreceived = () => {
	const { address, isWalletConnected } = useChain("cosmoshub")
	const [walletAddress, setWalletAddress] = useState<string>("")
	const [percentage, setPercentage] = useState<number | null>(null)
	const [particles, setParticles] = useState<number | null>(null) // Store particles as number
	const [isLoading, setIsLoading] = useState<boolean>(true) // Loading state

	useEffect(() => {
		if (isWalletConnected && address) {
			setWalletAddress(address)
		}
	}, [isWalletConnected, address])

	// eslint-disable-next-line consistent-return
	useEffect(() => {
		const fetchData = async (): Promise<void> => {
			try {
				const response = await axios.get<AddressData[]>(
					"https://raw.githubusercontent.com/Electron-Protocol/airdrop/main/Cosmos/Cosmos_percentage_Rewards.json"
				)
				const data = response.data
				const addressData = data.find(
					// eslint-disable-next-line @typescript-eslint/prefer-string-starts-ends-with
					(item) => item.delegator_address.slice(0, 12) === walletAddress.slice(0, 12)
				)
				if (addressData) {
					setPercentage(addressData.share_percentage)
					const convertedParticles = Number.parseFloat(addressData.particles) / 1_000_000
					setParticles(convertedParticles)
				} else {
					setPercentage(0)
					setParticles(0)
				}
			} catch (error) {
				console.error("Error fetching data:", error)
				setPercentage(0)
				setParticles(0)
			}
		}

		if (walletAddress) {
			void fetchData()

			const timeout = setTimeout(() => {
				setIsLoading(false)
			}, 22_000)

			return () => clearTimeout(timeout)
		}
	}, [walletAddress])

	return (
		<Flex alignItems="center" flexDirection="column">
			<Text fontSize={{ base: "0.35rem", md: "0.5rem" }} ml="0">
				Collect Rewards
			</Text>

			{isLoading ? (
				<>
					<Spinner size="sm" />
					<Text fontSize={{ base: "0.35rem", md: "0.5rem" }} ml="0">
						Loading data...
					</Text>
				</>
			) : (
				<>
					<Text fontSize={{ base: "0.35rem", md: "0.5rem" }} ml="0">
						{percentage !== null ? percentage + "%" : "Percentage: N/A"}
					</Text>
					<Flex
						alignItems="center"
						fontWeight="bold"
						fontSize={{ base: "0.35rem", md: "1rem" }}
						ml="0"
					>
						{particles !== null ? particles.toFixed(2) : "Not eligible"}
						{particles !== null && (
							<Image
								src="/assets/tokens/particle.png"
								alt="Particle Icon"
								boxSize="1rem"
								ml="0.3rem"
								mt="0.09rem"
							/>
						)}
					</Flex>
				</>
			)}
		</Flex>
	)
}

export default CosmosIBCreceived
