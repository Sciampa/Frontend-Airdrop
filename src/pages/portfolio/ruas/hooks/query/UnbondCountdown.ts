/* eslint-disable no-console */
/* eslint-disable consistent-return */
import { useChain } from "@cosmos-kit/react"
import { useEffect, useState } from "react"

type ReleaseCountdownFetcherProps = {
	onReleaseCountdownUpdate: (countdown: string | null) => void
	stakingContractAddress: string
	tokenId: string
}

export const useFetchedReleaseCountdownData = ({
	stakingContractAddress,
	tokenId,
	onReleaseCountdownUpdate
}: ReleaseCountdownFetcherProps) => {
	const { address, getCosmWasmClient } = useChain(import.meta.env.VITE_NEUTRONNETWORK)
	const [countdown, setCountdown] = useState<number | null>(null) // Store countdown in seconds
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	const [releaseTime, setReleaseTime] = useState<number | null>(null) // Store release time in milliseconds

	useEffect(() => {
		const fetchReleaseData = async () => {
			if (!stakingContractAddress || !tokenId) return

			try {
				const cosmwasmClient = await getCosmWasmClient()
				const response = await cosmwasmClient.queryContractSmart(stakingContractAddress, {
					nft_claims: { address }
				})

				if (response?.nft_claims) {
					// eslint-disable-next-line @typescript-eslint/no-explicit-any
					const nftClaim = response.nft_claims.find((claim: any) => claim.token_id === tokenId)

					if (nftClaim?.release_at?.at_time) {
						const releaseTimeNano = BigInt(nftClaim.release_at.at_time)
						const releaseTimeMillis = Number(releaseTimeNano) / 1_000_000 // Convert to milliseconds
						setReleaseTime(releaseTimeMillis)
						setCountdown(Math.floor((releaseTimeMillis - Date.now()) / 1_000)) // Set initial countdown in seconds
						onReleaseCountdownUpdate(
							Math.floor((releaseTimeMillis - Date.now()) / 1_000).toString()
						)
					} else {
						setCountdown(null)
						onReleaseCountdownUpdate(null)
					}
				} else {
					setCountdown(null)
					onReleaseCountdownUpdate(null)
				}
			} catch (error) {
				console.error("Error fetching NFT release data:", error)
				setCountdown(null)
				onReleaseCountdownUpdate(null)
			}
		}

		if (stakingContractAddress && tokenId && address) {
			void fetchReleaseData()
		}
	}, [stakingContractAddress, address, getCosmWasmClient, tokenId, onReleaseCountdownUpdate])

	useEffect(() => {
		if (countdown === null || countdown <= 0) return // No countdown needed if it's null or non-positive

		const interval = setInterval(() => {
			setCountdown((previousCountdown) => {
				if (previousCountdown === null || previousCountdown <= 1) {
					clearInterval(interval) // Stop the interval if the countdown reaches zero
					return 0 // Ensure countdown is set to zero
				}

				return previousCountdown - 1 // Decrement countdown
			})
		}, 1_000) // Update every second

		// Cleanup the interval on unmount
		return () => clearInterval(interval)
	}, [countdown]) // Dependency on countdown value

	// Return the countdown as a string format for display
	const formattedCountdown =
		countdown !== null && countdown > 0
			? `${Math.floor(countdown / 86_400)} | ${Math.floor(
					(countdown % 86_400) / 3_600
			  )} | ${Math.floor((countdown % 3_600) / 60)} | ${countdown % 60}`
			: null

	// Call the update callback with the formatted countdown string
	useEffect(() => {
		onReleaseCountdownUpdate(formattedCountdown)
	}, [formattedCountdown, onReleaseCountdownUpdate])

	return formattedCountdown // Return the formatted countdown string
}
