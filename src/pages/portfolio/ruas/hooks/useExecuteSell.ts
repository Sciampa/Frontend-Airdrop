/* eslint-disable prettier/prettier */
/* eslint-disable no-console */
import { useContractList, useContractOffers } from "../../../shares/hooks/query/useListing"
import { WalletStatus } from "@cosmos-kit/core"
import { useChain } from "@cosmos-kit/react"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { handleTxError } from "@utils/handleTxError"
import DefaultToast from "components/Toasts/DefaultToast"
import SuccessToast from "components/Toasts/SuccessToast"
import { useRef } from "react"
import { type Id, toast } from "react-toastify"

type ExecuteSellParameters = {
	currentId: string
	marketAddress: string
	maxPrice: number
	nftContract: string
	tokenId: string
}

export const useExecuteSell = ({ collection }: { collection: { marketAddress: string } }) => {
	const { getSigningCosmWasmClient, address, status } = useChain(
		import.meta.env.VITE_NEUTRONNETWORK
	)
	const toastId = useRef<Id>()
	const queryClient = useQueryClient()
	const marketAddress = collection.marketAddress

	const fetchAvailableSwaps = async () => {
		const client = await getSigningCosmWasmClient()
		const queryMessage = { get_listings: {} }
		const offersQueryMessage = { get_offers: {} }

		try {
			const listingsResult = await client.queryContractSmart(marketAddress, queryMessage)
			const offersResult = await client.queryContractSmart(marketAddress, offersQueryMessage)

			if (!listingsResult?.swaps || !Array.isArray(listingsResult.swaps)) {
				throw new TypeError("Listings data is missing or not in the expected format.")
			}

			if (!offersResult?.swaps || !Array.isArray(offersResult.swaps)) {
				throw new TypeError("Offers data is missing or not in the expected format.")
			}

			const listingsSwaps = listingsResult.swaps
				// eslint-disable-next-line @typescript-eslint/no-explicit-any
				.map((swap: { [key: string]: any; price: string }) => {
					if (!swap.price) {
						return null
					}

					return {
						...swap,
						id: Number(swap.id),
						price: Number(swap.price)
					}
				})
				.filter(Boolean)

			const offersSwaps = offersResult.swaps
				// eslint-disable-next-line @typescript-eslint/no-explicit-any
				.map((swap: { [key: string]: any; price: string }) => {
					if (!swap.price) {
						return null
					}

					return {
						...swap,
						id: Number(swap.id),
						price: Number(swap.price)
					}
				})
				.filter(Boolean)

			// eslint-disable-next-line @typescript-eslint/no-shadow
			const combinedSwaps = [...listingsSwaps, ...offersSwaps]

			const idsByMarketAddress: { [key: string]: number[] } = {}
			for (const swap of combinedSwaps) {
				const id = swap.id
				if (!idsByMarketAddress[marketAddress]) {
					idsByMarketAddress[marketAddress] = []
				}

				idsByMarketAddress[marketAddress].push(id)
			}

			return { combinedSwaps, idsByMarketAddress }
		} catch (error) {
			console.error("Error fetching available swaps:", error)
			throw error
		}
	}

	const { data: swapData, isLoading: isSwapsLoading } = useQuery(
		["availableSwaps", marketAddress],
		fetchAvailableSwaps,
		{
			onError: (error) => {
				console.error("Error in useQuery:", error)
			},
			refetchOnWindowFocus: false
		}
	)

	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	const { combinedSwaps = [], idsByMarketAddress: fetchedIdsByMarketAddress } = swapData ?? {}

	const [listingsData] = useContractList(marketAddress)
	const [offersData] = useContractOffers(marketAddress)

	const finalSwaps = [
		...(combinedSwaps ?? []),
		...(offersData?.swaps ?? []),
		...(listingsData?.swaps ?? [])
	]


	const usedIds = finalSwaps.map((swap) => swap.id)


	const getSmallestAvailableId = () => {
		const usedIdsSet = new Set(usedIds)
		let smallestId = 1

		while (usedIdsSet.has(smallestId)) {
			smallestId++
		}

		return smallestId
	}

	const smallestAvailableId = getSmallestAvailableId()

	return useMutation(
		async ({ maxPrice, nftContract, tokenId }: ExecuteSellParameters) => {
			if (status !== WalletStatus.Connected) {
				throw new Error("Please connect your wallet.")
			}

			if (isSwapsLoading) {
				throw new Error("Swaps data is still loading...")
			}

			const client = await getSigningCosmWasmClient()
			try {
				const nftDetails = await client.queryContractSmart(nftContract, {
					nft_info: { token_id: tokenId }
				})

				console.log("NFT Details:", nftDetails)
			} catch (error) {
				console.error("Error retrieving NFT details:", error)
				throw new Error("Could not retrieve NFT details.")
			}

			const adjustedPrice = maxPrice * 1_000_000

			const approvalMessage = {
				approve: {
					spender: marketAddress,
					token_id: tokenId
				}
			}

			try {
				const approveResponse = await client.execute(address!, nftContract, approvalMessage, "auto")
				console.log("Approval response:", approveResponse)
			} catch (error) {
				console.error("Error approving contract:", error)
				throw new Error("Approval failed.")
			}

			toastId.current = toast(
				DefaultToast({ isPromise: true, toastText: "Executing contract..." }),
				{
					autoClose: false,
					type: "default"
				}
			)

			const uniqueId = smallestAvailableId.toString();

			const message = {
				create: {
					cw721: nftContract,
					expires: { never: {} },
					id: uniqueId,
					price: adjustedPrice.toString(),
					swap_type: "Sale",
					token_id: tokenId
				}
			}

			const funds = [{ amount: adjustedPrice.toString(), denom: "untrn" }]

			try {
				const response = await client.execute(
					address!,
					marketAddress,
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
				void queryClient.invalidateQueries(["availableSwaps", marketAddress])
			}
		}
	)
}

export default useExecuteSell
