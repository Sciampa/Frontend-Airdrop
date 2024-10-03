/* eslint-disable no-console */
import { WalletStatus } from "@cosmos-kit/core"
import { useChain } from "@cosmos-kit/react"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { handleTxError } from "@utils/handleTxError"
import { useRef } from "react"
import { type Id, toast } from "react-toastify"

type Offer = {
	id: string
	price: string // Adjust based on how price is handled
	token_id: string
}

type ExecuteSellParameters = {
	currentId: string
	marketAddress: string
	maxPrice: number
	nftContract: string
	tokenId: string
}

export const useExecuteAccept = ({ collection }: { collection: { marketAddress: string } }) => {
	const { getSigningCosmWasmClient, address, status } = useChain(
		import.meta.env.VITE_NEUTRONNETWORK
	)
	const toastId = useRef<Id>()
	const queryClient = useQueryClient()
	const marketAddress = collection.marketAddress

	if (!marketAddress) {
		throw new Error("Market address is not defined.")
	}

	// Fetch the highest offer for a specific tokenId
	const fetchOffersForToken = async (tokenId: string) => {
		const client = await getSigningCosmWasmClient()
		const offersQueryMessage = { get_offers: {} }

		try {
			const offersResult = await client.queryContractSmart(marketAddress, offersQueryMessage)
			if (!offersResult?.swaps || !Array.isArray(offersResult.swaps)) {
				throw new TypeError("Offers data is missing or not in the expected format.")
			}

			const offersForToken = offersResult.swaps.filter((offer: Offer) => offer.token_id === tokenId)

			// eslint-disable-next-line unicorn/no-array-reduce
			const highestOffer = offersForToken.reduce((maxOffer: Offer | null, offer: Offer) => {
				if (!maxOffer || Number(offer.price) > Number(maxOffer.price)) {
					return offer
				}

				return maxOffer
			}, null)

			return highestOffer // Return the highest offer object
		} catch (error) {
			console.error("Error fetching offers for token:", error)
			throw error
		}
	}

	return useMutation(
		async ({ nftContract, tokenId }: ExecuteSellParameters) => {
			if (status !== WalletStatus.Connected) {
				throw new Error("Please connect your wallet.")
			}

			const client = await getSigningCosmWasmClient()
			let highestOffer: Offer | null

			try {
				// Fetch the highest offer for the specified token
				highestOffer = await fetchOffersForToken(tokenId)

				if (!highestOffer) {
					throw new Error("No offers found for this token ID.")
				}

				// Create the accept message using the highest offer ID
				const acceptMessage = {
					finish: {
						id: highestOffer.id // Use the ID of the highest price offer
					}
				}

				// Execute the accept message using the nftContract
				const response = await client.execute(address!, nftContract, acceptMessage, "auto")
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

export default useExecuteAccept
