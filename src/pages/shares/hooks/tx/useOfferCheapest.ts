/* eslint-disable unicorn/no-array-for-each */
/* eslint-disable @typescript-eslint/no-shadow */
/* eslint-disable import/no-duplicates */
/* eslint-disable no-console */
import { useContractList, useContractOffers } from "../query/useListing"
import { WalletStatus } from "@cosmos-kit/core"
import { useChain } from "@cosmos-kit/react"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { handleTxError } from "@utils/handleTxError"
import DefaultToast from "components/Toasts/DefaultToast"
import SuccessToast from "components/Toasts/SuccessToast"
import { useRef } from "react"
import { type Id, toast } from "react-toastify"

export type Swap = {
	creator: string
	expires: string
	id: string
	nft_contract: string
	payment_token: string | null
	price: string
	swap_type: string
	token_id: string
}

export type Listing = {
	id: string
	price: string
}

export type ContractResponse = {
	page: number
	swaps: Swap[]
	total: string
}

type BuyCheapestProps = {
	collection: {
		Author: string
		Tquantity: string
		contractAddress: string
		image: string
		imageA: string
		imageB: string
		issuerContract: string
		marketAddress: string
		name: string
	}
	initialValue?: number
}

export const useOfferCheapest = ({ collection }: BuyCheapestProps) => {
	const { getSigningCosmWasmClient, address, status } = useChain(
		import.meta.env.VITE_NEUTRONNETWORK
	)

	const toastId = useRef<Id>()
	const queryClient = useQueryClient()
	const { marketAddress } = collection // Keep using the marketAddress from collection

	// Use your hooks to get listings and offers
	const [listingsData] = useContractList(marketAddress)
	const [offersData] = useContractOffers(marketAddress)

	console.log("Listings Data:", listingsData)
	console.log("Offers Data:", offersData)

	// Combined fetching logic
	const fetchCombinedSwapsAndListings = async () => {
		try {
			const swaps = offersData?.swaps ?? []
			const listings = listingsData?.swaps ?? []

			console.log("Swaps length:", swaps.length)
			console.log("Listings length:", listings.length)

			if (!Array.isArray(swaps) || !Array.isArray(listings)) {
				throw new TypeError("Invalid swaps or listings format.")
			}

			// Combine and transform data
			const combined = [...swaps, ...listings].map((swap) => ({
				...swap,
				price: Number(swap.price)
			}))

			console.log("Combined swaps and listings:", combined)
			return combined
		} catch (error) {
			console.error("Error fetching swaps and listings:", error)
			throw error
		}
	}

	// Collect existing IDs
	const existingIds = new Set<number>()
	const swaps = offersData?.swaps ?? []
	const listings = listingsData?.swaps ?? []

	swaps.forEach((swap) => existingIds.add(Number(swap.id)))
	listings.forEach((listing) => existingIds.add(Number(listing.id)))

	// Find the smallest available ID starting from 1
	let currentId = 1
	while (existingIds.has(currentId)) {
		currentId++
	}

	const { data: combinedSwaps, isLoading } = useQuery(
		["combinedSwaps"],
		fetchCombinedSwapsAndListings,
		{
			cacheTime: 0,
			onError: (error) => console.error("Query error:", error),
			refetchInterval: 5_000,
			refetchOnMount: true,
			refetchOnWindowFocus: false,
			retry: 2
		}
	)

	return useMutation(
		async ({ maxPrice }: { maxPrice: number }) => {
			if (status !== WalletStatus.Connected) {
				throw new Error("Please connect your wallet.")
			}

			if (isLoading) {
				throw new Error("Data is still loading...")
			}

			if (!combinedSwaps) {
				throw new Error("Combined swaps data is not available.")
			}

			const sortedSwaps = combinedSwaps
				.filter((swap) => {
					const price = Number(swap.price)
					const isValid = swap && !Number.isNaN(price) && swap.nft_contract

					if (!isValid) {
						console.log("Filtered out swap:", swap)
					}

					return isValid
				})
				.sort((b, a) => Number(b.price) - Number(a.price))

			console.log("Sorted Swaps:", sortedSwaps)

			if (!sortedSwaps || sortedSwaps.length === 0) {
				console.error("No valid swaps after filtering:", combinedSwaps)
				throw new Error("No valid swaps found after filtering.")
			}

			const selectedSwap = sortedSwaps[0]
			toastId.current = toast(
				DefaultToast({ isPromise: true, toastText: "Executing contract..." }),
				{
					autoClose: false,
					type: "default"
				}
			)

			const client = await getSigningCosmWasmClient()
			const adjustedPrice = maxPrice * 1_000_000
			const message = {
				create: {
					cw721: collection.contractAddress,
					expires: { never: {} },
					id: currentId.toString(), // Use the calculated currentId
					payment_token: "untrn",
					price: adjustedPrice.toString(),
					swap_type: "Offer",
					token_id: selectedSwap.token_id
				}
			}

			const funds = [{ amount: adjustedPrice.toString(), denom: "untrn" }]

			try {
				const response = await client.execute(
					address!,
					marketAddress, // Use the marketAddress directly here
					message,
					"auto",
					undefined,
					funds
				)
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
			onSuccess(data) {
				toast.update(toastId.current!, {
					autoClose: 5_000,
					progressStyle: { background: "rgba(2, 226, 150, 1)", height: "0.6rem" },
					render: SuccessToast({ data, txType: "Contract Execution" }),
					type: "success"
				})
				void queryClient.invalidateQueries(["combinedSwaps"])
				console.log("Combined swaps data:", combinedSwaps)
			}
		}
	)
}

export default useOfferCheapest
