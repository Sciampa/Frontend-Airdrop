/* eslint-disable no-console */
import { WalletStatus } from "@cosmos-kit/core"
import { useChain } from "@cosmos-kit/react"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { handleTxError } from "@utils/handleTxError"
import { useRef } from "react"
import { type Id, toast } from "react-toastify"

type Sale = {
	id: string
	price: string // Adjust based on how price is handled
	token_id: string
}

type ExecuteCancelParameters = {
	// The ID of the token you want to cancel
	currentId: string
	marketAddress: string
	maxPrice: number
	nftContract: string
	tokenId: string
}

export const useExecuteCancel = ({ collection }: { collection: { marketAddress: string } }) => {
	const { getSigningCosmWasmClient, address, status } = useChain(
		import.meta.env.VITE_NEUTRONNETWORK
	)
	const toastId = useRef<Id>()
	const queryClient = useQueryClient()
	const marketAddress = collection.marketAddress

	if (!marketAddress) {
		throw new Error("Market address is not defined.")
	}

	// Fetch the listings for a specific tokenId
	const fetchListingsForToken = async (tokenId: string) => {
		const client = await getSigningCosmWasmClient()
		const listingsQueryMessage = { get_listings: {} }

		try {
			const listingsResult = await client.queryContractSmart(marketAddress, listingsQueryMessage)
			if (!listingsResult?.swaps || !Array.isArray(listingsResult.swaps)) {
				throw new TypeError("Listings data is missing or not in the expected format.")
			}

			const listingsForToken = listingsResult.swaps.filter(
				(listing: Sale) => listing.token_id === tokenId
			)

			return listingsForToken // Return the array of listings for the token
		} catch (error) {
			console.error("Error fetching listings for token:", error)
			throw error
		}
	}

	return useMutation(
		async ({ tokenId }: ExecuteCancelParameters) => {
			if (status !== WalletStatus.Connected) {
				throw new Error("Please connect your wallet.")
			}

			const client = await getSigningCosmWasmClient()
			let listings: Sale[]

			try {
				// Fetch the listings for the specified token
				listings = await fetchListingsForToken(tokenId)

				if (listings.length === 0) {
					throw new Error("No listings found for this token ID.")
				}

				// Create the cancel message using the ID of the selected listing
				const cancelMessage = {
					cancel: {
						id: listings[0].id // Use the ID of the first listing (or you can choose based on your logic)
					}
				}

				// Execute the cancel message using the marketAddress
				const response = await client.execute(address!, marketAddress, cancelMessage, "auto")
				return response
			} catch (error) {
				console.error("Error executing contract:", error)
				throw error
			}
		},
		{
			onError(error) {
				console.error("Contract execution error:", error)
				handleTxError({ error, toastId })
			},
			onSuccess() {
				toastId.current = toast.loading("Transaction successful!", {
					autoClose: 5_000,
					type: "success"
				})
				void queryClient.invalidateQueries(["availableSwaps", marketAddress])
			}
		}
	)
}

export default useExecuteCancel
