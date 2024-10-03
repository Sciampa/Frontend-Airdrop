/* eslint-disable import/no-named-as-default-member */
/* eslint-disable @typescript-eslint/no-shadow */
/* eslint-disable import/no-duplicates */
/* eslint-disable no-console */
import { useContractList } from "../query/useListing"
import { WalletStatus } from "@cosmos-kit/core"
import { useChain } from "@cosmos-kit/react"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { handleTxError } from "@utils/handleTxError"
import DefaultToast from "components/Toasts/DefaultToast"
import SuccessToast from "components/Toasts/SuccessToast"
import React from "react"
import { useRef } from "react"
import { type Id, toast } from "react-toastify"

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

export const useBuyCheapest = ({ collection }: BuyCheapestProps) => {
	const { getSigningCosmWasmClient, address, status } = useChain(
		import.meta.env.VITE_NEUTRONNETWORK
	)
	const { marketAddress } = collection
	const toastId = useRef<Id>()
	const queryClient = useQueryClient()
	const contractAddressSale = collection.marketAddress
	const [contractList, isLoading, error] = useContractList(marketAddress)

	React.useEffect(() => {}, [contractList, isLoading, error])

	const fetchAvailableSwaps = async () => {
		const client = await getSigningCosmWasmClient()
		const queryMessage = { get_listings: {} }

		try {
			const result = await client.queryContractSmart(contractAddressSale, queryMessage)

			if (!result?.swaps || !Array.isArray(result.swaps)) {
				throw new TypeError("Swaps data is missing or not in the expected format.")
			}

			const swaps = result.swaps
				// eslint-disable-next-line @typescript-eslint/no-explicit-any
				.map((swap: { [key: string]: any; price: string }) => {
					if (!swap.price) {
						return null
					}

					return {
						...swap,
						price: Number(swap.price)
					}
				})
				.filter(Boolean)

			return swaps
		} catch (error) {
			console.error("Error fetching available swaps:", error)
			throw error
		}
	}

	const { data: availableSwaps, isLoading: isSwapsLoading } = useQuery(
		["availableSwaps", marketAddress],
		fetchAvailableSwaps,
		{
			onError: (error) => {
				console.error("Error in useQuery:", error)
			},
			refetchOnWindowFocus: false
		}
	)

	return useMutation(
		["executeContractMsg"],
		async () => {
			if (status !== WalletStatus.Connected) {
				throw new Error("Please connect your wallet.")
			}

			if (isSwapsLoading) {
				throw new Error("Swaps are still loading...")
			}

			if (!availableSwaps || availableSwaps.length === 0) {
				throw new Error("No available swaps found.")
			}

			const swaps = contractList?.swaps ?? []
			if (swaps.length === 0) {
				throw new Error("No swaps available.")
			}

			const sortedSwaps = swaps
				.filter((swap: { price: unknown }) => !Number.isNaN(Number(swap.price)))
				.sort((a: { price: unknown }, b: { price: unknown }) => Number(a.price) - Number(b.price))

			const selectedSwapId = sortedSwaps[0]
			const selectedSwapfund = sortedSwaps[0]

			toastId.current = toast(
				DefaultToast({
					isPromise: true,
					toastText: "Executing contract..."
				}),
				{
					autoClose: false,
					type: "default"
				}
			)

			const client = await getSigningCosmWasmClient()
			const message = {
				finish: {
					id: selectedSwapId.id
				}
			}

			const funds = [
				{
					amount: selectedSwapfund.price,
					denom: "untrn"
				}
			]

			try {
				return await client.execute(
					address!,
					contractAddressSale,
					message,
					"auto",
					undefined,
					funds
				)
			} catch (error) {
				console.error("Error executing contract:", error)
				throw error
			}
		},
		{
			onError(error) {
				handleTxError({ error, toastId })
			},
			onSuccess(data) {
				toast.update(toastId.current!, {
					autoClose: 5_000,
					render: SuccessToast({ data, txType: "Contract Execution" }),
					type: "success"
				})

				void queryClient.invalidateQueries(["availableSwaps", marketAddress])
			}
		}
	)
}

export default useBuyCheapest
