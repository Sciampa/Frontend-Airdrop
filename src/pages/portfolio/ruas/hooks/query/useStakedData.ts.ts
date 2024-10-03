/* eslint-disable no-console */
import { useChain } from "@cosmos-kit/react"
import { useEffect } from "react"

type StakedNFTDataFetcherProps = {
	onStakedStatusUpdate: (isStaked: boolean | null) => void
	stakingContractAddress: string
	tokenId: string
}

const FetchedStakedNFTData = ({
	stakingContractAddress,
	tokenId,
	onStakedStatusUpdate
}: StakedNFTDataFetcherProps) => {
	const { address, getCosmWasmClient } = useChain(import.meta.env.VITE_NEUTRONNETWORK)

	// Fetch staked NFT data and update the staked status
	useEffect(() => {
		const fetchStakedData = async () => {
			if (!stakingContractAddress || !tokenId) return

			try {
				const cosmwasmClient = await getCosmWasmClient()
				// Query the contract using the staked_nfts message format and connected wallet address
				const response = await cosmwasmClient.queryContractSmart(stakingContractAddress, {
					staked_nfts: { address }
				})

				if (response?.staked_nfts && Array.isArray(response.staked_nfts)) {
					// Check if the tokenId is part of the staked NFTs
					const isStaked = response.staked_nfts.includes(tokenId)
					onStakedStatusUpdate(isStaked)
				} else {
					onStakedStatusUpdate(null)
				}
			} catch (error) {
				console.error("Error fetching staked NFT data:", error)
				onStakedStatusUpdate(null)
			}
		}

		if (stakingContractAddress && tokenId && address) {
			void fetchStakedData()
		}
	}, [stakingContractAddress, address, getCosmWasmClient, tokenId, onStakedStatusUpdate])

	return null
}

export default FetchedStakedNFTData
